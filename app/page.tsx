'use client'

import { useMemo, useState } from 'react'
import {
  Archive, ArrowDown, ArrowUp, Bot, Braces, Check, ChevronDown, ChevronRight,
  CircleDot, Command, FileCode2, FileJson, Folder, FolderOpen, GitBranch,
  HelpCircle, History, Layers3, Menu, MessageSquare, MoreHorizontal, PanelLeft,
  PanelRight, Paperclip, Play, Plus, Search, Send, Settings2, Sparkles, Terminal,
  X, Zap,
} from 'lucide-react'

const files = [
  { name: 'app', type: 'folder', open: true, children: [
    { name: 'page.tsx', type: 'ts', active: true },
    { name: 'layout.tsx', type: 'ts' },
    { name: 'globals.css', type: 'css' },
  ]},
  { name: 'components', type: 'folder', open: false, children: [] },
  { name: 'lib', type: 'folder', open: false, children: [] },
  { name: 'public', type: 'folder', open: false, children: [] },
  { name: 'package.json', type: 'json' },
  { name: 'README.md', type: 'md' },
  { name: 'tsconfig.json', type: 'json' },
]

const codeLines = [
  ['keyword', 'import'], ['plain', " { useState } from 'react'"],
  ['plain', ''], ['keyword', 'export default function'], ['fn', ' Page'], ['plain', '() {'],
  ['plain', '  '], ['keyword', 'const'], ['plain', ' [prompt, setPrompt] = '], ['fn', 'useState'], ['plain', '(\"\")'],
  ['plain', ''], ['keyword', 'return'], ['plain', ' ('], ['tag', '    <main'], ['attr', ' className'], ['plain', '='], ['string', '\"min-h-screen bg-background\"'], ['tag', '>'],
  ['plain', '      '], ['tag', '<section'], ['attr', ' aria-label'], ['plain', '='], ['string', '\"Agent workspace\"'], ['tag', '>'],
  ['plain', '        '], ['tag', '<h1'], ['tag', '>'], ['plain', 'Build something great'], ['tag', '</h1>'],
  ['plain', '        '], ['tag', '<p'], ['tag', '>'], ['plain', 'Describe what you want to build.'], ['tag', '</p>'],
  ['plain', '      '], ['tag', '</section>'],
  ['plain', '    '], ['tag', '</main>'], [ 'plain', '  )'], ['plain', '}'],
]

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className="icon-button">{children}</button>
}

function FileIcon({ type }: { type: string }) {
  if (type === 'folder') return <Folder size={15} />
  if (type === 'json') return <FileJson size={15} />
  if (type === 'css') return <Braces size={15} />
  return <FileCode2 size={15} />
}

export default function Page() {
  const [agent, setAgent] = useState<'Build' | 'Plan'>('Build')
  const [prompt, setPrompt] = useState('')
  const [session, setSession] = useState('Refine the landing page')
  const [terminalOpen, setTerminalOpen] = useState(true)
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(true)
  const [messages, setMessages] = useState([
    { role: 'user', text: 'Refine the landing page' },
    { role: 'agent', text: 'I’ll inspect the current layout and make the hero feel more focused. I found the page entry point and am ready to make the first pass.' },
  ])
  const status = useMemo(() => agent === 'Build' ? 'Ready to build' : 'Planning changes', [agent])

  function submitPrompt() {
    const clean = prompt.trim()
    if (!clean) return
    setMessages((current) => [...current, { role: 'user', text: clean }, { role: 'agent', text: 'I’m on it. I’ll map this request to the project files and prepare a focused change set.' }])
    setSession(clean.length > 29 ? `${clean.slice(0, 29)}…` : clean)
    setPrompt('')
  }

  return (
    <main className="workspace-shell">
      <header className="mobile-header">
        <IconButton label="Open navigation" onClick={() => setLeftOpen(true)}><Menu /></IconButton>
        <div className="brand-mark"><span>o</span> opencode</div>
        <IconButton label="Open agent panel" onClick={() => setRightOpen(true)}><MessageSquare /></IconButton>
      </header>
      <aside className={`left-rail ${leftOpen ? 'is-mobile-open' : ''}`}>
        <div className="rail-top">
          <div className="brand-mark"><span>o</span> opencode</div>
          <IconButton label="Close navigation" onClick={() => setLeftOpen(false)}><X /></IconButton>
        </div>
        <button className="project-switcher" type="button"><div className="project-avatar">OC</div><div><strong>opencode</strong><small>~/projects/opencode</small></div><ChevronDown size={14} /></button>
        <button className="new-session" type="button" onClick={() => { setSession('New session'); setMessages([]) }}><Plus size={15} /> New session <kbd>⌘ N</kbd></button>
        <div className="rail-section"><div className="section-label"><History size={13} /> RECENT</div><button className="session-item active" type="button"><span className="session-dot" />{session}<MoreHorizontal size={14} /></button><button className="session-item" type="button"><span className="session-dot muted" />Add command palette<span /></button></div>
        <div className="rail-section older"><div className="section-label">YESTERDAY</div><button className="session-item" type="button"><span className="session-dot muted" />Explore the codebase</button><button className="session-item" type="button"><span className="session-dot muted" />Fix auth redirect</button></div>
        <div className="rail-bottom"><button className="rail-link" type="button"><Settings2 size={15} /> Settings</button><button className="rail-link" type="button"><HelpCircle size={15} /> Help & docs</button><div className="runtime"><span className="online-dot" /><span>Local runtime</span><span className="runtime-version">v0.1.2</span></div></div>
      </aside>

      <section className="center-pane">
        <div className="project-header"><div className="breadcrumb"><FolderOpen size={15} /><span>opencode</span><ChevronRight size={13} /><span className="muted-text">app</span><ChevronRight size={13} /><span>page.tsx</span></div><div className="header-actions"><button className="branch-button" type="button"><GitBranch size={14} /> main <ChevronDown size={13} /></button><IconButton label="Command palette"><Command /></IconButton><IconButton label="Toggle agent panel" onClick={() => setRightOpen(!rightOpen)}><PanelRight /></IconButton></div></div>
        <div className="editor-tabs"><button className="editor-tab active" type="button"><FileCode2 size={14} />page.tsx <X size={13} /></button><button className="editor-tab" type="button"><FileCode2 size={14} />layout.tsx</button><button className="editor-tab" type="button"><FileCode2 size={14} />globals.css</button><span className="tab-spacer" /><span className="editor-status"><CircleDot size={12} /> main</span></div>
        <div className="code-workspace">
          <div className="file-explorer"><div className="pane-heading"><span>EXPLORER</span><div><IconButton label="Search files"><Search /></IconButton><IconButton label="More file actions"><MoreHorizontal /></IconButton></div></div><div className="tree-root"><ChevronDown size={14} /><FolderOpen size={15} className="folder-accent" /><strong>opencode</strong></div>{files.map((file) => <div key={file.name}><button className={`tree-row ${file.active ? 'selected' : ''}`} type="button">{file.type === 'folder' ? (file.open ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="tree-indent" />}<FileIcon type={file.type} /><span>{file.name}</span></button>{file.open && file.children?.map((child) => <button className={`tree-row child ${child.active ? 'selected' : ''}`} key={child.name} type="button"><span className="tree-indent" /><FileIcon type={child.type} /><span>{child.name}</span></button>)}</div>)}</div>
          <div className="editor-area"><div className="editor-breadcrumb"><FileCode2 size={14} /> app / page.tsx <span className="muted-text">•</span> <span className="muted-text">modified</span></div><div className="code-scroll">{codeLines.map(([kind, text], index) => <div className="code-line" key={`${index}-${text}`}><span className="line-number">{String(index + 1).padStart(2, '0')}</span><code className={kind}>{text || ' '}</code></div>)}</div></div>
        </div>
        <div className={`terminal-panel ${terminalOpen ? '' : 'collapsed'}`}><div className="terminal-heading"><div><Terminal size={14} /> TERMINAL <span className="terminal-tab">zsh</span></div><div className="terminal-actions"><span className="terminal-live"><span className="online-dot" /> connected</span><IconButton label={terminalOpen ? 'Collapse terminal' : 'Expand terminal'} onClick={() => setTerminalOpen(!terminalOpen)}>{terminalOpen ? <ArrowDown /> : <ArrowUp />}</IconButton><IconButton label="More terminal actions"><MoreHorizontal /></IconButton></div></div>{terminalOpen && <div className="terminal-body"><div><span className="prompt-symbol">➜</span> <span className="terminal-path">opencode</span> <span className="terminal-command">git status --short</span></div><div className="terminal-output"> M app/page.tsx<br /> M app/globals.css</div><div><span className="prompt-symbol">➜</span> <span className="terminal-path">opencode</span> <span className="cursor-block"> </span></div></div>}</div>
      </section>

      <aside className={`agent-panel ${rightOpen ? '' : 'is-closed'} ${rightOpen ? '' : ''}`}><div className="agent-heading"><div className="agent-title"><div className="agent-avatar"><Sparkles size={16} /></div><div><strong>Agent</strong><span>{status}</span></div></div><div className="agent-actions"><IconButton label="Toggle agent panel" onClick={() => setRightOpen(false)}><PanelRight /></IconButton><IconButton label="More agent actions"><MoreHorizontal /></IconButton></div></div><div className="agent-toolbar"><button className="agent-select" type="button"><Bot size={14} /> {agent}<ChevronDown size={13} /></button><span className="model-label">opencode / kimi-k2</span></div><div className="conversation"><div className="session-intro"><div className="intro-icon"><Zap size={18} /></div><div><strong>Let&apos;s build.</strong><p>Describe a change, ask a question, or run a command in your project.</p></div></div>{messages.map((message, index) => <div className={`message ${message.role}`} key={`${index}-${message.text}`}><div className="message-meta">{message.role === 'user' ? <><div className="user-avatar">you</div><span>You</span></> : <><div className="small-agent"><Sparkles size={11} /></div><span>opencode</span><span className="message-time">just now</span></>}</div><p>{message.text}</p>{message.role === 'agent' && index === 1 && <div className="task-card"><div className="task-row done"><Check size={13} /> Read <code>app/page.tsx</code></div><div className="task-row done"><Check size={13} /> Read <code>app/globals.css</code></div><div className="task-row current"><span className="spinner" /> Preparing changes</div></div>}</div>)}<div className="quick-prompts"><span>Try asking</span><button type="button" onClick={() => setPrompt('Explain this project')}>Explain this project <ArrowUp size={12} /></button><button type="button" onClick={() => setPrompt('Find and fix a bug')}>Find and fix a bug <ArrowUp size={12} /></button></div></div><div className="composer-wrap"><div className="mode-toggle"><button className={agent === 'Build' ? 'active' : ''} onClick={() => setAgent('Build')} type="button"><Play size={12} /> Build</button><button className={agent === 'Plan' ? 'active' : ''} onClick={() => setAgent('Plan')} type="button"><Layers3 size={12} /> Plan</button><span className="composer-hint">Enter to send</span></div><div className="composer"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); submitPrompt() } }} placeholder="Ask opencode anything..." aria-label="Message opencode" /><div className="composer-footer"><IconButton label="Attach file"><Paperclip /></IconButton><span className="composer-context">+ Add context</span><button className="send-button" type="button" onClick={submitPrompt} disabled={!prompt.trim()} aria-label="Send message"><Send size={15} /></button></div></div><div className="composer-note">opencode can make mistakes. Review changes before applying.</div></div></aside>
    </main>
  )
}
