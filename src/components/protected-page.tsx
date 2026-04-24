import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { AppShell } from "./app-shell";

export async function ProtectedPage({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  return <AppShell email={user.email}>{children}</AppShell>;
}
