-- Formulários guiados utilizados durante ligações comerciais.

create table if not exists public.lead_script_flows (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  script_key text not null default 'vehicle_store',
  script_version integer not null default 1,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed', 'abandoned')),
  current_step integer not null default 0 check (current_step >= 0),
  answers jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lead_script_flows_lead
  on public.lead_script_flows (lead_id, updated_at desc);
create index if not exists idx_lead_script_flows_created_by
  on public.lead_script_flows (created_by);
create index if not exists idx_lead_script_flows_status
  on public.lead_script_flows (status);

create or replace function public.touch_lead_script_flow_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_lead_script_flow on public.lead_script_flows;
create trigger trg_touch_lead_script_flow
before update on public.lead_script_flows
for each row execute function public.touch_lead_script_flow_updated_at();

create or replace function public.is_leader(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role::text = 'leader'
  );
$$;

alter table public.lead_script_flows enable row level security;

drop policy if exists lead_script_flows_visible_lead on public.lead_script_flows;
create policy lead_script_flows_visible_lead
on public.lead_script_flows
for select
to authenticated
using (
  public.is_leader(auth.uid())
  or exists (
    select 1
    from public.leads
    where leads.id = lead_script_flows.lead_id
      and leads.owner_id = auth.uid()
  )
);

drop policy if exists lead_script_flows_insert_visible_lead on public.lead_script_flows;
create policy lead_script_flows_insert_visible_lead
on public.lead_script_flows
for insert
to authenticated
with check (
  created_by = auth.uid()
  and (
    public.is_leader(auth.uid())
    or exists (
      select 1
      from public.leads
      where leads.id = lead_script_flows.lead_id
        and leads.owner_id = auth.uid()
    )
  )
);

drop policy if exists lead_script_flows_update_visible_lead on public.lead_script_flows;
create policy lead_script_flows_update_visible_lead
on public.lead_script_flows
for update
to authenticated
using (
  public.is_leader(auth.uid())
  or exists (
    select 1
    from public.leads
    where leads.id = lead_script_flows.lead_id
      and leads.owner_id = auth.uid()
  )
)
with check (
  public.is_leader(auth.uid())
  or exists (
    select 1
    from public.leads
    where leads.id = lead_script_flows.lead_id
      and leads.owner_id = auth.uid()
  )
);

drop policy if exists lead_script_flows_delete_visible_lead on public.lead_script_flows;
create policy lead_script_flows_delete_visible_lead
on public.lead_script_flows
for delete
to authenticated
using (
  public.is_leader(auth.uid())
  or exists (
    select 1
    from public.leads
    where leads.id = lead_script_flows.lead_id
      and leads.owner_id = auth.uid()
  )
);

grant select, insert, update, delete on public.lead_script_flows to authenticated;
grant all on public.lead_script_flows to service_role;
