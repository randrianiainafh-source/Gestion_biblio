import { IconBook, IconUsers, IconExchange, IconFeather, IconTags, IconBuilding } from "./icons.jsx";

const iso = (d) => d.toISOString().slice(0, 10);
const plusDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

// Une seule configuration pilote : liste, info, enregistrement, modification, suppression.
export const RESOURCES = {
  livres: {
    label: "livre", plural: "Livres", icon: IconBook, title: (r) => r.titre,
    columns: [
      { key: "id_livre", label: "Numéro" }, { key: "titre", label: "Titre" },
      { key: "auteur_nom", label: "Auteur" }, { key: "categorie_nom", label: "Catégorie" },
      { key: "dispo", label: "Disponibles", render: (r) => `${r.nb_disponibles} / ${r.nb_exemplaires}` },
    ],
    fields: [
      { key: "titre", label: "Titre", required: true },
      { key: "isbn", label: "ISBN" },
      { key: "annee_publication", label: "Année", type: "number" },
      { key: "nb_exemplaires", label: "Exemplaires", type: "number", required: true, def: () => 1 },
      { key: "auteur", label: "Auteur", type: "select", from: "auteurs", show: "auteur_nom" },
      { key: "editeur", label: "Éditeur", type: "select", from: "editeurs", show: "editeur_nom" },
      { key: "categorie", label: "Catégorie", type: "select", from: "categories", show: "categorie_nom" },
    ],
    extra: [{ key: "nb_disponibles", label: "Disponibles" }],
  },
  membres: {
    label: "membre", plural: "Membres", icon: IconUsers, title: (r) => `${r.prenom} ${r.nom}`,
    columns: [
      { key: "id_membre", label: "Numéro" }, { key: "nom", label: "Nom" }, { key: "prenom", label: "Prénom" },
      { key: "email", label: "Email" }, { key: "telephone", label: "Téléphone" },
    ],
    fields: [
      { key: "nom", label: "Nom", required: true }, { key: "prenom", label: "Prénom", required: true },
      { key: "email", label: "Email", type: "email" }, { key: "telephone", label: "Téléphone" },
    ],
    extra: [{ key: "date_inscription", label: "Inscrit le" }],
  },
  emprunts: {
    label: "emprunt", plural: "Emprunts", icon: IconExchange, title: (r) => `n°${r.id_emprunt} — ${r.livre_titre}`,
    columns: [
      { key: "id_emprunt", label: "Numéro" }, { key: "livre_titre", label: "Livre" },
      { key: "membre_nom", label: "Membre" }, { key: "date_retour_prevue", label: "Retour prévu" },
      { key: "statut", label: "Statut", badge: true },
    ],
    fields: [
      { key: "livre", label: "Livre", type: "select", from: "livres", show: "livre_titre", required: true, lock: true },
      { key: "membre", label: "Membre", type: "select", from: "membres", show: "membre_nom", required: true, lock: true },
      { key: "date_emprunt", label: "Date d'emprunt", type: "date", def: () => iso(new Date()) },
      { key: "date_retour_prevue", label: "Retour prévu", type: "date", required: true, def: () => plusDays(14) },
    ],
    extra: [{ key: "date_retour_effective", label: "Retourné le" }, { key: "statut", label: "Statut", badge: true }],
  },
  auteurs: {
    label: "auteur", plural: "Auteurs", icon: IconFeather, title: (r) => `${r.prenom} ${r.nom}`,
    columns: [
      { key: "id_auteur", label: "Numéro" }, { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" }, { key: "nationalite", label: "Nationalité" },
    ],
    fields: [
      { key: "nom", label: "Nom", required: true }, { key: "prenom", label: "Prénom", required: true },
      { key: "nationalite", label: "Nationalité" },
    ],
    extra: [],
  },
  categories: {
    label: "catégorie", plural: "Catégories", icon: IconTags, title: (r) => r.nom_categorie,
    columns: [{ key: "id_categorie", label: "Numéro" }, { key: "nom_categorie", label: "Nom" }],
    fields: [{ key: "nom_categorie", label: "Nom", required: true }],
    extra: [],
  },
  editeurs: {
    label: "éditeur", plural: "Éditeurs", icon: IconBuilding, title: (r) => r.nom_editeur,
    columns: [{ key: "id_editeur", label: "Numéro" }, { key: "nom_editeur", label: "Nom" }],
    fields: [{ key: "nom_editeur", label: "Nom", required: true }],
    extra: [],
  },
};

export const pkOf = (cfg) => cfg.columns[0].key;

export function statusOf(r) {
  if (r.statut === "Retourne") return { text: "Retourné", cls: "ok" };
  if (r.en_retard) return { text: "En retard", cls: "late" };
  return { text: "En cours", cls: "run" };
}
