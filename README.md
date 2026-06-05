<div align="center">

# SkySync 🌤️

**Your Weather Intelligence** — a production-quality, offline-first weather app built with React Native and TypeScript.

SkySync integrates the [WeatherAI](https://weather-ai.co) API directly, with a single clean API client, smart caching, an offline-first data layer, and a polished, adaptive UI that runs on **Android and iOS** from one codebase.

</div>

---

## Highlights

- 🌍 **Zero-setup location** — detects your city automatically from your IP (`weather-geo?ip=auto`). No GPS, no permission prompts.
- 🎨 **Adaptive weather backdrop** — the background gradient changes with the live condition *and* time of day (clear / cloudy / rain / storm / snow / fog × dawn / day / dusk / night), with a smooth cross-fade and a gentle ambient drift.
- 📈 **Hourly temperature curve** — an elegant SVG line graph (Pixel-Weather style) instead of a flat list.
- 🌗 **Light / Dark themes** — follows the system by default, with a one-tap manual toggle. Warm amber accent labels for life and contrast.
- 📴 **Offline-first** — last successful response is cached and shown instantly; a friendly offline banner appears when there's no connection.
- 🔄 **Smart pull-to-refresh** — pull to refresh with a 30-minute cooldown that protects your API quota (enforced silently, foreground *and* background).
- 🧠 **Fact-only daily summary** — a concise written summary built **only** from real API fields (never fabricated), with a toggle in Settings.
- 📊 **Usage view** — see how much of your monthly allowance you've used, with clean progress bars.
- ⚙️ **Real settings** — units (°C/°F), 12h/24h clock, summary toggle — all persisted across restarts.

---

## Screens

| Home | Daily | Hourly | Usage | Settings |
|------|-------|--------|-------|----------|
| Current conditions, hourly curve, daily summary | 7-day forecast cards | Hour-by-hour, grouped by day | Monthly quota with progress bars | Units, clock, summary, location |

> Add screenshots to `docs/` and link them here for the repo gallery.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Expo (SDK 54) + React Native 0.81** | Cross-platform (Android + iOS) framework |
| **TypeScript (strict)** | Type-safe code, no `any` |
| **React Navigation** (bottom tabs) | Navigation |
| **Zustand** | Client/UI state (settings, refresh cooldown) — persisted |
| **TanStack Query** (+ persist client) | Server-state caching, offline persistence, retries |
| **react-native-svg** | Hourly temperature curve graph |
| **expo-linear-gradient** | Adaptive animated weather backdrop |
| **@react-native-community/netinfo** | Offline detection |
| **AsyncStorage** (MMKV-ready) | Local persistence behind a swappable layer |
| **EAS Build** | Android APK / iOS builds |

---

## Project Structure

The app lives in [`app/`](app/). Source is organized by responsibility; components are kept small and the `@/` alias avoids deep relative imports.

```
app/src/
├── api/
│   ├── client.ts            # THE single WeatherAI client (Bearer auth, base URL, errors)
│   ├── weather.ts           # The 6 endpoint functions + current enrichment
│   ├── queryClient.ts       # TanStack Query client (30-min staleTime, retries)
│   └── QueryProvider.tsx    # Persisted query cache (offline-first)
├── components/              # Small, reusable UI (barrel-exported)
│   ├── Screen, Card, Button, ThemedText, Segmented, Skeleton
│   ├── WeatherBackground    #   adaptive animated gradient
│   ├── HourlyGraph          #   SVG temperature curve
│   ├── ThemeToggle, OfflineBanner, EmptyState, ErrorState, AnimatedSplash
├── screens/                 # Home · Daily · Hourly · Usage · Settings
├── navigation/RootNavigator # Bottom tabs (branded)
├── store/
│   ├── settingsStore.ts     # units, clock, theme, summary toggle (persisted)
│   └── refreshStore.ts      # 30-min refresh cooldown timestamp (persisted)
├── theme/
│   ├── index.ts             # light + dark palettes, design tokens
│   ├── useTheme.ts          # active palette (system or manual override)
│   ├── sky.ts               # condition × time-of-day gradient map
│   └── SkyContext.tsx       # live-condition → backdrop wiring
├── hooks/
│   ├── useWeather.ts        # TanStack Query hooks per endpoint
│   ├── useAppWeather.ts     # app flow: geo → bundle, enrichment, cooldown
│   └── useOnline.ts         # connectivity
├── types/                   # weather.ts, settings.ts (modelled from real API)
└── utils/
    ├── weather.ts           # condition labels/emoji, unit + time formatting
    ├── summary.ts           # fact-only daily summary
    ├── country.ts           # country code → name + flag (client-side)
    └── storage.ts           # swappable persistence (AsyncStorage → MMKV)
```

**Architecture:** layered — **UI** (screens/components) → **State** (Zustand + TanStack Query) → **Services** (`src/api`) → **Persistence** (`src/utils/storage`).

---

## WeatherAI Integration

A **single API client** ([`app/src/api/client.ts`](app/src/api/client.ts)) handles auth, base URL, and error mapping. The six endpoint functions live in [`app/src/api/weather.ts`](app/src/api/weather.ts):

| Endpoint | Function | Used for |
|----------|----------|----------|
| `GET /v1/weather` | `getWeather` | Full bundle for a lat/lon |
| `GET /v1/weather-geo?ip=auto` | `getWeatherGeo` | Auto-detect location + weather (primary flow) |
| `GET /v1/current` | `getCurrent` | Current conditions |
| `GET /v1/daily` | `getDaily` | Daily forecast |
| `GET /v1/hourly` | `getHourly` | Hourly forecast |
| `GET /v1/usage` | `getUsage` | Account quota |

- **Auth:** `Authorization: Bearer <key>` — key read from `EXPO_PUBLIC_WEATHERAI_KEY`.
- **Base URL:** `EXPO_PUBLIC_WEATHERAI_BASE_URL` (defaults to `https://api.weather-ai.co`).
- **No Pro-only endpoints** — no `forecast14`, `insights`, webhooks, SMS, or USSD.
- **Error handling:** typed `ApiError` for **401 / 403 / 429 / 500 / 503** + network/offline, each surfaced as a friendly message with retry where it makes sense.

> Note: every weather endpoint returns the same combined bundle (location + current + hourly + daily), so the app makes **one** `weather-geo` request and derives every screen from it — minimising API usage.

---

## Caching & Offline-First

- **Instant load:** the TanStack Query cache is **persisted** locally (`QueryProvider`), so the last weather shows immediately on launch — even offline.
- **Smart refresh cooldown:** after a successful fetch the timestamp is stored ([`refreshStore`](app/src/store/refreshStore.ts)); no further API call is made — pull-to-refresh **or** background — for **30 minutes**. The cooldown persists across app restarts.
- **Offline UX:** a subtle "Offline — showing saved weather" banner appears; cached data stays visible. With no cache yet, a friendly empty state is shown.
- **Retries:** transient failures retry once with exponential backoff; auth errors don't retry.

---

## Getting Started

### Prerequisites
- **Node.js 20 LTS**
- A free **WeatherAI** API key — sign up at [weather-ai.co](https://weather-ai.co) → dashboard → **API Keys** (format `wai_...`)
- For device-over-cable dev: `adb` (`sudo apt install adb` on Ubuntu) + **Expo Go** on your phone

### Install & configure
```bash
cd app
npm install
cp .env.example .env
# then edit app/.env:
#   EXPO_PUBLIC_WEATHERAI_KEY=wai_your_key_here
#   EXPO_PUBLIC_WEATHERAI_BASE_URL=https://api.weather-ai.co
```
The real `.env` is **gitignored** — secrets never get committed.

### Run
```bash
cd app
npm run dev      # = adb reverse + expo start --localhost   (then press "a")
# or
npm run start    # scan the QR with Expo Go
```

---

## Build an APK (EAS)

```bash
cd app
npx eas-cli login                 # or set EXPO_TOKEN in .env
npx eas-cli build --platform android --profile preview   # installable APK
```
Profiles live in [`app/eas.json`](app/eas.json): `preview` → installable **APK**, `production` → **app-bundle**.

---

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Single `weather-geo` request drives all screens** | Every endpoint returns the same bundle, so one call minimises API usage |
| **Client-side unit conversion** | Switching °C/°F never triggers a network request |
| **30-min refresh cooldown** | Weather changes ~hourly; protects the free-tier quota while staying fresh |
| **Fact-only summary** | The API has no AI-text field (and `insights` is out of scope), so the summary is composed **only** from real fields — never fabricated |
| **Swappable storage layer** | AsyncStorage today for fast Expo-Go dev; one-file swap to MMKV in a native build |
| **Condition × time-of-day backdrop** | Makes the app feel alive and informative at a glance, theme-aware and contrast-checked |

---

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | adb reverse + start dev server (Android over cable) |
| `npm run start` | start dev server (QR / Expo Go) |
| `npx tsc --noEmit` | type-check |
| `npx expo export --platform android` | verify the JS bundle builds |

---

## Author

**Brian Kiboi** · Nairobi, Kenya · Full-Stack / Mobile Developer
🌐 https://briankiboi.is-a.dev

## License

MIT — see [LICENSE](app/LICENSE).

---

<div align="center">

**Built with ❤️ using React Native, TypeScript, and WeatherAI**

</div>
