-- Create profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  credits integer default 3,
  is_pro boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Create tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text,
  description text,
  code_content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for tasks
alter table tasks enable row level security;

create policy "Users can view own tasks" on tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert own tasks" on tasks
  for insert with check (auth.uid() = user_id);

-- Create evaluations table
create table evaluations (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references tasks not null,
  score integer,
  strengths jsonb,
  improvements jsonb,
  fixed_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for evaluations
alter table evaluations enable row level security;

create policy "Users can view evaluations for their tasks" on evaluations
  for select using (
    exists (
      select 1 from tasks
      where tasks.id = evaluations.task_id
      and tasks.user_id = auth.uid()
    )
  );

-- Create payments table (mock)
create table payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount integer,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for payments
alter table payments enable row level security;

create policy "Users can view own payments" on payments
  for select using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
