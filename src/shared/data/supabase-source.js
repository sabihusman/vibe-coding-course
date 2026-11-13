/* Supabase data source: loads deals and activities, and saves what happens in the tool.
   Talks to Supabase's REST and Auth endpoints with fetch; no library needed.
   The project URL and public (anon) key come at runtime from /api/supabase-config,
   which reads Vercel environment variables. Nothing secret is in this repo.
   With no config (opening index.html from disk, or env vars not set), the app keeps
   using the in-page sample data, exactly as before.
   Call and Email stay simulated: only what happened in the tool is stored. */
var SB = { cfg: null, session: null, connected: false, loading: null };
var SB_SESSION_KEY = "crm-companion-supabase-session";
var SB_SUMMARY = { email: "Email sent", log: "Logged activity" };

function sbTodayISO(){ var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); }
function sbDateLabel(iso){
  var p = iso.split("-"), d = new Date(+p[0], +p[1]-1, +p[2]);
  return d.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
}
function sbReadSession(){ try { return JSON.parse(localStorage.getItem(SB_SESSION_KEY) || "null"); } catch(e){ return null; } }
function sbWriteSession(s){ SB.session = s; try { localStorage.setItem(SB_SESSION_KEY, JSON.stringify(s)); } catch(e){} }

function sbGetConfig(){
  if(window.CRM_SUPABASE_CONFIG) return Promise.resolve(window.CRM_SUPABASE_CONFIG);
  if(location.protocol === "file:") return Promise.resolve(null);
  return fetch("/api/supabase-config", { cache: "no-store" })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(c){ return c && c.url && c.anonKey ? c : null; })
    .catch(function(){ return null; });
}

function sbAuth(path, body){
  return fetch(SB.cfg.url + "/auth/v1/" + path, {
    method: "POST",
    headers: { "apikey": SB.cfg.anonKey, "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  }).then(function(r){ return r.json().then(function(j){ if(!r.ok) throw new Error(j.msg || j.error_description || ("Auth " + r.status)); return j; }); });
}
function sbKeepSession(j){
  sbWriteSession({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || (Math.floor(Date.now()/1000) + (j.expires_in || 3600)), user_id: j.user && j.user.id });
}
/* One rep per browser: anonymous sign-in on first visit, then refresh the same session. */
function sbEnsureSession(){
  var s = SB.session || sbReadSession();
  var now = Math.floor(Date.now()/1000);
  if(s && s.access_token && s.expires_at - 60 > now){ SB.session = s; return Promise.resolve(s); }
  var p = (s && s.refresh_token)
    ? sbAuth("token?grant_type=refresh_token", { refresh_token: s.refresh_token }).catch(function(){ return sbAuth("signup", {}); })
    : sbAuth("signup", {});
  return p.then(function(j){ sbKeepSession(j); return SB.session; });
}

function sbRest(path, opts){
  opts = opts || {};
  return sbEnsureSession().then(function(s){
    return fetch(SB.cfg.url + "/rest/v1/" + path, {
      method: opts.method || "GET",
      headers: { "apikey": SB.cfg.anonKey, "Authorization": "Bearer " + s.access_token, "Content-Type": "application/json", "Prefer": opts.prefer || "return=representation" },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
  }).then(function(r){
    if(!r.ok) return r.text().then(function(t){ throw new Error("Supabase " + r.status + ": " + t); });
    return r.status === 204 ? null : r.text().then(function(t){ return t ? JSON.parse(t) : null; });
  });
}

/* Load the rep's deals, activities and follow-up status into the app's arrays. */
function sbLoadAll(){
  return sbRest("rpc/seed_my_sample_data", { method: "POST", body: {} })
    .then(function(){
      return Promise.all([
        sbRest("deals?select=*&order=arr.desc"),
        sbRest("activities?select=*&order=created_at.desc"),
        sbRest("follow_ups?select=*")
      ]);
    })
    .then(function(res){
      var deals = res[0], acts = res[1], fups = res[2], today = sbTodayISO();
      DEALS.length = 0;
      deals.forEach(function(d){
        DEALS.push({ id: d.id, contact: d.contact, company: d.company, arr: d.arr, arrLabel: "$" + d.arr + "k",
                     due: d.due, overdue: /^Overdue/.test(d.due), next: d.next_step });
      });
      PAST.length = 0; feed.length = 0;
      acts.forEach(function(a){
        var row = { dealId: a.deal_id, via: a.type, title: a.title, detail: a.detail, time: a.time, rowId: a.id };
        if(a.attempted){ row.attempt = true; }
        if(a.date === today){ row.date = "Today"; feed.push(row); }
        else { row.date = sbDateLabel(a.date); PAST.push(row); }
      });
      Object.keys(done).forEach(function(k){ delete done[k]; });
      fups.forEach(function(f){
        if(f.status !== "updated_today") return;
        var last = acts.find(function(a){ return a.deal_id === f.deal_id && !a.attempted; });
        var via = last ? last.type : "log";
        var summary = SB_SUMMARY[via] || "Call logged";
        if(via === "call" && last){
          var outcome = last.title.split(" · ").pop();
          var dur = (last.detail.match(/Duration (\d\d:\d\d)/) || [])[1];
          summary = "Call · " + outcome + (dur ? " · " + dur : "");
        }
        done[f.deal_id] = { via: via, summary: summary };
      });
      undoStack = Object.keys(done);
      SB.connected = true;
      sbShowSavedLabels();
    });
}

/* The page's labels say "resets on reload", which is true without Supabase.
   Once the rep's data has loaded from Supabase, say what really happens instead. */
function sbShowSavedLabels(){
  document.querySelectorAll(".sample-pill").forEach(function(pill){
    var text = pill.lastChild;
    if(text && text.nodeType === 3) text.textContent = " Sample data only — saved for this browser";
  });
  var box = document.querySelector(".samplebox p");
  if(box) box.textContent = "All names, deals and amounts on this page are sample data. Your changes are saved for this browser, so they survive a reload.";
}

function sbWarn(what, err){ if(window.console) console.warn("CRM Companion: could not save " + what + " to Supabase.", err); }

function sbSaveActivity(entry, attempted){
  return sbRest("activities", { method: "POST", body: {
    deal_id: entry.dealId, type: entry.via, title: entry.title, detail: entry.detail || "",
    date: sbTodayISO(), time: entry.time, attempted: !!attempted
  }}).then(function(rows){ if(rows && rows[0]) entry.rowId = rows[0].id; });
}
function sbSetStatus(dealId, status){
  return sbRest("follow_ups?deal_id=eq." + encodeURIComponent(dealId), { method: "PATCH", prefer: "return=minimal",
    body: { status: status, updated_at: new Date().toISOString() } });
}

/* Wrap the model functions so each change is also saved. The screens are unchanged. */
function sbWireWrites(){
  var baseComplete = completeDeal, baseAttempt = addAttempt, baseUndo = undoDeal;
  completeDeal = function(id){
    baseComplete.apply(null, arguments);
    if(!SB.connected) return;
    var entry = feed[0];
    sbSaveActivity(entry, false).then(function(){ return sbSetStatus(id, "updated_today"); }).catch(function(e){ sbWarn("the activity", e); });
  };
  addAttempt = function(){
    baseAttempt.apply(null, arguments);
    if(!SB.connected) return;
    sbSaveActivity(feed[0], true).catch(function(e){ sbWarn("the attempt", e); });
  };
  undoDeal = function(id){
    var entry = feed.find(function(f){ return f.dealId === id && !f.attempt; });
    baseUndo.apply(null, arguments);
    if(!SB.connected) return;
    var del = entry && entry.rowId ? sbRest("activities?id=eq." + entry.rowId, { method: "DELETE", prefer: "return=minimal" }) : Promise.resolve();
    del.then(function(){ return sbSetStatus(id, "open"); }).catch(function(e){ sbWarn("the undo", e); });
  };
}

/* In Supabase mode, Loading (and Retry) re-reads the data instead of waiting on a timer. */
function sbWireLoading(){
  var baseSetFollowups = setFollowupsState;
  setFollowupsState = function(state){
    if(state !== "loading"){ baseSetFollowups(state); return; }
    followupsState = "loading"; syncDemo("followupsDemo", "data-fstate", "loading"); renderTodo();
    clearTimeout(followupsTimer);
    sbLoadAll().then(function(){
      followupsState = "ready"; syncDemo("followupsDemo", "data-fstate", "ready"); render();
    }).catch(function(e){
      if(window.console) console.warn("CRM Companion: could not load from Supabase.", e);
      baseSetFollowups("error");
    });
  };
}

/* Called by boot.js. Resolves true when Supabase is in use, false for in-page sample data. */
function sbStart(){
  return sbGetConfig().then(function(cfg){
    if(!cfg) return false;
    SB.cfg = { url: cfg.url.replace(/\/$/, ""), anonKey: cfg.anonKey };
    sbWireWrites();
    sbWireLoading();
    return true;
  });
}
