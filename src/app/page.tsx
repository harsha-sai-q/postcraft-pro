import { redirect } from "next/navigation";
import LandingPage from "@/components/landing-page";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
