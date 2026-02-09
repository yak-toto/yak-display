import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import { client } from './client/client.gen';
import { refreshApiV1UsersRefreshPost } from './client/sdk.gen';
import router from './router';
import useYakStore from './store';

const app = createApp(App);

const store = createPinia();
store.use(piniaPluginPersistedstate);
app.use(store);
app.use(router);

// Auto-refresh: if multiple requests hit 401 simultaneously, only one
// refresh call is made and the others wait for its result.
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const { error } = await refreshApiV1UsersRefreshPost();
  return !error;
}

// Register 401 response interceptor with auto-refresh
client.instance.interceptors.response.use(undefined, async (error) => {
  const config = error.config;

  if (
    error.response?.status !== 401 ||
    config?.url?.includes('/users/login') ||
    config?.url?.includes('/users/signup') ||
    config?.url?.includes('/users/refresh')
  ) {
    return Promise.reject(error);
  }

  // Attempt token refresh (deduplicated across concurrent requests)
  if (!refreshPromise) {
    refreshPromise = tryRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;

  if (refreshed) {
    return client.instance(config);
  }

  // Refresh failed — session is truly expired
  const yakStore = useYakStore();
  yakStore.eraseAuthState();
  router.push('/login');
  return Promise.reject(error);
});

app.mount('#app');
