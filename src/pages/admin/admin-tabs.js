/* Admin tabs (Orbit, Living PRD, Handoff) and the links between them. */
/* ---------- Admin tabs: Orbit / Living PRD / Handoff ---------- */
var adminTab = "orbit";
var PRD_BLOCKS = { "prd-01":"01 · Product Overview", "prd-02":"02 · Problem & Hypothesis", "prd-03":"03 · User Flow & Screen Map", "prd-04":"04 · Success Metrics", "prd-05":"05 · Technical Reality", "prd-06":"06 · Assumptions & Risks", "prd-07":"07 · In vs. Out of Scope", "prd-08":"08 · Engineering Recommendation" };
var HO_SECTIONS = { "ho-summary":"What this is", "ho-frontend":"Frontend", "ho-backend":"Backend / data", "ho-flows":"Key flows", "ho-solid":"Solid vs. duct tape", "ho-risks":"Risks & assumptions", "ho-run":"How to run it", "ho-admin":"Admin portal" };
/* Which PRD block and handoff section describe each orbit node. */
var NODE_DOCS = {
  app:         { prd:["prd-01","prd-05"], ho:["ho-summary","ho-frontend"] },
  today:       { prd:["prd-03","prd-07"], ho:["ho-flows"] },
  detail:      { prd:["prd-03"],          ho:["ho-flows"] },
  history:     { prd:["prd-03"],          ho:["ho-flows"] },
  followups:   { prd:["prd-03","prd-06"], ho:["ho-flows","ho-solid"] },
  call:        { prd:["prd-03","prd-04"], ho:["ho-flows","ho-solid"] },
  email:       { prd:["prd-03","prd-04"], ho:["ho-flows","ho-solid"] },
  log:         { prd:["prd-06"],          ho:["ho-solid"] },
  stepper:     { prd:["prd-03"],          ho:["ho-flows"] },
  updated:     { prd:["prd-03"],          ho:["ho-flows"] },
  feed:        { prd:["prd-03","prd-04"], ho:["ho-flows"] },
  header:      { prd:["prd-03"],          ho:["ho-flows"] },
  past:        { prd:["prd-03"],          ho:["ho-flows"] },
  backlinks:   { prd:["prd-03"],          ho:["ho-risks"] },
  seehist:     { prd:["prd-03"],          ho:["ho-solid"] },
  actlist:     { prd:["prd-03"],          ho:["ho-flows"] },
  search:      { prd:["prd-03"],          ho:["ho-flows"] },
  rowopen:     { prd:["prd-03"],          ho:["ho-flows"] },
  dealsdata:   { prd:["prd-05","prd-08"], ho:["ho-backend"] },
  actdata:     { prd:["prd-05","prd-06"], ho:["ho-backend","ho-risks"] },
  session:     { prd:["prd-05"],          ho:["ho-backend"] },
  design:      { prd:["prd-05"],          ho:["ho-frontend"] },
  loading:     { prd:["prd-07","prd-04"], ho:["ho-flows"] },
  emptytoday:  { prd:["prd-07"],          ho:["ho-flows"] },
  errortoday:  { prd:["prd-07"],          ho:["ho-flows"] },
  emptyhistory:{ prd:["prd-07"],          ho:["ho-flows"] },
  errorhistory:{ prd:["prd-07"],          ho:["ho-flows"] }
};
function docLinksHtml(nodeId){
  var d = NODE_DOCS[nodeId]; if(!d) return "";
  var html = '<div class="doc-links"><div class="connect-label">In the Living PRD</div><div class="connects">'
    + d.prd.map(function(id){ return '<button type="button" class="olink doc" data-prdlink="' + id + '">' + esc(PRD_BLOCKS[id] || id) + '</button>'; }).join("")
    + '</div>';
  if(d.ho && d.ho.length){
    html += '<div class="connect-label">In the Handoff</div><div class="connects">'
      + d.ho.map(function(id){ return '<button type="button" class="olink doc" data-holink="' + id + '">' + esc(HO_SECTIONS[id] || id) + '</button>'; }).join("")
      + '</div>';
  }
  return html + '</div>';
}
function showAdminTab(t, targetId){
  adminTab = t;
  var panels = { orbit:"adminTabOrbit", prd:"adminTabPrd", handoff:"adminTabHandoff" };
  Object.keys(panels).forEach(function(k){ var p = byId(panels[k]); if(p) p.hidden = (k!==t); });
  document.querySelectorAll("[data-atab]").forEach(function(b){
    var on = b.getAttribute("data-atab")===t;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
  if(currentView!=="admin") showView("admin");
  if(targetId){
    var el = byId(targetId);
    if(el){
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
      if(el.scrollIntoView) el.scrollIntoView({ block:"start", behavior:"smooth" });
    }
  } else {
    var tabs = document.querySelector(".admin-tabs");
    if(tabs && tabs.scrollIntoView && currentView==="admin") tabs.scrollIntoView({ block:"start", behavior:"smooth" });
  }
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-atab],[data-atab-go],[data-orbit-link],[data-prdlink],[data-holink]");
  if(!b) return;
  if(b.hasAttribute("data-atab")){ showAdminTab(b.getAttribute("data-atab")); return; }
  if(b.hasAttribute("data-atab-go")){ showAdminTab(b.getAttribute("data-atab-go")); return; }
  if(b.hasAttribute("data-prdlink")){ showAdminTab("prd", b.getAttribute("data-prdlink")); return; }
  if(b.hasAttribute("data-holink")){ showAdminTab("handoff", b.getAttribute("data-holink")); return; }
  if(b.hasAttribute("data-orbit-link")){
    var id = b.getAttribute("data-orbit-link");
    showAdminTab("orbit", "orbitDetail");
    selectNode(id, true);
  }
});
