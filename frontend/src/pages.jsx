import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "./router.jsx";
import { IconPlus, IconEdit, IconTrash, IconBack, IconReturn, IconSave, IconFirst, IconLast, IconPrev, IconNext } from "./icons.jsx";
import Shell from "./Shell.jsx";
import { api, parseErrors } from "./api.js";
import { RESOURCES, pkOf, statusOf } from "./config.jsx";

const PAGE = 5;

const withRes = (Page) => function Wrapped() {
  const { res, id } = useParams();
  const cfg = RESOURCES[res];
  if (!cfg) return <Navigate to="/home" replace />;
  return <Page key={res + id} res={res} cfg={cfg} />;
};

function Cell({ col, row }) {
  if (col.badge) { const s = statusOf(row); return <span className={"badge " + s.cls}>{s.text}</span>; }
  if (col.render) return col.render(row);
  const v = row[col.show || col.key];
  return v === null || v === undefined || v === "" ? "—" : String(v);
}

function useRecord(res, id) {
  const [row, setRow] = useState(null);
  const [error, setError] = useState("");
  const load = () => id && api(`/${res}/${id}/`).then(setRow).catch(() => setError("Élément introuvable."));
  useEffect(() => { load(); }, [res, id]);
  return { row, error, reload: load };
}

/* ---------- Liste ---------- */
export const ListPage = withRes(function ListPage({ res, cfg }) {
  const nav = useNavigate();
  const focus = useLocation().state?.focus; // id de la ligne ajoutée / modifiée
  const [rows, setRows] = useState(null);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api(`/${res}/`).then((d) => {
      setRows(d);
      // Après ajout/modification : ouvrir la page de pagination qui contient la ligne
      const i = focus ? d.findIndex((r) => String(r[pkOf(cfg)]) === String(focus)) : -1;
      if (i >= 0) setPage(Math.floor(i / PAGE) + 1);
    });
  }, [res]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const s = q.trim().toLowerCase();
    return s ? rows.filter((r) => cfg.columns.some((c) => String(r[c.show || c.key] ?? "").toLowerCase().includes(s))) : rows;
  }, [rows, q, cfg]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * PAGE, cur * PAGE);
  const go = (n) => setPage(Math.min(pages, Math.max(1, n)));
  const from = Math.max(1, Math.min(cur - 2, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => from + i);

  return (
    <Shell
      banner={cfg.plural}
      heading={`Liste des ${cfg.plural.toLowerCase()}`}
      action={
        <div className="tools">
          <form onSubmit={(e) => { e.preventDefault(); setQ(text); setPage(1); }}>
            <input placeholder="Rechercher…" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn">Chercher</button>
          </form>
          <Link to={`/${res}/insert`} className="btn primary"><IconPlus /> Enregistrement</Link>
        </div>
      }
    >
      {!rows ? <p className="muted">Chargement…</p> : (
        <>
          <div className="scroll">
            <table className="table clickable">
              <thead><tr>{cfg.columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>
              <tbody>
                {slice.map((r) => (
                  <tr key={r[pkOf(cfg)]} className={String(r[pkOf(cfg)]) === String(focus) ? "flash" : ""} onClick={() => nav(`/${res}/info/${r[pkOf(cfg)]}`)}>
                    {cfg.columns.map((c) => <td key={c.key}><Cell col={c} row={r} /></td>)}
                  </tr>
                ))}
                {!slice.length && <tr><td colSpan={cfg.columns.length} className="muted">Aucun résultat. Utilisez « Enregistrement » pour ajouter un {cfg.label}.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="pager">
            <button onClick={() => go(1)} disabled={cur === 1} title="Première"><IconFirst /></button>
            <button onClick={() => go(cur - 1)} disabled={cur === 1} title="Précédente"><IconPrev /></button>
            {nums.map((n) => <button key={n} className={n === cur ? "on" : ""} onClick={() => go(n)}>{n}</button>)}
            <button onClick={() => go(cur + 1)} disabled={cur === pages} title="Suivante"><IconNext /></button>
            <button onClick={() => go(pages)} disabled={cur === pages} title="Dernière"><IconLast /></button>
            <span className="muted">{filtered.length} résultat(s)</span>
          </div>
        </>
      )}
    </Shell>
  );
});

/* ---------- Champs en lecture seule (info / suppression) ---------- */
function ReadOnly({ cfg, row }) {
  const items = [{ ...cfg.columns[0] }, ...cfg.fields, ...cfg.extra];
  return (
    <div className="form">
      {items.map((f) => (
        <div className="row" key={f.key}>
          <label>{f.label}</label>
          <div className="ro"><Cell col={f} row={row} /></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Info ---------- */
export const InfoPage = withRes(function InfoPage({ res, cfg }) {
  const { id } = useParams();
  const { row, error, reload } = useRecord(res, id);
  const [busy, setBusy] = useState(false);
  const retour = async () => { setBusy(true); await api(`/emprunts/${id}/retourner/`, { method: "POST" }); setBusy(false); reload(); };

  return (
    <Shell banner={row ? `Informations — ${cfg.title(row)}` : "Informations"} heading={row ? `Informations sur ${cfg.title(row)}` : "Informations"}>
      {error && <p className="error">{error}</p>}
      {!row && !error && <p className="muted">Chargement…</p>}
      {row && (
        <>
          <ReadOnly cfg={cfg} row={row} />
          <div className="actions">
            {res === "emprunts" && row.statut !== "Retourne" && (
              <button className="btn ok" onClick={retour} disabled={busy}><IconReturn /> Marquer comme retourné</button>
            )}
            <Link className="btn primary" to={`/${res}/update/${id}`}><IconEdit /> Modifier</Link>
            <Link className="btn danger" to={`/${res}/deleteform/${id}`}><IconTrash /> Supprimer</Link>
            <Link className="btn" to={`/${res}`}><IconBack /> Retour à la liste</Link>
          </div>
        </>
      )}
    </Shell>
  );
});

/* ---------- Enregistrement / Modification ---------- */
function Form({ res, cfg, mode }) {
  const nav = useNavigate();
  const { id } = useParams();
  const update = mode === "update";
  const { row, error } = useRecord(res, update ? id : null);
  const [form, setForm] = useState(() => Object.fromEntries(cfg.fields.map((f) => [f.key, f.def ? f.def() : ""])));
  const [opts, setOpts] = useState({});
  const [errs, setErrs] = useState({ fields: {}, general: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    cfg.fields.filter((f) => f.type === "select").forEach((f) =>
      api(`/${f.from}/`).then((d) => setOpts((o) => ({ ...o, [f.key]: d }))));
  }, [res]);
  useEffect(() => {
    if (update && row) setForm(Object.fromEntries(cfg.fields.map((f) => [f.key, row[f.key] ?? ""])));
  }, [row]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const body = {};
    cfg.fields.forEach((f) => {
      if (update && f.lock) return;
      const v = form[f.key];
      body[f.key] = v === "" ? null : f.type === "number" || f.type === "select" ? Number(v) : v;
    });
    try {
      const saved = await api(update ? `/${res}/${id}/` : `/${res}/`, { method: update ? "PUT" : "POST", body });
      nav(`/${res}`, { state: { focus: saved[pkOf(cfg)] } });
    } catch (x) { setErrs(parseErrors(x)); setBusy(false); }
  };

  const title = update ? (row ? `Modification des infos sur ${cfg.title(row)}` : "Modification") : `Enregistrement d'un ${cfg.label}`;
  return (
    <Shell banner={update ? "Modification" : "Page d'Enregistrement"} heading={title}>
      {error && <p className="error">{error}</p>}
      <form className="form" onSubmit={submit}>
        {cfg.fields.map((f) => (
          <div className="row" key={f.key}>
            <label htmlFor={f.key}>{f.label}{f.required && " *"} :</label>
            <div>
              {f.type === "select" ? (
                <select id={f.key} value={form[f.key]} required={f.required} disabled={update && f.lock}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                  <option value="">---------</option>
                  {(opts[f.key] || []).map((o) => {
                    const pk = pkOf(RESOURCES[f.from]);
                    return <option key={o[pk]} value={o[pk]}>{RESOURCES[f.from].title(o)}</option>;
                  })}
                </select>
              ) : (
                <input id={f.key} type={f.type || "text"} value={form[f.key] ?? ""} required={f.required}
                  disabled={update && f.lock} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              )}
              {errs.fields[f.key] && <small className="error">{errs.fields[f.key]}</small>}
            </div>
          </div>
        ))}
        {errs.general && <p className="error">{errs.general}</p>}
        <div className="row"><span /><div className="actions">
          <button className="btn primary" disabled={busy}><IconSave /> {update ? "Modifier" : "Enregistrer"}</button>
          <Link className="btn" to={update ? `/${res}/info/${id}` : `/${res}`}>Annuler</Link>
        </div></div>
      </form>
    </Shell>
  );
}
export const InsertPage = withRes((p) => <Form {...p} mode="insert" />);
export const UpdatePage = withRes((p) => <Form {...p} mode="update" />);

/* ---------- Suppression ---------- */
export const DeletePage = withRes(function DeletePage({ res, cfg }) {
  const nav = useNavigate();
  const { id } = useParams();
  const { row, error } = useRecord(res, id);
  const [err, setErr] = useState("");
  const del = async () => {
    try { await api(`/${res}/${id}/`, { method: "DELETE" }); nav(`/${res}`); }
    catch (x) { setErr(parseErrors(x).general); }
  };
  return (
    <Shell banner="Suppression" heading={row ? `Voulez-vous supprimer ${cfg.title(row)} ?` : "Suppression"}>
      {(error || err) && <p className="error">{error || err}</p>}
      {row && (
        <>
          <ReadOnly cfg={cfg} row={row} />
          {res !== "emprunts" && <p className="muted warn-text">Les emprunts liés seront également supprimés.</p>}
          <div className="actions">
            <button className="btn danger" onClick={del}><IconTrash /> Supprimer</button>
            <Link className="btn" to={`/${res}/info/${id}`}>Annuler</Link>
          </div>
        </>
      )}
    </Shell>
  );
});
