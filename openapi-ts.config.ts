import { execSync } from 'node:child_process';
import { defineConfig } from '@hey-api/openapi-ts';
import pkg from './package.json';

const uvRun = (script: string) =>
  execSync(`uv run --isolated --with yak-server==${pkg.backendApiVersion} ${script}`)
    .toString()
    .trim();

console.log(`Generating client for backend API version ${pkg.backendApiVersion}...`);

const specJson = uvRun('export_openapi_spec.py');

export default defineConfig({
  input: JSON.parse(specJson),
  output: 'src/client',
  plugins: [
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: '@/hey-api.ts',
    },
  ],
});
