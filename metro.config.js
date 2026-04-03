const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Expo SDK 54 enables unstable_enablePackageExports by default.
// This causes Metro to pick up ESM builds (e.g. zustand/esm/*.mjs)
// that contain import.meta, which breaks web bundling.
// Force it off so Metro uses the CJS "main" field instead.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
