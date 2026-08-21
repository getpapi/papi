import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8');

test('declares a public DeepSeek Harness bundle', () => {
  assert.equal(manifest.name, '@papi-ai/deepseek-harness');
  assert.deepEqual(manifest.dsh, { bundle: { patch: './cordis.patch.yml' } });
  assert.equal(manifest.publishConfig.access, 'public');
  assert.ok(!Object.hasOwn(manifest, 'private'));
});

test('mounts the official MCP client with canonical PAPI configuration', () => {
  assert.match(patch, /name: '@deepseek-ai\/dsh-mcp-client'/);
  assert.match(patch, /serverName: papi/);
  assert.match(patch, /transport: streamable-http/);
  assert.match(patch, /url: https:\/\/mcp\.getpapi\.ai\/mcp/);
  assert.match(patch, /process\.env\.PAPI_CONNECTION_TOKEN/);
});

test('contains no literal bearer credential', () => {
  assert.doesNotMatch(patch, /Bearer (?!\$\{process\.env\.PAPI_CONNECTION_TOKEN\})[A-Za-z0-9_-]+/);
});
