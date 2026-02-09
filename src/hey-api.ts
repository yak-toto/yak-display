// Runtime configuration for hey-api client
import type { CreateClientConfig } from '@/client/client.gen';

/**
 * Create the client configuration with base URL and other settings
 */
export const createClientConfig: CreateClientConfig = (config) => {
  // Environment-based configuration variables
  const baseURL = '';

  // Return the complete configuration
  return {
    ...config,
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  };
};
