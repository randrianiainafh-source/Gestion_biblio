export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch("/api" + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Token " + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw data || { detail: "Erreur serveur" };
  return data;
}

export async function login(username, password) {
  const res = await fetch("/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
  const { token } = await res.json();
  localStorage.setItem("token", token);
  localStorage.setItem("user", username);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// Transforme l'erreur DRF en { champ: message } + message global
export function parseErrors(e) {
  const fields = {};
  let general = "";
  if (e && typeof e === "object") {
    for (const [k, v] of Object.entries(e)) {
      const msg = Array.isArray(v) ? v.join(" ") : String(v);
      if (k === "detail" || k === "non_field_errors") general = msg;
      else fields[k] = msg;
    }
  }
  if (!general && !Object.keys(fields).length) general = "Une erreur est survenue.";
  return { fields, general };
}
