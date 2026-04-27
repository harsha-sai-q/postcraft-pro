# Security Policy

## Reporting a vulnerability

If you discover a security issue, **do not report secrets or vulnerabilities publicly** in GitHub issues, discussions, or pull requests.

Instead, report privately to the maintainers through your designated private channel (for example: internal security inbox or direct maintainer contact).

When reporting, include:
- A clear description of the issue
- Impact and affected areas
- Steps to reproduce
- Suggested remediation (if known)

## Sensitive data handling
- Never commit API keys, access tokens, or credentials.
- Rotate any exposed secrets immediately.
- Use `.env.local` for local secrets and `.env.example` for placeholders only.
