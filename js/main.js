// ===== Point d'entrée =====
const svg = document.getElementById('diagram');

drawDiagram(svg);        // 1. dessine le schéma (js/diagram.js)
setupView(svg);          // 2. zoom et déplacement (doit précéder setupInfoPanel)
setupInfoPanel(svg);     // 3. descriptif au clic
