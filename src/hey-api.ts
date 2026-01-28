// Runtime configuration for hey-api client
import type { CreateClientConfig } from '@/client/client.gen';

/**
 * Create the client configuration with base URL and other settings
 */
export const createClientConfig: CreateClientConfig = (config) => {
  // Environment-based configuration variables
  const baseUrl = import.meta.env.PROD ? 'https://yak-toto.com' : 'http://127.0.0.1:8000';

  // Return the complete configuration
  return {
    ...config,
    baseUrl,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  };
};
