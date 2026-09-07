import { useEffect } from "react";
import { router } from "expo-router";
import { createSessionFromUrl } from "@/lib/auth";

export default function AuthCallback() {
  useEffect(() => {
    // Grab the full URL that was redirected to this deep link
    const url = window.location.href;
    createSessionFromUrl(url)
      .then((session) => {
        if (session) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  }, []);

  return null;
}
