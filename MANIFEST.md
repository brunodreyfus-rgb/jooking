# Jooking AntiBooking V1 - Patch réel

Ce package contient des fichiers directement utilisables pour remplacer/ajouter dans le repo Next.js.

## Fichiers inclus

- `pages/search.js` — nouvelle page Search
- `pages/risks.js` — nouvelle page Risks
- `pages/risk-map.js` — page Risk Map corrigée, wording "Live dashboard"
- `pages/methodology.js` — ajout anonymat des personnes qui soumettent les reports
- `pages/report-incident.js` — background gris, suppression texte V2, branding Jooking
- `components/Navbar.js` — liens menu corrigés vers `/search`, `/risks`, `/risk-map`, `/report-incident`
- `components/Footer.js` — branding footer Jooking
- `components/WorldRiskMap.js` — carte monde SVG responsive avec points alignés et légende en bas à gauche
- `lib/reportedEventsImport.js` — helper pour filtrer les reported events pas encore ajoutés à la plateforme
- `styles/jooking-pages.css` — styles partagés gris / cartes / layout
- `apply-patch.sh` — copie les fichiers dans un repo local

## Application

Depuis la racine de ton repo :

```bash
unzip jooking-antibooking-v1-real-patch.zip -d patch
cd patch
bash apply-patch.sh /chemin/vers/ton/repo
```

Ou copie manuellement les dossiers `pages`, `components`, `lib`, `styles` dans ton repo.

## Important

Si ton projet utilise déjà certains de ces fichiers avec une structure différente, compare avant remplacement.
