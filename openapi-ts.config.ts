/**
 * @fileoverview OpenAPI TypeScript client generator configuration
 *
 * This configuration file generates a fully-typed REST client from the backend's OpenAPI specification.
 * It dynamically fetches the OpenAPI spec from the yak-server backend and generates TypeScript types
 * and client functions that provide compile-time type safety for API interactions.
 *
 * @example
 * ```bash
 * # Generate the client
 * npx @hey-api/openapi-ts
 *
 * # Use the generated client
 * import { signupApiV1UsersSignupPost } from '@/client'
 * ```
 *
 * @see https://heyapi.dev/openapi-ts/
 */

import { execSync } from 'node:child_process';
import { defineConfig } from '@hey-api/openapi-ts';

import pkg from './package.json';

/**
 * Dynamically retrieves the OpenAPI specification from the backend server
 * using the version specified in package.json
 */
const openapi_spec = JSON.parse(
  execSync(`uv run --isolated --with yak-server==${pkg.backendApiVersion} export_openapi_spec.py`)
    .toString()
    .trim(),
);

console.log(`Generating client for backend API version ${pkg.backendApiVersion}...`);

/**
 * Hey-API configuration for generating TypeScript client from OpenAPI spec
 *
 * @config
 * - input: OpenAPI specification (dynamically fetched from backend)
 * - output: Generated client files location (src/client/)
 * - plugins: Uses fetch client with custom runtime configuration
 */
export default defineConfig({
  input: openapi_spec,
  output: `src/client`,
  plugins: [
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: '@/hey-api.ts',
    },
  ],
});
