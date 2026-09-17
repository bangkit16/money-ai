# Graph Report - money-ai  (2026-09-17)

## Corpus Check
- 217 files · ~192,085 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 622 nodes · 1861 edges · 29 communities (27 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Expo UI Components
- Authentication Screens
- Package Configuration
- Expo Dependencies
- Activity Screen
- App Configuration
- React Native & Query
- UI Components (Buttons, DatePicker)
- Expo Haptics
- Tanstack React Query
- Theme & Color Scheme
- Image & Avatar
- Supabase Integration
- AI Components
- Speech Recognition
- Input Fields
- Fonts & Navigation
- Transaction Flow
- Native Gestures & Toasts
- Settings & Analytics
- Bottom Sheet Components
- Expo Router
- TypeScript Config
- Date & Time Fields
- Auth Callback & Login
- Theme Colors
- ESLint Configuration
- React Native Assets
- MCP & Supabase Config

## God Nodes (most connected - your core abstractions)
1. `useColor()` - 131 edges
2. `useT()` - 74 edges
3. `react-native` - 70 edges
4. `Text` - 59 edges
5. `typography` - 50 edges
6. `react` - 41 edges
7. `radius` - 37 edges
8. `useSettings()` - 33 edges
9. `shadow` - 31 edges
10. `@expo/vector-icons` - 30 edges

## Surprising Connections (you probably didn't know these)
- `GroupedInput()` --calls--> `useColor()`  [EXTRACTED]
  src/components/ui/input.tsx → src/hooks/useColor.ts
- `GroupedInputItem` --calls--> `useColor()`  [EXTRACTED]
  src/components/ui/input.tsx → src/hooks/useColor.ts
- `LoadingOverlay()` --calls--> `useColor()`  [EXTRACTED]
  src/components/ui/spinner.tsx → src/hooks/useColor.ts
- `AccountScreen()` --calls--> `useToast()`  [EXTRACTED]
  src/app/(tabs)/account.tsx → src/components/ui/toast.tsx
- `ActivityScreen()` --calls--> `groupByDate()`  [EXTRACTED]
  src/app/(tabs)/activity.tsx → src/components/features/activity/utils.ts

## Import Cycles
- None detected.

## Communities (29 total, 2 thin omitted)

### Community 0 - "Expo UI Components"
Cohesion: 0.07
Nodes (66): assets_images_adaptive_icon, expo-linear-gradient, expo-status-bar, @expo/vector-icons, react-native, react-native-safe-area-context, redirectTo, styles (+58 more)

### Community 1 - "Authentication Screens"
Cohesion: 0.06
Nodes (67): RegisterScreen(), AccountScreen(), styles, ActivityScreen(), AnalyticsScreen(), styles, DashboardScreen(), styles (+59 more)

### Community 2 - "Package Configuration"
Cohesion: 0.04
Nodes (45): devDependencies, eslint, eslint-config-expo, @types/react, typescript, main, name, private (+37 more)

### Community 3 - "Expo Dependencies"
Cohesion: 0.05
Nodes (38): dependencies, expo, expo-auth-session, expo-constants, expo-crypto, expo-device, expo-font, expo-glass-effect (+30 more)

### Community 4 - "Activity Screen"
Cohesion: 0.10
Nodes (30): styles, TxType, DateSectionHeader(), FilterChips(), FilterChipsProps, FILTERS, styles, TxType (+22 more)

### Community 5 - "App Configuration"
Cohesion: 0.06
Nodes (30): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+22 more)

### Community 6 - "React Native & Query"
Cohesion: 0.13
Nodes (21): react-native-svg, AmountDisplay(), styles, FormattedAmountInput(), DonutChart(), DonutChartProps, DonutSegment, Props (+13 more)

### Community 7 - "UI Components (Buttons, DatePicker)"
Cohesion: 0.11
Nodes (20): lucide-react-native, react-native-reanimated, ButtonProps, ButtonSize, ButtonVariant, Icon(), Props, AnimatedBar (+12 more)

### Community 8 - "Expo Haptics"
Cohesion: 0.13
Nodes (19): expo-haptics, Button, BaseDatePickerProps, currentYear, DatePicker(), DatePickerProps, DatePickerPropsDate, DatePickerPropsRange (+11 more)

### Community 9 - "Tanstack React Query"
Cohesion: 0.21
Nodes (12): @tanstack/react-query, EditTransactionBottomSheet(), EditTransactionBottomSheetProps, styles, TransactionTypeKey, useToast(), LoadedTx, TransactionFormState (+4 more)

### Community 10 - "Theme & Color Scheme"
Cohesion: 0.16
Nodes (14): OPTIONS, Props, styles, useColorScheme(), useColorScheme(), isMode(), Mode, ModeContext (+6 more)

### Community 11 - "Image & Avatar"
Cohesion: 0.16
Nodes (14): expo-image, Avatar, AvatarContext, AvatarContextValue, AvatarFallback, AvatarFallbackProps, AvatarImage, AvatarImageProps (+6 more)

### Community 12 - "Supabase Integration"
Cohesion: 0.17
Nodes (10): @supabase/supabase-js, noopStorage, supabase, AccountOptionRow, CategoryRow, InsertTransactionParams, TransactionType, DashboardService (+2 more)

### Community 13 - "AI Components"
Cohesion: 0.21
Nodes (13): AiButton(), AiButtonProps, styles, AiCategory, AiDeleteTarget, AiPromptResult, AiShowResultTool, AiTransactionDraft (+5 more)

### Community 14 - "Speech Recognition"
Cohesion: 0.14
Nodes (8): SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionConstructor, SpeechRecognitionErrorEvent, SpeechRecognitionEvent, SpeechRecognitionResult, SpeechRecognitionResultList, Window

### Community 15 - "Input Fields"
Cohesion: 0.21
Nodes (11): GroupedInput(), GroupedInputItem, GroupedInputItemProps, GroupedInputProps, Input, InputProps, BORDER_RADIUS, CORNERS (+3 more)

### Community 16 - "Fonts & Navigation"
Cohesion: 0.20
Nodes (9): @expo-google-fonts/poppins, @react-native-async-storage/async-storage, queryClient, AuthGuard(), styles, ToastProvider(), src_global, useAuth() (+1 more)

### Community 17 - "Transaction Flow"
Cohesion: 0.29
Nodes (8): react, styles, TransactionScreen(), AccountChips(), Keypad(), useKeyboardAwareOffset(), useKeyboardHeight(), UseKeyboardHeightReturn

### Community 18 - "Native Gestures & Toasts"
Cohesion: 0.20
Nodes (10): react-native-gesture-handler, react-native-worklets, SPRING_CONFIG, ToastContext, ToastContextType, ToastData, ToastProps, ToastProviderProps (+2 more)

### Community 19 - "Settings & Analytics"
Cohesion: 0.24
Nodes (9): LanguageCode, AnalyticsData, AnalyticsSegment, AnalyticsService, CategorySummary, monthLabel(), PALETTE, startEndOfMonth() (+1 more)

### Community 20 - "Bottom Sheet Components"
Cohesion: 0.33
Nodes (6): BottomSheetForm(), BottomSheet(), BottomSheetContentProps, BottomSheetProps, useBottomSheet(), View

### Community 21 - "Expo Router"
Cohesion: 0.28
Nodes (5): expo-router, styles, AddTransactionButton(), styles, colors

### Community 22 - "TypeScript Config"
Cohesion: 0.25
Nodes (7): expo/tsconfig.base, compilerOptions, paths, strict, extends, include, @/assets/*

### Community 23 - "Date & Time Fields"
Cohesion: 0.38
Nodes (5): DateField(), Props, TimeField(), styles, TransactionDateFieldsProps

### Community 24 - "Auth Callback & Login"
Cohesion: 0.47
Nodes (4): ref_expo_auth_session_build_queryparams, AuthCallback(), LoginScreen(), createSessionFromUrl()

### Community 25 - "Theme Colors"
Cohesion: 0.33
Nodes (4): ColorKeys, Colors, darkColors, lightColors

### Community 26 - "ESLint Configuration"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

## Knowledge Gaps
- **277 isolated node(s):** `supabase`, `name`, `slug`, `version`, `orientation` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 302 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useColor()` connect `Authentication Screens` to `Expo UI Components`, `Package Configuration`, `Activity Screen`, `React Native & Query`, `UI Components (Buttons, DatePicker)`, `Expo Haptics`, `Tanstack React Query`, `Theme & Color Scheme`, `Image & Avatar`, `AI Components`, `Input Fields`, `Fonts & Navigation`, `Transaction Flow`, `Native Gestures & Toasts`, `Bottom Sheet Components`, `Expo Router`, `Date & Time Fields`, `Auth Callback & Login`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `react-native` connect `Expo UI Components` to `Authentication Screens`, `Package Configuration`, `Activity Screen`, `React Native & Query`, `UI Components (Buttons, DatePicker)`, `Expo Haptics`, `Tanstack React Query`, `Theme & Color Scheme`, `Image & Avatar`, `AI Components`, `Input Fields`, `Fonts & Navigation`, `Transaction Flow`, `Native Gestures & Toasts`, `Bottom Sheet Components`, `Expo Router`, `Date & Time Fields`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Expo Dependencies` to `Package Configuration`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `supabase`, `name`, `slug` to the rest of the system?**
  _277 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Expo UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.06557017543859649 - nodes in this community are weakly interconnected._
- **Should `Authentication Screens` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Package Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.04440333024976873 - nodes in this community are weakly interconnected._