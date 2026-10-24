import { useEffect, useState } from "react";
import { Link } from "./router.jsx";
import { IconBook, IconCheck, IconUsers, IconExchange, IconAlert } from "./icons.jsx";
import Shell from "./Shell.jsx";
import { api } from "./api.js";
import { statusOf } from "./config.jsx";

export default function Home() {
  const [s, setS] = useState(null);
  useEffect(() => { api("/stats/").then(setS); }, []);
  const cards = s && [
    { icon: IconBook, n: s.livres, t: "Titres au catalogue", to: "/livres" },
    { icon: IconCheck, n: `${s.disponibles} / ${s.exemplaires}`, t: "Exemplaires disponibles", to: "/livres" },
    { icon: IconUsers, n: s.membres, t: "Membres inscrits", to: "/membres" },
    { icon: IconExchange, n: s.emprunts_en_cours, t: "Emprunts en cours", to: "/emprunts" },
    { icon: IconAlert, n: s.en_retard, t: "Retours en retard", to: "/emprunts", warn: s.en_retard > 0 },
  ];
  return (
    <Shell banner="Page d'Accueil" heading="Accueil">
      <p className="welcome">Bienvenue dans votre espace de gestion. Suivez le catalogue, les membres et les prêts en un coup d'œil.</p>
      {!s ? <p className="muted">Chargement…</p> : (
        <>
          <div className="stats">
            {cards.map((c) => (
              <Link key={c.t} to={c.to} className={"stat" + (c.warn ? " warn" : "")}>
                <c.icon /><strong>{c.n}</strong><span>{c.t}</span>
              </Link>
            ))}
          </div>
          <h3>Derniers emprunts</h3>
          <table className="table">
            <thead><tr><th>Livre</th><th>Membre</th><th>Retour prévu</th><th>Statut</th></tr></thead>
            <tbody>
              {s.recents.map((r) => {
                const st = statusOf(r);
                return (
                  <tr key={r.id_emprunt}>
                    <td>{r.livre_titre}</td><td>{r.membre_nom}</td><td>{r.date_retour_prevue}</td>
                    <td><span className={"badge " + st.cls}>{st.text}</span></td>
                  </tr>
                );
              })}
              {!s.recents.length && <tr><td colSpan="4" className="muted">Aucun emprunt pour le moment.</td></tr>}
            </tbody>
          </table>
        </>
      )}
    </Shell>
  );
}
