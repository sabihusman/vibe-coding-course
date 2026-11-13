-- CRM Companion backend: deals, activities, follow_ups, with row-level security.
-- Every rep (a Supabase Auth user; anonymous sign-in in v1) sees only their own rows.
-- Sample data only. Call and Email stay simulated: these tables store what happened in the tool.

create table if not exists public.deals (
  id         uuid primary key default gen_random_uuid(),
  contact    text not null,
  company    text not null,
  arr        integer not null check (arr >= 0),          -- sample ARR in $k
  due        text not null,                               -- label as shown, e.g. "Due today", "Overdue 2 days"
  next_step  text not null,
  owner_id   uuid not null default auth.uid() references auth.users(id) on delete cascade
);

create table if not exists public.activities (
  id         uuid primary key default gen_random_uuid(),
  deal_id    uuid not null references public.deals(id) on delete cascade,
  type       text not null check (type in ('call','email','log')),
  title      text not null,
  detail     text not null default '',
  date       date not null default current_date,
  time       text not null,                               -- display time, e.g. "4:02 PM"
  attempted  boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id         uuid primary key default gen_random_uuid(),
  deal_id    uuid not null unique references public.deals(id) on delete cascade,
  status     text not null default 'open' check (status in ('open','updated_today')),
  updated_at timestamptz not null default now()
);

create index if not exists deals_owner_idx on public.deals(owner_id);
create index if not exists activities_deal_idx on public.activities(deal_id);

alter table public.deals      enable row level security;
alter table public.activities enable row level security;
alter table public.follow_ups enable row level security;

-- deals: a rep reads and writes only rows they own
drop policy if exists "deals: own rows" on public.deals;
create policy "deals: own rows" on public.deals
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

-- activities and follow_ups: only for deals the rep owns
drop policy if exists "activities: own deals" on public.activities;
create policy "activities: own deals" on public.activities
  for all to authenticated
  using (exists (select 1 from public.deals d where d.id = deal_id and d.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.deals d where d.id = deal_id and d.owner_id = (select auth.uid())));

drop policy if exists "follow_ups: own deals" on public.follow_ups;
create policy "follow_ups: own deals" on public.follow_ups
  for all to authenticated
  using (exists (select 1 from public.deals d where d.id = deal_id and d.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.deals d where d.id = deal_id and d.owner_id = (select auth.uid())));

grant select, insert, update, delete on public.deals, public.activities, public.follow_ups to authenticated;
revoke all on public.deals, public.activities, public.follow_ups from anon;

-- Give the signed-in rep their own copy of the prototype's sample data, once.
-- Runs as the caller (security invoker), so row-level security still applies.
create or replace function public.seed_my_sample_data()
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  me uuid := auth.uid();
  j uuid; dn uuid; p uuid; m uuid; s uuid; a uuid;
begin
  if me is null then raise exception 'Sign in first'; end if;
  if exists (select 1 from deals where owner_id = me) then return 0; end if;

  insert into deals (contact, company, arr, due, next_step, owner_id) values
    ('James Whitfield','Meridian Legal',312,'Due today','Confirm renewal terms before legal review',me) returning id into j;
  insert into deals (contact, company, arr, due, next_step, owner_id) values
    ('Daniel Ortiz','BluePeak Logistics',148,'Due today','Share pilot results and agree rollout date',me) returning id into dn;
  insert into deals (contact, company, arr, due, next_step, owner_id) values
    ('Priya Nair','Harbor Dental Group',92,'Due today','Confirm the decision-maker meeting for next week',me) returning id into p;
  insert into deals (contact, company, arr, due, next_step, owner_id) values
    ('Maya Chen','Northwind Retail',54,'Overdue 2 days','Reconnect on the expansion plan',me) returning id into m;
  insert into deals (contact, company, arr, due, next_step, owner_id) values
    ('Sofia Reyes','Cascade Fitness Co.',38,'Overdue 1 day','Send the updated proposal',me) returning id into s;
  insert into deals (contact, company, arr, due, next_step, owner_id) values
    ('Aisha Bello','GreenLeaf Grocers',19,'Due today','Check the first order timeline',me) returning id into a;

  insert into follow_ups (deal_id) values (j),(dn),(p),(m),(s),(a);

  -- The 12 seeded activities, Oct 28 to Nov 4 (Pacific time), newest first.
  insert into activities (deal_id, type, title, detail, date, time, attempted, created_at) values
    (m, 'call', 'Call — Maya Chen, Northwind Retail · No answer', 'Left a voicemail about the expansion plan', '2026-11-04', '4:02 PM', false, '2026-11-04 16:02:00-08'),
    (dn, 'call', 'Call — Daniel Ortiz, BluePeak Logistics · Called', '“Pilot numbers look strong — send the summary.” · Duration 06:12', '2026-11-04', '11:20 AM', false, '2026-11-04 11:20:00-08'),
    (j, 'email', 'Email — James Whitfield, Meridian Legal', 'Subject: Renewal terms — draft for legal review', '2026-11-04', '9:41 AM', false, '2026-11-04 09:41:00-08'),
    (s, 'log', 'Logged activity — Sofia Reyes, Cascade Fitness Co.', 'Proposal feedback received — pricing page flagged', '2026-11-04', '9:05 AM', false, '2026-11-04 09:05:00-08'),
    (j, 'call', 'Call — James Whitfield, Meridian Legal · Called', 'Walked through renewal timeline · Duration 09:37', '2026-11-03', '2:15 PM', false, '2026-11-03 14:15:00-08'),
    (p, 'email', 'Email — Priya Nair, Harbor Dental Group', 'Subject: Decision-maker meeting — proposed times', '2026-11-03', '1:03 PM', false, '2026-11-03 13:03:00-08'),
    (a, 'call', 'Call — Aisha Bello, GreenLeaf Grocers · Called', 'Confirmed first order quantities · Duration 04:48', '2026-11-03', '10:26 AM', false, '2026-11-03 10:26:00-08'),
    (dn, 'log', 'Logged activity — Daniel Ortiz, BluePeak Logistics', 'Pilot results deck shared internally', '2026-10-31', '3:30 PM', false, '2026-10-31 15:30:00-08'),
    (a, 'log', 'Logged activity — Aisha Bello, GreenLeaf Grocers', 'Onboarding packet sent to store ops', '2026-10-31', '11:12 AM', false, '2026-10-31 11:12:00-08'),
    (p, 'log', 'Logged activity — Priya Nair, Harbor Dental Group', 'Champion identified — office manager', '2026-10-30', '4:44 PM', false, '2026-10-30 16:44:00-08'),
    (m, 'email', 'Email — Maya Chen, Northwind Retail', 'Subject: Expansion plan — next steps', '2026-10-29', '9:18 AM', false, '2026-10-29 09:18:00-08'),
    (s, 'email', 'Email — Sofia Reyes, Cascade Fitness Co.', 'Subject: Updated proposal — first draft', '2026-10-28', '2:57 PM', false, '2026-10-28 14:57:00-08');
  return 6;
end;
$$;

revoke all on function public.seed_my_sample_data() from public, anon;
grant execute on function public.seed_my_sample_data() to authenticated;
