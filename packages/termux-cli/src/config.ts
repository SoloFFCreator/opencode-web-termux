import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'

export type OpenCodeConfig = { provider: string; model: string; baseUrl: string; apiKey?: string }

function readJson(file: string): Partial<OpenCodeConfig> {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return {} }
}

export function loadConfig(cwd = process.cwd()): OpenCodeConfig {
  const project = readJson(path.join(cwd, '.opencode.json'))
  const global = readJson(path.join(process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config'), 'opencode', 'config.json'))
  return {
    provider: process.env.OPENCODE_PROVIDER ?? project.provider ?? global.provider ?? 'openai-compatible',
    model: process.env.OPENCODE_MODEL ?? project.model ?? global.model ?? 'gpt-4o-mini',
    baseUrl: process.env.OPENCODE_BASE_URL ?? project.baseUrl ?? global.baseUrl ?? 'https://api.openai.com/v1',
    apiKey: process.env.OPENCODE_API_KEY ?? project.apiKey ?? global.apiKey,
  }
}

export function configPath(): string { return path.join(process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config'), 'opencode', 'config.json') }

export function saveConfig(config: OpenCodeConfig) {
  fs.mkdirSync(path.dirname(configPath()), { recursive: true })
  fs.writeFileSync(configPath(), JSON.stringify(config, null, 2) + '\n', { mode: 0o600 })
}

export function parseArgs(args: string[]) {
  const result: { cwd?: string; mode?: 'build' | 'plan'; prompt?: string; help?: boolean } = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--help' || arg === '-h') result.help = true
    else if (arg === '--cwd') result.cwd = args[++i]
    else if (arg === '--plan') result.mode = 'plan'
    else if (arg === '--build') result.mode = 'build'
    else if (!result.prompt) result.prompt = arg
  }
  return result
}

export async function askModel(prompt: string, config: OpenCodeConfig): Promise<string> {
  if (!config.apiKey) return 'No provider key configured. Add OPENCODE_API_KEY, then retry.'
  const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${config.apiKey}` }, body: JSON.stringify({ model: config.model, messages: [{ role: 'user', content: prompt }] }) })
  if (!response.ok) return `Provider error ${response.status}: ${await response.text()}`
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
  return data.choices?.[0]?.message?.content ?? 'The provider returned no content.'
}

export const help = `OpenCode Termux\n\nUsage: opencode [prompt] [--plan|--build] [--cwd path]\nKeys: Tab switch panel, n new session, p plan/build, q quit\nConfig: .opencode.json or $XDG_CONFIG_HOME/opencode/config.json\nEnv: OPENCODE_PROVIDER OPENCODE_MODEL OPENCODE_BASE_URL OPENCODE_API_KEY`

export function safeCommand(command: string): string[] {
  if (!command.trim() || /[;&|`$<>]/.test(command)) throw new Error('Unsafe command: use one simple command without shell operators.')
  return command.trim().split(/\s+/)
}

export function runCommand(command: string, cwd: string): Promise<string> {
  const [file, ...args] = safeCommand(command)
  return new Promise((resolve) => {
    const child = spawn(file, args, { cwd, env: process.env })
    let output = ''
    child.stdout.on('data', (d: Buffer) => output += d.toString())
    child.stderr.on('data', (d: Buffer) => output += d.toString())
    child.on('close', (code: number | null) => resolve(`${output.trim()}${code ? `\n(exit ${code})` : ''}` || '(no output)'))
    child.on('error', (e: Error) => resolve(`Command error: ${e.message}`))
  })
}

export function listFiles(cwd: string): string[] { return fs.readdirSync(cwd, { withFileTypes: true }).map((entry) => `${entry.isDirectory() ? '▸' : '·'} ${entry.name}`).slice(0, 40) }
export function readPreview(cwd: string, file = 'package.json'): string { try { return fs.readFileSync(path.join(cwd, file), 'utf8').split('\n').slice(0, 18).join('\n') } catch { return 'Select a file from the project.' } }

if (import.meta.url === `file://${process.argv[1]}`) console.log(help)

export const __test = { loadConfig, parseArgs, safeCommand }
