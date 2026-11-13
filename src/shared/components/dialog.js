/* Accessible dialogs for Call, Email and Log activity.
   - The rest of the page is made inert while a dialog is open, and Tab cycles inside it.
   - Escape, the close button, Cancel and a backdrop click all mean Cancel: nothing is saved,
     and the dialog's onDismiss keeps any unsent draft.
   - Focus returns to the control that opened the dialog, or to the next task after a save. */
var DIALOGS = {};      // overlayId -> { onDismiss }
var openDialogId = null, dialogOpener = null;

function focusables(root){
  return Array.prototype.filter.call(
    root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    function(el){ return !el.disabled && !el.hidden && el.offsetParent !== null; });
}
function setBackgroundInert(on, keepId){
  Array.prototype.forEach.call(document.body.children, function(el){
    if(el.id === keepId || el.id === "liveRegion" || el.tagName === "SCRIPT") return;
    if(on){ el.setAttribute("inert", ""); } else { el.removeAttribute("inert"); }
  });
}
function openDialog(overlayId, firstFocusId){
  if(openDialogId) return;
  var ov = byId(overlayId);
  dialogOpener = document.activeElement;
  openDialogId = overlayId;
  ov.classList.add("open");
  setBackgroundInert(true, overlayId);
  var first = firstFocusId ? byId(firstFocusId) : focusables(ov)[0];
  if(first) first.focus();  /* synchronous, so keys typed right after opening land in the field */
}
/* afterSave: the opener may be gone (its row left the queue), so focus the next task. */
function closeDialog(overlayId, afterSave){
  var ov = byId(overlayId);
  if(!ov.classList.contains("open")) return;
  ov.classList.remove("open");
  /* For a moment after closing, an invisible overlay absorbs clicks, so the second click of a
     double-clicked Save cannot land on the button underneath (another deal's Call, say). */
  ov.classList.add("closing");
  setTimeout(function(){ ov.classList.remove("closing"); }, 400);
  setBackgroundInert(false);
  openDialogId = null;
  var target = dialogOpener;
  if(afterSave || !target || !document.contains(target) || target.offsetParent === null){
    target = document.querySelector("#todoList .qrow.selected [data-select]") ||
             document.querySelector("#todoList [data-select]") ||
             byId(currentView === "detail" ? "detailName" : "queueTitle");
  }
  dialogOpener = null;
  if(target && target.focus) target.focus();
}
function dismissDialog(overlayId){
  var cfg = DIALOGS[overlayId];
  if(cfg && cfg.onDismiss) cfg.onDismiss();
  closeDialog(overlayId, false);
}
function registerDialog(overlayId, cfg){
  DIALOGS[overlayId] = cfg;
  var ov = byId(overlayId);
  ov.querySelectorAll("[data-close]").forEach(function(b){
    b.addEventListener("click", function(){ dismissDialog(overlayId); });
  });
  ov.addEventListener("mousedown", function(e){ if(e.target === ov) dismissDialog(overlayId); });
}
document.addEventListener("keydown", function(e){
  if(!openDialogId) return;
  var ov = byId(openDialogId);
  if(e.key === "Escape"){ e.preventDefault(); dismissDialog(openDialogId); return; }
  if(e.key === "Tab"){
    var f = focusables(ov); if(!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});

/* Field validation helpers shared by the three forms. */
function setFieldError(inputId, errId, msg){
  var input = byId(inputId), err = byId(errId);
  if(msg){ err.textContent = msg; err.hidden = false; input.setAttribute("aria-invalid", "true"); }
  else { err.textContent = ""; err.hidden = true; input.removeAttribute("aria-invalid"); }
}
function clearFieldErrors(root){
  root.querySelectorAll(".field-error").forEach(function(e){ e.hidden = true; e.textContent = ""; });
  root.querySelectorAll("[aria-invalid]").forEach(function(e){ e.removeAttribute("aria-invalid"); });
}
function draftFor(id){ if(!drafts[id]) drafts[id] = {}; return drafts[id]; }
