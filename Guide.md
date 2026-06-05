Build a production-quality Android weather app called SkySync using Expo React Native and TypeScript.

Goal
Create an offline-first weather app that integrates WeatherAI directly, demonstrates clean architecture, caching, state management, and a polished mobile UI.

Tech stack
- Expo
- TypeScript
- TanStack Query
- Zustand
- MMKV
- React Navigation or Expo Router
- EAS Build for APK

Project structure
Create these folders:
src/api
src/components
src/screens
src/store
src/hooks
src/utils
src/types
src/navigation

Phase 1: verify the app boots
1. Create a fresh Expo app.
2. Run the starter app.
3. Fix any setup or boot issues before adding features.
4. Do not add API code yet.

Phase 2: setup architecture
1. Add navigation.
2. Add a theme file.
3. Add reusable UI components.
4. Add state management with Zustand.
5. Add server-state caching with TanStack Query.
6. Add local persistence with MMKV.

Phase 3: WeatherAI integration
1. Create one API client for WeatherAI.
2. Use Bearer token auth from environment variables.
3. Set the base URL from the WeatherAI docs.
4. Implement these endpoints:
   - GET /v1/weather
   - GET /v1/weather-geo?ip=auto
   - GET /v1/current
   - GET /v1/daily
   - GET /v1/hourly
   - GET /v1/usage
5. Do not depend on Pro-only endpoints.
6. Do not use forecast14, insights, webhooks, SMS, or USSD in v1.

Phase 4: app flow
1. On app launch, call weather-geo?ip=auto.
2. Use the detected lat/lon to fetch weather.
3. Show cached data immediately if available.
4. Refresh in the background.
5. Save all successful responses locally.

Phase 5: screens
1. Home screen:
   - current temperature
   - condition
   - feels like
   - humidity
   - wind
   - location
   - last updated time
2. Daily forecast screen:
   - daily cards
3. Hourly forecast screen:
   - hourly list or chart
4. Settings screen:
   - units toggle metric/imperial
   - AI summary toggle
   - saved locations
5. Usage screen:
   - show /v1/usage data if available

Phase 6: offline-first behavior
1. If offline, show the last cached response.
2. If no cache exists, show a friendly empty state.
3. Add visible loading skeletons.
4. Add graceful error handling for 401, 403, 429, 500, and 503.
5. Retry temporary failures intelligently.


Phase 7: quality
1. Keep components organised.
2. Add strong TypeScript types.
3. Keep the UI minimal, modern, and easy to review.
4. Add a clear README.
5. Keep secrets out of the repo.

Phase 8: build and deliver
1. Configure EAS Build.
2. Generate an Android APK.
3. Test on a real physical device.
4. Fix build/runtime issues.
5. Prepare a clean GitHub repo.

Acceptance criteria
- App launches successfully.
- WeatherAI data loads correctly.
- Cached weather works offline.
- Forecast screens work.
- APK is generated.
- Repo is tidy and reviewable.