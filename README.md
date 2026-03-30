# Tabitomo (タビトモ / 旅友)

Japanese conversation learning app with a travel-themed progression system.

## Concept

Learn Japanese as you prepare for and embark on a trip to Japan.
Each level represents a stage of your journey — from getting your passport to exploring cities like Shibuya, Kyoto, and Osaka.

### Level Progression

| Level | Location | Milestone |
|-------|----------|-----------|
| Lv.0 | Passport | Sign up + Onboarding |
| Lv.1 | Book Ticket | Complete Hiragana |
| Lv.2 | Pack Bags | Complete Katakana |
| Lv.3 | Airport | Basic Greetings / Numbers |
| Lv.4 | Board Plane | Basic Grammar |
| Lv.5 | Land at Narita | 10 Basic Conversations |
| Lv.6+ | Shibuya / Kyoto / Osaka | Expanding... |

## Tech Stack

- **Framework**: Expo SDK 54 + React Native 0.81
- **Language**: TypeScript
- **Navigation**: Expo Router v6 (file-based routing)
- **State Management**: Zustand (persisted with AsyncStorage)
- **Backend**: Supabase (auth + database)
- **Animation**: React Native Reanimated v4
- **UI**: Custom Glass UI design system (dark theme, tactile depth)

## Project Structure

```
app/
  _layout.tsx              # Root layout (auth routing)
  (onboarding)/
    _layout.tsx            # Onboarding stack
    passport.tsx           # Lv.0 - Passport creation (signup)
  (tabs)/
    _layout.tsx            # Bottom tab navigator
    index.tsx              # Home screen (journey status)
    lessons.tsx            # Lessons (coming soon)
    practice.tsx           # AI conversation practice (coming soon)
    profile.tsx            # User profile + stats
components/
  Avatar3D.tsx             # 3D-style character avatar
  GlassCard.tsx            # Tactile glass card component
  JourneyMap.tsx           # Travel route visualization
  ScreenContainer.tsx      # Gradient background wrapper
  scenes/
    PassportScene.tsx      # Passport visual with animations
constants/
  Colors.ts                # Design system color tokens
  TravelStages.ts          # Level progression data
lib/
  supabase.ts              # Supabase client configuration
store/
  useUserStore.ts          # Global state (auth, progress, profile)
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npx expo start

# Run on web
npx expo start --web
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Update `lib/supabase.ts` with your project URL and anon key
3. Run the SQL schema in `docs/schema.sql` (coming soon)

## Design

- Dark theme with sci-fi gradients
- Tactile depth system (4 surface levels)
- Coral primary accent (#FF6B6B)
- Mint/Blue/Purple/Amber secondary accents
- Passport-style onboarding with flip + stamp animations
