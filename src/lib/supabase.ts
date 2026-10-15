import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const isServer = typeof window === 'undefined'
const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: isServer ? noopStorage : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })

// Bind channel.unsubscribe so detached callbacks from @legendapp/state don't throw on undefined `this.timeout`
const origChannel = supabase.channel.bind(supabase)
supabase.channel = ((name: string, opts?: any) => {
  const chan = origChannel(name, opts)
  if (chan && typeof chan.unsubscribe === 'function') {
    chan.unsubscribe = chan.unsubscribe.bind(chan)
  }
  return chan
}) as typeof supabase.channel
