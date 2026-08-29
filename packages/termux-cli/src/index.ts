#!/usr/bin/env node
import readline from 'node:readline'
import path from 'node:path'
import { askModel, help, listFiles, loadConfig, parseArgs, readPreview, runCommand } from './config.js'

const args = parseArgs(process.argv.slice(2))
if (args.help) { console.log(help); process.exit(0) }
const cwd = path.resolve(args.cwd ?? process.cwd())
const config = loadConfig(cwd)
let mode: 'build' | 'plan' = args.mode ?? 'build'
let panel = 1
const messages: Array<{ role: string; text: string }> = [{ role: 'system', text: `Ready in ${cwd}` }]
const files = listFiles(cwd)

function render() {
  console.clear()
  const divider = '─'.repeat(Math.max(36, Math.min(process.stdout.columns ?? 80, 100)))
  console.log('\x1b[1;97m OpenCode · Termux\x1b[0m  \x1b[90m' + mode.toUpperCase() + ' · ' + config.model + '\x1b[0m')
  console.log(divider)
  console.log(`\x1b[36mPROJECT\x1b[0m ${path.basename(cwd)}   \x1b[90m${cwd}\x1b[0m`)
  console.log('\n\x1b[1;37mFILES\x1b[0m')
  console.log(files.join('\n'))
  console.log('\n\x1b[1;37mSESSION\x1b[0m')
  messages.slice(-7).forEach((message) => console.log(`${message.role === 'user' ? '\x1b[36mYOU' : message.role === 'assistant' ? '\x1b[32mAI' : '\x1b[90mSYS'}\x1b[0m  ${message.text.replace(/\n/g, '\n      ')}`))
  console.log('\n\x1b[1;37mPREVIEW\x1b[0m')
  console.log(readPreview(cwd))
  console.log(`\n${divider}\n\x1b[90m[${panel === 1 ? 'chat' : 'terminal'}] Tab switch · p mode · n new · q quit\x1b[0m`)
}

async function submit(value: string) {
  const prompt = value.trim()
  if (!prompt) return render()
  messages.push({ role: 'user', text: prompt })
  render()
  if (panel === 2) messages.push({ role: 'assistant', text: await runCommand(prompt, cwd) })
  else messages.push({ role: 'assistant', text: await askModel(`${mode} mode. Work in ${cwd}. ${prompt}`, config) })
  render()
}

render()
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function loop() { rl.question('\n> ', async (input) => { if (input === 'q' || input === ':q') return rl.close(); if (input === 'p') mode = mode === 'build' ? 'plan' : 'build'; else if (input === 'n') messages.splice(0, messages.length, { role: 'system', text: `New ${mode} session` }); else if (input === 'tab') panel = panel === 1 ? 2 : 1; else { await submit(input); return loop() } render(); loop() }) }
loop()
