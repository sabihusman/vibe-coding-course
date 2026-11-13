/* Queue order. Highest ARR is the default. Overdue first puts the most days overdue on top,
   then the larger ARR. Pure functions: they never change the deals. */
function daysOverdue(d){
  var m = /^Overdue (\d+) days?$/.exec(d.due || "");
  return m ? Number(m[1]) : 0;
}
function sortDeals(list, mode){
  var copy = list.slice();
  if(mode === "overdue"){
    copy.sort(function(a, b){ return (daysOverdue(b) - daysOverdue(a)) || (b.arr - a.arr); });
  } else {
    copy.sort(function(a, b){ return b.arr - a.arr; });
  }
  return copy;
}
function pendingDeals(){
  return sortDeals(DEALS.filter(function(d){ return !done[d.id]; }), sortMode);
}
function overdueCount(){ return DEALS.filter(function(d){ return daysOverdue(d) > 0; }).length; }
function totalArr(){ return DEALS.reduce(function(s, d){ return s + d.arr; }, 0); }
