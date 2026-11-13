/* Toast and screen-reader live region markup. */
document.body.insertAdjacentHTML("beforeend", `
<!-- Toast -->
<div class="toast" id="toast" aria-hidden="true">
  <span id="toastText"></span>
  <button type="button" id="toastUndo">Undo</button>
</div>
<div id="liveRegion" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
`);
