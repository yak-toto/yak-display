import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const store = createPinia();
store.use(piniaPluginPersistedstate);

createApp(App).use(store).use(router).mount('#app');
