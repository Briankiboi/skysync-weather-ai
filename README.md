# SkySync 🌤️

A production-quality offline-first weather app built with React Native (Expo) and TypeScript. SkySync integrates the WeatherAI API to deliver real-time weather forecasts with intelligent local caching and seamless offline support.

---

## Features

- 🌡️ **Current Weather**: Real-time temperature, humidity, wind speed, and conditions
- 📅 **7-Day Forecast**: Daily weather predictions with min/max temperatures
- ⏰ **24-Hour Forecast**: Hour-by-hour breakdown for the next day
- 📍 **Auto-Location**: Detects your location automatically on first launch
- 📴 **Offline-First**: Cached weather loads instantly, works without internet
- 🔄 **Background Sync**: Auto-refreshes data when network is available
- ⚙️ **Settings**: Toggle metric/imperial units, manage saved locations

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Expo + React Native** | Cross-platform mobile framework |
| **TypeScript** | Type-safe JavaScript |
| **Zustand** | Client state management (UI state) |
| **TanStack Query** | Server state management (API data) |
| **MMKV** | Fast local storage for caching |
| **React Navigation** | Screen navigation |
| **Axios** | HTTP client for API calls |
| **EAS Build** | Android APK generation |

---

## Project Structure

```bash
skySync-weather-ai/
├── src/
│   ├── api/              # WeatherAI API client
│   │   ├── client.ts     # Axios instance with Bearer token auth
│   │   ├── weather.ts    # Weather endpoint functions
│   │   ├── geo.ts        # Geolocation endpoint functions
│   │   └── usage.ts      # Usage tracking endpoint
│   ├── components/       # Reusable UI components
│   │   ├── WeatherCard.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── EmptyState.tsx
│   │   └── OfflineBadge.tsx
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── DailyForecastScreen.tsx
│   │   ├── HourlyForecastScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── UsageScreen.tsx
│   ├── store/            # Zustand state management
│   │   ├── weatherStore.ts
│   │   ├── settingsStore.ts
│   │   └── index.ts
│   ├── hooks/            # Custom React hooks
│   │   ├── useWeather.ts
│   │   ├── useOfflineSync.ts
│   │   └── useLocation.ts
│   ├── utils/            # Helper functions
│   │   ├── formatters.ts
│   │   ├── errorHandlers.ts
│   │   └── constants.ts
│   ├── types/            # TypeScript interfaces
│   │   ├── weather.ts
│   │   ├── geo.ts
│   │   └── index.ts
│   └── navigation/       # React Navigation setup
│       ├── AppNavigator.tsx
│       └── types.ts
├── __tests__/            # Test files (optional)
│   ├── api/weather.test.ts
│   └── utils/formatters.test.ts
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── tsconfig.json         # TypeScript configuration
├── babel.config.js       # Babel configuration
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

**Architecture**: Clean Architecture with 4 layers (UI → State → Services → API)

---

## API Integration

SkySync uses these WeatherAI API endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/weather-geo?ip=auto` | Auto-detect user location |
| `GET /v1/weather` | Current weather + 7-day forecast |
| `GET /v1/current` | Current conditions only |
| `GET /v1/daily` | 7-day daily forecast |
| `GET /v1/hourly` | 24-hour hourly forecast |
| `GET /v1/usage` | API usage tracking |

**Authentication**: Bearer token via `Authorization` header

---

## Offline-First Caching

SkySync implements cache-first strategy using MMKV:

1. **Instant Load**: Cached weather shows in 0ms on app launch
2. **Background Refresh**: New data fetched every 30 minutes
3. **Offline Badge**: Visible indicator when using cached data
4. **Smart Retry**: Exponential backoff (1s → 30s max) on network failures

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- WeatherAI API key (get one at [weather-ai.co](https://weather-ai.co))

### Installation

```bash
# Clone repository
git clone https://github.com/briankiboi/skySync-weather-ai.git
cd skySync-weather-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env: EXPO_PUBLIC_WEATHERAI_KEY=wai_your_key_here

# Start development server
npm run start

# Run on Android
npm run android
```

### Build APK

```bash
# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build Android APK
eas build --platform android --profile preview
```

---


## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Zustand + TanStack Query** | Separate UI state (Zustand) from server state (TanStack) |
| **MMKV for caching** | 3x faster than AsyncStorage, ~1ms read time |
| **Single API client** | All auth and error handling in one place |
| **TypeScript interfaces** | Catch bugs at compile time, better DX |
| **Reusable components** | WeatherCard used across multiple screens |
| **Custom hooks** | Encapsulate complex logic (caching, retry, offline detection) |


---

## About the Author

**Brian Kiboi**  
📍 Nairobi, Kenya  
🎯 Full Stack Developer / Mobile Developer
- 🌐 https://briankiboi.is-a.dev

---

## License

MIT License — see [LICENSE](LICENSE) file for details

---

**Built with ❤️ using React Native, TypeScript, and WeatherAI**
