const BASE = "/api";

function token() {
  return sessionStorage.getItem("roster_token") || "";
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

  getClients: ()       => req("GET",  "/clients"),
  putClients: (data)   => req("PUT",  "/clients", data),
  getTasks:   ()       => req("GET",  "/tasks"),
  putTasks:   (data)   => req("PUT",  "/tasks", data),

  saveToken: (token) => sessionStorage.setItem("roster_token", token),
  clearToken: ()     => sessionStorage.removeItem("roster_token"),
  hasToken: ()       => !!sessionStorage.getItem("roster_token"),
};
