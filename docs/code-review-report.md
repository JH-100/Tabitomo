# Tabitomo Code Review & Security Audit Report

**Date:** 2026-04-03
**Scope:** Full source code review of all app/, components/, constants/, store/, lib/ files

---

## CRITICAL Severity

### C1. No Birthdate Input Validation (passport.tsx)

**File:** `app/(onboarding)/passport.tsx`, lines 24-33
**Type:** Input Validation / Data Integrity

The birthdate field accepts arbitrary free-text input with no format validation. The `canSubmit` check on line 33 only verifies `birthdate.length > 0`, meaning values like "abcdef", "9999-99-99", or even script-like strings are stored as-is.

**Impact:** Corrupted user profile data, potential display issues, and if this data is later sent to a Supabase backend, it could cause server-side errors or data integrity violations.

**Fix:**

```tsx
// Add validation function
function isValidBirthdate(value: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) return false;
  const date = new Date(value);
  const now = new Date();
  return !isNaN(date.getTime()) && date < now && date.getFullYear() > 1900;
}

// Update canSubmit:
const canSubmit = name.trim().length > 0 && isValidBirthdate(birthdate) && gender !== null;
```

### C2. No Name Field Length or Character Validation (passport.tsx)

**File:** `app/(onboarding)/passport.tsx`, lines 107-114
**Type:** Input Validation

The name field has no `maxLength` prop and no character filtering. Users can input extremely long strings or special characters, which will be stored in AsyncStorage and later rendered in the passport MRZ strip (PassportScene.tsx line 121) where `.toUpperCase()` is called on it directly.

**Impact:** Layout-breaking long names, potential performance issues from rendering massive strings, and data integrity issues.

**Fix:**

```tsx
<TextInput
  style={styles.input}
  value={name}
  onChangeText={(text) => setName(text.replace(/[^\p{L}\p{N}\s'-]/gu, '').slice(0, 50))}
  placeholder="..."
  maxLength={50}
/>
```

### C3. Supabase Credentials Not Using Environment Variables (lib/supabase.ts)

**File:** `lib/supabase.ts`, lines 19-20
**Type:** Security - Credential Management

Supabase URL and anon key are hardcoded as string literals. While currently placeholder values, the TODO comment indicates real credentials will be placed here. Hardcoded credentials will be committed to version control.

**Impact:** When real credentials are added, they will be exposed in the git history, even if later removed. The `.gitignore` does not include `.env` files.

**Fix:**

```ts
// 1. Install expo-constants or use process.env
// 2. Create .env file:
//    EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
//    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
// 3. Add .env* to .gitignore
// 4. Replace hardcoded values:
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
```

---

## HIGH Severity

### H1. Profile Data Stored in Unencrypted AsyncStorage (store/useUserStore.ts)

**File:** `store/useUserStore.ts`, lines 119-133
**Type:** Security - Data at Rest

User profile (displayName, birthdate, gender) is persisted via Zustand + AsyncStorage, which stores data as plaintext JSON. While `lib/supabase.ts` correctly uses SecureStore for auth tokens, the profile data in the Zustand store bypasses this entirely.

**Impact:** On a rooted/jailbroken device, any app or user could read the profile data from AsyncStorage.

**Recommendation:** For sensitive fields (birthdate), either encrypt before storing or use a SecureStore-based storage adapter for the Zustand persist middleware.

### H2. No Logout/Reset Confirmation Dialog (profile.tsx)

**File:** `app/(tabs)/profile.tsx`, lines 12-14
**Type:** UX / Data Loss

The `handleLogout` function calls `reset()` which wipes ALL user progress (lessons completed, XP, practice history) immediately with no confirmation dialog. The `Alert` import on line 1 is imported but never used.

**Impact:** Users can accidentally lose all their learning progress with a single tap.

**Fix:**

```tsx
const handleLogout = () => {
  Alert.alert('초기화', '모든 학습 데이터가 삭제됩니다. 계속하시겠습니까?', [
    { text: '취소', style: 'cancel' },
    {
      text: '초기화',
      style: 'destructive',
      onPress: () => {
        reset();
        router.replace('/(onboarding)/welcome');
      },
    },
  ]);
};
```

### H3. Missing Error Boundary at Root Level (\_layout.tsx)

**File:** `app/_layout.tsx`
**Type:** Reliability

There is no React Error Boundary wrapping the app. If any component throws during render (e.g., corrupted AsyncStorage data, missing lesson data), the entire app crashes with no recovery path.

**Recommendation:** Add a top-level ErrorBoundary component that catches errors and shows a recovery screen with a "Reset" button.

### H4. Lesson [id] Only Searches Hiragana Lessons (lesson/[id].tsx)

**File:** `app/lesson/[id].tsx`, line 37
**Type:** Bug

`const lesson = HIRAGANA_LESSONS.find((l) => l.id === id);` only searches hiragana lessons. If a user navigates to a katakana lesson (e.g., `/lesson/katakana-a`), `lesson` will be undefined and the error screen is shown.

**Impact:** Katakana lessons are completely broken -- they display as "not found."

**Fix:**

```tsx
import KATAKANA_LESSONS from '../../constants/KatakanaData';
const ALL_LESSONS = [...HIRAGANA_LESSONS, ...KATAKANA_LESSONS];
// ...
const lesson = ALL_LESSONS.find((l) => l.id === id);
```

### H5. .gitignore Missing .env Pattern

**File:** `.gitignore`
**Type:** Security

The `.gitignore` file does not include `.env`, `.env.local`, or `.env.*` patterns. When the Supabase credentials are eventually moved to environment variables, the `.env` file could be accidentally committed.

**Fix:** Add `.env*` to `.gitignore`.

### H6. Duplicate shuffleArray Implementations

**Files:** `app/lesson/[id].tsx` (line 17), `app/practice/matching.tsx` (line 19), `constants/QuizUtils.ts` (line 33)
**Type:** Code Quality - DRY Violation

The Fisher-Yates shuffle is implemented identically in three separate files. This makes maintenance harder and increases the surface area for subtle bugs.

**Fix:** Export `shuffleArray` from `constants/QuizUtils.ts` and import it everywhere else.

---

## MEDIUM Severity

### M1. Large Files Exceeding 300 Lines

The following files exceed 300 lines and should be refactored:

| File                        | Lines | Recommendation                                                      |
| --------------------------- | ----- | ------------------------------------------------------------------- |
| `app/lesson/[id].tsx`       | 461   | Extract `CompletionScreen` into separate component                  |
| `app/practice/matching.tsx` | 405   | Extract `MatchCard`, `ResultScreen` into separate files             |
| `app/practice/input.tsx`    | 399   | Extract `ResultScreen` into separate component                      |
| `app/practice/quiz.tsx`     | 381   | Extract `ResultScreen` into separate component                      |
| `components/Avatar3D.tsx`   | 370   | Extract styles, consider breaking face/body/cap into sub-components |

### M2. Unused Import: Alert in profile.tsx

**File:** `app/(tabs)/profile.tsx`, line 1
**Type:** Dead Code

`Alert` is imported from `react-native` but never used. (This ties into H2 -- it should be used for confirmation.)

### M3. Missing useEffect Dependency in \_layout.tsx

**File:** `app/_layout.tsx`, line 15
**Type:** React Best Practices

`useEffect(() => { ... }, [])` calls `setLoading` but doesn't include it in the dependency array. While Zustand actions are stable references, the React linter will flag this.

### M4. Unused Variable `s` in Avatar3D.tsx

**File:** `components/Avatar3D.tsx`, line 15
**Type:** Dead Code

`const s = size / 90;` is declared but never used anywhere in the component.

### M5. Magic Numbers Throughout Codebase

Numerous hardcoded values appear without named constants:

- `500` ms loading timeout (`_layout.tsx:13`)
- `1000` ms delay after selection (`lesson/[id].tsx:80`)
- `800` ms delay after quiz selection (`practice/quiz.tsx:65`)
- `600` ms wrong card visibility (`practice/matching.tsx:160`)
- `100` max practice history entries (`store/useUserStore.ts:101`)
- `10` default quiz question count (`constants/QuizUtils.ts:65`)

**Recommendation:** Extract these into a `constants/Config.ts` file with named values.

### M6. Web localStorage Fallback Has No Error Handling (lib/supabase.ts)

**File:** `lib/supabase.ts`, lines 7-11
**Type:** Error Handling

The web fallback uses `localStorage` directly without try/catch. In private/incognito mode or when storage is full, localStorage operations throw errors.

### M7. No Accessibility Labels on Interactive Elements

Multiple screens lack `accessibilityLabel` and `accessibilityRole` props:

- Gender pills in `passport.tsx`
- Action buttons in `index.tsx` (home)
- Practice mode cards in `practice.tsx`
- Quiz option buttons in `quiz.tsx`, `lesson/[id].tsx`
- Drawing canvas in `handwriting.tsx`

### M8. DrawingCanvas Forces Re-render on Every Touch Move

**File:** `components/DrawingCanvas.tsx`, line 41
**Type:** Performance

`setStrokes((prev) => [...prev])` is called on every `onPanResponderMove` event (potentially 60+ times per second) just to force a re-render of the current stroke. This creates a new array reference on every touch move.

**Recommendation:** Use `useSharedValue` from Reanimated for the current stroke, or debounce the state updates.

### M9. practiceHistory Grows Unboundedly Per Session

**File:** `store/useUserStore.ts`, line 101
**Type:** Performance

While `practiceHistory` is sliced to 100 entries, `flashcardResults` (line 109) grows without bound -- one entry per character per lesson attempt. Over many sessions this could grow large.

---

## LOW Severity

### L1. @ts-ignore in GlassCard.tsx

**File:** `components/GlassCard.tsx`, line 88
**Type:** Type Safety

`// @ts-ignore` suppresses type errors for web-specific CSS properties. Use a proper type assertion or conditional styles instead.

### L2. Hardcoded Color Strings in Avatar3D.tsx

**File:** `components/Avatar3D.tsx`
**Type:** Consistency

Colors like `'#3B4A6B'`, `'#4A72B8'`, `'#FFDBB4'`, `'#E05A3A'` are hardcoded instead of using the `Colors` constant. While these are avatar-specific, they should at least be extracted to named constants at the top of the file.

### L3. `as any` Type Casts

**File:** `app/(tabs)/practice.tsx`, line 99
**Type:** Type Safety

`router.push(mode.route as any)` casts the route to `any`. Use proper route typing from expo-router.

### L4. No Loading State for Quiz Generation

**Files:** `app/practice/quiz.tsx`, `app/practice/input.tsx`, `app/practice/matching.tsx`
**Type:** UX

When questions/pairs are being generated in `useEffect`, the component briefly renders the "cannot generate" error state before the effect runs and populates the state. This can cause a flash of error content.

### L5. Inconsistent Error Message Language

Error messages mix Korean and generic patterns:

- `passport.tsx`: Korean error message
- `lesson/[id].tsx`: Korean error
- `practice/*.tsx`: Korean error

This is fine for a Korean-targeted app, but there is no i18n infrastructure for future localization.

### L6. PanResponder Created in useRef Without Cleanup

**File:** `components/DrawingCanvas.tsx`, line 28
**Type:** Minor

The PanResponder is created once via `useRef` and never cleaned up. While not a memory leak in this case, it references `setStrokes` from the initial render closure. This works because `setStrokes` from `useState` is stable, but it is a subtle dependency.

---

## Summary

| Severity  | Count  |
| --------- | ------ |
| CRITICAL  | 3      |
| HIGH      | 6      |
| MEDIUM    | 9      |
| LOW       | 6      |
| **Total** | **24** |

### Top Priority Action Items

1. Add birthdate validation in passport.tsx (C1)
2. Add name field sanitization and length limit (C2)
3. Move Supabase credentials to environment variables and update .gitignore (C3, H5)
4. Fix katakana lesson lookup bug in lesson/[id].tsx (H4)
5. Add reset confirmation dialog in profile.tsx (H2)
6. Add root-level Error Boundary (H3)
