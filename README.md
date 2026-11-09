# Schéma d'architecture Kubernetes

Ouvrir `index.html` dans un navigateur (aucune installation, aucune dépendance).

```
index.html          Structure de la page (légende, boutons, panneau, zone du schéma)
css/style.css       Couleurs (variables en haut) et styles par type d'élément
js/data.js          Textes, libellés et liens de documentation      ← modifier le contenu
js/svg-helpers.js   Petits outils de dessin (hexagone, texte, élément cliquable)
js/diagram.js       Positions et contenu du schéma (constantes en haut) ← modifier le schéma
js/view.js          Zoom (molette, boutons, double-clic) et déplacement
js/info-panel.js    Descriptif affiché au clic
js/main.js          Point d'entrée : dessine puis active les interactions
```

Ajouter un pod : une ligne dans `WORKERS` (js/diagram.js).

Changer un texte ou un lien : `ELEMENTS` (js/data.js).

Changer une couleur : variables `--...` en haut de css/style.css.
