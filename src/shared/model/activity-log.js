/* Recording work: save an update (one activity, one Updated today entry) and Undo it.
   Only an explicit save in a dialog calls completeDeal. Opening, cancelling or closing a
   dialog records nothing. completeDeal returns false, and does nothing, if the deal is
   already updated, so a repeated submit cannot create a duplicate. */
function completeDeal(id, via, summary, feedTitle, feedDetail){
  if(!dealById(id) || done[id]) return false;
  done[id] = { via: via, summary: summary };
  feed.unshift({ dealId:id, via:via, title:feedTitle, detail:feedDetail||"", date:"Today", time:nowTime() });
  undoStack.push(id);
  delete drafts[id];
  if(historyState==="empty"){ historyState="ready"; syncDemo("historyDemo","data-hstate","ready"); }
  if(followupsState==="empty"){ followupsState="ready"; syncDemo("followupsDemo","data-fstate","ready"); }
  if(selectedId===id){ var next = pendingDeals()[0]; selectedId = next ? next.id : null; }
  render();
  if(currentView==="detail") showView("today"); /* saving from Deal Detail returns to Today */
  var d = dealById(id);
  showToast(summary + " — " + d.contact, id);
  announce(summary + " for " + d.contact + ". " + doneCount() + " of " + DEALS.length + " updated. Undo is available.");
  return true;
}

/* Undo removes that one activity, puts the deal back in the queue (in its place under the
   current sort), and restores the counts. Other history is untouched. */
function undoDeal(id){
  if(!done[id]) return false;
  delete done[id];
  for(var i=0;i<feed.length;i++){ if(feed[i].dealId===id && !feed[i].attempt){ feed.splice(i,1); break; } }
  undoStack = undoStack.filter(function(h){ return h!==id; });
  hideToast();
  selectedId = id;
  render();
  if(currentView==="detail" && detailId===id) renderDetail();
  var d = dealById(id);
  announce("Undone. " + d.contact + " is back in your queue. " + doneCount() + " of " + DEALS.length + " updated.");
  var row = document.querySelector('#todoList [data-select="' + id + '"]');
  if(row && currentView==="today") row.focus();
  return true;
}
