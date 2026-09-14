-- Consolida a visibilidade comercial: líder acessa todos os registros;
-- os demais perfis acessam somente registros sob sua responsabilidade.

alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.sales_events enable row level security;

-- Helper defensivo para projetos onde as migrações-base não foram
-- aplicadas integralmente ou usam uma versão diferente do enum de papéis.
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

drop policy if exists leads_select on public.leads;
drop policy if exists leads_insert on public.leads;
drop policy if exists leads_update on public.leads;
drop policy if exists leads_delete on public.leads;
drop policy if exists leads_read_policy on public.leads;
drop policy if exists leads_write_policy on public.leads;
drop policy if exists leads_leader_all_or_owner on public.leads;
drop policy if exists leads_leader_or_owner on public.leads;

create policy leads_leader_or_owner on public.leads
  for all to authenticated
  using (public.is_leader(auth.uid()) or owner_id = auth.uid())
  with check (public.is_leader(auth.uid()) or owner_id = auth.uid());

drop policy if exists la_select on public.lead_activities;
drop policy if exists la_insert on public.lead_activities;
drop policy if exists la_update on public.lead_activities;
drop policy if exists la_delete on public.lead_activities;
drop policy if exists lead_activities_read_policy on public.lead_activities;
drop policy if exists lead_activities_write_policy on public.lead_activities;
drop policy if exists lead_activities_by_visible_lead on public.lead_activities;
drop policy if exists lead_activities_leader_or_owner on public.lead_activities;

create policy lead_activities_leader_or_owner on public.lead_activities
  for all to authenticated
  using (
    public.is_leader(auth.uid())
    or exists (
      select 1
      from public.leads
      where leads.id = lead_activities.lead_id
        and leads.owner_id = auth.uid()
    )
  )
  with check (
    public.is_leader(auth.uid())
    or exists (
      select 1
      from public.leads
      where leads.id = lead_activities.lead_id
        and leads.owner_id = auth.uid()
    )
  );

drop policy if exists se_select on public.sales_events;
drop policy if exists se_modify on public.sales_events;
drop policy if exists sales_events_leader_all_or_owner on public.sales_events;
drop policy if exists sales_events_leader_or_owner on public.sales_events;

create policy sales_events_leader_or_owner on public.sales_events
  for all to authenticated
  using (public.is_leader(auth.uid()) or owner_id = auth.uid())
  with check (public.is_leader(auth.uid()) or owner_id = auth.uid());
