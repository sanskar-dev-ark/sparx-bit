-- ============================================================
-- Sparx Bit — migrate Supabase Auth user ids to Firebase Auth ids
-- Run once after switching authentication to Firebase.
-- ============================================================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

alter table if exists public.bits
  drop constraint if exists bits_user_id_fkey,
  alter column user_id type text using user_id::text;

alter table if exists public.completions
  drop constraint if exists completions_user_id_fkey,
  alter column user_id type text using user_id::text;

alter table if exists public.user_settings
  drop constraint if exists user_settings_user_id_fkey,
  alter column user_id type text using user_id::text;

alter table if exists public.promos
  drop constraint if exists promos_user_id_fkey,
  alter column user_id type text using user_id::text;

drop policy if exists "users manage own bits" on public.bits;
drop policy if exists "users manage own completions" on public.completions;
drop policy if exists "users manage own settings" on public.user_settings;
drop policy if exists "users manage own promos" on public.promos;

-- The Express backend now verifies Firebase ID tokens and uses the Supabase
-- service-role key with explicit user_id filters, so browser clients should
-- not read/write these tables directly.
alter table public.bits enable row level security;
alter table public.completions enable row level security;
alter table public.user_settings enable row level security;
alter table public.promos enable row level security;
