import { useColorScheme as useRNColorScheme } from 'react-native';

import { useModeContext } from '@/providers/mode-provider';

/**
 * Web mirror of the native hook. Provider wins over the OS scheme so the
 * in-app light/dark toggle works on every platform — react-native-web's
 * `Appearance` is read-only.
 *
 * No `hasHydrated` two-pass: returning `'light'` first then the real scheme
 * forces every `useColor` consumer to re-render. On the first paint the
 * provider has not been read yet, so we just use the system scheme and let
 * the next render (triggered by the provider's own state being available)
 * flip to the user-chosen one. The trade is one wrong-tinted frame on
 * the very first navigation, not an extra render every mount.
 */
export function useColorScheme(): 'light' | 'dark' {
  const system = useRNColorScheme() === 'dark' ? 'dark' : 'light';
  return useModeContext()?.scheme ?? system;
}
