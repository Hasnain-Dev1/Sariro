"use client";

import { useState, useEffect } from "react";
import { onAuthChange, type SariroUser } from "@/lib/auth-client";

/**
 * Lightweight hook that returns the current user (or null).
 * Used by the navbar to change the logo link: /dashboard when logged in, / when not.
 */
export function useAuthState(): { user: SariroUser | null; loading: boolean } {
  const [user, setUser] = useState<SariroUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { user, loading };
}
