# The Coach Design

## But

The Coach est une SPA statique pour lancer une seance de musculation fournie en JSON dans l'URL, noter chaque etape, puis copier un compte rendu Markdown.

## Architecture

- `index.html` porte la structure de l'interface.
- `style.css` porte le design et les etats responsive.
- `app.js` contient le moteur pur, le parsing URL, la musique Web Audio, le rendu DOM et le resume Markdown.
- `tests/app.test.mjs` charge `app.js` sans DOM et teste les fonctions exposees.

## Donnees

Le transport principal est `?p=${BASE64URL_JSON}`. Le JSON est versionne avec `v: 1`.

Les etapes normalisees ont :

- `kind`: `work`, `rest` ou `timed`.
- `block`: groupe affichable.
- `title`: nom de l'etape.
- `detail`: objectif lisible.
- `cue`: consigne optionnelle.
- `seconds`: obligatoire pour `rest` et `timed`.

## Comportement

- L'app charge le JSON de l'URL si present.
- Si absent ou invalide, elle affiche une seance exemple et une zone de saisie JSON.
- Les pauses et etapes chronometrees demarrent automatiquement.
- Les notes par etape sont conservees dans l'etat courant.
- La fin de seance affiche un Markdown copiable.

## Publication

Le projet suit le modele Parure : depot public GitHub, branche `main`, GitHub Pages depuis `/`, pas de build, chemins relatifs.
