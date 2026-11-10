// ===== Navigation : zoom et déplacement =====
// Molette ou boutons = zoom ; glisser = déplacer ; double-clic sur un nœud = zoom sur ce nœud.
// Principe : on modifie le viewBox du SVG, c'est-à-dire la zone du schéma visible à l'écran.

const ZOOM_STEP = 1.12;       // facteur de zoom par cran de molette
const ANIMATION_MS = 1000;    // durée des zooms animés (boutons, double-clic)
const TILT_DEG = 7;           // légère rotation pendant un zoom animé (0 = aucune)
const DRAG_THRESHOLD = 4;     // pixels à partir desquels un clic devient un glissement

function setupView(svg) {
  let view, animationFrame, dragFrom = null, dragDistance = 0;      // view = { x, y, w, h }

  const bounds = () => svg.getBoundingClientRect();

  // Transforme [centre x, centre y, largeur, hauteur] en viewBox au même ratio que l'écran.
  function fit([cx, cy, w, h]) {
    const ratio = bounds().width / bounds().height;
    if (w / h < ratio) w = h * ratio; else h = w / ratio;
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }

  function show(newView) {
    view = newView;
    svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
  }

  // Vue agrandie/réduite d'un facteur autour du point (px, py) du schéma.
  const zoomed = (factor, px, py) => ({
    x: px - (px - view.x) * factor, y: py - (py - view.y) * factor, w: view.w * factor, h: view.h * factor });

  // Passe progressivement de la vue actuelle à la vue "target".
  function animateTo(target) {
    cancelAnimationFrame(animationFrame);
    const from = { ...view }, start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / ANIMATION_MS);
      const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;     // accélération puis freinage
      const mix = key => from[key] + (target[key] - from[key]) * e;
      show({ x: mix('x'), y: mix('y'), w: mix('w'), h: mix('h') });
      svg.style.transform = `rotate(${TILT_DEG * Math.sin(Math.PI * t)}deg)`;
      if (t < 1) animationFrame = requestAnimationFrame(step); else svg.style.transform = '';
    };
    animationFrame = requestAnimationFrame(step);
  }

  // Molette : zoom autour du curseur.
  svg.addEventListener('wheel', e => {
    e.preventDefault();
    cancelAnimationFrame(animationFrame);
    const px = view.x + (e.clientX - bounds().left) / bounds().width * view.w;
    const py = view.y + (e.clientY - bounds().top) / bounds().height * view.h;
    show(zoomed(e.deltaY > 0 ? ZOOM_STEP : 1 / ZOOM_STEP, px, py));
  }, { passive: false });

  // Boutons + et − : zoom autour du centre de l'écran.
  const zoomFromCenter = factor => animateTo(zoomed(factor, view.x + view.w / 2, view.y + view.h / 2));
  document.getElementById('zoom-in').onclick = () => zoomFromCenter(0.7);
  document.getElementById('zoom-out').onclick = () => zoomFromCenter(1.4);

  // Glisser : déplace la vue.
  svg.addEventListener('pointerdown', e => { dragFrom = { x: e.clientX, y: e.clientY }; dragDistance = 0; });
  addEventListener('pointermove', e => {
    if (!dragFrom) return;
    const dx = e.clientX - dragFrom.x, dy = e.clientY - dragFrom.y;
    dragDistance += Math.abs(dx) + Math.abs(dy);
    if (dragDistance > DRAG_THRESHOLD) {
      cancelAnimationFrame(animationFrame);
      show({ ...view, x: view.x - dx / bounds().width * view.w, y: view.y - dy / bounds().height * view.h });
    }
    dragFrom = { x: e.clientX, y: e.clientY };
  });
  addEventListener('pointerup', () => { dragFrom = null; });

  // Après un glissement, on ignore le clic (sinon le panneau de descriptif s'ouvrirait).
  // Ce setup doit donc être appelé AVANT setupInfoPanel (voir main.js).
  svg.addEventListener('click', e => { if (dragDistance > DRAG_THRESHOLD) e.stopImmediatePropagation(); }, true);

  // Double-clic sur un nœud (ou le fond du cluster) : zoom animé. La zone vient de data-zoom.
  svg.addEventListener('dblclick', e => {
    const target = e.target.closest('[data-zoom]');
    if (target) animateTo(fit(target.dataset.zoom.split(' ').map(Number)));
  });

  addEventListener('resize', () => show(fit(FULL_VIEW)));
  show(fit(FULL_VIEW));
}
