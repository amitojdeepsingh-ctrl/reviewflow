"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export function OnboardingCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;
    if (pathname === "/onboarding") return;

    supabase
      .from("profiles")
      .select("company_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!data?.company_name) {
          router.push("/onboarding");
        }
      });
  }, [user, loading, pathname, router]);

  return <>{children}</>;
}