/* render(): redraws every list after any change. */
function render(){
  renderProgress(); renderTodo(); renderUpdated(); renderHistory();
  if(detailId) renderDetailActivity();
  byId("navCount").textContent = String(DEALS.length - doneCount());
}
