import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from "./supabase";

/**
 * Ambil access_token & refresh_token dari URL callback OAuth (hasil redirect
 * dari Google -> Supabase -> deep link app kita), lalu set jadi session aktif.
 */
export async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(errorCode);
  }

  const { access_token, refresh_token } = params;

  if (!access_token) {
    // URL tidak mengandung token (mis. user membatalkan login)
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
}
