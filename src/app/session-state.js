/* Session state: current view, list states, done set, feed, Undo stack, queue sort and selection,
   unsent drafts. Held in memory; with Supabase configured, supabase-source.js loads the done set
   and activity on start and saves each change. */
var currentView = "today";  // "today" | "detail" | "history" | "problem" | "admin"
var detailId = null;        // deal shown on Deal Detail
var followupsState = "loading"; // loading | ready | empty | error
var historyState = "ready";     // loading | ready | empty | error
var followupsTimer = null;
var historyTimer = null;

var done = {};       // id -> {via, summary}
var feed = [];       // newest first: {dealId, via, title, detail, date, time}
var undoStack = [];  // ids of saved updates, for Undo
var currentId = null;  // deal the open dialog is for
var toastTimer = null;

var sortMode = "arr";   // "arr" (Highest ARR, default) | "overdue" (Overdue first)
var selectedId = null;  // deal shown in the context panel; selecting never changes data
var drafts = {};        // id -> { call:{note,outcome}, email:{subject,body}, log:{note} } — unsent edits survive a dismissal
