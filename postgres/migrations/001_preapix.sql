create table if not exists preapix_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists preapix_sessions (
  token_hash text primary key,
  user_id uuid not null references preapix_users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists preapix_sessions_user_id_idx on preapix_sessions(user_id);
create index if not exists preapix_sessions_expires_at_idx on preapix_sessions(expires_at);

create table if not exists preapix_workspaces (
  user_id uuid primary key references preapix_users(id) on delete cascade,
  data jsonb not null default '{"projects":[],"published":{},"activity":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
