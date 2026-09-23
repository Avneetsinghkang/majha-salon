"use client";

import { createBrowserClient } from "@supabase/ssr";

export function BookNowButton({
  label = "BOOK NOW",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  async function startBooking() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.signOut();
    window.location.href = "/book";
  }

  return (
    <button type="button" onClick={startBooking} className={className}>
      {label}
    </button>
  );
}