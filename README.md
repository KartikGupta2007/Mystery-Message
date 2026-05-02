# True Feedback (learn-nextjs)

An anonymous messaging / feedback web application built with Next.js (App Router), NextAuth, and MongoDB. Users can register, verify their email, and receive anonymous messages via a public profile link. The project includes server endpoints for signing up, verification, sending messages, and a small AI-powered message-suggestion stream.

## Features

- Email-based sign-up with verification (nodemailer + Gmail app password)
- Authentication using `next-auth` (credentials provider)
- Store users and messages in MongoDB via Mongoose
- Users can toggle whether they accept anonymous messages
- Send and fetch messages via REST routes under `app/api`
- Streaming AI-generated suggested questions using OpenAI (edge runtime)

## Tech stack

- Framework: Next.js (App Router)
- Auth: NextAuth
- Database: MongoDB + Mongoose
- Email: nodemailer + `@react-email` templates
- AI: OpenAI (server-side streaming)
- Validation: Zod, react-hook-form
- UI: Tailwind CSS and Radix-based UI components

---

## Quick start

Prerequisites

- Node.js 18+ or supported by Next.js 16
- MongoDB (Atlas or self-hosted)
- A Gmail account with an "app password" (or any SMTP credentials)
- OpenAI API key (if using the suggestion feature)

1. Install dependencies

```bash
npm install
# or
pnpm install
```

2. Create a `.env.local` file (see example below)

3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Environment variables

Create a `.env.local` at the project root and provide the values below. These keys are referenced in the codebase (see linked files):

```env
# MongoDB connection
MONGODB_URI=your_mongodb_connection_string_without_dbname
MONGODB_DB_NAME=your_database_name

# NextAuth
NEXTAUTH_SECRET=some_long_random_string
NEXTAUTH_URL=http://localhost:3000

# Email (Gmail example with App Password)
EMAIL_USER=youremail@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# OpenAI (used by the suggest-messages route)
OPENAI_API_KEY=sk-...
```

Notes:
- `src/lib/dbConnect.ts` expects `MONGODB_URI` and `MONGODB_DB_NAME`. See [src/lib/dbConnect.ts](src/lib/dbConnect.ts).
- `src/lib/Resend.ts` uses `EMAIL_USER` and `EMAIL_APP_PASSWORD` for SMTP via Gmail. See [src/lib/Resend.ts](src/lib/Resend.ts).
- The AI suggestion endpoint uses `OPENAI_API_KEY` (see [src/app/api/suggest-messages/route.ts](src/app/api/suggest-messages/route.ts)).

---

## Available scripts

- `npm run dev` — Runs Next.js in development mode
- `npm run build` — Builds the production app
- `npm run start` — Starts the production server after build
- `npm run lint` — Runs ESLint

These are defined in `package.json`.

---

## Project structure (high level)

- [app/](src/app) — Next.js App Router pages and API routes
	- [app/page.tsx](src/app/page.tsx) — Home / placeholder
	- [app/(auth)/sign-in/page.tsx](src/app/(auth)/sign-in/page.tsx) — Sign in UI
	- [app/(auth)/sign-up/page.tsx](src/app/(auth)/sign-up/page.tsx) — Sign up UI
	- [app/(auth)/verify/[username]/page.tsx](src/app/(auth)/verify/[username]/page.tsx) — Verification UI
	- [app/u/[username]/page.tsx](src/app/u/[username]/page.tsx) — Public profile / send message UI
	- [app/(app)/dashboard/page.tsx](src/app/(app)/dashboard/page.tsx) — User dashboard

- [app/api/](src/app/api) — Server routes (sign-up, verify-code, send-message, get-messages, suggest-messages, etc.)
	- [app/api/sign-up/route.ts](src/app/api/sign-up/route.ts)
	- [app/api/verify-code/route.ts](src/app/api/verify-code/route.ts)
	- [app/api/send-message/route.ts](src/app/api/send-message/route.ts)
	- [app/api/suggest-messages/route.ts](src/app/api/suggest-messages/route.ts)

- [lib/](src/lib) — Helpers and integrations
	- [lib/dbConnect.ts](src/lib/dbConnect.ts) — MongoDB connection helper
	- [lib/Resend.ts](src/lib/Resend.ts) — Email sending (nodemailer + react-email)

- [model/](src/model) — Mongoose models
	- [model/user.model.ts](src/model/user.model.ts)

- [components/](src/components) — React components and UI primitives

- [schemas/](src/schemas) — Zod schemas used for validation


---

## Key implementation notes

- Email verification: When a new user signs up, the server saves a verification code and sends an email using `sendVerificationEmail` in [src/lib/Resend.ts](src/lib/Resend.ts).
- Authentication: `next-auth` with a credentials provider is implemented in [src/app/api/auth/[...nextauth]/options.ts](src/app/api/auth/[...nextauth]/options.ts). The provider enforces email verification before allowing sign-in.
- Messaging: anonymous messages are saved inside the `messages` array on the `User` document (`src/model/user.model.ts`). API endpoints add, fetch, and delete messages.
- Streaming AI suggestions: `suggest-messages` streams text from OpenAI. This runs on the Edge runtime and requires a valid `OPENAI_API_KEY`.

---

## Deployment

- Vercel: Recommended for Next.js apps. Add the environment variables from the "Environment variables" section to your Vercel project settings.
- MongoDB: Use Atlas for production. Make sure `MONGODB_URI` allows connections from Vercel's IP ranges (or use SRV/driver options).
- Email: For production, verify and use a domain-based SMTP (or use a transactional email provider). Gmail with app passwords can be used for quick testing but is not ideal for production.

---

## Contribution

- Open an issue or a pull request. Small, focused PRs are preferred. Add tests/validation when changing API behavior.
- Follow the existing code style and patterns. The codebase uses TypeScript, React, and Next.js conventions.

Files referenced above (examples): [src/lib/dbConnect.ts](src/lib/dbConnect.ts), [src/lib/Resend.ts](src/lib/Resend.ts), [src/app/api/suggest-messages/route.ts](src/app/api/suggest-messages/route.ts), [src/model/user.model.ts](src/model/user.model.ts)
