-- New reps start clean: seed_my_sample_data() now gives a new rep the 6 sample deals and their
-- open follow-ups only. The 12 seeded past activities (Oct 28 to Nov 4) are no longer inserted,
-- so Activity history starts empty and fills only with what the rep saves.
-- Existing reps are not touched. Run once in the Supabase SQL editor for project
-- toctukiccnirfkkoaqog. Safe to re-run.

create or replace function public.seed_my_sample_data()
returns integer
language plpgsql
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

  -- No seeded activities: a new rep's Activity history starts empty.
  return 6;
end;
$$;

revoke all on function public.seed_my_sample_data() from public, anon;
grant execute on function public.seed_my_sample_data() to authenticated;
