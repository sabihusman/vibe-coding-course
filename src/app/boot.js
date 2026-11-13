/* Start-up: first render and the initial follow-ups load. */
renderOrbit(); renderOrbitList(); renderOrbitDetail();

render();
/* Open the view named in the address (#today, #history, #problem, #admin), so views are
   directly addressable and browser Back works. */
routeFromHash({ fromHistory: true });
try { history.replaceState(null, "", location.hash || "#today"); } catch(e){}
/* Initial fetch: follow-ups start as a skeleton, then load.
   With Supabase configured, the load reads the rep's data; otherwise the in-page sample data appears after 750 ms, as before. */
function loadSampleFollowups(){
  clearTimeout(followupsTimer);
  followupsTimer = setTimeout(function(){ followupsState="ready"; syncDemo("followupsDemo","data-fstate","ready"); renderTodo(); }, 750);
}
sbStart().then(function(usingSupabase){
  if(usingSupabase){ setFollowupsState("loading"); return; }
  loadSampleFollowups();
}, function(err){
  /* Config lookup failed unexpectedly: fall back to the in-page sample data. */
  if(window.console) console.warn("CRM Companion: Supabase start-up failed; using sample data.", err);
  loadSampleFollowups();
});
