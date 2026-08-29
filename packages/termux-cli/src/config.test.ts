import test from 'node:test'
import assert from 'node:assert/strict'
import { parseArgs, safeCommand } from './config.js'
test('parses mode and cwd', () => assert.deepEqual(parseArgs(['hello', '--plan', '--cwd', '/tmp']), { prompt: 'hello', mode: 'plan', cwd: '/tmp' }))
test('rejects shell operators', () => assert.throws(() => safeCommand('rm -rf / | cat')))
test('accepts simple command', () => assert.deepEqual(safeCommand('git status'), ['git', 'status']))
