/* render(): redraws every list after any change. */
function render(){
  renderStepper(); renderTodo(); renderUpdated(); renderFeed(); renderHistory();
  if(detailId) renderDetailActivity();
  byId("navCount").textContent = DEALS.length - doneCount();
}
