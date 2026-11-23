# JobHub Frontend (Expo React Native)

This is an Expo / React Native mobile application following modern Expo architecture (SDK 58+).

## ⚠️ Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json` (Currently: **SDK 58**).
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v58.0.0/`
3. Fetch `https://docs.expo.dev/llms.txt` — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

---

## 🛠️ Official Expo Agent Skills

This repository includes 25 official Expo skills in `.agents/skills/` (from `github.com/expo/skills`):
- `expo-overview`: Start here for general tasks.
- `expo-project-structure`: Scaffolding files and directories.
- `expo-router`: Navigation, stacks, tabs, modals, deep linking.
- `expo-native-ui`: Native styling, Apple HIG, Material 3, semantic themes.
- `expo-ui`: SwiftUI and Jetpack Compose components via `@expo/ui`.
- `expo-data-fetching`: Networking, caching, React Query, SWR.
- `expo-dev-client`: Local development builds with native code.
- `eas-app-stores` & `eas-hosting`: Deployment and release pipelines.
- `eas-workflows`: CI/CD automation for Expo.

AI coding agents (Antigravity, Cursor, Claude Code, Windsurf, Codex, etc.) should consult these skills before executing tasks.

---

## 🔌 Model Context Protocol (MCP)

The Expo MCP server is configured in `.mcp.json` and `.cursor/mcp.json`:
- **Server URL:** `https://mcp.expo.dev/mcp`
- **Transport:** HTTP (SSE / Streamable HTTP)
- **Capabilities:**
  - Live access to latest official Expo docs.
  - Safe package installation (`npx expo install`).
  - Query EAS build history, EAS Update channels, TestFlight metadata.
  - Take simulator screenshots and interact with running app instances.

---

## 📋 Essential Commands (Bun Active)

This project uses **Bun** as its package manager and script runner (`bun.lock` present).

```bash
bun expo install <package>  # ALWAYS use to install dependencies — resolves SDK-compatible versions
bun expo start              # Start the local development server (Metro bundler)
bun run android             # Run on Android emulator / device
bun run ios                 # Run on iOS simulator (macOS required)
bun run web                 # Run in browser
bun run lint                # Run linter
bunx tsc --noEmit           # TypeScript type check
bunx expo-doctor            # Diagnose dependency and configuration health
bun expo install --fix      # Fix incompatible package versions
```

---

## 🏗️ Architecture & Best Practices

1. **Continuous Native Generation (CNG):**
   - The repository does NOT track `android/` and `ios/` in version control.
   - Configure native behavior (permissions, schemes, icons, plugins) in `app.json` or Config Plugins.
   - Run `npx expo prebuild` when compiling native binaries.

2. **Navigation (Expo Router):**
   - Routes live strictly in `src/app/`.
   - Every file in `src/app/` represents a route; `_layout.tsx` defines the navigator.
   - Reusable components live in `src/components/`, business logic in `src/hooks/` and `src/services/`.

3. **Development Builds:**
   - Expo Go is for initial prototyping. When adding custom native code, install `expo-dev-client` and create a development build via `npx expo run:android` or EAS Build.

4. **Quality Gate:**
   - Always verify changes with `npx expo-doctor` and `npx tsc --noEmit`.
