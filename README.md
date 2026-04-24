# PostCraft Pro

AI-powered LinkedIn post generator built with Next.js, Supabase Auth/Postgres, and server-side Sarvam API routes.

## Tech Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth + Postgres (RLS)
- Sarvam API (server routes only)

## Setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Configure `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SARVAM_API_KEY=...
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Deploy to Vercel
1. Import repository into Vercel.
2. Add environment variables from `.env.local` in Vercel project settings.
3. Deploy.

## Notes
- Protected routes: `/dashboard`, `/generator`, `/history`, `/analyzer`, `/settings`
- No billing/pricing implementation.
- All AI calls are proxied through server-side API routes in `src/app/api/*`.


## Applying the fixed Supabase schema (important)
If signup currently fails with `relation "profiles" does not exist`, your project likely still has an old `auth.users` trigger that inserts into `public.profiles`.

1. Open **Supabase → SQL Editor**.
2. Run a one-time transaction reset if you previously saw `current transaction is aborted`:
   ```sql
   rollback;
   ```
3. Copy and run the full latest `supabase/schema.sql` from this repo.
   - The script now safely removes legacy objects with:
     - `drop trigger if exists on_auth_user_created on auth.users;`
     - `drop function if exists public.handle_new_user();`
     - `drop table if exists public.profiles;`
   - It then recreates MVP tables and RLS policies for `posts`, `competitor_analyses`, and `ai_generations`.
4. Retry email/password signup in the app.

This app does not require a `profiles` table for MVP. User identity is read directly from `auth.users`, and all user-owned app data stays in RLS-protected tables.
