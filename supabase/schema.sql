-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for prompts
create table prompts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  title text, -- Optional, maybe derived from prompt
  prompt_text text not null,
  negative_prompt text,
  model text not null,
  before_image_url text not null,
  after_image_url text not null,
  likes_count bigint default 0,
  
  constraint title_length check (char_length(title) < 100)
);

-- Set up RLS for prompts
alter table prompts enable row level security;

create policy "Prompts are viewable by everyone."
  on prompts for select
  using ( true );

create policy "Users can insert their own prompts."
  on prompts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own prompts."
  on prompts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own prompts."
  on prompts for delete
  using ( auth.uid() = user_id );

-- Set up Storage Buckets (Execute this in Storage Section of Supabase Dashboard ideally, but documenting here)
-- Bucket: 'images'
-- Policy: Public Access
