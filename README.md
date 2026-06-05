# SkySync 🌤️

A production-quality, **offline-first** weather app built with **Expo (React Native)** and **TypeScript**. SkySync integrates the WeatherAI API to deliver real-time forecasts with intelligent local caching and seamless offline support — and runs on both **Android and iOS** from a single codebase.

---

## Features

- 🌡️ **Current weather** — temperature, feels-like, humidity, wind, conditions
- 📅 **Daily forecast** — multi-day outlook cards
- ⏰ **Hourly forecast** — hour-by-hour breakdown
- 📍 **Auto-location** — detects location on first launch (`weather-geo?ip=auto`)
- 📴 **Offline-first** — cached weather loads instantly, works without internet
- 🔄 **Background sync** — refreshes silently when online
- ⚙️ **Settings** — metric/imperial units, AI-summary toggle, saved locations
- 📊 **Usage** — WeatherAI API usage stats

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Expo + React Native** | Cross-platform (Android + iOS) mobile framework |
| **TypeScript (strict)** | Type-safe code |
| **React Navigation** | Bottom-tab navigation |
| **Zustand** | Client/UI state (settings) |
| **TanStack Query** | Server-state caching (weather data) |
| **Persistence layer** | Swappable storage — AsyncStorage today, **MMKV-ready** for native builds |
| **EAS Build** | Android APK / iOS builds |

---

## Project Structure

The app lives in [`app/`](app/). Source is organized by responsibility so it scales cleanly:

```
app/
├── App.tsx                 # Root: providers + navigation
├── index.ts                # Expo entry point
├── app.json                # Expo config (name, icon, splash, plugins)
├── eas.json                # EAS Build profiles (APK / app-bundle)
├── metro.config.js         # Metro + "@/" path alias
├── tsconfig.json           # TS strict + "@/*" -> "src/*"
├── .env.example            # Env template (real .env is gitignored)
└── src/
    ├── api/                # Server-state: query client + WeatherAI client
    │   ├── queryClient.ts
    │   └── QueryProvider.tsx
    ├── components/         # Reusable UI primitives (barrel-exported)
    │   ├── Screen.tsx      #   safe-area + branded background wrapper
    │   ├── ThemedText.tsx  #   typography variants
    │   ├── Card.tsx
    │   ├── Button.tsx
    │   ├── Skeleton.tsx    #   animated loading placeholder
    │   └── index.ts
    ├── screens/            # One file per screen (barrel-exported)
    │   ├── HomeScreen.tsx
    │   ├── DailyScreen.tsx
    │   ├── HourlyScreen.tsx
    │   ├── UsageScreen.tsx
    │   ├── SettingsScreen.tsx
    │   └── index.ts
    ├── navigation/         # React Navigation setup
    │   └── RootNavigator.tsx
    ├── store/              # Zustand stores
    │   └── settingsStore.ts
    ├── hooks/              # Custom React hooks
    ├── theme/              # Design tokens (colors, spacing, type)
    │   └── index.ts
    ├── types/              # Shared TypeScript types
    │   └── settings.ts
    └── utils/              # Helpers
        ├── storage.ts      #   swappable persistence (AsyncStorage → MMKV)
        └── constants.ts
```

**Import style:** use the `@/` alias instead of deep relative paths — e.g. `import { Card } from '@/components'`.

**Architecture:** layered — **UI** (screens/components) → **State** (Zustand + TanStack Query) → **Services/API** (`src/api`) → **Persistence** (`src/utils/storage`).

---

## Getting Started

### Prerequisites
- **Node.js 20 LTS** (this project targets Expo SDK 54; Node 20 recommended)
- **Expo Go** app on your phone (Play Store / App Store), OR Android/iOS emulator
- For device-over-cable testing: `adb` (`sudo apt install adb` on Ubuntu)

### Install & run

```bash
cd app
npm install

# Start the dev server (and link an Android phone over USB)
npm run dev          # = adb reverse + expo start --localhost
# then press "a" to open on a connected Android device

# Or plain start (scan the QR with Expo Go):
npm run start
```

### Environment

```bash
cd app
cp .env.example .env
# Add your WeatherAI key
#   EXPO_PUBLIC_WEATHERAI_KEY=wai_your_key_here
```
The real `.env` is **gitignored** — secrets never get committed.

---

## Build an APK (EAS)

```bash
cd app
npx eas-cli login                 # or set EXPO_TOKEN in .env
npx eas-cli build --platform android --profile preview   # installable APK
```
Profiles are defined in [`app/eas.json`](app/eas.json):
- `preview` → installable **APK** (for testing)
- `production` → **app-bundle** (for store submission)

---

## Notes on storage (AsyncStorage vs MMKV)

Persistence is built behind a small swappable layer in [`app/src/utils/storage.ts`](app/src/utils/storage.ts): it uses **AsyncStorage** today (Expo-Go friendly, keeps fast hot-reload) and can switch to **MMKV** with a one-file change in a native build. The rest of the app is storage-agnostic.

---

## API Integration

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/weather-geo?ip=auto` | Auto-detect location |
| `GET /v1/weather` | Current + forecast |
| `GET /v1/current` | Current conditions |
| `GET /v1/daily` | Daily forecast |
| `GET /v1/hourly` | Hourly forecast |
| `GET /v1/usage` | API usage |

**Auth:** Bearer token via `Authorization` header, key read from environment.

---

## Author

**Brian Kiboi** · Nairobi, Kenya · Full-Stack / Mobile Developer
🌐 https://briankiboi.is-a.dev

## License

MIT — see [LICENSE](app/LICENSE).

---

**Built with ❤️ using React Native, TypeScript, and WeatherAI**
