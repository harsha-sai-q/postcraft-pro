import { ProtectedPage } from "@/components/protected-page";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <ProtectedPage>
      <main>
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="card mt-4 space-y-2">
          <p className="text-sm text-slate-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div className="card mt-4">
          <h2 className="font-semibold">Brand voice settings</h2>
          <p className="mt-1 text-sm text-slate-600">Coming soon.</p>
        </div>
        <form action="/api/logout" method="post" className="mt-4">
          <button className="btn-secondary" type="submit">Logout</button>
        </form>
      </main>
    </ProtectedPage>
  );
}
