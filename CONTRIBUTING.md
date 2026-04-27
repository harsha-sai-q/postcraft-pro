# Contributing to PostCraft Pro

Thanks for your interest in contributing to PostCraft Pro.

## Ground rules
- Keep changes focused and reviewable.
- Do not commit real API keys or secrets.
- Do not introduce pricing or payment logic.
- Do not change core Supabase or Sarvam behavior unless explicitly discussed.

## Development setup
1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in `.env.local`.
5. Start development server:
   ```bash
   npm run dev
   ```

## Pull request process
1. Create a branch from `main`.
2. Keep commits descriptive.
3. Run checks before opening a PR:
   ```bash
   npm run build
   ```
4. Explain what changed and why.
5. Include screenshots for UI changes when relevant.

## Code style
- Follow existing TypeScript and Next.js patterns.
- Keep API logic server-side.
- Prefer small, composable components.

## Reporting bugs and proposing features
- Open an issue with reproduction steps.
- For security concerns, follow `SECURITY.md`.
