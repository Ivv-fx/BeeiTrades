import {
  firebaseConfigured,
  finishRedirectSignIn,
  loadWorkspace,
  saveWorkspace,
  signInWithGoogle,
  signOutUser,
  subscribeToAuth,
} from "./firebase-client.js";

const SVG = {
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>',
  bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4V4.8Z"></path></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7V5Z" fill="currentColor" stroke="none"></path></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>',
};

const lessonData = [
  { id: "prepare-session", title: "A Calm Start to Your Market Session", category: "Preparation", length: "12 min", type: "Free", description: "Build a repeatable pre-session routine and identify the questions that matter before the day begins.", days: "2 days ago", progress: 35 },
  { id: "chart-context", title: "Finding Context Across Timeframes", category: "Market structure", length: "18 min", type: "Free", description: "Practice zooming out, mapping a scenario, and keeping a chart readable without overloading it.", days: "4 days ago", progress: 0 },
  { id: "risk-basics", title: "Risk, Position Size, and Staying in the Game", category: "Risk management", length: "16 min", type: "Free", description: "An introduction to planning exposure and thinking through what you can afford to lose.", days: "1 week ago", progress: 0 },
  { id: "review-routine", title: "A Useful Weekly Review", category: "Reflection", length: "9 min", type: "Free", description: "Turn notes from the week into a short list of useful questions and a manageable next step.", days: "1 week ago", progress: 0 },
  { id: "levels-map", title: "Mapping Levels Without Cluttering the Chart", category: "Market structure", length: "21 min", type: "Free", description: "A practical exercise in choosing a small number of reference points and explaining why they matter.", days: "2 weeks ago", progress: 0 },
  { id: "patience", title: "Patience Is a Practice", category: "Mindset", length: "14 min", type: "Free", description: "Explore practical ways to pause, follow a written plan, and reflect on rushed decisions.", days: "2 weeks ago", progress: 0 },
  { id: "study-blueprint", title: "Create a Personal Study Blueprint", category: "Preparation", length: "11 min", type: "Free", description: "Set a realistic learning goal and organize a short, repeatable study routine.", days: "3 weeks ago", progress: 0 },
  { id: "market-scenarios", title: "Writing More Than One Market Scenario", category: "Market structure", length: "17 min", type: "Free", description: "Learn to describe alternative outcomes and what evidence would support each view.", days: "3 weeks ago", progress: 0 },
  { id: "journal", title: "Keep a Journal That You Will Actually Use", category: "Reflection", length: "10 min", type: "Free", description: "Design a compact decision journal for observations, intentions, and follow-up questions.", days: "1 month ago", progress: 0 },
  { id: "session-framework", title: "Build a Complete Session Framework", category: "Guided paths", length: "22 min", type: "Premium", description: "Bring preparation, context, and review together in a guided learning exercise.", days: "5 days ago", progress: 0 },
  { id: "volatility", title: "Understanding Volatility and Quiet Sessions", category: "Market structure", length: "25 min", type: "Premium", description: "Compare changing market conditions and consider how they might affect your plan.", days: "6 days ago", progress: 0 },
  { id: "scenario-practice", title: "Scenario Planning: A Guided Walkthrough", category: "Guided paths", length: "19 min", type: "Premium", description: "Work through a hypothetical chart study from first observation to written review.", days: "1 week ago", progress: 0 },
  { id: "risk-review", title: "Reviewing Decisions Through a Risk Lens", category: "Risk management", length: "24 min", type: "Premium", description: "Use reflective prompts to consider uncertainty, exposure, and what a good decision means.", days: "2 weeks ago", progress: 0 },
  { id: "routine-lab", title: "The Weekly Routine Lab", category: "Preparation", length: "30 min", type: "Premium", description: "Design, test, and refine a routine that fits your time and learning goals.", days: "2 weeks ago", progress: 0 },
  { id: "data-notes", title: "Make Your Notes More Useful", category: "Reflection", length: "16 min", type: "Premium", description: "Practice turning observations into focused questions for future study.", days: "3 weeks ago", progress: 0 },
  { id: "case-study", title: "Market Case Study: A Neutral Read", category: "Market structure", length: "28 min", type: "Premium", description: "Examine a fictional session and document multiple possible interpretations.", days: "1 month ago", progress: 0 },
  { id: "psychology", title: "Recognizing Your Decision Patterns", category: "Mindset", length: "20 min", type: "Premium", description: "Reflect on habits and conditions that shape the way you approach uncertain choices.", days: "1 month ago", progress: 0 },
  { id: "plan-builder", title: "Turn Observations into a Study Plan", category: "Guided paths", length: "13 min", type: "Premium", description: "Use a structured worksheet to choose the next idea you want to understand.", days: "1 month ago", progress: 0 },
];

const recordingData = [
  { id: "rec-oct", title: "October Study Room: Reading a Range", length: "58:14", date: "Oct 8, 2026", month: "October 2026", tier: "Member", status: "Not started", category: "Weekly study" },
  { id: "rec-sep-1", title: "September Review: Questions Worth Keeping", length: "46:30", date: "Sep 26, 2026", month: "September 2026", tier: "Open", status: "Not started", category: "Community review" },
  { id: "rec-sep-2", title: "Reading a Quiet Market", length: "1:04:28", date: "Sep 17, 2026", month: "September 2026", tier: "Member", status: "In progress", category: "Market study" },
  { id: "rec-aug-1", title: "Notes from the Weekly Study Session", length: "52:03", date: "Aug 28, 2026", month: "August 2026", tier: "Member", status: "Not started", category: "Weekly study" },
  { id: "rec-aug-2", title: "Building a More Useful Checklist", length: "39:41", date: "Aug 12, 2026", month: "August 2026", tier: "Member", status: "Not started", category: "Preparation" },
  { id: "rec-jul", title: "Open Q&A: Learning at Your Own Pace", length: "44:12", date: "Jul 22, 2026", month: "July 2026", tier: "Open", status: "Not started", category: "Community Q&A" },
];

const initial = {
  saved: [],
  folders: [],
  notes: [],
  completed: [],
  reminders: [],
  progress: {},
  notificationsRead: false,
  theme: "dark",
  settingsTab: "Profile",
  preferences: { displayName: "Alex Morgan", region: "", weekly: true, completedVisible: true, announcements: true, sessions: true, newContent: true, experience: "Exploring", markets: "Not set", preferredHours: "Not set" },
};
let state = createInitialState();
let activeDialog = "";
let playerTimer = null;
let isPlaying = false;
let firebaseUser = null;
let authStatus = firebaseConfigured ? "loading" : "unconfigured";
let authError = "";
let workspaceSaveTimer = null;

function createInitialState() {
  return {
    ...initial,
    saved: [],
    folders: [],
    notes: [],
    completed: [],
    reminders: [],
    progress: {},
    preferences: { ...initial.preferences },
  };
}

function persist() {
  if (!firebaseUser || authStatus !== "signed-in") return;
  clearTimeout(workspaceSaveTimer);
  const uid = firebaseUser.uid;
  const workspace = JSON.parse(JSON.stringify(state));
  workspaceSaveTimer = setTimeout(async () => {
    try {
      await saveWorkspace(uid, workspace);
    } catch (error) {
      console.error("Could not save workspace data to Firebase:", error);
      toast("Your changes could not be saved to your account. Check your connection and Firestore rules.");
    }
  }, 400);
}

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const currentRoute = () => location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
const getParam = (key) => new URLSearchParams(location.hash.split("?")[1] || "").get(key);
const navigate = (route) => {
  location.hash = `/${route}`;
  document.querySelector("#sidebar").classList.remove("open");
};
const formatDate = (date) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
function toast(message) {
  const region = document.querySelector(".toast-region");
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  region.append(item);
  setTimeout(() => item.remove(), 2700);
}
function titleFor(route) {
  return ({ home: "Home", learn: "Learn", videos: "Recordings", saved: "Saved", sessions: "Live sessions", perks: "Member perks", lesson: "Lesson", category: "Learning path", membership: "Membership", settings: "Settings", upgrade: "Membership" })[route] || "Home";
}
function activeNav(route) {
  document.querySelectorAll("[data-mobile-route]").forEach((link) => link.classList.toggle("active", link.dataset.mobileRoute === route || (route === "lesson" || route === "category") && link.dataset.mobileRoute === "learn" || route === "upgrade" && link.dataset.mobileRoute === "home"));
  document.querySelector("#mobile-title").textContent = titleFor(route);
}
function header(title) {
  return `<div class="page-heading"><div><div class="overline">NAMOH TRADES LEARNING SPACE</div><h1>${title}</h1></div></div>`;
}
function pageIntro(title, description, eyebrow = "YOUR LEARNING SPACE") {
  return `<section class="intro"><div class="overline">${eyebrow}</div><h1>${title}</h1><p>${description}</p></section>`;
}
function artThumb(item, i = 0) {
  const palettes = ["thumb-blue", "thumb-violet", "thumb-teal", "thumb-amber", "thumb-rose"];
  const bars = Array.from({ length: 19 }, (_, n) => {
    const h = 15 + ((n * 29 + i * 23) % 64);
    const up = (n + i) % 3 !== 0;
    return `<i class="${up ? "candle-up" : "candle-down"}" style="--h:${h}%;--left:${n * 5.25}%"></i>`;
  }).join("");
  return `<div class="thumb-art ${palettes[i % palettes.length]}"><div class="thumb-grid"></div><div class="thumb-mark">${bars}</div><span class="thumb-caption">${escapeHtml(item.category || "FIELD STUDY")}</span><span class="thumb-duration">${escapeHtml(item.length)}</span></div>`;
}
function lessonCard(item, i = 0) {
  const saved = state.saved.some((entry) => entry.id === item.id);
  const savedFolder = state.saved.find((entry) => entry.id === item.id)?.folderId || "";
  const locked = item.type === "Premium";
  return `<article class="content-card lesson-card">
    <div class="card-media">${artThumb(item, i)}
      ${locked ? `<span class="premium-pill">${SVG.lock} MEMBER</span>` : `<span class="free-pill">OPEN</span>`}
      <button class="bookmark-button ${saved ? "saved" : ""}" aria-label="${saved ? "Remove from" : "Save to"} saved items" data-action="save" data-id="${item.id}">${SVG.bookmark}</button>
    </div>
    <div class="card-body"><div class="card-meta"><span>${escapeHtml(item.category)}</span><i></i><span>${escapeHtml(item.length)}</span></div>
      <button class="card-title" data-action="${locked ? "upgrade" : "lesson"}" data-id="${item.id}">${escapeHtml(item.title)}</button>
      <div class="card-foot"><span>${escapeHtml(item.days || item.date || "Study at your pace")}</span><span class="progress-state">${item.progress ? `${item.progress}% studied` : "Not started"}</span></div>
      ${saved ? `<label class="card-folder-picker">Move to <select data-folder-item="${item.id}" aria-label="Move ${escapeHtml(item.title)} to a folder"><option value="">No folder</option>${state.folders.map((folder) => `<option value="${folder.id}" ${folder.id === savedFolder ? "selected" : ""}>${escapeHtml(folder.name)}</option>`).join("")}</select></label>` : ""}
    </div>
  </article>`;
}
function recordingCard(item, i = 0) {
  const saved = state.saved.some((entry) => entry.id === item.id);
  const savedFolder = state.saved.find((entry) => entry.id === item.id)?.folderId || "";
  return `<article class="content-card lesson-card"><div class="card-media">${artThumb(item, i + 2)}
    ${item.tier === "Member" ? `<span class="premium-pill">${SVG.lock} MEMBER</span>` : `<span class="free-pill">OPEN</span>`}
    <button class="bookmark-button ${saved ? "saved" : ""}" aria-label="${saved ? "Remove from" : "Save to"} saved items" data-action="save" data-id="${item.id}">${SVG.bookmark}</button>
  </div><div class="card-body"><div class="card-meta"><span>${escapeHtml(item.category)}</span><i></i><span>${escapeHtml(item.date)}</span></div>
    <button class="card-title" data-action="${item.tier === "Member" ? "upgrade" : "recording"}" data-id="${item.id}">${escapeHtml(item.title)}</button>
    <div class="card-foot"><span>${escapeHtml(item.length)}</span><span class="progress-state">${escapeHtml(item.status)}</span></div>
    ${saved ? `<label class="card-folder-picker">Move to <select data-folder-item="${item.id}" aria-label="Move ${escapeHtml(item.title)} to a folder"><option value="">No folder</option>${state.folders.map((folder) => `<option value="${folder.id}" ${folder.id === savedFolder ? "selected" : ""}>${escapeHtml(folder.name)}</option>`).join("")}</select></label>` : ""}
  </div></article>`;
}
function sectionHeader(title, linkRoute, linkText = "Browse all") {
  return `<div class="section-head"><div><h2>${title}</h2><p>Pick up where curiosity takes you.</p></div><a class="quiet-link" href="#/${linkRoute}">${linkText} <span>↗</span></a></div>`;
}
function homePage() {
  const done = state.completed.length;
  const featured = lessonData[0];
  return `${header("Home")}
  <section class="welcome-row"><div><div class="overline"><span class="online-dot"></span> YOUR STUDY DESK</div><h1>Welcome back, ${escapeHtml(state.preferences.displayName.split(" ")[0] || "learner")}</h1><p>Make a little room for learning today.</p></div><button class="button button-outline" data-action="search">${SVG.search} Find something to study</button></section>
  <section class="hero-card"><div class="hero-content"><div class="hero-chip">A SHORT STUDY FOR TODAY</div><h2>${escapeHtml(featured.title)}</h2><p>${escapeHtml(featured.description)}</p><div class="hero-meta"><span>Open lesson</span><i></i><span>${featured.length}</span><i></i><span>${featured.category}</span></div><button class="button button-primary" data-action="lesson" data-id="${featured.id}">${SVG.play} Continue learning</button></div><div class="hero-chart" aria-hidden="true"><div class="hero-chart-lines"></div><div class="hero-chart-line"></div><div class="hero-chart-label">MARKET STUDY<br><b>Observe · Plan · Review</b></div></div></section>
  <div class="progress-overview"><div class="progress-description"><span class="progress-icon">↗</span><span><b>Your learning rhythm</b><small>${done} lessons marked complete · Start at your own pace</small></span></div><div class="progress-count"><span>${done}</span><small>completed</small></div><div class="progress-bar"><i style="width:${Math.min(100, done * 7)}%"></i></div></div>
  <section class="content-section">${sectionHeader("Continue learning", "learn")}<div class="card-grid">${lessonCard(lessonData[1], 1)}${lessonCard(lessonData[2], 2)}${lessonCard(lessonData[3], 3)}</div></section>
  <section class="content-section">${sectionHeader("Recently added", "learn")}<div class="card-grid">${lessonCard(lessonData[4], 4)}${lessonCard(lessonData[5], 0)}${lessonCard(lessonData[6], 1)}</div></section>
  <section class="study-callout"><span class="callout-icon">✳</span><div><b>A practice, not a prediction.</b><p>Use this space to study ideas and reflect. Nothing here is investment advice or a promise of financial results.</p></div><a href="#/settings">Your preferences ↗</a></section>`;
}
function filterBar(kind) {
  return `<div class="filter-bar">
    <label class="library-search">${SVG.search}<input type="search" placeholder="${kind === "videos" ? "Search recordings…" : "Search lessons…"}" data-library-search value="${escapeHtml(appFilters.query)}"></label>
    ${kind === "learn" ? `<select data-filter="category" aria-label="Filter by category"><option value="All">All topics</option>${["Preparation", "Market structure", "Risk management", "Mindset", "Reflection", "Guided paths"].map((x) => `<option ${appFilters.category === x ? "selected" : ""}>${x}</option>`).join("")}</select>` : ""}
    <select data-filter="status" aria-label="Filter by status"><option value="Any">Any progress</option><option ${appFilters.status === "Not started" ? "selected" : ""}>Not started</option><option ${appFilters.status === "In progress" ? "selected" : ""}>In progress</option><option ${appFilters.status === "Complete" ? "selected" : ""}>Complete</option></select>
    <select data-filter="sort" aria-label="Sort items"><option ${appFilters.sort === "Newest" ? "selected" : ""}>Newest</option><option ${appFilters.sort === "Title" ? "selected" : ""}>Title</option><option ${appFilters.sort === "Length" ? "selected" : ""}>Length</option></select>
  </div>`;
}
let appFilters = { query: "", category: "All", status: "Any", sort: "Newest" };
let selectedTier = "All";
function filteredItems(items) {
  let filtered = items.filter((item) => {
    const searchText = `${item.title} ${item.category} ${item.description || ""}`.toLowerCase();
    const tier = item.type || (item.tier === "Member" ? "Premium" : "Free");
    const status = state.completed.includes(item.id) ? "Complete" : item.progress ? "In progress" : item.status || "Not started";
    return (!appFilters.query || searchText.includes(appFilters.query.toLowerCase())) &&
      (selectedTier === "All" || tier === selectedTier) &&
      (appFilters.category === "All" || item.category === appFilters.category) &&
      (appFilters.status === "Any" || appFilters.status === status);
  });
  if (appFilters.sort === "Title") filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (appFilters.sort === "Length") filtered.sort((a, b) => durationSeconds(a.length) - durationSeconds(b.length));
  return filtered;
}
function durationSeconds(length = "") {
  if (length.includes("min")) return (Number.parseInt(length, 10) || 0) * 60;
  const parts = length.split(":").map((part) => Number(part) || 0);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + (parts[1] || 0);
}
function playerTimeAt(percentage, lessonId = getParam("id")) {
  const lesson = lessonData.find((item) => item.id === lessonId) || lessonData[0];
  const elapsed = Math.floor(durationSeconds(lesson.length) * percentage / 100);
  return `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
}
function tierTabs(items) {
  return `<div class="tabs" role="tablist" aria-label="Content access">${["All", "Free", "Premium"].map((tab) => `<button class="tab ${selectedTier === tab ? "selected" : ""}" role="tab" aria-selected="${selectedTier === tab}" data-tier="${tab}">${tab}<span>${tab === "All" ? items.length : items.filter((item) => (item.type || (item.tier === "Member" ? "Premium" : "Free")) === tab).length}</span></button>`).join("")}</div>`;
}
function learnPage() {
  const items = filteredItems(lessonData);
  return `${header("Learn")}${pageIntro("A library for curious minds", "Explore self-paced topics, build foundational understanding, and choose one useful question to take into your next study session.")}
    ${tierTabs(lessonData)}${filterBar("learn")}
    <div class="result-line"><span>${items.length} lessons</span><span>Content for education only</span></div>
    <section class="card-grid">${items.map((item, i) => lessonCard(item, i)).join("") || emptyState("No lessons match these filters.", "Try a different search or clear a filter.")}</section>
    <p class="risk-note">The learning library is educational. Trading and investing involve risk; no lesson can ensure a particular outcome.</p>`;
}
const months = [...new Set(recordingData.map((item) => item.month))];
let openMonths = new Set([months[0]]);
function videosPage() {
  const items = filteredItems(recordingData);
  return `${header("Recordings")}${pageIntro("A library of past study sessions", "Revisit community discussions and recorded study sessions whenever it suits your schedule.")}
    ${tierTabs(recordingData)}${filterBar("videos")}
    <div class="recording-months">${months.map((month) => {
      const monthItems = items.filter((item) => item.month === month);
      if (!monthItems.length) return "";
      const open = openMonths.has(month);
      return `<section class="month-section"><button class="month-toggle" data-action="month" data-month="${escapeHtml(month)}" aria-expanded="${open}"><span><b>${month}</b><small>${monthItems.length} recording${monthItems.length === 1 ? "" : "s"}</small></span><span>${open ? "⌃" : "⌄"}</span></button>${open ? `<div class="card-grid">${monthItems.map((item, i) => recordingCard(item, i)).join("")}</div>` : ""}</section>`;
    }).join("") || emptyState("No recordings found.", "Try changing your search or filters.")}</div>`;
}
function savedItems() {
  return state.saved.map((saved) => {
    const item = [...lessonData, ...recordingData].find((candidate) => candidate.id === saved.id);
    return item ? { ...item, folderId: saved.folderId, savedAt: saved.savedAt } : null;
  }).filter(Boolean);
}
let savedTab = "All";
let savedQuery = "";
function savedPage() {
  const activeFolder = getParam("folder");
  const items = savedItems().filter((item) => {
    const isLesson = lessonData.some((lesson) => lesson.id === item.id);
    const matchesTab = savedTab === "All" || savedTab === "Lessons" && isLesson || savedTab === "Videos" && !isLesson;
    return (!savedQuery || item.title.toLowerCase().includes(savedQuery.toLowerCase())) && (!activeFolder || item.folderId === activeFolder) && matchesTab;
  });
  return `${header("Saved")}${pageIntro("Your bookmarks and study notes", "Keep useful lessons, recordings, and personal notes together. Create folders to organize your own study queue.")}
    <div class="tabs" role="tablist" aria-label="Saved item type">${["All", "Lessons", "Videos", "Notes"].map((tab) => `<button class="tab ${savedTab === tab ? "selected" : ""}" data-saved-tab="${tab}" role="tab" aria-selected="${savedTab === tab}">${tab}<span>${tab === "Notes" ? state.notes.length : tab === "All" ? state.saved.length + state.notes.length : state.saved.filter((s) => tab === "Lessons" ? lessonData.some((l) => l.id === s.id) : recordingData.some((r) => r.id === s.id)).length}</span></button>`).join("")}</div>
    <div class="filter-bar"><label class="library-search">${SVG.search}<input type="search" placeholder="Search your saved items…" data-saved-search value="${escapeHtml(savedQuery)}"></label><button class="button button-outline" data-action="new-folder">＋ New folder</button></div>
    <section class="folder-section"><div class="section-head compact-head"><div><h2>Your folders</h2><p>Folders are private to your account.</p></div></div><div class="folder-grid"><button class="folder-tile new-folder-tile" data-action="new-folder"><span>＋</span><b>Create a folder</b><small>Organize your saved items</small></button>${state.folders.map((folder) => `<button class="folder-tile ${folder.id === getParam("folder") ? "folder-active" : ""}" data-action="folder" data-id="${folder.id}"><span>▱</span><b>${escapeHtml(folder.name)}</b><small>${state.saved.filter((entry) => entry.folderId === folder.id).length} items</small></button>`).join("")}</div></section>
    <section class="saved-results"><div class="section-head compact-head"><div><h2>${activeFolder ? escapeHtml(state.folders.find((folder) => folder.id === activeFolder)?.name || "Folder") : "All saved"}</h2><p>${items.length} bookmarked item${items.length === 1 ? "" : "s"} · ${state.notes.length} note${state.notes.length === 1 ? "" : "s"}</p></div>${activeFolder ? `<button class="text-button" data-action="clear-folder">View all</button>` : ""}</div>
      ${items.length ? `<div class="card-grid">${items.map((item, i) => item.type ? lessonCard(item, i) : recordingCard(item, i)).join("")}</div>` : `<div class="empty-state"><div class="empty-icon">▣</div><h3>${savedTab === "Notes" ? "Your lesson notes will appear here" : "Nothing saved here yet"}</h3><p>Use the bookmark on a lesson or recording to keep it close at hand.</p><a href="#/learn" class="button button-outline">Explore the library</a></div>`}
    </section>
    ${savedTab !== "Lessons" && savedTab !== "Videos" && state.notes.length ? `<section class="saved-notes"><div class="section-head compact-head"><div><h2>Recent notes</h2><p>Thoughts attached to a lesson timestamp.</p></div></div>${state.notes.slice().reverse().map((note) => `<article class="note-list-item"><div class="note-time">${note.time}</div><div><b>${escapeHtml(lessonData.find((lesson) => lesson.id === note.lessonId)?.title || "Study note")}</b><p>${escapeHtml(note.text)}</p></div></article>`).join("")}</section>` : ""}`;
}
function emptyState(title, body) {
  return `<div class="empty-state"><div class="empty-icon">⌕</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>`;
}
const sessionData = [
  { id: "session-1", name: "Open Study Hall", kind: "Open", day: "Wednesday", date: "Oct 14", time: "6:00 PM", duration: "60 min", host: "Northstar hosts" },
  { id: "session-2", name: "Chart Reading Workshop", kind: "Member", day: "Thursday", date: "Oct 15", time: "5:30 PM", duration: "75 min", host: "Study facilitators" },
  { id: "session-3", name: "Weekly Reflection Circle", kind: "Member", day: "Monday", date: "Oct 19", time: "7:00 PM", duration: "45 min", host: "Northstar hosts" },
];
let sessionTab = "All";
function sessionsPage() {
  const items = sessionData.filter((item) => (sessionTab === "All" || sessionTab === "My reminders" && state.reminders.includes(item.id) || sessionTab === "Free" && item.kind === "Open" || sessionTab === "Premium" && item.kind === "Member"));
  return `${header("Live sessions")}${pageIntro("Learn together, on your schedule", "See upcoming community study sessions and set a reminder for the ones you plan to join. Dates and times here are sample demo data.")}
    <div class="tabs" role="tablist">${["All", "Free", "Premium", "My reminders"].map((tab) => `<button class="tab ${sessionTab === tab ? "selected" : ""}" data-session-tab="${tab}" role="tab" aria-selected="${sessionTab === tab}">${tab}<span>${tab === "My reminders" ? state.reminders.length : tab === "All" ? sessionData.length : sessionData.filter((x) => tab === "Free" ? x.kind === "Open" : x.kind === "Member").length}</span></button>`).join("")}</div>
    <div class="section-head compact-head"><div><h2>Upcoming sessions</h2><p>Times shown in your local browser time zone</p></div></div>
    <div class="session-list">${items.map((session) => `<article class="session-card"><div class="session-date"><b>${session.date.split(" ")[1]}</b><span>${session.date.split(" ")[0].toUpperCase()}</span></div><div class="session-time">${session.time}<small>${session.duration}</small></div><div class="session-info"><h3>${session.name}</h3><p>${session.host} <i>·</i> ${session.day} <i>·</i> ${session.kind === "Open" ? "Open to all" : "Member session"}</p></div>${session.kind === "Member" ? `<button class="button button-outline" data-action="upgrade">See membership</button>` : `<button class="button ${state.reminders.includes(session.id) ? "button-confirmed" : "button-outline"}" data-action="reminder" data-id="${session.id}">${state.reminders.includes(session.id) ? "✓ Reminder set" : "♧ Remind me"}</button>`}</article>`).join("") || emptyState("No sessions in this view.", "Check back for new session announcements.")}</div>
    <div class="callout subtle-callout"><span>◷</span><p>Need a different time? Reminders are saved to your account, but this demo does not send push notifications.</p></div>`;
}
const perkData = [
  { company: "Summit Evaluation", offer: "20% off a starter evaluation", code: "NORTHSTAR20", tint: "perk-indigo" },
  { company: "ClearPath Markets", offer: "15% off eligible study accounts", code: "STUDY15", tint: "perk-green" },
  { company: "Harbor Funding", offer: "Save on select account plans", code: "FIELDNOTES", tint: "perk-amber" },
];
function perksPage() {
  return `${header("Member perks")}${pageIntro("Offers from our partners", "Browse sample partner offers. Always review a provider's own terms before making a purchase.", "COMMUNITY RESOURCES")}
    <div class="perks-notice"><span>ⓘ</span><p>Partner names and codes on this page are demonstration content, not real offers or endorsements.</p></div>
    <div class="perk-list">${perkData.map((item) => `<article class="perk-card"><div class="perk-badge ${item.tint}"><span>OFFER</span><b>Member<br>deal</b></div><div class="perk-main"><div class="card-meta"><span>PARTNER OFFER</span><i></i><span>DEMO</span></div><h2>${item.company}</h2><p>${item.offer}</p><div class="perk-actions"><button class="code-button" data-action="copy-code" data-code="${item.code}">${item.code} <span>▢</span></button><button class="button button-outline" data-action="copy-code" data-code="${item.code}">Copy sample code</button></div></div><div class="perk-valid">SAMPLE CONTENT<br>No real discount</div></article>`).join("")}</div>`;
}
function membershipPage() {
  return `${header("Membership")}${pageIntro("Choose how you want to learn", "Explore the learning format and features available in this demo. No payment or external checkout is connected.")}
    <div class="membership-hero"><div><span class="membership-tag">LEARN AT YOUR OWN PACE</span><h2>Make space for<br><span>the next question.</span></h2><p>Build understanding through organized lessons, guided study tools, and a community centered on learning.</p></div><div class="membership-orbit"><span>✳</span><i></i><b>STUDY<br>TOGETHER</b></div></div>
    <div class="membership-plans"><article class="plan"><span class="plan-type">START HERE</span><h3>Open library</h3><p>Explore introductory content and create a steady learning habit.</p><div class="plan-price">$0 <small>free</small></div><ul><li>✓ Introductory lessons</li><li>✓ Personal saved list</li><li>✓ Open study sessions</li></ul><button class="button button-outline" data-route-click="learn">Explore open lessons</button></article><article class="plan plan-highlight"><span class="plan-type">FULL LEARNING SPACE</span><h3>Study room</h3><p>Go deeper with complete pathways and facilitated learning sessions.</p><div class="plan-price">$39 <small>/ month · sample price</small></div><ul><li>✓ Complete learning pathways</li><li>✓ Personal notes and folders</li><li>✓ Member recordings</li><li>✓ Facilitated study sessions</li></ul><button class="button button-primary" data-action="sample-upgrade">See sample upgrade flow</button></article></div>
    <p class="legal-copy">This is a local UI demo. No real membership is sold here. Trading carries substantial risk, and educational resources cannot guarantee outcomes.</p>`;
}
function lessonPage(id) {
  const lesson = lessonData.find((item) => item.id === id) || lessonData[0];
  const complete = state.completed.includes(lesson.id);
  const lessonNotes = state.notes.filter((note) => note.lessonId === lesson.id);
  const saved = state.saved.some((entry) => entry.id === lesson.id);
  const progress = complete ? 100 : state.progress[lesson.id] ?? lesson.progress ?? 0;
  return `<div class="breadcrumbs"><a href="#/learn">Learn</a><span>/</span><b>${escapeHtml(lesson.title)}</b></div>
    <article class="lesson-detail"><div class="lesson-badges"><span class="free-pill">${lesson.type === "Free" ? "OPEN LESSON" : "MEMBER STUDY"}</span><span class="detail-category">${escapeHtml(lesson.category)}</span></div>
      <h1>${escapeHtml(lesson.title)}</h1><p class="lesson-description">${escapeHtml(lesson.description)}</p>
      <div class="lesson-info"><span>${lesson.length} lesson</span><i></i><span>Self-paced study</span><i></i><button class="detail-save ${saved ? "saved" : ""}" data-action="save" data-id="${lesson.id}">${SVG.bookmark} ${saved ? "Saved" : "Save lesson"}</button></div>
      <div class="player-shell"><div class="player-art">${artThumb(lesson, lesson.id.length % 5)}<div class="player-cover"><button class="play-large" data-action="play">${SVG.play}</button><span class="player-state">ILLUSTRATIVE STUDY PLAYER</span><p>Sample lesson interface<br>Video content not included</p></div><div class="player-controls"><button data-action="play">${SVG.play}</button><input aria-label="Lesson playback progress" type="range" min="0" max="100" value="${progress}" data-progress><span class="play-time">${progress}%</span><button data-action="player-fullscreen">⛶</button></div></div></div>
      <div class="lesson-actions"><button class="button button-primary" data-action="play">${progress ? "Continue lesson" : "Start lesson"} ${SVG.play}</button><button class="button button-outline" data-action="note-at">${SVG.bookmark} Add note at <span data-player-time>0:00</span></button><button class="button button-outline" data-action="share">↗ Share</button></div>
    </article>
    <div class="lesson-body"><article class="lesson-reading"><div class="overline">LEARNING NOTES</div><h2>A useful way to approach this topic</h2><p>This original sample lesson is a place to explore an idea carefully. Start by writing down what you notice, what you are unsure about, and which assumptions you want to test against more information.</p><div class="study-callout"><span class="callout-icon">✳</span><div><b>Pause and reflect</b><p>What would you need to observe before changing your current view? Write the question down before you move on.</p></div></div><h2>Build your own checklist</h2><p>A checklist can help you slow down and apply the same questions more than once. Keep it short, revise it when your understanding changes, and treat it as a learning aid rather than an instruction to act.</p><div class="worksheet"><span class="overline">PERSONAL STUDY PROMPT</span><ol><li>What did I observe directly?</li><li>What remains uncertain?</li><li>What would I like to learn next?</li></ol></div><h2>Take it into your journal</h2><p>There is no single correct response. Use your notes to track how your thinking develops over time. This material is for education and is not financial advice.</p></article>
    <aside class="lesson-notes-panel"><div class="note-panel-heading"><div><div class="overline">YOUR PRIVATE NOTES</div><h2>Add a note</h2></div><span class="note-marker" data-player-time>0:00</span></div><label class="note-input-wrap"><span>Linked to lesson timestamp</span><textarea data-note-input rows="4" placeholder="Write a thought, question, or observation…"></textarea></label><button class="button button-primary note-submit" data-action="save-note" disabled>Save note</button><div class="notes-list"><h3>Notes on this lesson <span>${lessonNotes.length}</span></h3>${lessonNotes.length ? lessonNotes.map((note) => `<article class="saved-note"><span>${note.time}</span><p>${escapeHtml(note.text)}</p></article>`).join("") : `<p class="notes-empty">Your saved notes will appear here.</p>`}</div></aside></div>
    <div class="completion-row"><span class="complete-icon">${complete ? "✓" : "○"}</span><div><b>${complete ? "Lesson marked complete" : "Finished studying?"}</b><small>${complete ? "You can revisit this lesson any time." : "Mark it complete to update your learning progress."}</small></div><button class="button ${complete ? "button-outline" : "button-primary"}" data-action="complete" data-id="${lesson.id}">${complete ? "Undo complete" : "Mark complete"}</button></div>
    <section class="content-section">${sectionHeader("Keep exploring", "learn")}<div class="card-grid">${lessonData.filter((item) => item.id !== lesson.id).slice(0, 3).map((item, i) => lessonCard(item, i)).join("")}</div></section>`;
}
function categoryPage(id) {
  const names = { foundation: "Market foundations", context: "Context and scenarios", planning: "Preparation and planning", reflection: "Review and reflection" };
  const name = names[id] || "Learning pathway";
  const matching = lessonData.filter((item) => item.type === "Premium");
  return `${header("Learn")}<div class="breadcrumbs"><a href="#/learn">Learn</a><span>/</span><b>${name}</b></div>${pageIntro(name, "A sample learning path that organizes ideas into a manageable sequence.")}
    <div class="path-progress"><div><span class="overline">YOUR PATH PROGRESS</span><b>0 of ${matching.length} topics explored</b></div><div class="progress-bar"><i></i></div></div>
    <div class="path-list">${matching.map((item, index) => `<button class="path-row" data-action="${item.type === "Free" ? "lesson" : "upgrade"}" data-id="${item.id}"><span class="path-number">${String(index + 1).padStart(2, "0")}</span><span class="path-content"><b>${item.title}</b><small>${item.category} · ${item.length}</small></span><span class="path-lock">${SVG.lock}</span><span>↗</span></button>`).join("")}</div>`;
}
function settingsPage() {
  const tabs = ["Profile", "Learning", "Membership", "Trading profile", "Notifications", "Security"];
  return `${header("Settings")}${pageIntro("Make the space yours", "Your workspace preferences are saved privately to your Firebase account.")}
    <div class="settings-layout"><nav class="settings-tabs" aria-label="Settings">${tabs.map((tab) => `<button class="${state.settingsTab === tab ? "selected" : ""}" data-settings-tab="${tab}">${tab}</button>`).join("")}</nav>
    <section class="settings-card">${settingsPanel()}</section></div>`;
}
function settingsPanel() {
  if (state.settingsTab === "Profile") return `<div class="settings-section"><div class="settings-section-title"><h2>Your profile</h2><p>Workspace preferences are saved to your Firebase account.</p></div><label class="settings-field">Display name<input data-setting="name" value="${escapeHtml(state.preferences.displayName)}"></label><label class="settings-field">Email address<input value="${escapeHtml(firebaseUser?.email || "")}" disabled></label><label class="settings-field">Region<select data-setting="region"><option value="">Choose your region</option><option ${state.preferences.region === "North America" ? "selected" : ""}>North America</option><option ${state.preferences.region === "Europe" ? "selected" : ""}>Europe</option><option ${state.preferences.region === "Asia Pacific" ? "selected" : ""}>Asia Pacific</option></select></label></div><div class="settings-section"><div class="settings-section-title"><h2>Appearance</h2><p>Choose a comfortable reading theme.</p></div><div class="theme-choices">${["Dark", "Light", "System"].map((theme) => `<button class="${state.theme === theme.toLowerCase() ? "selected" : ""}" data-setting-theme="${theme.toLowerCase()}">${theme}</button>`).join("")}</div></div><button class="button button-primary" data-action="save-settings">Save preferences</button>`;
  if (state.settingsTab === "Learning") return `<div class="settings-section"><div class="settings-section-title"><h2>Learning preferences</h2><p>Shape the way study activity appears in your workspace.</p></div><label class="toggle-setting"><span><b>Weekly study reminder</b><small>Show a gentle reminder in your workspace.</small></span><input type="checkbox" data-setting-check="weekly" ${state.preferences.weekly ? "checked" : ""}></label><label class="toggle-setting"><span><b>Show completed lessons</b><small>Keep finished lessons visible in the library.</small></span><input type="checkbox" data-setting-check="completedVisible" ${state.preferences.completedVisible ? "checked" : ""}></label><label class="settings-field">Study goal<select><option>Set my own pace</option><option>One session each week</option><option>Three sessions each week</option></select></label></div><button class="button button-primary" data-action="save-settings">Save preferences</button>`;
  if (state.settingsTab === "Notifications") return `<div class="settings-section"><div class="settings-section-title"><h2>Notification preferences</h2><p>Local demo switches do not send email or push notifications.</p></div>${[["newContent", "New learning material"], ["sessions", "Upcoming study sessions"], ["announcements", "Community announcements"]].map(([key, item]) => `<label class="toggle-setting"><span><b>${item}</b><small>Choose whether this type is highlighted in the demo.</small></span><input type="checkbox" data-setting-check="${key}" ${state.preferences[key] ? "checked" : ""}></label>`).join("")}</div><button class="button button-primary" data-action="save-settings">Save preferences</button>`;
  if (state.settingsTab === "Membership") return `<div class="settings-section"><div class="settings-section-title"><h2>Membership options</h2><p>Membership status in this demo does not represent a real subscription.</p></div><div class="privacy-note"><b>Open library · Demo access</b><p>Your demo profile has access to the sample open lessons. Premium pathways and member recordings are shown as locked examples.</p></div></div><a href="#/membership" class="button button-primary">Explore sample plans ↗</a>`;
  if (state.settingsTab === "Trading profile") return `<div class="settings-section"><div class="settings-section-title"><h2>Your learning context</h2><p>Optional fields to personalize your private study workspace. These are not used to make trade recommendations.</p></div><label class="settings-field">Experience level<select data-setting="experience"><option ${state.preferences.experience === "Exploring" ? "selected" : ""}>Exploring</option><option ${state.preferences.experience === "Learning the basics" ? "selected" : ""}>Learning the basics</option><option ${state.preferences.experience === "Building a routine" ? "selected" : ""}>Building a routine</option><option ${state.preferences.experience === "Experienced learner" ? "selected" : ""}>Experienced learner</option></select></label><label class="settings-field">Topics of interest<select data-setting="markets"><option ${state.preferences.markets === "Not set" ? "selected" : ""}>Not set</option><option ${state.preferences.markets === "Market structure" ? "selected" : ""}>Market structure</option><option ${state.preferences.markets === "Risk and planning" ? "selected" : ""}>Risk and planning</option><option ${state.preferences.markets === "Trading psychology" ? "selected" : ""}>Trading psychology</option></select></label><label class="settings-field">Preferred study time<select data-setting="preferredHours"><option ${state.preferences.preferredHours === "Not set" ? "selected" : ""}>Not set</option><option ${state.preferences.preferredHours === "Morning" ? "selected" : ""}>Morning</option><option ${state.preferences.preferredHours === "Afternoon" ? "selected" : ""}>Afternoon</option><option ${state.preferences.preferredHours === "Evening" ? "selected" : ""}>Evening</option></select></label></div><button class="button button-primary" data-action="save-settings">Save preferences</button>`;
  if (state.settingsTab === "Security") return `  <div class="settings-section"><div class="settings-section-title"><h2>Account security</h2><p>Your Google identity is managed by Firebase Authentication.</p></div><div class="privacy-note"><b>Signed in securely with Google</b><p>Passwords are not collected or stored by this app. Sign out of this workspace using your account menu. Account deletion and multi-factor settings are managed in your Google account.</p></div><button class="button button-outline" data-action="export-data">Download my workspace data</button> <button class="button button-danger" data-action="clear-data">Clear workspace data</button></div>`;
  return "";
}
function upgradePage() {
  return `${header("Membership")}<div class="breadcrumbs"><a href="#/home">Home</a><span>/</span><b>Study room</b></div><div class="upgrade-card"><div class="membership-orbit"><span>✳</span><i></i><b>STUDY<br>TOGETHER</b></div><div class="overline">EXPLORE A DEEPER LEARNING PATH</div><h1>Unlock room to<br><span>keep exploring.</span></h1><p>Sample premium access includes guided pathways, additional study sessions, and expanded note-taking tools. This button does not charge or subscribe you.</p><div class="upgrade-includes"><span>✓ Guided learning paths</span><span>✓ Extended recordings</span><span>✓ Community sessions</span><span>✓ Personal study notes</span></div><button class="button button-primary" data-action="sample-upgrade">Preview membership details <span>↗</span></button><p class="legal-copy">Demo membership only. No payment service or real subscription is connected.</p></div>`;
}
function signInPage() {
  const message = authStatus === "unconfigured"
    ? "Firebase is not configured yet. Add your Firebase web app values to .env.local, enable Google sign-in, and reload."
    : authStatus === "loading"
      ? "Checking your account…"
      : authError || "Sign in with Google to open your private learning workspace.";
  const button = authStatus === "loading"
    ? `<span class="auth-loading" role="status">Checking account…</span>`
    : authStatus === "unconfigured"
      ? ""
      : `<button class="button button-primary google-sign-in" data-action="google-sign-in"><span class="google-mark" aria-hidden="true">G</span>Continue with Google</button>`;
  return `<main class="auth-gate"><div class="auth-card">
    <div class="auth-brand"><span class="brand-symbol">✳</span><span>Namoh Trades</span></div>
    <div class="overline">YOUR PRIVATE LEARNING SPACE</div>
    <h1>${authStatus === "loading" ? "Welcome back" : "Sign in to continue"}</h1>
    <p>${escapeHtml(message)}</p>
    ${button}
    ${authStatus === "error" && firebaseUser ? `<button class="button button-outline" data-action="retry-workspace">Try again</button><button class="text-button" data-action="sign-out">Sign out</button>` : ""}
    <small>Authentication is provided by Firebase. Your workspace is private to your account.</small>
  </div></main>`;
}
async function loadSignedInWorkspace(user) {
  authStatus = "loading";
  authError = "";
  render();
  try {
    const remoteState = await loadWorkspace(user.uid);
    if (firebaseUser?.uid !== user.uid) return;
    const defaults = createInitialState();
    state = {
      ...defaults,
      ...(remoteState || {}),
      preferences: {
        ...defaults.preferences,
        displayName: user.displayName || defaults.preferences.displayName,
        ...(remoteState?.preferences || {}),
      },
    };
    authStatus = "signed-in";
    render();
    if (!remoteState) persist();
  } catch (error) {
    console.error("Could not load workspace data from Firebase:", error);
    authStatus = "error";
    authError = "Your Google account is signed in, but the private workspace could not be loaded. Check the Firestore rules and try again.";
    render();
  }
}
function render() {
  clearInterval(playerTimer);
  isPlaying = false;
  const content = document.querySelector("#page-content");
  if (!firebaseConfigured || authStatus !== "signed-in") {
    document.body.dataset.authState = "signed-out";
    content.innerHTML = signInPage();
    document.title = "Sign in — Namoh Trades";
    return;
  }
  document.body.dataset.authState = "signed-in";
  const route = currentRoute();
  activeNav(route);
  const pages = { home: homePage, learn: learnPage, videos: videosPage, saved: savedPage, sessions: sessionsPage, perks: perksPage, membership: membershipPage, settings: settingsPage, upgrade: upgradePage };
  const html = route === "lesson" ? lessonPage(getParam("id")) : route === "category" ? categoryPage(getParam("id")) : (pages[route] || homePage)();
  document.querySelector("#page-content").innerHTML = html;
  document.title = `${titleFor(route)} — Namoh Trades`;
  document.body.dataset.theme = state.theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    : state.theme;
  document.querySelector(".sidebar-user .user-details b").textContent = state.preferences.displayName;
  document.querySelector(".sidebar-user .user-avatar").textContent = state.preferences.displayName.slice(0, 1) || "A";
  document.querySelector(".unread-dot").hidden = state.notificationsRead;
}

function openOverlay(content, name) {
  activeDialog = name;
  const root = document.querySelector("#overlay-root");
  root.innerHTML = `<div class="overlay-backdrop" data-action="close-overlay"><section class="dialog ${name === "search" ? "search-dialog" : ""}" role="dialog" aria-modal="true" aria-label="${escapeHtml(name)}" data-dialog>${content}</section></div>`;
  const focusable = root.querySelector("input,button");
  if (focusable) focusable.focus();
}
function openSearch() {
  openOverlay(`<div class="search-modal-head">${SVG.search}<input type="search" placeholder="Search lessons, recordings, notes…" data-global-search autofocus><kbd>ESC</kbd><button data-action="close-overlay" aria-label="Close search">×</button></div><div class="search-hint">Search the learning library and your saved items</div><div class="search-results" data-search-results><div class="search-empty">Start typing to find something to study.</div></div><div class="dialog-foot"><span>↑ ↓ Navigate</span><span>↵ Open</span><span>ESC Close</span></div>`, "search");
}
function searchResults(query) {
  const target = document.querySelector("[data-search-results]");
  if (!target) return;
  const normalized = query.trim().toLowerCase();
  if (!normalized) { target.innerHTML = '<div class="search-empty">Start typing to find something to study.</div>'; return; }
  const matches = [...lessonData.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(normalized)).map((item) => ({ ...item, kind: "Lesson" })), ...recordingData.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(normalized)).map((item) => ({ ...item, kind: "Recording" }))].slice(0, 7);
  target.innerHTML = matches.length ? matches.map((item) => `<button class="search-result" data-action="${item.kind === "Lesson" ? item.type === "Free" ? "lesson" : "upgrade" : item.tier === "Open" ? "recording" : "upgrade"}" data-id="${item.id}"><span class="result-kind">${item.kind === "Lesson" ? "▤" : "▷"}</span><span><b>${escapeHtml(item.title)}</b><small>${item.kind} · ${escapeHtml(item.category)}</small></span><span class="result-arrow">↵</span></button>`).join("") : '<div class="search-empty">No matching content. Try another search.</div>';
}
function openNotifications() {
  const unseen = !state.notificationsRead;
  openOverlay(`<div class="dialog-head"><div><div class="overline">YOUR WORKSPACE</div><h2>Notifications</h2></div><button class="close-button" data-action="close-overlay">×</button></div>${unseen ? `<article class="notification-row"><span class="online-dot"></span><div><b>A new study note is available</b><p>Explore a short guide to planning a learning session.</p><small>Recently · Demo notification</small></div></article>` : `<div class="empty-state small-empty"><div class="empty-icon">♧</div><h3>You're all caught up</h3><p>New workspace updates will appear here.</p></div>`}<div class="dialog-actions"><button class="button button-outline" data-action="mark-read">Mark all as read</button><button class="text-button" data-action="settings-notifications">Notification settings</button></div>`, "notifications");
}
function openProfile() {
  const displayName = escapeHtml(state.preferences.displayName);
  const email = escapeHtml(firebaseUser?.email || "Google account");
  openOverlay(`<div class="dialog-head"><div class="profile-head"><span class="user-avatar">${escapeHtml(displayName.slice(0, 1))}</span><span><b>${displayName}</b><small>${email}</small></span></div><button class="close-button" data-action="close-overlay">×</button></div><div class="profile-options"><button data-route-click="settings">Account settings <span>↗</span></button><button data-route-click="membership">Membership options <span>↗</span></button><button data-action="export-data">Download workspace data <span>↓</span></button><button data-action="sign-out">Sign out <span>↗</span></button></div><div class="profile-safe-note">Signed in with Google through Firebase Authentication.</div>`, "profile");
}
function openMore() {
  openOverlay(`<div class="dialog-head"><div class="overline">MORE IN YOUR WORKSPACE</div><button class="close-button" data-action="close-overlay">×</button></div><div class="more-list"><a href="#/sessions" data-route-click="sessions"><span>◷</span><b>Live sessions</b><small>See the sample calendar</small></a><a href="#/perks" data-route-click="perks"><span>◇</span><b>Member perks</b><small>Sample partner offers</small></a><a href="#/membership" data-route-click="membership"><span>✳</span><b>Membership</b><small>Compare demo plans</small></a><a href="#/settings" data-route-click="settings"><span>⚙</span><b>Settings</b><small>Personalize this space</small></a></div>`, "more");
}
function saveItem(id) {
  const found = state.saved.some((item) => item.id === id);
  if (found) state.saved = state.saved.filter((item) => item.id !== id);
  else state.saved.push({ id, folderId: "", savedAt: Date.now() });
  persist();
  toast(found ? "Removed from saved items." : "Added to saved items.");
  render();
}
function addFolder() {
  openOverlay(`<div class="dialog-head"><div><div class="overline">SAVED ITEMS</div><h2>New folder</h2></div><button class="close-button" data-action="close-overlay">×</button></div><label class="settings-field">Folder name<input data-folder-name maxlength="32" placeholder="e.g. This week's study"></label><div class="dialog-actions"><button class="button button-outline" data-action="close-overlay">Cancel</button><button class="button button-primary" data-action="create-folder">Create folder</button></div>`, "new-folder");
}
function closeOverlay() {
  document.querySelector("#overlay-root").innerHTML = "";
  activeDialog = "";
}
function startLesson() {
  const progress = document.querySelector("[data-progress]");
  if (!progress) return;
  if (isPlaying) {
    clearInterval(playerTimer);
    isPlaying = false;
    document.querySelectorAll('[data-action="play"]').forEach((button) => { button.setAttribute("aria-label", "Resume sample player"); });
    toast("Sample player paused.");
    return;
  }
  isPlaying = true;
  let value = Number(progress.value);
  if (value >= 100) value = 0;
  toast("Sample player started. Video playback is not connected.");
  playerTimer = setInterval(() => {
    value = Math.min(100, value + 1);
    progress.value = String(value);
    state.progress[getParam("id") || lessonData[0].id] = value;
    const label = document.querySelector(".play-time");
    if (label) label.textContent = `${value}%`;
    document.querySelectorAll("[data-player-time]").forEach((node) => { node.textContent = playerTimeAt(value); });
    if (value % 5 === 0) persist();
    if (value >= 100) { clearInterval(playerTimer); isPlaying = false; persist(); }
  }, 1600);
}
function addNote() {
  const input = document.querySelector("[data-note-input]");
  const text = input?.value.trim();
  if (!text) return;
  const lessonId = getParam("id") || lessonData[0].id;
  const progress = Number(document.querySelector("[data-progress]")?.value || 0);
  state.notes.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), lessonId, time: playerTimeAt(progress, lessonId), text, createdAt: Date.now() });
  persist();
  render();
  toast("Your note has been saved to your account.");
}
function createFolder() {
  const input = document.querySelector("[data-folder-name]");
  const name = input.value.trim();
  if (!name) { input.focus(); toast("Enter a folder name first."); return; }
  if (state.folders.some((folder) => folder.name.toLowerCase() === name.toLowerCase())) { toast("A folder with that name already exists."); return; }
  state.folders.push({ id: `folder-${Date.now()}`, name });
  persist();
  closeOverlay();
  render();
  toast("Folder created.");
}
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "northstar-workspace-data.json";
  link.click();
  URL.revokeObjectURL(url);
  toast("Workspace data downloaded.");
}
function resetData() {
  if (!confirm("Clear saved items, notes, reminders, and preferences from your account?")) return;
  state = createInitialState();
  render();
  persist();
  toast("Workspace data cleared from your account.");
}

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route-click]");
  if (routeLink) {
    event.preventDefault();
    closeOverlay();
    navigate(routeLink.dataset.routeClick);
    return;
  }
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    const tier = event.target.closest("[data-tier]");
    if (tier) { selectedTier = tier.dataset.tier; render(); return; }
    const savedFilter = event.target.closest("[data-saved-tab]");
    if (savedFilter) { savedTab = savedFilter.dataset.savedTab; render(); return; }
    const sessionFilter = event.target.closest("[data-session-tab]");
    if (sessionFilter) { sessionTab = sessionFilter.dataset.sessionTab; render(); return; }
    const settingsTab = event.target.closest("[data-settings-tab]");
    if (settingsTab) { state.settingsTab = settingsTab.dataset.settingsTab; render(); return; }
    const settingTheme = event.target.closest("[data-setting-theme]");
    if (settingTheme) { state.theme = settingTheme.dataset.settingTheme; persist(); render(); return; }
    return;
  }
  const { action, id } = actionTarget.dataset;
  if (action === "google-sign-in") {
    actionTarget.disabled = true;
    signInWithGoogle().catch((error) => {
      console.error("Google sign-in failed:", error);
      authError = "Google sign-in did not complete. Check the Firebase Authentication setup and try again.";
      render();
    });
  }
  else if (action === "retry-workspace" && firebaseUser) loadSignedInWorkspace(firebaseUser);
  else if (action === "sign-out") {
    signOutUser().catch((error) => {
      console.error("Firebase sign-out failed:", error);
      toast("Sign out failed. Please try again.");
    });
  }
  else if (action === "search") openSearch();
  else if (action === "notifications") openNotifications();
  else if (action === "profile") openProfile();
  else if (action === "more") openMore();
  else if (action === "close-overlay") {
    if (event.target === actionTarget || actionTarget.closest("[data-dialog]") && event.target.closest(".close-button")) closeOverlay();
    else if (event.target === actionTarget) closeOverlay();
  } else if (action === "save") saveItem(id);
  else if (action === "lesson") { closeOverlay(); navigate(`lesson?id=${encodeURIComponent(id)}`); }
  else if (action === "recording") { closeOverlay(); navigate(`lesson?id=${encodeURIComponent("prepare-session")}`); toast("This recording opens in the sample lesson player."); }
  else if (action === "upgrade") { closeOverlay(); navigate("upgrade"); }
  else if (action === "complete") {
    if (state.completed.includes(id)) state.completed = state.completed.filter((value) => value !== id);
    else state.completed.push(id);
    persist(); render(); toast("Learning progress updated.");
  } else if (action === "play") startLesson();
  else if (action === "note-at") { document.querySelector("[data-note-input]")?.focus(); document.querySelector(".lesson-notes-panel")?.scrollIntoView({ behavior: "smooth", block: "center" }); }
  else if (action === "save-note") addNote();
  else if (action === "share") {
    const url = location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast("Lesson link copied.")).catch(() => toast(url));
    else toast(url);
  } else if (action === "reminder") {
    if (state.reminders.includes(id)) state.reminders = state.reminders.filter((item) => item !== id);
    else state.reminders.push(id);
    persist(); render(); toast(state.reminders.includes(id) ? "Reminder saved to your account." : "Reminder removed.");
  } else if (action === "month") {
    if (openMonths.has(actionTarget.dataset.month)) openMonths.delete(actionTarget.dataset.month);
    else openMonths.add(actionTarget.dataset.month);
    render();
  } else if (action === "new-folder") addFolder();
  else if (action === "create-folder") createFolder();
  else if (action === "folder") navigate(`saved?folder=${encodeURIComponent(id)}`);
  else if (action === "clear-folder") navigate("saved");
  else if (action === "copy-code") {
    const code = actionTarget.dataset.code;
    if (navigator.clipboard) navigator.clipboard.writeText(code).then(() => toast("Sample code copied.")).catch(() => toast(`Sample code: ${code}`));
    else toast(`Sample code: ${code}`);
  } else if (action === "theme") {
    state.theme = state.theme === "light" ? "dark" : "light";
    persist(); render(); toast(`${state.theme === "light" ? "Light" : "Dark"} theme enabled.`);
  } else if (action === "mark-read") {
    state.notificationsRead = true; persist(); closeOverlay(); toast("Notifications marked as read.");
  } else if (action === "settings-notifications") { closeOverlay(); state.settingsTab = "Notifications"; navigate("settings"); }
  else if (action === "save-settings") {
    const name = document.querySelector("[data-setting='name']");
    const region = document.querySelector("[data-setting='region']");
    if (name) state.preferences.displayName = name.value.trim() || "Alex Morgan";
    if (region) state.preferences.region = region.value;
    ["experience", "markets", "preferredHours"].forEach((key) => {
      const field = document.querySelector(`[data-setting="${key}"]`);
      if (field) state.preferences[key] = field.value;
    });
    document.querySelectorAll("[data-setting-check]").forEach((control) => { state.preferences[control.dataset.settingCheck] = control.checked; });
    persist(); render(); toast("Preferences saved to your account.");
  }
  else if (action === "sample-upgrade") { closeOverlay(); navigate("membership"); toast("Demo only — no payment or membership was created."); }
  else if (action === "export-data") exportData();
  else if (action === "clear-data") resetData();
  else if (action === "player-fullscreen") toast("Full screen is unavailable in the sample player.");
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-library-search]")) { appFilters.query = event.target.value; render(); const input = document.querySelector("[data-library-search]"); input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  else if (event.target.matches("[data-saved-search]")) { savedQuery = event.target.value; render(); const input = document.querySelector("[data-saved-search]"); input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  else if (event.target.matches("[data-global-search]")) searchResults(event.target.value);
  else if (event.target.matches("[data-note-input]")) { document.querySelector(".note-submit").disabled = !event.target.value.trim(); }
  else if (event.target.matches("[data-progress]")) {
    const number = Number(event.target.value);
    state.progress[getParam("id") || lessonData[0].id] = number;
    persist();
    document.querySelector(".play-time").textContent = `${number}%`;
    document.querySelectorAll("[data-player-time]").forEach((node) => { node.textContent = playerTimeAt(number); });
  }
});
document.addEventListener("change", (event) => {
  if (event.target.matches("[data-filter]")) { appFilters[event.target.dataset.filter] = event.target.value === "All" ? "All" : event.target.value; render(); }
  if (event.target.matches("[data-folder-item]")) {
    const entry = state.saved.find((item) => item.id === event.target.dataset.folderItem);
    if (entry) { entry.folderId = event.target.value; persist(); toast("Saved item moved."); }
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openSearch(); }
  if (event.key === "Escape" && activeDialog) closeOverlay();
  if (event.key === "Enter" && event.target.matches("[data-global-search]")) document.querySelector(".search-result")?.click();
  if (event.key === "Enter" && event.target.matches("[data-folder-name]")) createFolder();
});
window.addEventListener("hashchange", render);
if (firebaseConfigured) {
  finishRedirectSignIn().catch((error) => {
    console.error("Google redirect sign-in did not complete:", error);
    authError = "Google sign-in did not complete. Check the Firebase Authentication setup and try again.";
    render();
  });
  subscribeToAuth((user) => {
    firebaseUser = user;
    if (!user) {
      clearTimeout(workspaceSaveTimer);
      state = createInitialState();
      authStatus = "signed-out";
      authError = "";
      render();
      return;
    }
    loadSignedInWorkspace(user);
  }, (error) => {
    console.error("Firebase authentication state failed:", error);
    authStatus = "error";
    authError = "Firebase could not verify your sign-in state. Reload the page and try again.";
    render();
  });
}
render();
