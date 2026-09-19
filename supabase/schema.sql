-- ==============================================================================
-- Nuzio AI — Database Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Base preferences table (User already ran this query)
create table if not exists public.preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  categories text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.preferences enable row level security;

-- 3. Policy: Users manage their own preferences
drop policy if exists "Users manage their own preferences" on public.preferences;
create policy "Users manage their own preferences"
  on public.preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Extended columns for full onboarding preferences
-- (RUN THIS QUERY IN SUPABASE SQL EDITOR TO STORE EXTENDED PREFERENCES)
alter table public.preferences
  add column if not exists full_name text,
  add column if not exists profession text default 'Founder / Builder',
  add column if not exists voice text default 'Aria',
  add column if not exists brief_length text default '10 min',
  add column if not exists delivery_time text default '07:00 AM',
  add column if not exists language text default 'English',
  add column if not exists notifications_enabled boolean default true;
