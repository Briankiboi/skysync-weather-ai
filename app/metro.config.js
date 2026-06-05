// Metro config extending Expo's defaults.
// Adds the "@/..." path alias (mirrors tsconfig paths) so imports stay clean
// as the app grows. Works identically on Android and iOS.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
};

module.exports = config;
