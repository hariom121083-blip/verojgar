-- Verojgar.com production database
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  city text not null default '',
  state text not null default '',
  field text not null default '',
  avatar_url text,
  bio text,
  is_teacher boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  handle text unique not null,
  description text default '',
  banner_url text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  channel_id uuid references public.channels(id) on delete set null,
  title text not null,
  description text default '',
  field text not null default '',
  city text not null default '',
  state text default '',
  video_url text not null,
  thumbnail_url text,
  duration_seconds integer,
  views bigint not null default 0,
  likes bigint not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  field text not null,
  city text not null,
  scheduled_at timestamptz not null,
  meeting_url text,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  channel_id uuid not null references public.channels(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, channel_id)
);

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.videos enable row level security;
alter table public.live_sessions enable row level security;
alter table public.follows enable row level security;

create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

create policy "channels public read" on public.channels for select using (true);
create policy "channels insert own" on public.channels for insert with check (auth.uid() = owner_id);
create policy "channels update own" on public.channels for update using (auth.uid() = owner_id);
create policy "channels delete own" on public.channels for delete using (auth.uid() = owner_id);

create policy "public videos read" on public.videos for select using (is_public = true or auth.uid() = creator_id);
create policy "videos insert own" on public.videos for insert with check (auth.uid() = creator_id);
create policy "videos update own" on public.videos for update using (auth.uid() = creator_id);
create policy "videos delete own" on public.videos for delete using (auth.uid() = creator_id);

create policy "live public read" on public.live_sessions for select using (true);
create policy "live insert own" on public.live_sessions for insert with check (auth.uid() = teacher_id);
create policy "live update own" on public.live_sessions for update using (auth.uid() = teacher_id);
create policy "live delete own" on public.live_sessions for delete using (auth.uid() = teacher_id);

create policy "follow read own" on public.follows for select using (auth.uid() = follower_id);
create policy "follow insert own" on public.follows for insert with check (auth.uid() = follower_id);
create policy "follow delete own" on public.follows for delete using (auth.uid() = follower_id);

-- Create Storage buckets from the Supabase Dashboard if you prefer the UI:
-- videos (public)
-- thumbnails (public)
-- avatars (public)
--
-- IMPORTANT: For a production platform, consider private video buckets + signed URLs
-- rather than public videos, especially if paid/private content will be added later.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, city, state, field)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name',''),
    coalesce(new.raw_user_meta_data->>'city',''),
    coalesce(new.raw_user_meta_data->>'state',''),
    coalesce(new.raw_user_meta_data->>'field','')
  )
  on conflict (id) do update set
    name=excluded.name,
    city=excluded.city,
    state=excluded.state,
    field=excluded.field;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
