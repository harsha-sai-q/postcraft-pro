import { Card, SectionHeading } from "@/components/ui-kit";
import { ProtectedPage } from "@/components/protected-page";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function SettingsPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <ProtectedPage>
      <main>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Manage account and workspace preferences.</p>

        <Card className="mt-4 space-y-2">
          <SectionHeading title="Account" />
          <p className="text-sm text-slate-500">Email</p>
          <p className="font-medium text-slate-900">{user?.email}</p>
        </Card>

        <Card className="mt-4">
          <SectionHeading title="Brand voice settings" subtitle="Coming soon." />
        </Card>

        <Card className="mt-4">
          <SectionHeading title="Session" subtitle="Sign out from this device." />
          <form action="/api/logout" method="post">
            <button className="btn-secondary" type="submit">
              Logout
            </button>
          </form>
        </Card>
      </main>
    </ProtectedPage>
  );
}
