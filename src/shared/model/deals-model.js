/* Calculations over the data: find a deal, count done deals, time stamp, join session and seeded activity. */
function dealById(id){ for(var i=0;i<DEALS.length;i++){ if(DEALS[i].id===id) return DEALS[i]; } return null; }
function doneCount(){ return Object.keys(done).length; }
function nowTime(){ var d=new Date(); var h=d.getHours(); var m=d.getMinutes(); var ap=h>=12?"PM":"AM"; h=h%12||12; return h+":"+(m<10?"0":"")+m+" "+ap; }

function allActivity(){ return feed.concat(PAST); }
