/* Log activity: completes the deal straight away, with no panel. */
function logActivity(id){
  var d = dealById(id);
  completeDeal(id, "log", "Logged activity", "Logged activity — " + d.contact + ", " + d.company, d.next);
}
