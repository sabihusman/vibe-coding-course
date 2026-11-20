-- CRM Companion in-app analytics: one row per view change, counts only.
-- No names, companies, deal ids, notes or any rep data. Telemetry, not rep data.
-- Run once in the Supabase SQL editor for project toctukiccnirfkkoaqog. Safe to re-run.

create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  session_id  uuid not null,
  view        text not null check (view in ('today','history','problem','deal','admin')),
  entered_at  timestamptz not null default now()
);

create index if not exists analytics_events_entered_idx on public.analytics_events (entered_at);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

-- A rep inserts only their own rows and reads only their own rows. No update or delete.
drop policy if exists "analytics_events: insert own" on public.analytics_events;
create policy "analytics_events: insert own" on public.analytics_events
  for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "analytics_events: read own" on public.analytics_events;
create policy "analytics_events: read own" on public.analytics_events
  for select to authenticated
  using (owner_id = (select auth.uid()));

revoke all on public.analytics_events from anon, authenticated;
grant select, insert on public.analytics_events to authenticated;

-- Totals only, across all reps, never individual rows.
-- Security definer so it can count every rep's events; it returns aggregates and nothing else.
create or replace function public.get_analytics_summary()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with periods(label, since) as (
    values ('last_30_days', now() - interval '30 days'),
           ('all_time',     '-infinity'::timestamptz)
  ),
  views(view, label_text, ord) as (
    values ('today','Today',1), ('history','Activity history',2), ('problem','Problem statement',3),
           ('deal','Deal Detail',4), ('admin','Admin',5)
  ),
  ev as (
    select p.label, e.owner_id, e.session_id, e.view, e.entered_at
    from periods p join public.analytics_events e on e.entered_at >= p.since
  ),
  sess as (
    select label, session_id, count(*) as n,
           extract(epoch from max(entered_at) - min(entered_at)) as dur
    from ev group by label, session_id
  ),
  totals as (
    select p.label,
           (select count(distinct owner_id) from ev where ev.label = p.label)           as visitors,
           (select count(*) from ev where ev.label = p.label)                           as page_views,
           (select count(*) from sess where sess.label = p.label)                       as sessions,
           (select coalesce(avg(dur), 0) from sess where sess.label = p.label)          as avg_duration,
           (select count(*) from sess where sess.label = p.label and n = 1)             as bounced
    from periods p
  ),
  by_view as (
    select p.label, v.view, v.label_text, v.ord,
           (select count(*) from ev where ev.label = p.label and ev.view = v.view) as views
    from periods p cross join views v
  )
  select jsonb_build_object(
    'generated_at', now(),
    'periods', (
      select jsonb_object_agg(t.label, jsonb_build_object(
        'visitors',             t.visitors,
        'page_views',           t.page_views,
        'sessions',             t.sessions,
        'views_per_visit',      case when t.sessions > 0 then round(t.page_views::numeric / t.sessions, 2) else 0 end,
        'avg_duration_seconds', round(t.avg_duration::numeric),
        'bounce_rate',          case when t.sessions > 0 then round(100.0 * t.bounced / t.sessions, 1) else 0 end,
        'by_view', (
          select jsonb_agg(jsonb_build_object(
                   'view', b.view, 'label', b.label_text, 'views', b.views,
                   'share', case when t.page_views > 0 then round(100.0 * b.views / t.page_views, 1) else 0 end)
                 order by b.ord)
          from by_view b where b.label = t.label)
      ))
      from totals t)
  );
$$;

revoke all on function public.get_analytics_summary() from public, anon;
grant execute on function public.get_analytics_summary() to authenticated;
