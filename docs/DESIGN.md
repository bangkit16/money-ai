---
name: Dompety Poppins
colors:
  surface: '#fbf8fb'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  surface-variant: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545e76'
  background: '#fbf8fb'
  on-background: '#1b1b1d'
  primary: '#051125'
  on-primary: '#ffffff'
  primary-container: '#1b263b'
  on-primary-container: '#828da7'
  inverse-primary: '#bbc6e2'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#bbc6e2'
  on-primary-fixed: '#101b30'
  on-primary-fixed-variant: '#3c475d'
  secondary: '#47607e'
  on-secondary: '#ffffff'
  secondary-container: '#c2dcff'
  on-secondary-container: '#48617e'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#afc9ea'
  on-secondary-fixed: '#001d36'
  on-secondary-fixed-variant: '#2f4865'
  tertiary: '#1a0f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#332306'
  on-tertiary-container: '#a28963'
  tertiary-fixed: '#fcdeb3'
  tertiary-fixed-dim: '#dfc299'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574423'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  success-green: '#10b981'
  platinum-mist: '#e0e1dd'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
icons: Material Symbols Outlined (weight 400, FILL 0; FILL 1 for the active bottom-nav icon)
rounded:
  DEFAULT: 0.25rem
  lg: 0.5rem
  xl: 0.75rem
  '2xl': 1rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
  container-max: 1200px
---

## Brand & Style

**Dompety** is a personal-finance app built around **Quiet Confidence**: a private-banking feeling delivered through everyday mobile UI. The palette leans on an almost-black navy (`#051125`) instead of pure black, paired with an airy off-white surface (`#fbf8fb`) — the effect reads as premium and calm rather than loud or "fintech neon."

The interface is content-first: large numerals, soft ambient shadows instead of borders, and generous rounded corners. Poppins (400/600/700) gives it a friendly, geometric character that keeps the "private banking" tone from feeling cold. Material Symbols Outlined icons are used everywhere for a consistent, lightweight iconographic language.

This system currently covers four core screens: **Dashboard**, **Transaction Activity (History)**, **Analytics/Reports**, and **Add Transaction** — all sharing the same header, bottom navigation, tokens, and card language.

## Colors

- **Deep Navy `#051125` (primary)**: Headers, primary buttons, active nav state, balance-card gradient, active category chips. This is the single dominant accent — used deliberately, not decoratively.
- **Slate Blue `#47607e` (secondary)** / **Secondary Container `#c2dcff`**: Supporting icon backgrounds (e.g. category icon chips) and secondary data callouts.
- **Warm Gold `#dfc299` / `#a28963` (tertiary)**: Reserved for positive/income accents (e.g. salary icon chip, "insight" highlights) — a warm counterpoint to the cool navy/blue.
- **Platinum Mist `#e0e1dd` (30–40% opacity)**: Neutral fill for inputs, dividers, and "ghost" backgrounds — never used at full opacity in UI chrome.
- **Error `#ba1a1a`**: Expense amounts and destructive/negative states.
- **Success Green `#10b981`**: Used ad hoc for strongly positive amounts (e.g. dividend deposits) alongside the tertiary gold — treat as an accent for "money in," not a full token family.
- **Surfaces**: `background`/`surface` (`#fbf8fb`) is the canvas; all cards sit on pure white (`surface-container-lowest`, `#ffffff`) so the ambient shadow reads clearly against the slightly warm off-white page.

## Typography

Poppins is the only typeface, scaled through a fixed set of named styles rather than ad-hoc sizes:

- **`display-lg` (48px/700)**: Hero numbers only — total balance, amount input on Add Transaction.
- **`headline-lg` (32px/600)** and **`headline-lg-mobile` (24px/600)**: Section titles and the "Dompety" wordmark in the header.
- **`title-md` (20px/600)**: Card titles, list-item primary text, button labels.
- **`body-lg` (16px/400)**: Default body/paragraph text and form inputs.
- **`body-sm` (14px/400)**: Secondary/meta text (timestamps, subtitles).
- **`label-caps` (12px/700, +5% tracking, uppercase)**: All-caps micro-labels — field labels, filter chips, status pills, category names.

Rule of thumb: numbers get the largest weight available in context (`display-lg` for hero figures, `title-md` for line-item amounts); everything structural/metadata uses `label-caps` uppercase.

## Layout & Spacing

- **8px rhythm**: All padding/margin is a multiple of the `unit` (8px) token.
- **Screen structure**: fixed/sticky glassmorphic header (h-16) + `max-w-container-max` (1200px) centered content + fixed bottom nav, with `pt-24`/`pb-32` on `<main>` to clear both bars.
- **Mobile-first single column**: content maxes out around `max-w-lg` on form-heavy screens (Add Transaction) and stretches to the container max on data screens (Dashboard, Analytics use `md:grid-cols-2` / `md:grid-cols-3` bento layouts at desktop widths).
- **Gutter**: 24px between cards/sections; larger multiples (e.g. `space-y-16`, `mb-10`) separate major page regions.

## Elevation & Depth

- **Level 0 — Background**: flat `background` color, no shadow.
- **Level 1 — Cards**: white surface, soft ambient shadow — `box-shadow: 0 4px 20px rgba(5,17,37,0.05)` (`premium-card`) for compact cards, `0 20px 40px rgba(5,17,37,0.08)` (`custom-shadow`) for hero/dashboard cards. No visible borders; an optional 1px `soft-border` (`rgba(224,225,221,0.3)`) can reinforce edges on light backgrounds.
- **Level 2 — Chrome (header/bottom nav)**: `backdrop-filter: blur(20px)` over `rgba(251,248,251,0.8)`, so content is visible but softened as it scrolls beneath.
- **Hero gradient card**: the balance/insight cards use a diagonal navy gradient (`linear-gradient(135deg, #051125 0%, #1b263b 100%)`) plus a large blurred white radial accent for a subtle premium sheen.

## Shapes

- **Standard controls** (chips, small buttons): `rounded-full` for pill shapes (filters, status chips, nav FAB).
- **Inputs & buttons**: `rounded-lg` (0.5rem).
- **Cards & modals**: `rounded-xl` / `rounded-2xl` (0.75rem–1rem) — the primary "container" radius across dashboard cards, transaction groups, and the category grid.
- **Avatars & icon chips**: perfect circles (`rounded-full`), typically 40–48px.

## Components

### Top App Bar
Sticky/fixed, `h-16`, glass-blurred background, centered content up to `container-max`. Left: avatar + wordmark or contextual back/close icon + screen title. Right: a single utility icon (notifications) or a balancing spacer for symmetry on modal-style screens (Add Transaction).

### Bottom Navigation
Fixed, full-width, glass-blurred, 4 icon+label tabs (Dashboard, Activity, Analytics, Settings). Inactive: `outline` color icon/label. Active: `primary` color, bold label, and filled icon variant (`FILL 1`) where used. A floating circular action button (56px, `bg-primary`) can float above the nav for a primary quick action.

### Buttons
- **Primary**: solid `primary` background, white text, `rounded-xl`, generous vertical padding (e.g. `py-5` for full-width CTAs like "Save Transaction"), `active:scale-[0.98]` micro-interaction, subtle shadow.
- **Filter/chip button**: `rounded-full`, active state = solid `primary` + white text + soft shadow; inactive = white fill with a faint `outline-variant` border.
- **Ghost/text button**: `label-caps` uppercase, `primary` or `secondary` text color, no fill (e.g. "VIEW ALL", "View All Reports").

### Cards
White (`surface-container-lowest`) background, no hard borders, `rounded-xl`/`rounded-2xl`, internal padding 24–32px (`p-6`–`p-8`). Used for: balance/hero cards (gradient variant), stat pairs, chart containers, and grouped list containers.

### Inputs
`input-soft` pattern: `rgba(224,225,221,0.3)` background fill, no border, transparent 2px bottom border that turns `primary` on focus (background opacity increases slightly too). Labels are always `label-caps` uppercase above the field, never inline placeholders alone.

### Category / Selection Grid
4-column grid of `rounded-xl` cards, each with a circular icon chip (`secondary-container/40` background, `secondary` icon) and an uppercase `label-caps` name below. Selected state inverts to solid `primary` background with white icon/text and drops the card shadow.

### Lists & Transactions
Grouped by date with a `label-caps`/`title-md` section header and a hairline divider (`outline-variant/30`) trailing it. Rows live inside a single white rounded container, separated by 1px dividers (`divide-outline-variant/10`), with hover state `surface-container-low`. Each row: circular category icon chip (tinted background matching category), title (`title-md`/`body-lg` semibold) + meta line (`body-sm`, muted), amount right-aligned (`title-md`, `error` for expenses, green/tertiary for income).

### Charts
- **Bar/trend chart**: simple flex of rounded-top divs with variable height, muted `surface-container-low` for inactive bars and `primary`/`primary-fixed-dim` for the most recent/highlighted bars.
- **Donut chart**: SVG stroke-based rings (`stroke-dasharray` per segment) using `primary`, `secondary`, `tertiary-fixed-dim`, `secondary-container` per category, animated from 0 on load, centered total label inside.
- **Progress/allocation bars**: thin (4px) rounded tracks, `platinum-mist`/`surface-container` track color, `primary`/`secondary`/category-tint fill.

### Motion
Cards fade + translate up on load (`opacity 0→1`, `translateY(20px→0)`, staggered ~0.1s per item, `cubic-bezier(0.16,1,0.3,1)`). Interactive elements use `active:scale-95`/`active:scale-90` for tactile press feedback; hover states are subtle opacity or background-tint shifts, never abrupt color swaps.
