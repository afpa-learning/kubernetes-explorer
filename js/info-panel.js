// ===== Descriptif affiché au clic sur un élément =====

function setupInfoPanel(svg) {
  const panel = document.getElementById('info');
  let selected = null;

  // Sélectionne un élément (entouré en orange) et affiche son descriptif ; null = tout fermer.
  function select(element) {
    if (selected) selected.classList.remove('selected');
    selected = element;
    panel.hidden = !element;
    if (!element) return;

    const data = ELEMENTS[element.dataset.key];
    element.classList.add('selected');
    document.getElementById('info-title').textContent = element.dataset.name || data.name;
    document.getElementById('info-text').textContent = data.text;
    document.getElementById('info-link').href = DOC + data.doc;
  }

  svg.addEventListener('click', e => select(e.target.closest('.el')));   // clic dans le vide = fermer
  document.getElementById('info-close').onclick = () => select(null);
  addEventListener('keydown', e => { if (e.key === 'Escape') select(null); });
}
