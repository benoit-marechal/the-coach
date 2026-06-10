# QCD - The Coach

## Objectif

Mettre en ligne une mini-SPA gratuite sur GitHub Pages :

- lancer une seance de musculation decrite en JSON dans l'URL ;
- enchainer automatiquement les pauses et les etapes chronometrees ;
- permettre une note libre sur chaque etape ;
- proposer un bouton Musique qui ouvre une playlist YouTube publique motivante ;
- produire en fin de seance un resume Markdown copiable pour un agent IA.

Interaction : 100 % client-side. Pas de compte, pas de backend, pas de donnees envoyees.

## LOT 1 - Publication initiale - SHIPPED (2026-06-09)

Delai : cette session.

Cout : 0 EUR d'hebergement, GitHub Pages.

Qualite minimale :

- Chrome desktop et mobile moderne.
- Vanilla JS, HTML, CSS purs.
- Aucun build step, aucun package npm.
- JSON par URL via `?p=${BASE64URL_JSON}`.
- Fallback si aucun JSON : seance exemple + zone de saisie JSON.
- Validation explicite des erreurs de JSON.
- Pas de conseil de pompes par defaut.

Definition of done :

- [x] App locale testee.
- [x] Tests Node du moteur verts.
- [x] Page verifiee en navigateur.
- [x] Repo GitHub public `benoit-marechal/the-coach` cree.
- [x] GitHub Pages active pour `main`.
- [x] URL cible : `https://benoit-marechal.github.io/the-coach/`.

Livraison :

- Repo : `https://github.com/benoit-marechal/the-coach`
- Production : `https://benoit-marechal.github.io/the-coach/`

## LOT 2 - Seance complete compacte - SHIPPED (2026-06-09)

Delai : cette session.

Qualite minimale :

- Afficher les 35 actions de la seance exemple dans le premier ecran desktop.
- Regrouper visuellement les actions par tour/bloc, avec une nouvelle ligne par tour.
- Rendre chaque action et chaque pause cliquable pour naviguer directement.
- Garder un bouton retour arriere.
- Ajouter le choix de theme `system`, `light`, `dark`, avec `system` par defaut.
- Deplacer les informations annexes sous l'ecran principal.
- Remplacer la musique locale par une playlist YouTube publique.

## LOT 3 - Controle global, videos et journal reel - SHIPPED (2026-06-10)

Delai : cette session.

Qualite minimale :

- Corriger le chevauchement entre la note courante et les annexes.
- Afficher en haut un controle global `Play`, `Pause`, `Stop`.
- Afficher un chrono global de la seance du jour, persistant en localStorage.
- Reduire `A ton rythme` au niveau d'un texte de conseil, pas d'un timer geant.
- Afficher une video YouTube integree pour chaque etape non-pause du programme par defaut.
- Renommer les annexes en `Programme de seance` et `Programme partageable`.
- Ajouter un JSON reel `Seance du DATE`, mis a jour en temps reel et copiable par clic.

## Decisions

- Transport URL : parametre `p` contenant le JSON encode en Base64URL.
- Schema versionne : `v: 1`.
- Types d'etapes : `work`, `rest`, `timed`.
- Videos d'etapes : alias `u`, `video` ou `youtube`, normalises en `youtube-nocookie.com/embed`.
- `rest` demarre automatiquement.
- `timed` demarre automatiquement aussi, car l'utilisateur demande que l'app lance la seance.
- Musique : ouverture d'une playlist YouTube publique apres clic utilisateur.
- Journal reel : JSON local uniquement, copie presse-papier par clic.
- Resume : Markdown dans un `textarea`, avec bouton copier.
- Deploiement : GitHub Actions Pages, car le build legacy GitHub Pages echouait instantanement sans log exploitable. L'app reste statique, sans build applicatif.

## Backlog

- LOT 4 : bibliotheque de templates de seances.
- LOT 5 : import/export fichier JSON.
- LOT 6 : historique localStorage avance.
- LOT 7 : partage raccourci avec compression.
- LOT 8 : PWA/offline.

## Derives evitees

- Pas d'integration Spotify : dependance externe et friction mobile.
- Pas de framework : inutile pour le LOT 1.
- Pas de compte utilisateur : hors objectif.
