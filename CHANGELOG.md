# Changelog

All notable changes to this project will be documented in this file.

## [0.0.3] - 2026-01-14

### 🚀 Major Changes

#### Migrated from Claude SDK to OpenAI SDK
- **Complete rewrite** of the API layer for better control
- **OpenAI SDK** (`openai`) replaces Claude Agent SDK
- **Full control** over temperature, tools, and request format
- **Better compatibility** with vLLM, local models, and OpenAI-compatible APIs

### ✨ Features

#### Configuration & Settings
- ✅ **GUI Settings Modal** - configure API key, base URL, model, and temperature
- ✅ **Temperature Control** - adjust model creativity (0.0 - 2.0)
- ✅ **Model Indicator** - shows current model in UI
- ✅ **Settings Storage** - saved to `~/.agent-cowork/settings.json`
- ✅ **No Claude Code required** - completely standalone

#### Security & Safety
- ✅ **Directory Sandboxing** - agent cannot access files outside working directory
- ✅ **Path Validation** - blocks `..` and absolute paths outside CWD
- ✅ **Security Logging** - warns when access is blocked

#### Context & History
- ✅ **Session History** - saves all messages to SQLite database
- ✅ **Context Loading** - history loaded and passed to model on continuation
- ✅ **Smart Deduplication** - prevents duplicate user prompts in context

#### System Prompt
- ✅ **Structured XML Prompt** - clear sections with tags
- ✅ **Current Directory** - included in system environment
- ✅ **Platform-Aware Commands** - Windows (PowerShell) vs Unix (Bash)
- ✅ **Tool Descriptions** - explicit tool list with examples

#### Tool Improvements
- ✅ **OpenAI Function Format** - proper JSON schema for tools
- ✅ **UTF-8 Encoding** - correct handling of Cyrillic and special characters
- ✅ **Windows Commands** - `dir`, `type`, `cd` instead of `ls`, `cat`, `pwd`
- ✅ **Fast Execution** - removed artificial delays

#### UI/UX Enhancements
- ✅ **Smart Auto-scroll** - sticks to bottom only when user is there
- ✅ **Manual Scroll Control** - scroll up to disable auto-scroll
- ✅ **Smooth Streaming** - RAF-based throttling for 60fps updates
- ✅ **No Cost Display** - removed for local models

#### Developer Experience
- ✅ **Request Logging** - full API requests saved to `~/.agent-cowork/logs/`
- ✅ **Console Debugging** - detailed logs for message flow
- ✅ **Message Inspection** - last 3 messages logged before each API call

### 🐛 Bug Fixes

#### Critical Fixes
- 🔧 **Cyrillic Encoding** - fixed `������` issue on Windows
  - Solution: `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`
- 🔧 **Duplicate User Prompts** - prevented duplicates in message history
- 🔧 **Missing Tool Results** - tool outputs now properly sent to model
- 🔧 **Streaming Lag** - removed 100ms delay per tool call
- 🔧 **Auto-scroll Issues** - fixed aggressive scrolling during typing

#### Platform-Specific Fixes
- 🔧 **Windows Commands** - model now uses correct PowerShell commands
- 🔧 **Path Handling** - proper path resolution with `resolve()` and `relative()`
- 🔧 **vLLM Compatibility** - auto-appends `/v1` to base URL

### 🔄 Technical Changes

#### Architecture
- **New Files:**
  - `src/electron/libs/runner-openai.ts` - OpenAI-based runner
  - `src/electron/libs/tools-definitions.ts` - tool schemas
  - `src/electron/libs/tools-executor.ts` - tool implementation
  
- **Modified Files:**
  - `src/electron/ipc-handlers.ts` - uses new runner
  - `src/ui/App.tsx` - improved auto-scroll logic
  - `src/ui/components/SettingsModal.tsx` - added temperature
  - `src/ui/components/EventCard.tsx` - removed cost display

- **Deprecated:**
  - `src/electron/libs/runner.ts` - old Claude SDK runner (kept for reference)

#### Data Storage
- **Settings:** `~/.agent-cowork/settings.json`
- **Database:** `~/.agent-cowork/sessions.db` (SQLite)
- **Logs:** `~/.agent-cowork/logs/openai-request-*.json`

### 📝 Documentation

- ✅ **README.md** - completely rewritten with new features
- ✅ **MIGRATION_GUIDE.md** - detailed migration guide
- ✅ **QUICKSTART.md** - 5-minute setup guide
- ✅ **CHANGELOG.md** - this file

### ⚠️ Breaking Changes

1. **No backward compatibility** with original settings
   - Old: `~/.claude/settings.json`
   - New: `~/.agent-cowork/settings.json`

2. **Different API format** - OpenAI instead of Claude
   - Must configure API key, base URL, model in GUI
   - Temperature now configurable (was hardcoded in Claude SDK)

3. **Tool format changed** - OpenAI function calling schema
   - Models must support function calling
   - vLLM must use `--enable-auto-tool-choice`

### 🔮 Future Plans

- [ ] Streaming performance optimization
- [ ] More tool types (web search, image generation)
- [ ] Multi-session management improvements
- [ ] Model comparison mode
- [ ] Export conversation to markdown
- [ ] Custom tool definitions

---

## [0.0.2] - 2025-12-XX (Original Fork)

### Initial Features
- Basic Electron app
- Claude SDK integration
- File management tools
- Session management

---

## [0.0.1] - 2025-11-XX (Original Project)

### Initial Release
- Desktop app for Claude Code
- Basic GUI for Claude Agent SDK
- Tool calling support

---

**Note:** This project is a community fork focused on flexibility, local model support, and user control.

**License:** MIT  
**Contributors:** Community  
**Repository:** https://github.com/DevAgentForge/agent-cowork
