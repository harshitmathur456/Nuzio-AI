-- ==============================================================================
-- Nuzio AI — Database Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Create the user preferences table
create table if not exists public.preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  categories text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.preferences enable row level security;

-- 3. Create RLS Policies scoped strictly to auth.uid()
drop policy if exists "Users manage their own preferences" on public.preferences;
create policy "Users manage their own preferences"
  on public.preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Automatically update 'updated_at' column on row modification
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_preferences_updated_at on public.preferences;
create trigger set_preferences_updated_at
  before update on public.preferences
  for each row
  execute function public.handle_updated_at();

-- 5. Optional: Automatically insert default preference on new user registration
create or replace function public.handle_new_user_preferences()
returns trigger as $$
begin
  insert into public.preferences (user_id, categories)
  values (new.id, array['AI & Tech'])
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_preferences();
