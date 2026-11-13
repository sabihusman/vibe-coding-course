/* Start-up: first render and the initial follow-ups load. */
renderOrbit(); renderOrbitList(); renderOrbitDetail();

render();
/* Initial fetch: follow-ups start as a skeleton, then load. */
clearTimeout(followupsTimer);
followupsTimer = setTimeout(function(){ followupsState="ready"; syncDemo("followupsDemo","data-fstate","ready"); renderTodo(); }, 750);
