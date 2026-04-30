# Sparx Bit Deployment

Recommended free setup:

- Backend API: Render Free Web Service
- Frontend: Vercel Hobby
- Database: existing Supabase project
- Auth: existing Firebase project
- Branded auth email: Resend free tier, or dev-link logging without email delivery

## 1. Backend on Render

Create a new Render Blueprint from this repository, or create a Web Service manually:

- Root Directory: `backend`
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/health`
- Instance Type: Free

Set these environment variables in Render:

```bash
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
FIREBASE_PROJECT_ID=sparx-bit-837d4
FIREBASE_SERVICE_ACCOUNT_BASE64=...
RESEND_API_KEY=...
AUTH_EMAIL_FROM=Sparx Bit <auth@your-domain.com>
```

`RESEND_API_KEY` and `AUTH_EMAIL_FROM` are optional for first deploy. Without them, the backend logs the generated magic link instead of sending email.

Generate `FIREBASE_SERVICE_ACCOUNT_BASE64` from the Firebase service-account JSON:

```bash
base64 -i path/to/firebase-service-account.json
```

## 2. Frontend on Vercel

Import the repository into Vercel and configure:

- Framework Preset: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Set these environment variables in Vercel:

```bash
VITE_API_URL=https://your-render-service.onrender.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=sparx-bit-837d4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sparx-bit-837d4
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
```

Redeploy after adding environment variables.

## 3. Firebase Console Updates

Firebase Authentication must allow your deployed frontend domain:

- Authentication → Settings → Authorized domains
- Add `your-vercel-app.vercel.app`

For email-link auth, the callback URL is:

```text
https://your-vercel-app.vercel.app/auth/callback
```

For Apple auth, also add/configure the Firebase handler domain required by Apple:

```text
https://sparx-bit-837d4.firebaseapp.com/__/auth/handler
```

## 4. Supabase Schema

Confirm Firebase UID compatibility:

```sql
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and column_name = 'user_id'
  and table_name in ('bits', 'completions', 'user_settings', 'promos')
order by table_name;
```

All four rows should show `text`.

## 5. Smoke Test

After both deployments are live:

1. Open the Vercel URL.
2. Sign in with Google or magic link.
3. Create a bit.
4. Toggle completion.
5. Refresh the page.
6. Confirm the bit and completion remain.

Render Free web services spin down after inactivity, so the first API request after idle can be slow.
