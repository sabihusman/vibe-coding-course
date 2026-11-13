/* Toast markup.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.body.insertAdjacentHTML("beforeend", `
<!-- Toast -->
<div class="toast" id="toast" role="status" aria-hidden="true">
  <span id="toastText"></span>
  <button id="toastUndo">Undo</button>
</div>

`);
