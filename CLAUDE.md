# The Coach - Contraintes techniques

## Stack imposee

- Vanilla JS uniquement.
- Pas de framework JS.
- Pas de build step.
- Pas de dependance npm.
- Tailwind via CDN autorise.
- CSS local pour les interactions et l'identite visuelle.
- 100 % client-side.
- Deploiement GitHub Pages depuis `main` et `/`.

## Contrat seance LOT 1

Parametre URL :

```text
?p=${BASE64URL_JSON}
```

Schema :

```json
{
  "v": 1,
  "title": "Kettlebell 16 kg",
  "athleteNote": "Pas de pompes",
  "start": 0,
  "quick": [60, 90],
  "add": 30,
  "steps": [
    {
      "k": "work",
      "b": "Bloc force",
      "t": "Goblet squat",
      "d": "8 a 10 reps",
      "c": "Technique propre."
    },
    {
      "k": "rest",
      "b": "Bloc force",
      "t": "Pause",
      "s": 60
    },
    {
      "k": "timed",
      "b": "Retour au calme",
      "t": "Respiration",
      "s": 120
    }
  ]
}
```

Alias acceptes pour lisibilite :

- `type` pour `k`
- `block` pour `b`
- `title` pour `t`
- `detail` ou `target` pour `d`
- `cue` pour `c`
- `seconds` pour `s`

## Securite UI

- Toute donnee issue du JSON utilisateur doit etre rendue via `textContent` ou `value`.
- Ne pas utiliser `innerHTML` avec le contenu de seance.
- Bornes de duree : 1 a 7200 secondes.
- Maximum LOT 1 : 120 etapes.
