// Mini-routeur maison basé sur l'API History du navigateur (aucune dépendance).
import { createContext, useContext, useEffect, useState } from "react";

const ParamsCtx = createContext({});
const EVT = "app:navigate";

export function navigate(to, { state, replace } = {}) {
  window.history[replace ? "replaceState" : "pushState"](state ?? null, "", to);
  window.dispatchEvent(new Event(EVT));
  window.scrollTo(0, 0);
}

export function useLocation() {
  const read = () => ({ pathname: window.location.pathname, state: window.history.state });
  const [loc, setLoc] = useState(read);
  useEffect(() => {
    const on = () => setLoc(read());
    window.addEventListener("popstate", on);
    window.addEventListener(EVT, on);
    on(); // resynchronise : un enfant a pu naviguer avant cet abonnement
    return () => { window.removeEventListener("popstate", on); window.removeEventListener(EVT, on); };
  }, []);
  return loc;
}

export const useNavigate = () => navigate;
export const useParams = () => useContext(ParamsCtx);

export function Link({ to, state, children, ...p }) {
  const click = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    navigate(to, { state });
  };
  return <a href={to} onClick={click} {...p}>{children}</a>;
}

export function NavLink({ to, className = "", ...p }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");
  return <Link to={to} className={(className + (active ? " active" : "")).trim()} {...p} />;
}

export function Navigate({ to }) {
  useEffect(() => { navigate(to, { replace: true }); }, [to]);
  return null;
}

function match(pattern, path) {
  const a = pattern.split("/").filter(Boolean), b = path.split("/").filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

// routes : [{ path, element }] — la première qui correspond gagne.
export function Router({ routes }) {
  const { pathname } = useLocation();
  for (const r of routes) {
    const params = match(r.path, pathname);
    if (params) return <ParamsCtx.Provider value={params}>{r.element}</ParamsCtx.Provider>;
  }
  return <Navigate to="/home" />;
}
