import { NavLink } from "./router.jsx";
import { IconHome, IconUser, IconLogout, IconBookOpen } from "./icons.jsx";
import { RESOURCES } from "./config.jsx";
import { logout } from "./api.js";

// Structure : menu latéral (navigation + session en bas) et zone de contenu.
export default function Shell({ banner, heading, action, children }) {
  const user = localStorage.getItem("user") || "";
  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><span className="logo"><IconBookOpen /></span><div><strong>Bibliothèque</strong><small>Espace de gestion</small></div></div>
        <nav>
          <span className="nav-label">Navigation</span>
          <NavLink to="/home"><IconHome /> Accueil</NavLink>
          <span className="nav-label">Gestion</span>
          {Object.entries(RESOURCES).map(([k, c]) => {
            const Icon = c.icon;
            return <NavLink key={k} to={"/" + k}><Icon /> {c.plural}</NavLink>;
          })}
        </nav>
        <div className="side-foot">
          <div className="user"><IconUser /><div><strong>{user}</strong><small>Administrateur</small></div></div>
          <button onClick={logout}><IconLogout /> Déconnexion</button>
        </div>
      </aside>
      <div className="content">
        <header className="topbar"><h1>{banner}</h1></header>
        <main>
          <section className="card">
            <div className="card-head"><h2>{heading}</h2>{action}</div>
            <hr />
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
