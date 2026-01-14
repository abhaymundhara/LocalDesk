<div align="center">

# Agent Cowork - Local LLM Edition

[![Version](https://img.shields.io/badge/version-0.0.3-blue.svg)](https://github.com/vakovalskii/Cowork-Local-LLM/releases)
[![Platform](https://img.shields.io/badge/platform-%20Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/vakovalskii/Cowork-Local-LLM)
[![Original](https://img.shields.io/badge/forked%20from-DevAgentForge%2FClaude--Cowork-blue)](https://github.com/DevAgentForge/Claude-Cowork)

**Desktop AI Assistant with Local Model Support (vLLM, Qwen, Llama)**

> 🔱 Forked from [DevAgentForge/Claude-Cowork](https://github.com/DevAgentForge/Claude-Cowork)  
> Reworked to support OpenAI SDK and local models

[English](#english-version) | [Русский](#русская-версия)

</div>

---

# English Version

## 📖 About

**Agent Cowork** is a desktop AI assistant for programming, file management, and executing tasks through natural language.

**Based on:** [DevAgentForge/Claude-Cowork](https://github.com/DevAgentForge/Claude-Cowork)

**Key differences from original:**
- ✅ **OpenAI SDK** instead of Claude SDK — full API control
- ✅ **GUI settings** — API key, URL, model, temperature
- ✅ **vLLM support** — local models (Qwen, Llama)
- ✅ **Modular tools** — each tool in separate file
- ✅ **Web search** — Tavily integration for internet search
- ✅ **Directory sandboxing** — secure file operations
- ✅ **Windows compatibility** — PowerShell commands, UTF-8
- ✅ **Smart UI** — auto-scroll, smooth streaming, context preservation

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/vakovalskii/Cowork-Local-LLM.git
cd Cowork-Local-LLM

# Install dependencies
npm install

# Rebuild native modules
npx electron-rebuild

# Compile Electron code
npm run transpile:electron
```

### Running

**Windows:**
```powershell
# Terminal 1
npx vite

# Terminal 2 (after Vite starts)
$env:NODE_ENV='development'
npx electron .
```

**macOS/Linux:**
```bash
# Terminal 1
npx vite

# Terminal 2
NODE_ENV=development npx electron .
```

### Configuration

1. Click **Settings** (⚙️) in the interface
2. Enter:
   - **API Key** — your key (or `dummy-key` for local models)
   - **Base URL** — API endpoint (`https://api.anthropic.com` for Claude)
   - **Model Name** — model identifier
   - **Temperature** — 0.0-2.0 (default: 0.3)
   - **Tavily API Key** (optional) — for web search capabilities
3. Click **Save Settings**

### Configuration Examples

**vLLM (local model):**
```json
{
  "apiKey": "dummy-key",
  "baseUrl": "http://localhost:8000",
  "model": "qwen3-30b-a3b-instruct-2507",
  "temperature": 0.3
}
```

**Claude:**
```json
{
  "apiKey": "sk-ant-...",
  "baseUrl": "https://api.anthropic.com",
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.3
}
```

## 🦙 vLLM Setup

```bash
vllm serve qwen3-30b-a3b-instruct-2507 \
  --port 8000 \
  --enable-auto-tool-choice \
  --tool-call-parser hermes
```

**Requirements:**
- OpenAI-compatible API (`/v1/chat/completions`)
- Function calling (tools)
- Streaming

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Detailed deployment guide
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** — Technical migration details
- **[WEB_SEARCH_FEATURE.md](WEB_SEARCH_FEATURE.md)** — Web search integration guide
- **[CHANGELOG.md](CHANGELOG.md)** — Version history

## 🏗️ Project Structure

```
src/
├── electron/                    # Electron main process
│   ├── main.ts                 # Entry point
│   ├── ipc-handlers.ts         # IPC communication
│   ├── types.ts                # TypeScript types
│   └── libs/
│       ├── runner-openai.ts    # OpenAI API runner
│       ├── runner.ts           # Claude SDK runner (legacy)
│       ├── prompt-loader.ts    # Prompt template loader
│       ├── tools-definitions.ts # Tool exports
│       ├── tools-executor.ts   # Tool execution logic
│       ├── prompts/
│       │   ├── system.txt      # System prompt template
│       │   └── initial_prompt.txt # Initial prompt template
│       └── tools/              # Modular tool definitions
│           ├── base-tool.ts    # Base interfaces
│           ├── bash-tool.ts    # Shell command execution
│           ├── read-tool.ts    # File reading
│           ├── write-tool.ts   # File creation
│           ├── edit-tool.ts    # File editing
│           ├── glob-tool.ts    # File pattern search
│           ├── grep-tool.ts    # Text search
│           ├── web-search.ts   # Web search (Tavily)
│           ├── extract-page-content.ts # Page extraction
│           └── ask-user-question-tool.ts # User interaction
└── ui/                         # React frontend
    ├── App.tsx                 # Main app component
    ├── components/             # UI components
    ├── hooks/                  # Custom hooks
    ├── store/                  # Zustand state management
    └── render/                 # Markdown rendering
```

### Key Features

**Modular Tool Architecture:**
- Each tool in separate file with definition + executor
- Easy to add new tools
- Type-safe with TypeScript
- Consistent interface via `base-tool.ts`

**Prompt System:**
- Templates in `prompts/` directory
- Dynamic variable substitution
- OS-specific command examples
- Separate system and initial prompts

**Security:**
- Directory sandboxing (prevents access outside working directory)
- Path validation for all file operations
- Safe command execution with UTF-8 encoding

## 🛠️ Available Tools

### File Operations
- **Bash** — execute commands (PowerShell/bash)
- **Read** — read files
- **Write** — create files
- **Edit** — modify files (search & replace)

### Search Tools
- **Glob** — find files by pattern
- **Grep** — search text in files

### Web Tools (Optional)
- **WebSearch** — search the web using Tavily API
- **ExtractPageContent** — extract full content from web pages

### User Interaction
- **AskUserQuestion** — ask user for clarification

> **Note:** Web tools require Tavily API key in Settings

## 🔐 Data Storage

**Windows:** `C:\Users\YourName\AppData\Roaming\agent-cowork\`  
**macOS:** `~/Library/Application Support/agent-cowork\`  
**Linux:** `~/.config/agent-cowork/`

Files:
- `sessions.db` — SQLite database with history
- `api-settings.json` — API configuration
- `~/.agent-cowork/logs/` — request logs (debugging)

## 📝 Changelog

**v0.0.3** (current)
- Migration from Claude SDK to OpenAI SDK
- GUI temperature control
- Directory sandboxing (security)
- Session history preservation
- Windows compatibility (PowerShell, UTF-8)
- Smart auto-scroll
- Streaming optimization

Full list: [CHANGELOG.md](CHANGELOG.md)

## ⚠️ Known Issues

**Model doesn't see command results?**
- Ensure your model supports function calling
- Check DevTools (F12) — should see `tool` messages

**Cyrillic showing as `��������`?**
- Use v0.0.3+ (fixed)

**vLLM returns 404?**
- Check Base URL (system automatically adds `/v1`)

## 🤝 Contributing

1. Fork the repository
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT — same as original [DevAgentForge/Claude-Cowork](https://github.com/DevAgentForge/Claude-Cowork)

---

# Русская версия

## 📖 О проекте

**Agent Cowork** — десктопный AI-ассистент для программирования, управления файлами и выполнения задач через естественный язык.

**Основан на:** [DevAgentForge/Claude-Cowork](https://github.com/DevAgentForge/Claude-Cowork)

**Главные отличия от оригинала:**
- ✅ **OpenAI SDK** вместо Claude SDK — полный контроль над API
- ✅ **GUI для настроек** — API ключ, URL, модель, температура
- ✅ **Поддержка vLLM** — работа с локальными моделями (Qwen, Llama)
- ✅ **Модульные инструменты** — каждый инструмент в отдельном файле
- ✅ **Веб-поиск** — интеграция с Tavily для поиска в интернете
- ✅ **Песочница директорий** — безопасность файловых операций
- ✅ **Windows-совместимость** — правильные команды PowerShell, UTF-8
- ✅ **Умный UI** — автоскролл, плавный стриминг, сохранение контекста

## 🚀 Быстрый старт

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/vakovalskii/Cowork-Local-LLM.git
cd Cowork-Local-LLM

# Установите зависимости
npm install

# Пересоберите нативные модули
npx electron-rebuild

# Скомпилируйте Electron код
npm run transpile:electron
```

### Запуск

**Windows:**
```powershell
# Терминал 1
npx vite

# Терминал 2 (после запуска Vite)
$env:NODE_ENV='development'
npx electron .
```

**macOS/Linux:**
```bash
# Терминал 1
npx vite

# Терминал 2
NODE_ENV=development npx electron .
```

### Настройка

1. Нажмите **Settings** (⚙️) в интерфейсе
2. Введите данные:
   - **API Key** — ваш ключ (или `dummy-key` для локальных моделей)
   - **Base URL** — адрес API (`https://api.anthropic.com` для Claude)
   - **Model Name** — название модели
   - **Temperature** — температура (0.0-2.0, по умолчанию 0.3)
   - **Tavily API Key** (опционально) — для веб-поиска
3. Нажмите **Save Settings**

### Примеры настроек

**vLLM (локальная модель):**
```json
{
  "apiKey": "dummy-key",
  "baseUrl": "http://localhost:8000",
  "model": "qwen3-30b-a3b-instruct-2507",
  "temperature": 0.3
}
```

**Claude:**
```json
{
  "apiKey": "sk-ant-...",
  "baseUrl": "https://api.anthropic.com",
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.3
}
```

## 🦙 Настройка vLLM

```bash
vllm serve qwen3-30b-a3b-instruct-2507 \
  --port 8000 \
  --enable-auto-tool-choice \
  --tool-call-parser hermes
```

**Требования:**
- OpenAI-compatible API (`/v1/chat/completions`)
- Function calling (tools)
- Streaming

## 📚 Документация

- **[DEPLOYMENT.md](DEPLOYMENT.md)** — детальная инструкция по развертыванию
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** — технические детали миграции с Claude SDK
- **[WEB_SEARCH_FEATURE.md](WEB_SEARCH_FEATURE.md)** — руководство по интеграции веб-поиска
- **[CHANGELOG.md](CHANGELOG.md)** — история изменений

## 🛠️ Доступные инструменты

### Файловые операции
- **Bash** — выполнение команд (PowerShell/bash)
- **Read** — чтение файлов
- **Write** — создание файлов
- **Edit** — редактирование (search & replace)

### Инструменты поиска
- **Glob** — поиск файлов по паттерну
- **Grep** — поиск текста в файлах

### Веб-инструменты (опционально)
- **WebSearch** — поиск в интернете через Tavily API
- **ExtractPageContent** — извлечение полного содержимого веб-страниц

### Взаимодействие с пользователем
- **AskUserQuestion** — уточнения у пользователя

> **Примечание:** Веб-инструменты требуют Tavily API ключ в настройках

## 🏗️ Структура проекта

```
src/
├── electron/                    # Electron главный процесс
│   ├── main.ts                 # Точка входа
│   ├── ipc-handlers.ts         # IPC коммуникация
│   ├── types.ts                # TypeScript типы
│   └── libs/
│       ├── runner-openai.ts    # OpenAI API раннер
│       ├── runner.ts           # Claude SDK раннер (legacy)
│       ├── prompt-loader.ts    # Загрузчик шаблонов промптов
│       ├── tools-definitions.ts # Экспорт инструментов
│       ├── tools-executor.ts   # Логика выполнения инструментов
│       ├── prompts/
│       │   ├── system.txt      # Шаблон системного промпта
│       │   └── initial_prompt.txt # Шаблон начального промпта
│       └── tools/              # Модульные определения инструментов
│           ├── base-tool.ts    # Базовые интерфейсы
│           ├── bash-tool.ts    # Выполнение shell команд
│           ├── read-tool.ts    # Чтение файлов
│           ├── write-tool.ts   # Создание файлов
│           ├── edit-tool.ts    # Редактирование файлов
│           ├── glob-tool.ts    # Поиск файлов по паттерну
│           ├── grep-tool.ts    # Текстовый поиск
│           ├── web-search.ts   # Веб-поиск (Tavily)
│           ├── extract-page-content.ts # Извлечение страниц
│           └── ask-user-question-tool.ts # Взаимодействие с пользователем
└── ui/                         # React фронтенд
    ├── App.tsx                 # Главный компонент
    ├── components/             # UI компоненты
    ├── hooks/                  # Кастомные хуки
    ├── store/                  # Zustand управление состоянием
    └── render/                 # Рендеринг Markdown
```

### Ключевые особенности

**Модульная архитектура инструментов:**
- Каждый инструмент в отдельном файле с определением + исполнителем
- Легко добавлять новые инструменты
- Типобезопасность с TypeScript
- Единообразный интерфейс через `base-tool.ts`

**Система промптов:**
- Шаблоны в директории `prompts/`
- Динамическая подстановка переменных
- OS-специфичные примеры команд
- Разделение системного и начального промптов

**Безопасность:**
- Песочница директорий (запрет доступа за пределы рабочей директории)
- Валидация путей для всех файловых операций
- Безопасное выполнение команд с UTF-8 кодировкой

## 🔐 Хранение данных

**Windows:** `C:\Users\ВашеИмя\AppData\Roaming\agent-cowork\`  
**macOS:** `~/Library/Application Support/agent-cowork/`  
**Linux:** `~/.config/agent-cowork/`

Файлы:
- `sessions.db` — SQLite база с историей
- `api-settings.json` — настройки API
- `~/.agent-cowork/logs/` — логи запросов (для отладки)

## 📝 Changelog

**v0.0.3** (текущая версия)
- Переход с Claude SDK на OpenAI SDK
- GUI для настройки температуры
- Песочница директорий (безопасность)
- Сохранение и загрузка истории диалога
- Windows-совместимость (PowerShell, UTF-8)
- Умный автоскролл
- Оптимизация стриминга

Полный список: [CHANGELOG.md](CHANGELOG.md)

## ⚠️ Известные проблемы

**Модель не видит результаты команд?**
- Убедитесь, что модель поддерживает function calling
- Проверьте DevTools (F12) — должны быть `tool` сообщения

**Кириллица `��������`?**
- Используйте v0.0.3+ (исправлено)

**vLLM возвращает 404?**
- Проверьте Base URL (система автоматически добавляет `/v1`)

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте ветку (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT — как и оригинальный [DevAgentForge/Claude-Cowork](https://github.com/DevAgentForge/Claude-Cowork)

---

<div align="center">

**⭐ If this project helps you, please give it a star!**

Made with ❤️ based on [DevAgentForge/Claude-Cowork](https://github.com/DevAgentForge/Claude-Cowork)

</div>
