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
