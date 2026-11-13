/* Orbit Code Explorer: drawing the orbit, the list, search, filters, and the detail panel. */
var nodeByIdMap = {};
NODES.forEach(function(n){ nodeByIdMap[n.id] = n; });
var orbitSelected = "app";
var orbitFilter = "all";

function nodeMatches(n){
  var q = byId("orbitSearch").value.trim().toLowerCase();
  var catOk = orbitFilter==="all" || n.cat===orbitFilter || n.id==="app";
  var qOk = !q || n.name.toLowerCase().indexOf(q)>=0 || n.about.toLowerCase().indexOf(q)>=0 || n.catLabel.toLowerCase().indexOf(q)>=0;
  return catOk && qOk;
}
function catColor(cat){
  return cat==="screen" ? "#3b82f6" : cat==="data" ? "#b98a0a" : cat==="state" ? "#7c5cd6" : cat==="app" ? "#1e1e2d" : "#64748b";
}
function renderOrbit(){
  var stage = byId("orbitStage");
  stage.querySelectorAll(".onode").forEach(function(el){ el.remove(); });
  var rings = {1:[], 2:[], 3:[]};
  NODES.forEach(function(n){ if(n.ring>0) rings[n.ring].push(n); });
  Object.keys(rings).forEach(function(r){
    var list = rings[r];
    var rx = r==="1" ? 27 : (r==="2" ? 34 : 40);
    var ry = r==="1" ? 30 : (r==="2" ? 37 : 44);
    list.forEach(function(n, i){
      var ang;
      if(r==="1"){ ang = [-90, 30, 150][i] || 0; }
      else { ang = -90 + (360/list.length)*i + (r==="3" ? 360/list.length/2 : 0); }
      var rad = ang * Math.PI/180;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "onode" + (n.cat==="screen" ? " screen" : "") + (n.id===orbitSelected ? " selected" : "") + (nodeMatches(n) ? "" : " dimmed");
      b.style.left = (50 + rx*Math.cos(rad)) + "%";
      b.style.top = (50 + ry*Math.sin(rad)) + "%";
      b.textContent = n.name;
      b.setAttribute("aria-label", "About: " + n.name);
      b.addEventListener("click", function(){ selectNode(n.id, false); });
      stage.appendChild(b);
    });
  });
  var c = document.createElement("button");
  c.type = "button";
  c.className = "onode centre" + (orbitSelected==="app" ? " selected" : "");
  c.style.left = "50%"; c.style.top = "50%";
  c.innerHTML = "CRM Companion<small>index.html + src/<br>grouped by feature</small>";
  c.setAttribute("aria-label", "About: CRM Companion, the whole app");
  c.addEventListener("click", function(){ selectNode("app", false); });
  stage.appendChild(c);
}
function renderOrbitList(){
  var wrap = byId("orbitList");
  wrap.innerHTML = "";
  var shown = 0;
  NODES.forEach(function(n){
    if(!nodeMatches(n)) return;
    shown++;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "lnode" + (n.id===orbitSelected ? " selected" : "");
    b.innerHTML = '<span class="cdot" style="background:' + catColor(n.cat) + '"></span><span>' + esc(n.name) + '</span>';
    b.addEventListener("click", function(){ selectNode(n.id, true); });
    wrap.appendChild(b);
  });
  if(shown===0){
    wrap.innerHTML = '<p class="none">Nothing matches. Clear the search or pick a different filter.</p>';
  }
}
function renderOrbitChips(){
  var q = byId("orbitSearch").value.trim();
  var wrap = byId("orbitChips");
  if(!q){ wrap.innerHTML = ""; return; }
  var hits = NODES.filter(function(n){ return nodeMatches(n); });
  if(hits.length===0){ wrap.innerHTML = '<span class="no-match">No parts match “' + esc(q) + '”.</span>'; return; }
  wrap.innerHTML = '<span class="chips-label">Jump to</span>' + hits.map(function(n){
    return '<button type="button" class="ochip" data-jump="' + n.id + '">' + esc(n.name) + '</button>';
  }).join("");
  wrap.querySelectorAll("[data-jump]").forEach(function(b){
    b.addEventListener("click", function(){ selectNode(b.getAttribute("data-jump"), true); });
  });
}
function renderOrbitDetail(){
  var n = nodeByIdMap[orbitSelected]; if(!n) return;
  var sn = SNIPPETS[n.id];
  var vClass = n.verdict==="real" ? "real" : (n.verdict==="mocked" ? "mocked" : "mixed");
  byId("orbitDetail").innerHTML =
    '<div class="catrow"><span class="catpill">' + esc(n.catLabel) + '</span>'
    + '<span class="verdict ' + vClass + '"><i></i>' + esc(n.verdictLabel) + '</span></div>'
    + '<h2>' + esc(n.name) + '</h2>'
    + '<p>' + esc(n.about) + '</p>'
    + (n.exact ? '<p class="exact">“' + esc(n.exact) + '”</p>' : '')
    + '<div class="connect-label">Connects to</div>'
    + '<div class="connects">' + n.connects.map(function(cid){
        var t = nodeByIdMap[cid];
        return t ? '<button type="button" class="cbtn" data-connect="' + cid + '">' + esc(t.name) + '</button>' : '';
      }).join("") + '</div>'
    + docLinksHtml(n.id)
    + (sn ? '<div class="codebox"><button type="button" class="code-toggle" data-codetoggle aria-expanded="false">Show code — ' + esc(sn.fn) + '</button>'
      + '<div class="code-panel" data-codepanel hidden>'
      + '<p class="code-meta"><b>Where it lives:</b> ' + esc(sn.where) + '</p>'
      + '<p class="code-meta">' + esc(sn.does) + '</p>'
      + '<pre class="code-pre">' + esc(sn.code) + '</pre></div></div>' : '');
  byId("orbitDetail").querySelectorAll("[data-connect]").forEach(function(b){
    b.addEventListener("click", function(){ selectNode(b.getAttribute("data-connect"), true); });
  });
  var ct = byId("orbitDetail").querySelector("[data-codetoggle]");
  if(ct && sn){
    ct.addEventListener("click", function(){
      var p = byId("orbitDetail").querySelector("[data-codepanel]");
      var open = p.hidden;
      p.hidden = !open;
      ct.setAttribute("aria-expanded", open ? "true" : "false");
      ct.textContent = (open ? "Hide code — " : "Show code — ") + sn.fn;
    });
  }
}
function selectNode(id, scroll){
  if(!nodeByIdMap[id]) return;
  orbitSelected = id;
  renderOrbit(); renderOrbitList(); renderOrbitDetail();
  if(scroll){
    var d = byId("orbitDetail");
    if(d && d.scrollIntoView) d.scrollIntoView({ block:"nearest", behavior:"smooth" });
  }
}
function applyOrbitFilter(){
  renderOrbit(); renderOrbitList(); renderOrbitChips();
}
byId("orbitSearch").addEventListener("input", applyOrbitFilter);
document.querySelectorAll("[data-ofilter]").forEach(function(b){
  b.addEventListener("click", function(){
    orbitFilter = b.getAttribute("data-ofilter");
    document.querySelectorAll("[data-ofilter]").forEach(function(x){ x.classList.toggle("active", x===b); });
    applyOrbitFilter();
  });
});
