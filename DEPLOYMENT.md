# 🚀 Deployment Guide

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** for cloning the repository

Optional:
- **Bun** (alternative to npm, faster)
- **Electron Builder** (auto-installed)

---

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/DevAgentForge/agent-cowork.git
cd agent-cowork
npm install
npm run transpile:electron
```

### 2. Run Development Mode

**Option A: Two Terminals (Recommended)**

Terminal 1 - Start Vite:
```bash
npx vite
```

Terminal 2 - Start Electron (after Vite is running):
```bash
# Unix/macOS:
NODE_ENV=development npx electron .

# Windows PowerShell:
$env:NODE_ENV='development'; npx electron .
```

**Option B: Single Command (Unix/macOS only)**

```bash
npm run dev
```

Note: This requires `bun` and doesn't work on Windows.

---

## Production Build

### Build All Assets

```bash
npm run build
```

This will:
1. Compile TypeScript (`tsc -b`)
2. Build Vite (`vite build`)
3. Transpile Electron code

### Platform-Specific Builds

#### Windows

```bash
npm run dist:win
```

Output: `dist/agent-cowork-0.0.3-win.exe`

#### macOS

```bash
npm run dist:mac
```

Output: `dist/agent-cowork-0.0.3-mac.dmg` (Apple Silicon)

#### Linux

```bash
npm run dist:linux
```

Output: `dist/agent-cowork-0.0.3-linux.AppImage`

---

## Environment Variables

### Development

```bash
NODE_ENV=development
```

Enables:
- Hot reload
- Source maps
- DevTools
- Verbose logging

### Production

```bash
NODE_ENV=production
```

Enables:
- Minification
- Optimizations
- Disabled DevTools

---

## Configuration Files

### Electron Builder (`electron-builder.yml`)

```yaml
appId: com.agent.cowork
productName: Agent Cowork
directories:
  buildResources: build
  output: dist
files:
  - dist-react/**/*
  - dist-electron/**/*
  - package.json
mac:
  category: public.app-category.developer-tools
  target:
    - target: dmg
      arch: [arm64, x64]
win:
  target:
    - target: nsis
      arch: [x64]
linux:
  target:
    - target: AppImage
      arch: [x64]
```

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

---

## Debugging

### Electron Main Process

1. Open DevTools: `View → Toggle Developer Tools` or `F12`
2. Check Console tab for `[OpenAI Runner]`, `[Tool Executor]` logs
3. Check Network tab for API requests

### Electron Renderer Process

1. Open DevTools (same as above)
2. Check Console for React errors
3. Check Network for Vite HMR

### API Request Logs

Check: `~/.agent-cowork/logs/openai-request-*.json`

```bash
# View latest log:
ls -lt ~/.agent-cowork/logs/ | head -1
cat ~/.agent-cowork/logs/openai-request-<latest>.json | jq
```

---

## Troubleshooting

### "Cannot find module 'better-sqlite3'"

**Solution:**
```bash
npm install --save-dev electron-rebuild
npx electron-rebuild
```

### "Port 5173 already in use"

**Solution:**
```bash
# Kill Vite process
lsof -ti:5173 | xargs kill -9  # Unix/macOS
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process  # Windows
```

### "Electron builder fails"

**Solution:**
```bash
# Clean and rebuild
rm -rf dist dist-electron dist-react node_modules
npm install
npm run transpile:electron
npm run build
npm run dist:win  # or dist:mac, dist:linux
```

### "Settings not saving"

**Check permissions:**
```bash
# Unix/macOS:
ls -la ~/.agent-cowork/

# Windows:
dir C:\Users\%USERNAME%\AppData\Roaming\agent-cowork\
```

### "Model not responding"

**Debug steps:**
1. Check API key is correct
2. Check base URL is reachable
3. Check model name is exact
4. Check DevTools console for errors
5. Check `~/.agent-cowork/logs/` for API logs

---

## CI/CD Setup (GitHub Actions)

### `.github/workflows/build.yml`

```yaml
name: Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: |
          npm run transpile:electron
          npm run build
      
      - name: Test
        run: npm test
      
      - name: Build distributables
        if: startsWith(github.ref, 'refs/tags/')
        run: |
          npm run dist:win  # Windows
          npm run dist:mac  # macOS
          npm run dist:linux  # Linux
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist-${{ matrix.os }}
          path: dist/*
```

---

## Docker Support (Experimental)

### `Dockerfile`

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run transpile:electron
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev:react"]
```

### `docker-compose.yml`

```yaml
version: '3.8'
services:
  agent-cowork:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ~/.agent-cowork:/root/.agent-cowork
    environment:
      - NODE_ENV=development
```

**Note:** Electron requires X11 or Wayland display, Docker is mainly for development.

---

## Deployment Checklist

### Pre-Release
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Run all tests
- [ ] Test on all platforms
- [ ] Check for security vulnerabilities
- [ ] Update documentation

### Release
- [ ] Create Git tag
- [ ] Build distributables
- [ ] Upload to GitHub Releases
- [ ] Update download links
- [ ] Announce on social media

### Post-Release
- [ ] Monitor for issues
- [ ] Respond to user feedback
- [ ] Plan next version
- [ ] Update roadmap

---

## Performance Optimization

### Build Size

```bash
# Analyze bundle size
npx vite-bundle-visualizer

# Optimize
- Remove unused dependencies
- Use dynamic imports
- Minimize assets
```

### Runtime Performance

```bash
# Profile Electron
npx electron . --trace-warnings --trace-deprecation

# Monitor memory
- Use Chrome DevTools Memory profiler
- Check for memory leaks
- Optimize large data structures
```

---

## Security Best Practices

1. **Never commit secrets**
   - Add `settings.json` to `.gitignore`
   - Use environment variables for CI/CD

2. **Validate user input**
   - Sanitize file paths
   - Escape shell commands
   - Validate API responses

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

4. **Sign your builds**
   - macOS: Apple Developer Certificate
   - Windows: Code Signing Certificate

---

## Support

- **Issues:** https://github.com/DevAgentForge/agent-cowork/issues
- **Discussions:** https://github.com/DevAgentForge/agent-cowork/discussions
- **Documentation:** See README.md, QUICKSTART.md, MIGRATION_GUIDE.md

---

**Last Updated:** January 14, 2026  
**Version:** 0.0.3
