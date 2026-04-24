create extension if not exists "pgcrypto";

-- MVP does not need a profiles table or auth.users trigger.
-- Clean up any legacy trigger/function that may still exist in existing projects.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Optional cleanup for old MVP iterations where profiles was created.
-- Safe to keep data tables focused on user-owned app content only.
drop table if exists public.profiles;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  tone text not null,
  format text not null,
  length text not null,
  content text not null,
  highlighted_content text,
  formatted_content text,
  hashtags text[] default '{}',
  engagement_score integer,
  score_breakdown jsonb,
  image_prompt text,
  is_favorite boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.competitor_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_post text not null,
  analysis jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null,
  input jsonb not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.handle_updated_at();

alter table public.posts enable row level security;
alter table public.competitor_analyses enable row level security;
alter table public.ai_generations enable row level security;

drop policy if exists "posts_select_own" on public.posts;
drop policy if exists "posts_insert_own" on public.posts;
drop policy if exists "posts_update_own" on public.posts;
drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_select_own" on public.posts for select using (auth.uid() = user_id);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = user_id);

drop policy if exists "analyses_select_own" on public.competitor_analyses;
drop policy if exists "analyses_insert_own" on public.competitor_analyses;
drop policy if exists "analyses_update_own" on public.competitor_analyses;
drop policy if exists "analyses_delete_own" on public.competitor_analyses;
create policy "analyses_select_own" on public.competitor_analyses for select using (auth.uid() = user_id);
create policy "analyses_insert_own" on public.competitor_analyses for insert with check (auth.uid() = user_id);
create policy "analyses_update_own" on public.competitor_analyses for update using (auth.uid() = user_id);
create policy "analyses_delete_own" on public.competitor_analyses for delete using (auth.uid() = user_id);

drop policy if exists "generations_select_own" on public.ai_generations;
drop policy if exists "generations_insert_own" on public.ai_generations;
drop policy if exists "generations_update_own" on public.ai_generations;
drop policy if exists "generations_delete_own" on public.ai_generations;
create policy "generations_select_own" on public.ai_generations for select using (auth.uid() = user_id);
create policy "generations_insert_own" on public.ai_generations for insert with check (auth.uid() = user_id);
create policy "generations_update_own" on public.ai_generations for update using (auth.uid() = user_id);
create policy "generations_delete_own" on public.ai_generations for delete using (auth.uid() = user_id);
