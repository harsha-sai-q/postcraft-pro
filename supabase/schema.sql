create extension if not exists "pgcrypto";

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

create policy "posts_select_own" on public.posts for select using (auth.uid() = user_id);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = user_id);

create policy "analyses_select_own" on public.competitor_analyses for select using (auth.uid() = user_id);
create policy "analyses_insert_own" on public.competitor_analyses for insert with check (auth.uid() = user_id);
create policy "analyses_update_own" on public.competitor_analyses for update using (auth.uid() = user_id);
create policy "analyses_delete_own" on public.competitor_analyses for delete using (auth.uid() = user_id);

create policy "generations_select_own" on public.ai_generations for select using (auth.uid() = user_id);
create policy "generations_insert_own" on public.ai_generations for insert with check (auth.uid() = user_id);
create policy "generations_update_own" on public.ai_generations for update using (auth.uid() = user_id);
create policy "generations_delete_own" on public.ai_generations for delete using (auth.uid() = user_id);
