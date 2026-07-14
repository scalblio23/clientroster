const BASE = "/api";

// Token is written to both sessionStorage and localStorage so share links
// (which open in a new tab with a fresh sessionStorage) still work.
function token() {
  return sessionStorage.getItem("roster_token") || localStorage.getItem("roster_token") || "";
}

function headers() {
  return { "Content-Type": "application/json", "x-token": token() };
}

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    sessionStorage.removeItem("roster_token");
    localStorage.removeItem("roster_token");
    window.location.reload();
    return;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  signup: (data) => req("POST", "/signup", data),
  login:  (data) => req("POST", "/login", data),
  logout: ()     => req("POST", "/logout"),

  getClients:   ()       => req("GET",   "/clients"),
  patchClient:  (body)   => req("PATCH", "/clients", body),
  putClients:   (body)   => req("PUT",   "/clients", body),
  getTasks:   ()        => req("GET",  "/tasks"),
  putTasks:   (body)    => req("PUT",  "/tasks", body),

  getSettings:    ()     => req("GET",  "/settings"),
  putSettings:    (data) => req("PUT",  "/settings", data),

  getUsers:       ()     => req("GET",  "/users"),
  getLogs:        ()     => req("GET",  "/logs"),
  getDebug:       ()     => req("GET",  "/debug"),
  changePassword: (data) => req("POST", "/changepassword", data),

  saveToken: (t) => { sessionStorage.setItem("roster_token", t); localStorage.setItem("roster_token", t); },
  clearToken: ()  => { sessionStorage.removeItem("roster_token"); sessionStorage.removeItem("roster_user"); localStorage.removeItem("roster_token"); localStorage.removeItem("roster_user"); },
  hasToken: ()    => !!(sessionStorage.getItem("roster_token") || localStorage.getItem("roster_token")),
  saveUser: (u)   => { sessionStorage.setItem("roster_user", JSON.stringify(u)); localStorage.setItem("roster_user", JSON.stringify(u)); },
  loadUser: ()    => { try { return JSON.parse(sessionStorage.getItem("roster_user") || localStorage.getItem("roster_user") || "null"); } catch { return null; } },
};
