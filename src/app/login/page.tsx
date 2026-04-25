import { redirect } from "next/navigation";
import LoginForm from "@/components/login-form";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function LoginPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
