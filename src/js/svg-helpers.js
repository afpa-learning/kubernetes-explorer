// ===== Outils de dessin SVG =====
// Chaque fonction renvoie du texte SVG ; js/diagram.js les assemble.

// Points d'un hexagone (pointes à gauche et à droite) centré sur (0,0).
function hexPoints(width, height = width * 0.866) {
  const w = width / 2, h = height / 2;
  const inset = height * 0.2887;                 // retrait horizontal des sommets du haut et du bas
  return `${-w},0 ${-w + inset},${-h} ${w - inset},${-h} ${w},0 ${w - inset},${h} ${-w + inset},${h}`;
}

// Texte centré sur (0,y). "|" dans le texte = retour à la ligne.
function textBlock(text, size, y = 0, weight = 600) {
  const lines = text.split('|');
  const firstLine = -(lines.length - 1) / 2;
  const spans = lines
    .map((line, i) => `<tspan x="0" y="${y + (firstLine + i) * (size + 2) + size * 0.35}">${line}</tspan>`)
    .join('');
  return `<text text-anchor="middle" font-size="${size}" font-weight="${weight}">${spans}</text>`;
}

// Élément cliquable : un groupe SVG qui porte sa clé (→ data.js), son type (→ style.css) et sa position.
//   name : titre personnalisé pour le panneau (sinon, celui de data.js)
function clickable({ key, type, pos = { x: 0, y: 0 }, shape, text = '', name = '' }) {
  const nameAttr = name ? ` data-name="${name}"` : '';
  return `<g class="el type-${type}" data-key="${key}"${nameAttr} transform="translate(${pos.x},${pos.y})">${shape}${text}</g>`;
}

// Petit hexagone cliquable dont le libellé vient de data.js.
function hexagon(key, pos, width, type, fontSize = 10) {
  return clickable({
    key, type, pos,
    shape: `<polygon points="${hexPoints(width)}"/>`,
    text: textBlock(ELEMENTS[key].label, fontSize),
  });
}
