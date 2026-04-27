# PostCraft Pro

PostCraft Pro is an AI-assisted LinkedIn writing workspace built with Next.js, Supabase, and Sarvam. It helps users generate, refine, and analyze post drafts while keeping AI integrations on server-side routes.

> **Disclaimer:** AI engagement scores are estimates and do not guarantee real LinkedIn performance.

## Features
- AI-assisted LinkedIn post generation
- Post formatting and highlighting workflows
- Competitor analysis and history tracking
- Saved post history with protected user data
- Supabase authentication with Google OAuth support
- Server-side AI routes for generation, scoring, and analysis

## Tech stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Auth + DB:** Supabase Auth + Postgres with RLS
- **AI provider:** Sarvam API via server-side API routes
- **Deployment:** Vercel

## Screenshots
- _Add product screenshots or walkthrough GIFs here._

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in required values in `.env.local`.
5. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase setup
1. Create a Supabase project.
2. Open **Supabase Dashboard → SQL Editor**.
3. Run the SQL in `supabase/schema.sql`.
4. In **Project Settings → API**, copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - anon public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Google OAuth setup
1. In **Supabase Dashboard → Authentication → Providers**, enable **Google**.
2. In Google Cloud, create OAuth credentials and add Supabase callback URL:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. In **Supabase Dashboard → Authentication → URL Configuration**:
   - Set **Site URL** (`http://localhost:3000` for local dev)
   - Add redirects, including:
     - `http://localhost:3000/auth/callback`
     - `https://<your-domain>/auth/callback`

## Sarvam API setup
1. Create a Sarvam API key from your Sarvam account.
2. Add the key to `SARVAM_API_KEY` in your environment.
3. Keep `SARVAM_MODEL=sarvam-30b` unless intentionally changed.
4. Do not expose Sarvam keys in client-side code.

## Vercel deployment
1. Push your fork/branch to GitHub.
2. Import the repo in Vercel.
3. Configure environment variables (same values as `.env.local`).
4. Deploy.
5. Add production callback URL to Supabase Auth redirect settings.

## Environment variables
Create `.env.local` from `.env.example` and provide:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SARVAM_API_KEY=
SARVAM_MODEL=sarvam-30b
```

## Common troubleshooting

### `relation "profiles" does not exist`
Run the latest `supabase/schema.sql` again in Supabase SQL Editor to ensure legacy objects are removed and current tables/policies are created.

### OAuth sign-in redirects incorrectly
Confirm Supabase Site URL + redirect URLs exactly match your local or deployed app URL.

### AI endpoints fail at runtime
Check that `SARVAM_API_KEY` is set in the running environment (local or Vercel), and redeploy after updates.

### Build failures on CI/deploy
Run:
```bash
npm run build
```
Fix any type or environment variable issues reported in output.
