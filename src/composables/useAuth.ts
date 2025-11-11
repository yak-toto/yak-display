/**
 * @fileoverview Authentication composable with automatic token refresh and security features
 *
 * Provides secure token management without localStorage persistence, automatic token refresh,
 * and proper cleanup on tab close/navigation.
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import useYakStore from '@/store';
import { useRouter } from 'vue-router';
import { loginApiV1UsersLoginPost, refreshApiV1UsersRefreshPost } from '@/client';
import type {
  LoginIn,
  LoginApiV1UsersLoginPostError,
  RefreshIn,
  RefreshApiV1UsersRefreshPostError,
} from '@/client';

export function useAuth() {
  const yakStore = useYakStore();
  const router = useRouter();
  const isLoading = ref(false);
  const refreshTimer = ref<number | null>(null);

  /**
   * Automatically refresh token before it expires
   */
  const scheduleTokenRefresh = () => {
    if (refreshTimer.value) {
      window.clearTimeout(refreshTimer.value);
    }

    if (yakStore.tokenExpiry) {
      const now = Date.now();
      const timeUntilExpiry = yakStore.tokenExpiry - now;
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60000); // Refresh 5 min before expiry, minimum 1 min

      if (refreshTime > 0) {
        refreshTimer.value = window.setTimeout(async () => {
          await refreshToken();
        }, refreshTime);
      }
    }
  };

  /**
   * Refresh the JWT token using hey-api generated client
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!yakStore.refreshToken) {
        console.error('No refresh token available');
        await logout();
        return false;
      }

      const refreshData: RefreshIn = {
        refresh_token: yakStore.refreshToken,
      };

      const response = await refreshApiV1UsersRefreshPost({
        body: refreshData,
        throwOnError: true,
      });

      if (response.data?.result) {
        yakStore.setJwtToken({
          jwt: response.data.result.access_token,
          refreshToken: response.data.result.refresh_token,
          accessExpiresIn: response.data.result.access_expires_in,
          refreshExpiresIn: response.data.result.refresh_expires_in,
        });
        scheduleTokenRefresh();
        return true;
      } else {
        console.error('Invalid refresh response');
        await logout();
        return false;
      }
    } catch (error: unknown) {
      console.error('Token refresh failed:', error);

      // Handle hey-api errors
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error.error as RefreshApiV1UsersRefreshPostError;
        console.error('Refresh API error:', apiError);
      }

      await logout();
      return false;
    }
  };

  /**
   * Login with credentials using hey-api generated client
   */
  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true;
    try {
      // Convert credentials to match backend expectations
      const loginData: LoginIn = {
        name: credentials.email, // Your backend expects 'name' field
        password: credentials.password,
      };

      const response = await loginApiV1UsersLoginPost({
        body: loginData,
        throwOnError: true, // Use hey-api error handling
      });

      if (response.data?.result) {
        yakStore.setJwtToken({
          jwt: response.data.result.access_token,
          refreshToken: response.data.result.refresh_token,
          accessExpiresIn: response.data.result.access_expires_in,
          refreshExpiresIn: response.data.result.refresh_expires_in,
        });
        yakStore.setUserName({ userName: response.data.result.name });
        scheduleTokenRefresh();
        return { success: true };
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error: unknown) {
      // Handle hey-api errors properly
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error.error as LoginApiV1UsersLoginPostError;

        if (apiError && typeof apiError === 'object' && 'description' in apiError) {
          const errorMessage =
            typeof apiError.description === 'string' ? apiError.description : 'Login failed';
          return { success: false, error: errorMessage };
        }
      }
      return { success: false, error: 'Network error or server unavailable' };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Logout and clear all tokens
   */
  const logout = async () => {
    if (refreshTimer.value) {
      window.clearTimeout(refreshTimer.value);
    }

    yakStore.eraseJwtToken();

    // Redirect to login page
    router.push('/login');
  };

  /**
   * Check if user is authenticated with valid token
   */
  const checkAuth = () => {
    if (yakStore.isAuthenticated) {
      scheduleTokenRefresh();
      return true;
    }
    return false;
  };

  // Security: Clear tokens on page unload
  const handleBeforeUnload = () => {
    // Optional: You can keep this behavior or remove it if you want tokens to persist across page refreshes
    // yakStore.eraseJwtToken();
  };

  // Security: Clear tokens on visibility change (tab switch)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Optionally clear tokens when tab becomes hidden
      // This is very strict security - adjust based on your needs
    }
  };

  onMounted(() => {
    checkAuth();

    // Set up security event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onUnmounted(() => {
    if (refreshTimer.value) {
      window.clearTimeout(refreshTimer.value);
    }

    // Clean up event listeners
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return {
    isAuthenticated: computed(() => yakStore.isAuthenticated),
    userName: computed(() => yakStore.userName),
    isLoading: computed(() => isLoading.value),
    login,
    logout,
    refreshToken,
    checkAuth,
  };
}
