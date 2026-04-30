# Sparx Bit

Habit tracker with React frontend + Express backend + Firebase Auth + Supabase database.

```
sparx-bit/
  frontend/   React + Vite + Tailwind
  backend/    Express API
```

---

## 1. Firebase Auth Setup

1. Firebase Console → Authentication → Sign-in method.
2. Enable **Email/Password** and **Email link (passwordless sign-in)**.
3. Enable **Google**.
4. Enable **Apple**.
5. Firebase Console → Project settings → General → Web app config.
6. Add these to `frontend/.env`:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
```

7. Firebase Console → Project settings → Service accounts → Generate new private key.
8. Add the JSON to `backend/.env` as one of:

```bash
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
# or
FIREBASE_SERVICE_ACCOUNT_BASE64=base64-encoded-service-account-json
```

Apple sign-in also requires Apple Developer Program setup for Sign in with Apple.

---

## 2. Supabase Setup

### 1.1 Create a project
1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose a name, database password, and region → **Create project**

### 1.2 Run the schema
1. In your Supabase dashboard → **SQL Editor** → **New query**
2. Paste the contents of `backend/supabase/schema.sql`
3. Click **Run**

This creates: `bits`, `completions`, `user_settings`, `promos` tables. Firebase Auth is verified by the Express backend, which uses Supabase through the service-role key with explicit `user_id` filters.

If you already ran the old Supabase Auth schema, run `backend/supabase/firebase-auth-migration.sql` once.

### 1.3 Get your API keys
Supabase Dashboard → **Project Settings** → **API**:
- `Project URL` → `SUPABASE_URL`
- `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FIREBASE_SERVICE_ACCOUNT
npm install
npm run dev
# Running on http://localhost:3001
```

---

## 4. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Fill in VITE_API_URL and VITE_FIREBASE_* values
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 5. Auth Flow

### Magic Link
1. User enters email on Login screen
2. Frontend calls Firebase `sendSignInLinkToEmail`
3. Firebase sends email with link → `http://localhost:5173/auth/callback`
4. Frontend's `/auth/callback` route calls Firebase `signInWithEmailLink`
5. API calls send the Firebase ID token to Express

### Google OAuth
1. User clicks "Continue with Google".
2. Frontend calls Firebase `signInWithPopup` with `GoogleAuthProvider`.
3. API calls send the Firebase ID token to Express.

### Apple OAuth
1. User clicks "Continue with Apple".
2. Frontend calls Firebase `signInWithPopup` with `OAuthProvider('apple.com')`.
3. API calls send the Firebase ID token to Express.

---

## 6. API Reference

All app data routes require `Authorization: Bearer <firebase_id_token>` header.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/magic-link` | Send magic link to email |
| POST | `/auth/refresh` | Refresh session token |
| GET | `/bits` | Get all user's bits |
| POST | `/bits` | Create a bit |
| PUT | `/bits/:id` | Update a bit |
| DELETE | `/bits/:id` | Delete a bit |
| GET | `/completions?from=&to=` | Get completions in date range |
| POST | `/completions/toggle` | Toggle a completion on/off |
| GET | `/settings` | Get user settings |
| PUT | `/settings` | Update user settings |
| GET | `/promos` | Get user's promotions |
| POST | `/promos` | Create a promotion |

---

## 7. Environment Variables

### backend/.env
| Variable | Where to get it |
|----------|----------------|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase → Project Settings → Service accounts |
| `PORT` | Default: 3001 |
| `FRONTEND_URL` | Default: http://localhost:5173 |

### frontend/.env
| Variable | Where to get it |
|----------|----------------|
| `VITE_API_URL` | http://localhost:3001 (or your deployed backend URL) |
| `VITE_FIREBASE_API_KEY` | Firebase web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web app config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase web app config |
| `VITE_FIREBASE_APP_ID` | Firebase web app config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app config |

---

## 7. Deployment

### Backend (Railway / Render / Fly.io — all free tier)
```bash
# Railway
npm install -g @railway/cli
railway login
railway init
railway up
# Set env vars in Railway dashboard
```

### Frontend (Vercel — free)
```bash
npm install -g vercel
cd frontend
vercel
# Set VITE_* env vars in Vercel dashboard
# Set VITE_API_URL to your deployed backend URL
```

### Supabase
Already hosted — nothing to deploy.
