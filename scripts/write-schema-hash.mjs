import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'path';
import pkg from '../package.json' with { type: 'json' };

const uvRun = (script) =>
  execSync(`uv run --isolated --with yak-server==${pkg.backendApiVersion} ${script}`)
    .toString()
    .trim();

const OUTPUT_PATH = 'src/client/schema-hash.gen.ts';

const scriptPath = path.join(import.meta.dirname, 'get_schema_version.py');

const schemaHash = uvRun(scriptPath);

const content = `// Auto-generated. Do not edit.
export const apiSchemaHash = "${schemaHash}";
`;

writeFileSync(OUTPUT_PATH, content);

console.log(`Wrote ${OUTPUT_PATH} (${schemaHash})`);
