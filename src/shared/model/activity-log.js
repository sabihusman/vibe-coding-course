/* Recording work: complete a deal, undo it, and log an attempted call or email. */
function completeDeal(id, via, summary, feedTitle, feedDetail){
  done[id] = { via: via, summary: summary };
  feed.unshift({ dealId:id, via:via, title:feedTitle, detail:feedDetail||"", date:"Today", time:nowTime() });
  undoStack.push(id);
  if(historyState==="empty"){ historyState="ready"; syncDemo("historyDemo","data-hstate","ready"); }
  if(followupsState==="empty"){ followupsState="ready"; syncDemo("followupsDemo","data-fstate","ready"); }
  render();
  showView("today"); /* saving from Deal Detail returns to Today, deal in Updated today */
  showToast(summary + " — " + dealById(id).contact, id);
}

function undoDeal(id){
  if(!done[id]) return;
  delete done[id];
  for(var i=0;i<feed.length;i++){ if(feed[i].dealId===id && !feed[i].attempt){ feed.splice(i,1); break; } }
  undoStack = undoStack.filter(function(h){ return h!==id; });
  hideToast();
  render();
  if(currentView==="detail" && detailId===id) renderDetail();
}

function addAttempt(id, via, title, detail){
  attemptSeq++;
  feed.unshift({ dealId: id, attempt: true, seq: attemptSeq, via: via, title: title, detail: detail, date:"Today", time: nowTime() });
  if(historyState==="empty"){ historyState="ready"; syncDemo("historyDemo","data-hstate","ready"); }
  renderFeed(); renderHistory();
  if(currentView==="detail" && detailId===id) renderDetailActivity();
}
