/* Session state: current view, list states, done set, feed, Undo stack, panel state. In memory only. */
var currentView = "today";  // "today" | "detail" | "history"
var detailId = null;        // deal shown on Deal Detail
var followupsState = "loading"; // loading | ready | empty | error
var historyState = "ready";     // loading | ready | empty | error
var followupsTimer = null;
var historyTimer = null;

var done = {};       // id -> {via, detail}
var feed = [];       // newest first: {dealId, via, title, detail, time}
var undoStack = []; // action stack for Undo
var currentId = null;
var toastTimer = null;
var attemptSeq = 0;
var emailInitialSubject = "";
var emailInitialBody = "";
