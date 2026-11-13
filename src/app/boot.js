/* Start-up: first render and the initial follow-ups load. */
renderOrbit(); renderOrbitList(); renderOrbitDetail();

render();
/* Initial fetch: follow-ups start as a skeleton, then load.
   With Supabase configured, the load reads the rep's data; otherwise the in-page sample data appears after 750 ms, as before. */
sbStart().then(function(usingSupabase){
  if(usingSupabase){ setFollowupsState("loading"); return; }
  clearTimeout(followupsTimer);
  followupsTimer = setTimeout(function(){ followupsState="ready"; syncDemo("followupsDemo","data-fstate","ready"); renderTodo(); }, 750);
});
