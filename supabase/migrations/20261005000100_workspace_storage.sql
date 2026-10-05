create table if not exists public.preapix_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{"projects":[],"published":{},"activity":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.preapix_workspaces enable row level security;
revoke all on table public.preapix_workspaces from anon;
grant select, insert, update, delete on table public.preapix_workspaces to authenticated;

drop policy if exists "Users can read their own Preapix workspace" on public.preapix_workspaces;
create policy "Users can read their own Preapix workspace"
  on public.preapix_workspaces for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own Preapix workspace" on public.preapix_workspaces;
create policy "Users can create their own Preapix workspace"
  on public.preapix_workspaces for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own Preapix workspace" on public.preapix_workspaces;
create policy "Users can update their own Preapix workspace"
  on public.preapix_workspaces for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.preapix_get_mock_project(p_public_key text)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'publicKey', project.value->>'publicKey',
    'mockApis', coalesce((
      select jsonb_agg(api.value - 'requestLogs' - 'shareToken')
      from jsonb_array_elements(coalesce(project.value->'mockApis', '[]'::jsonb)) as api(value)
    ), '[]'::jsonb)
  )
  from public.preapix_workspaces as workspace
  cross join lateral jsonb_array_elements(coalesce(workspace.data->'projects', '[]'::jsonb)) as project(value)
  where project.value->>'publicKey' = p_public_key
  limit 1;
$$;

revoke all on function public.preapix_get_mock_project(text) from public;
grant execute on function public.preapix_get_mock_project(text) to anon, authenticated;
