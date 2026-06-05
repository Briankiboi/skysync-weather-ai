<div align="center">

# SkySync Weather-ai 🌤️

SkySync is a modern weather intelligence application built with React Native and TypeScript.

The app integrates directly with [WeatherAI](https://weather-ai.co) API to deliver real-time weather conditions, hourly forecasts, daily forecasts, and meaningful weather insights through a clean, responsive, and intuitive mobile experience.Built with a scalable architecture powered by TanStack Query, Zustand, and persistent local caching, SkySync demonstrates efficient data synchronization, intelligent refresh management, robust state handling, and high-performance cross-platform development for both **Android and iOS** from one codebase.

</div>


---

## Screens

| Home | Daily | Hourly | Usage | Settings |
|------|-------|--------|-------|----------|
| Current conditions, hourly curve, daily summary | 7-day forecast cards | Hour-by-hour, grouped by day | Monthly quota with progress bars | Units, clock, summary, location |


---

## Tech Stack

| Technology | Version | Category | Purpose | Why This Choice |
| ---------- | ------- | -------- | ------- | --------------- |
| Expo | SDK 54 | Framework | Cross-platform mobile (Android + iOS) | Cloud builds via EAS, no native toolchain needed, reproducible |
| React Native | 0.81.5 | Framework | UI rendering | Industry standard, large ecosystem, active maintenance |
| TypeScript | 5.9.3 | Language | Type-safe codebase (strict) | Zero `any` types, compile-time errors, strong IntelliSense |
| React Navigation | 7.2.5 | Navigation | Bottom tabs + screen transitions | Type-safe routing, native performance, large plugin ecosystem |
| Zustand | 5.0.14 | State (client) | UI state — settings, refresh cooldown, saved locations | Tiny footprint, persist middleware, minimal boilerplate |
| TanStack Query | 5.101.0 | State (server) | API caching, offline persistence, retry logic | Stale-while-revalidate, background refetch, deduped requests |
| react-native-svg | 15.12.1 | Visualization | Hourly temperature curve graph | Vector graphics, smooth rendering, no image assets |
| expo-linear-gradient | 15.0.8 | UI | Adaptive animated weather backdrop (colors by condition) | Native GPU rendering, smooth gradient transitions |
| @react-native-community/netinfo | 11.4.1 | Utilities | Real-time offline detection (offline banner) | Subscription-based, instant network-state changes |
| @react-native-async-storage/async-storage | 2.2.0 | Storage | Local persistence layer (MMKV-ready, swappable) | RN-standard, abstracted so it can swap to MMKV in a native build |
| Fetch API | native | HTTP | Single WeatherAI client (Bearer auth, error mapping) | Built-in, no extra dependency; centralized errors in `client.ts` |
| EAS Build | — | Build | Cloud-based Android APK / iOS builds | No Android Studio, signed builds, reproducible artifacts |

---

## Project Structure

Source  code files are  organized by responsibility; components are kept clean and scalable to avoid deep relative imports in future.

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

---

## WeatherAI Integration

A **single API client** handles auth, base URL, and error mapping. The six endpoint functions:

| Endpoint | Function | Used for |
|----------|----------|----------|
| `GET /v1/weather` | `getWeather` | Full bundle for a lat/lon |
| `GET /v1/weather-geo?ip=auto` | `getWeatherGeo` | Auto-detect location + weather (primary flow) |
| `GET /v1/current` | `getCurrent` | Current conditions |
| `GET /v1/daily` | `getDaily` | Daily forecast |
| `GET /v1/hourly` | `getHourly` | Hourly forecast |
| `GET /v1/usage` | `getUsage` | Account quota |


> Note: every weather endpoint returns the same combined bundle (location + current + hourly + daily), so the app makes **one** `weather-geo` request and derives every screen from it — minimising API usage.

---

## Caching & Offline-First

- **Instant load:** the TanStack Query cache is **persisted** locally (`QueryProvider`), so the last weather shows immediately on launch even offline.
- **Smart refresh cooldown:** after a successful fetch the timestamp is stored ([`refreshStore`](app/src/store/refreshStore.ts)); no further API call is made — pull-to-refresh **or** background for **30 minutes**. The cooldown persists across app restarts.
- **Offline UX:** a subtle "Offline — showing saved weather" banner appears; cached data stays visible. With no cache yet, a friendly empty state is shown.
- **Retries:** transient failures retry once with exponential backoff; auth errors don't retry.

---

## Getting Started

### Prerequisites
- **Node.js 20 LTS**
- A free **WeatherAI** API key  sign up at [weather-ai.co](https://weather-ai.co) → dashboard → **API Keys**
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

---

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Single `weather-geo` request drives all screens** | Every endpoint returns the same bundle, so one call minimises API usage |
| **Client-side unit conversion** | Switching °C/°F never triggers a network request |
| **30-min refresh cooldown** | Weather changes ~hourly; protects the free-tier quota while staying fresh |
| **Fact-only summary** | The API has no AI-text field (and `insights` is out of scope), so the summary is composed **only** from real fields  never fabricated |
| **Swappable storage layer** | AsyncStorage today for fast Expo-Go dev; one-file swap to MMKV in a native build |
| **Condition × time-of-day backdrop** | Makes the app feel alive and informative at a glance, theme-aware and contrast-checked |

---


## Author

🌐 https://briankiboi.is-a.dev

**Brian Kiboi** · Full-Stack / Mobile Developer

## License

MIT — see [LICENSE](app/LICENSE).

---

<div align="center">

**Built with ❤️ using React Native, TypeScript, and WeatherAI.**

</div>
