# OpenCode on Termux

This repository includes a standalone terminal-native client for Android. It operates on the current local project, exposes Build and Plan modes, shows a file preview, runs safe single commands, and sends prompts to any OpenAI-compatible endpoint.

## Install

Install Termux from F-Droid, then run:

```sh
curl -fsSL https://raw.githubusercontent.com/anomalyco/opencode-web-termux/main/scripts/install-termux.sh | bash
```

If the repository is under another owner, set `OPENCODE_REPO_URL` before running the installer.

## Configure

```sh
export OPENCODE_BASE_URL=https://provider.example/v1
export OPENCODE_MODEL=your-model
export OPENCODE_API_KEY=your-key
opencode
```

You can also add `.opencode.json` to a project or `~/.config/opencode/config.json`. Environment variables override both files. Never commit API keys.

## Usage

`opencode "inspect the auth flow"`, `opencode --plan`, and `opencode --cwd ~/project`. At the prompt, type `p` to switch Build/Plan, `tab` to switch between chat and terminal, `n` for a new session, and `q` to quit.

The terminal intentionally rejects shell operators such as pipes, redirects, command chaining, backticks, and variable expansion. Use one explicit command at a time.

## Permissions and updates

Run `termux-setup-storage` only if your project is in shared Android storage. Update with `git -C ~/opencode-web-termux pull && npm install && npm run termux:build`. Remove with `rm -rf ~/opencode-web-termux $PREFIX/bin/opencode`.
