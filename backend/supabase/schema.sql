-- ============================================================
-- Sparx Bit — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── bits ──────────────────────────────────────────────────────
create table if not exists bits (
  id          bigint generated always as identity primary key,
  user_id     text not null,
  title       text not null,
  why         text,
  description text,
  goal        int not null default 5,  -- days per week (1-7)
  category    text default 'none',
  created_at  timestamptz default now()
);

alter table bits enable row level security;
drop policy if exists "users manage own bits" on bits;

-- ── completions ───────────────────────────────────────────────
create table if not exists completions (
  id         bigint generated always as identity primary key,
  bit_id     bigint references bits(id) on delete cascade not null,
  user_id    text not null,
  date       date not null,
  unique (bit_id, date)
);

alter table completions enable row level security;
drop policy if exists "users manage own completions" on completions;

create index if not exists completions_user_date on completions(user_id, date desc);

-- ── user_settings ─────────────────────────────────────────────
create table if not exists user_settings (
  user_id          text primary key,
  reminder_time    text default '08:00',
  reminder_period  text default 'Morning',
  dark_mode        boolean default false,
  theme            text default 'Default',
  language         text default 'English',
  selected_plan    text default 'yearly',
  notif_settings   jsonb default '{"enabled":true,"daily":true,"weekly":true,"achievements":true,"quietStart":"22:00","quietEnd":"07:00"}'::jsonb,
  goals            text[] default '{}',
  preferences      text[] default '{}'
);

alter table user_settings enable row level security;
drop policy if exists "users manage own settings" on user_settings;

-- ── promos ────────────────────────────────────────────────────
create table if not exists promos (
  id          bigint generated always as identity primary key,
  user_id     text not null,
  title       text not null,
  description text,
  code        text,
  discount    int,
  start_date  date,
  end_date    date,
  created_at  timestamptz default now()
);

alter table promos enable row level security;
drop policy if exists "users manage own promos" on promos;

-- Firebase Auth is verified by the Express backend. Browser clients should not
-- access these tables directly; the backend uses the Supabase service-role key
-- and explicit user_id filters.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
