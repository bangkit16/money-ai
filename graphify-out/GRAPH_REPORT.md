# Graph Report - money-ai  (2026-09-17)

## Corpus Check
- 196 files · ~192,584 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 826 nodes · 2020 edges · 76 communities (39 shown, 37 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dec7a93c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react-native
- useColor
- package.json
- dependencies
- useSettings
- expo
- Dompety — Page Build Spec
- spinner.tsx
- date-picker.tsx
- edit-transaction-bottom-sheet.tsx
- settings.tsx
- avatar.tsx
- Supabase
- Changelog
- speech.d.ts
- input.tsx
- Components
- Changelog
- toast.tsx
- index.ts
- bottom-sheet.tsx
- (tabs)/_layout.tsx
- tsconfig.json
- Writing Guidelines for Postgres References
- login.tsx
- colors.ts
- eslint.config.js
- assets.d.ts
- .mcp.json
- useT
- Section Definitions
- button.tsx
- useSpeechRecognition.ts
- useHaptics.ts
- scripts
- Welcome to your Expo app 👋
- AccountService
- Supabase Postgres Best Practices
- filter-chips.tsx
- graphify.js
- devDependencies
- search-bar.tsx
- AGENTS.md
- CLAUDE.md
- advanced-full-text-search.md
- advanced-jsonb-indexing.md
- conn-idle-timeout.md
- conn-limits.md
- conn-pooling.md
- conn-prepared-statements.md
- data-batch-inserts.md
- data-n-plus-one.md
- data-pagination.md
- data-upsert.md
- lock-advisory.md
- lock-deadlock-prevention.md
- lock-short-transactions.md
- lock-skip-locked.md
- monitor-explain-analyze.md
- monitor-pg-stat-statements.md
- monitor-vacuum-analyze.md
- query-composite-indexes.md
- query-covering-indexes.md
- query-index-types.md
- query-missing-indexes.md
- query-partial-indexes.md
- schema-constraints.md
- schema-data-types.md
- schema-foreign-key-indexes.md
- schema-lowercase-identifiers.md
- schema-partitioning.md
- schema-primary-keys.md
- security-privileges.md
- security-rls-basics.md
- security-rls-performance.md
- _template.md

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
- `Toast()` --calls--> `useColor()`  [EXTRACTED]
  src/components/ui/toast.tsx → src/hooks/useColor.ts
- `TabsLayout()` --calls--> `useColor()`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/hooks/useColor.ts

## Import Cycles
- None detected.

## Communities (76 total, 37 thin omitted)

### Community 0 - "react-native"
Cohesion: 0.06
Nodes (79): assets_images_adaptive_icon, expo-linear-gradient, @expo/vector-icons, react-native, react-native-safe-area-context, styles, AiDeleteConfirmModal(), Props (+71 more)

### Community 1 - "useColor"
Cohesion: 0.20
Nodes (14): RegisterScreen(), DashboardScreen(), styles, AuthGuard(), styles, HeroBalanceCard(), MonthlySummaryCard(), RecentTransactions() (+6 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (24): main, name, private, version, eslint, eslint-config-expo, expo-constants, expo-crypto (+16 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (38): dependencies, expo, expo-auth-session, expo-constants, expo-crypto, expo-device, expo-font, expo-glass-effect (+30 more)

### Community 4 - "useSettings"
Cohesion: 0.07
Nodes (50): @expo-google-fonts/poppins, @react-native-async-storage/async-storage, queryClient, ActivityScreen(), styles, TxType, DateSectionHeader(), styles (+42 more)

### Community 5 - "expo"
Cohesion: 0.06
Nodes (31): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, softwareKeyboardLayoutMode (+23 more)

### Community 6 - "Dompety — Page Build Spec"
Cohesion: 0.09
Nodes (22): 1. Dashboard (`/` atau `/dashboard`), 2. Transaction Activity / Riwayat (`/activity`), 3. Analytics / Laporan (`/analytics`), 4. Add Transaction (`/add-transaction`, tampil sebagai modal/full-screen overlay), Bottom Navigation, Catatan untuk Agent Implementasi, Data yang di-submit, Data yang dibutuhkan (+14 more)

### Community 7 - "spinner.tsx"
Cohesion: 0.17
Nodes (11): AnimatedBar, AnimatedDot, AnimatedShapeProps, LoadingOverlay(), LoadingOverlayProps, sizeConfig, speedConfig, SpinnerConfig (+3 more)

### Community 8 - "date-picker.tsx"
Cohesion: 0.19
Nodes (12): BaseDatePickerProps, currentYear, DatePicker(), DatePickerProps, DatePickerPropsDate, DatePickerPropsRange, DateRange, DAYS (+4 more)

### Community 9 - "edit-transaction-bottom-sheet.tsx"
Cohesion: 0.06
Nodes (43): react, @supabase/supabase-js, @tanstack/react-query, styles, TransactionScreen(), DateField(), Props, TimeField() (+35 more)

### Community 10 - "settings.tsx"
Cohesion: 0.11
Nodes (20): MODE_LABEL, SettingsScreen(), styles, CurrencyPickerSheet(), LanguagePickerSheet(), LogoutButton(), SettingRow(), SettingToggle() (+12 more)

### Community 11 - "avatar.tsx"
Cohesion: 0.22
Nodes (11): styles, Avatar, AvatarContext, AvatarContextValue, AvatarFallback, AvatarFallbackProps, AvatarImage, AvatarImageProps (+3 more)

### Community 12 - "Supabase"
Cohesion: 0.11
Nodes (15): Fix suggestion, Source, What happened, Skill Feedback, Steps, Core Principles, Debugging, Making and Committing Schema Changes (+7 more)

### Community 13 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 14 - "speech.d.ts"
Cohesion: 0.14
Nodes (8): SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionConstructor, SpeechRecognitionErrorEvent, SpeechRecognitionEvent, SpeechRecognitionResult, SpeechRecognitionResultList, Window

### Community 15 - "input.tsx"
Cohesion: 0.16
Nodes (14): expo-image, Image, ImageProps, styles, GroupedInput(), GroupedInputItem, GroupedInputItemProps, GroupedInputProps (+6 more)

### Community 16 - "Components"
Cohesion: 0.12
Nodes (16): Bottom Navigation, Brand & Style, Buttons, Cards, Category / Selection Grid, Charts, Colors, Components (+8 more)

### Community 17 - "Changelog"
Cohesion: 0.12
Nodes (15): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), [0.1.5](https://github.com/supabase/agent-skills/compare/v0.1.4...v0.1.5) (2026-07-10), [0.1.6](https://github.com/supabase/agent-skills/compare/v0.1.5...supabase-v0.1.6) (2026-07-30), [0.1.7](https://github.com/supabase/agent-skills/compare/v0.1.6...supabase-v0.1.7) (2026-08-12), Bug Fixes, Bug Fixes, Bug Fixes (+7 more)

### Community 18 - "toast.tsx"
Cohesion: 0.18
Nodes (11): react-native-worklets, SPRING_CONFIG, Toast(), ToastContext, ToastContextType, ToastData, ToastProps, ToastProvider() (+3 more)

### Community 19 - "index.ts"
Cohesion: 0.09
Nodes (26): react-native-svg, AnalyticsScreen(), styles, DonutChart(), DonutChartProps, DonutSegment, Props, SpendingStructureCard() (+18 more)

### Community 20 - "bottom-sheet.tsx"
Cohesion: 0.23
Nodes (9): react-native-gesture-handler, react-native-reanimated, BottomSheetForm(), BottomSheet(), BottomSheetContentProps, BottomSheetProps, useBottomSheet(), Input (+1 more)

### Community 21 - "(tabs)/_layout.tsx"
Cohesion: 0.22
Nodes (7): expo-router, styles, TabsLayout(), AddTransactionButton(), styles, AiButton(), colors

### Community 22 - "tsconfig.json"
Cohesion: 0.25
Nodes (7): expo/tsconfig.base, compilerOptions, paths, strict, extends, include, @/assets/*

### Community 23 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 24 - "login.tsx"
Cohesion: 0.19
Nodes (11): expo-auth-session, ref_expo_auth_session_build_queryparams, expo-status-bar, expo-web-browser, AuthCallback(), LoginScreen(), redirectTo, styles (+3 more)

### Community 25 - "colors.ts"
Cohesion: 0.33
Nodes (4): ColorKeys, Colors, darkColors, lightColors

### Community 26 - "eslint.config.js"
Cohesion: 0.40
Nodes (4): { defineConfig }, expoConfig, ref_eslint_config, ref_eslint_config_expo_flat

### Community 29 - "useT"
Cohesion: 0.24
Nodes (12): styles, AccountFormModal(), AccountList(), AccountListProps, styles, AccountOptionsSheet(), AddAccountButton(), TransferCard() (+4 more)

### Community 30 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 31 - "button.tsx"
Cohesion: 0.27
Nodes (8): lucide-react-native, ButtonProps, ButtonSize, ButtonVariant, Icon(), Props, ButtonSpinner(), SpinnerVariant

### Community 32 - "useSpeechRecognition.ts"
Cohesion: 0.32
Nodes (7): expo, AiPromptBottomSheet(), SpeechRecognitionHook, useNativeSpeech(), useSpeechRecognition(), UseSpeechRecognitionOptions, useWebSpeech()

### Community 33 - "useHaptics.ts"
Cohesion: 0.32
Nodes (7): expo-haptics, Button, ANDROID_HAPTICS, HapticIntent, perform(), triggerHaptic(), useHaptics()

### Community 34 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 35 - "Welcome to your Expo app 👋"
Cohesion: 0.29
Nodes (6): Get a fresh project, Get started, Join the community, Learn more, Other setup steps, Welcome to your Expo app 👋

### Community 37 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 38 - "filter-chips.tsx"
Cohesion: 0.33
Nodes (5): FilterChips(), FilterChipsProps, FILTERS, styles, TxType

### Community 39 - "graphify.js"
Cohesion: 0.40
Nodes (3): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path

### Community 40 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint, eslint-config-expo, @types/react, typescript

### Community 41 - "search-bar.tsx"
Cohesion: 0.50
Nodes (3): SearchBar(), SearchBarProps, styles

## Knowledge Gaps
- **402 isolated node(s):** `supabase`, `name`, `slug`, `version`, `orientation` (+397 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 472 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useColor()` connect `useColor` to `react-native`, `useSettings`, `spinner.tsx`, `date-picker.tsx`, `edit-transaction-bottom-sheet.tsx`, `settings.tsx`, `avatar.tsx`, `input.tsx`, `toast.tsx`, `index.ts`, `bottom-sheet.tsx`, `(tabs)/_layout.tsx`, `login.tsx`, `useT`, `button.tsx`, `useSpeechRecognition.ts`, `useHaptics.ts`, `AccountService`, `filter-chips.tsx`, `search-bar.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `react-native` connect `react-native` to `useColor`, `package.json`, `useSettings`, `spinner.tsx`, `date-picker.tsx`, `edit-transaction-bottom-sheet.tsx`, `settings.tsx`, `avatar.tsx`, `input.tsx`, `toast.tsx`, `index.ts`, `bottom-sheet.tsx`, `(tabs)/_layout.tsx`, `login.tsx`, `useT`, `button.tsx`, `useSpeechRecognition.ts`, `useHaptics.ts`, `filter-chips.tsx`, `search-bar.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `supabase`, `name`, `slug` to the rest of the system?**
  _402 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react-native` be split into smaller, more focused modules?**
  _Cohesion score 0.059549624687239365 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._