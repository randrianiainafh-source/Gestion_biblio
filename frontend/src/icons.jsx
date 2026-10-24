// Icônes SVG intégrées (aucune bibliothèque externe).
const make = (paths) => function Icon({ size = "1em", ...p }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{paths}</svg>
  );
};

export const IconHome = make(<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>);
export const IconUser = make(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>);
export const IconLogout = make(<><path d="M9 21H5V3h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>);
export const IconBookOpen = make(<><path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2z" /><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z" /></>);
export const IconBook = make(<><path d="M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14" /></>);
export const IconUsers = make(<><circle cx="9" cy="8" r="3.5" /><path d="M2 21c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 15.5c2.5.6 4 2.2 4 5.5" /></>);
export const IconExchange = make(<><path d="M17 3l4 4-4 4" /><path d="M21 7H8" /><path d="M7 21l-4-4 4-4" /><path d="M3 17h13" /></>);
export const IconFeather = make(<><path d="M20 4a7 7 0 0 0-10 0L4 10v6h6l6-6a7 7 0 0 0 4-6z" /><path d="M4 20L14 10" /></>);
export const IconTags = make(<><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1" /></>);
export const IconBuilding = make(<><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" /></>);
export const IconPlus = make(<><path d="M12 5v14M5 12h14" /></>);
export const IconEdit = make(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>);
export const IconTrash = make(<><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /><path d="M10 11v6M14 11v6" /></>);
export const IconBack = make(<><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></>);
export const IconReturn = make(<><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>);
export const IconSave = make(<><path d="M5 3h11l4 4v14H5z" /><path d="M8 3v6h8V3" /><path d="M8 21v-7h8v7" /></>);
export const IconFirst = make(<><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></>);
export const IconLast = make(<><path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" /></>);
export const IconPrev = make(<><path d="M15 18l-6-6 6-6" /></>);
export const IconNext = make(<><path d="M9 18l6-6-6-6" /></>);
export const IconCheck = make(<><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></>);
export const IconAlert = make(<><path d="M12 3L2 20h20z" /><path d="M12 10v5M12 18h.01" /></>);
