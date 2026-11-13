/* Deal Detail screen: header, past activity, buttons, Back and the link into Activity History. */
/* ---------- Deal Detail ---------- */
function activityRowHtml(f, clickable){
  var d = dealById(f.dealId);
  var icon = f.via==="call" ? phoneSvg : (f.via==="email" ? mailSvg : checkSvg);
  var inner = '<div class="feed-ic '+f.via+'">'+icon+'</div>'
    + '<div style="min-width:0"><b>'+esc(f.title)+'</b>'+(f.detail?'<p>'+esc(f.detail)+'</p>':"")+'</div>'
    + '<span class="hist-when"><span class="d">'+esc(f.date||"Today")+'</span><span class="t">'+esc(f.time||"")+'</span></span>';
  if(clickable) return '<button type="button" class="hist-row" data-deal="'+f.dealId+'" aria-label="Open deal: '+esc(d?d.contact:"")+'">'+inner+'</button>';
  return '<div class="feed-item">'+inner+'</div>';
}
function renderDetail(){
  var d = dealById(detailId); if(!d) return;
  byId("detailName").textContent = d.contact;
  byId("detailCompany").textContent = d.company + " · " + d.due;
  byId("detailContact").textContent = d.contact;
  byId("detailCompanyLine").textContent = d.company;
  byId("detailArr").textContent = d.arrLabel;
  var due = byId("detailDue");
  due.textContent = d.due;
  due.className = "badge " + (d.overdue ? "over" : "due");
  var st = byId("detailStatus");
  if(done[d.id]){ st.hidden = false; st.textContent = "Updated today · " + done[d.id].summary; }
  else { st.hidden = true; }
  byId("detailNext").innerHTML = arrowSvg + '<span><b>Next step:</b> ' + esc(d.next) + '</span>';
  renderDetailActivity();
}
function renderDetailActivity(){
  var wrap = byId("detailActivity"); if(!wrap || !detailId) return;
  var items = allActivity().filter(function(f){ return f.dealId===detailId; });
  if(items.length===0){ wrap.innerHTML = '<p class="none">No activity yet for this deal.</p>'; return; }
  wrap.innerHTML = items.map(function(f){ return activityRowHtml(f, false); }).join("");
}
byId("detailCallBtn").innerHTML = phoneSvg + " Call";
byId("detailEmailBtn").innerHTML = mailSvg + " Email";
byId("detailCallBtn").addEventListener("click", function(){ if(detailId) openCall(detailId); });
byId("detailEmailBtn").addEventListener("click", function(){ if(detailId) openEmail(detailId); });
byId("detailLogBtn").addEventListener("click", function(){ if(detailId) logActivity(detailId); });
byId("detailBack").addEventListener("click", function(){ showView("today"); });
byId("detailHistoryLink").addEventListener("click", function(){
  var d = dealById(detailId);
  openHistory(d ? d.contact : ""); /* Deal Detail anchors into Activity History, filtered to this deal */
});
