const pathRoutes = {
  "/": "home",
  "/home": "home",
  "/learn": "learn",
  "/videos": "videos",
  "/saved": "saved",
  "/livestreams": "sessions",
  "/sessions": "sessions",
  "/discounts": "perks",
  "/perks": "perks",
  "/upgrade": "upgrade",
  "/membership": "upgrade",
  "/settings": "settings",
  "/legal/privacy": "privacy",
  "/lesson": "lesson",
  "/category": "category",
};

const routePaths = {
  home: "/",
  learn: "/learn",
  videos: "/videos",
  saved: "/saved",
  sessions: "/livestreams",
  perks: "/discounts",
  membership: "/upgrade",
  upgrade: "/upgrade",
  settings: "/settings",
  privacy: "/legal/privacy",
  lesson: "/lesson",
  category: "/category",
};

const settingsTabs = {
  profile: "Profile",
  learning: "Learning",
  membership: "Membership",
  trading_profile: "Trading profile",
  notifications: "Notifications",
  security: "Security",
};

export function resolveLocation({ pathname = "/", search = "", hash = "" } = {}) {
  const legacy = hash.match(/^#\/?([^?]*)(?:\?(.*))?$/);
  const legacyRoute = legacy?.[1];
  const route = legacyRoute
    ? pathRoutes[`/${legacyRoute}`] || legacyRoute
    : pathRoutes[pathname.replace(/\/+$/, "") || "/"] || "home";
  const query = legacyRoute ? legacy[2] || "" : search.replace(/^\?/, "");

  return { route, params: new URLSearchParams(query) };
}

export function settingsTabFromParams(params) {
  const tab = params.get("tab");
  return tab ? settingsTabs[tab.toLowerCase()] || null : null;
}

export function settingsTabParam(tab) {
  return Object.entries(settingsTabs).find(([, label]) => label === tab)?.[0] || null;
}

export function routePath(route) {
  return routePaths[route] || "/";
}

export function routeHref(route) {
  const [name, query = ""] = route.split("?");
  const path = routePath(name);
  return query ? `${path}?${query}` : path;
}
