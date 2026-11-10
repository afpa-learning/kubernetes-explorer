// ===== Le schéma : positions et contenu =====
// Repère : (0,0) = centre du Control Plane. x vers la droite, y vers le bas.
// Pour changer le schéma, modifier les constantes ci-dessous (pas les fonctions de dessin).

const at = (x, y) => ({ x, y });
const middle = (a, b) => at((a.x + b.x) / 2, (a.y + b.y) / 2);

// --- 1. Positions des grands éléments ---
const NODE_WIDTH = 440;
const CONTROL_PLANE = at(0, 0);
const WORKER_1 = at(330, -190.5);          // accolé au Control Plane
const WORKER_2 = at(330, 190.5);           // accolé au Control Plane et au worker 1
const CLUSTER = { ...at(255, 0), width: 1010, height: 900 };
const FULL_VIEW = [225, 0, 1400, 960];     // vue d'ensemble : [centre x, centre y, largeur, hauteur]

// --- 2. Contenu du Control Plane : [clé, x, y, taille du texte] (position dans le nœud) ---
const CONTROL_PLANE_PARTS = [
  ['scheduler', -78, -45], ['controllerManager', 78, -45], ['apiServer', 0, 0, 11],
  ['etcd', -78, 45], ['cloudControllerManager', 78, 45],
];

// --- 3. Workers : pods, conteneurs et volumes (à adapter librement) ---
// side = 1 : contenu vers le haut du nœud ; side = -1 : vers le bas (côté opposé aux interfaces).
const WORKERS = [
  { name: 'Worker Node 1', pos: WORKER_1, side: 1, pods: [
    { id: 'A', containers: ['nginx', 'log'], volume: 'emptyDir' },
    { id: 'B', containers: ['api', 'redis'], volume: 'PVC' } ] },
  { name: 'Worker Node 2', pos: WORKER_2, side: -1, pods: [
    { id: 'C', containers: ['web', 'proxy'], volume: 'configMap' },
    { id: 'D', containers: ['job'], volume: 'PVC' } ] },
];
const RUNTIME_SLOT = at(60, -95);                  // emplacement du runtime dans un worker (side = 1)
const POD_SLOTS = [at(-60, -20), at(52, 45)];      // emplacements des pods dans un worker (side = 1)

// --- 4. Réseau et éléments hors cluster ---
const SERVICES = at(515, 0);                       // dans l'encoche entre les deux workers
const INGRESS = at(615, -58);
const OUTSIDE = [['kubectl', at(-400, -90)], ['cloudApi', at(-400, 150)], ['internet', at(850, -58)]];
const LINKS = 'M-340-90L-165-95  M-340 150L-165 95  M790-58L674-58';   // traits pointillés vers le cluster

// --- 5. Interfaces à cheval sur une bordure (milieu de la bordure entre deux nœuds) ---
const INTERFACES = [
  { key: 'kubelet',   pos: middle(CONTROL_PLANE, WORKER_1), width: 86, type: 'node-part' },
  { key: 'kubelet',   pos: middle(CONTROL_PLANE, WORKER_2), width: 86, type: 'node-part' },
  { key: 'cni',       pos: middle(WORKER_1, WORKER_2),      width: 86, type: 'network-interface' },
  { key: 'kubeProxy', pos: at(458.75, -32.5), width: 70, type: 'network-interface', fontSize: 9 },  // worker 1 | Services
  { key: 'kubeProxy', pos: at(458.75, 32.5),  width: 70, type: 'network-interface', fontSize: 9 },  // worker 2 | Services
];

// ===== Fonctions de dessin =====

// Fond du cluster (grand hexagone en pointillés) et son titre.
function drawCluster() {
  const shape = `<polygon points="${hexPoints(CLUSTER.width, CLUSTER.height)}" data-zoom="${FULL_VIEW.join(' ')}"/>`;
  const title = `<g transform="translate(${CLUSTER.x},-415)">${textBlock('Cluster Kubernetes', 24, 0, 700)}</g>`;
  return clickable({ key: 'cluster', type: 'cluster', pos: CLUSTER, shape }) + title;
}

// Nœud : grand hexagone + titre + contenu. Le titre est placé du côté "side".
function drawNode({ key, name, pos, side = 1, content }) {
  const shape = `<polygon points="${hexPoints(NODE_WIDTH)}" data-zoom="${pos.x} ${pos.y} 480 420"/>`;
  const title = `<g transform="translate(0,${-158 * side})">${textBlock(name, 15, 0, 700)}</g>`;
  return `<g transform="translate(${pos.x},${pos.y})">`
    + clickable({ key, type: 'node', shape, name }) + title + content + '</g>';
}

function drawControlPlane() {
  const content = CONTROL_PLANE_PARTS
    .map(([key, x, y, size]) => hexagon(key, at(x, y), 100, 'control-plane', size))
    .join('');
  return drawNode({ key: 'controlPlane', name: 'Control Plane', pos: CONTROL_PLANE, content });
}

// Pod : hexagone contenant ses conteneurs (rectangles) et son volume (cylindre).
function drawPod({ id, containers, volume }, pos) {
  const pod = clickable({ key: 'pod', type: 'pod', name: `Pod ${id}`,
    shape: `<polygon points="${hexPoints(146)}"/>`, text: textBlock(`Pod ${id}`, 11, -45, 700) });
  const containerShapes = containers.map((name, i) => clickable({
    key: 'container', type: 'container', name: `Conteneur « ${name} »`,
    pos: at(containers.length > 1 ? (i ? 29 : -29) : 0, -14),
    shape: '<rect x="-26" y="-11" width="52" height="22" rx="6"/>', text: textBlock(name, 9.5) }));
  const volumeShape = clickable({ key: 'volume', type: 'volume', name: `Volume « ${volume} »`, pos: at(0, 30),
    shape: '<path d="M-24-9v22a24 8 0 0 0 48 0v-22"/><ellipse rx="24" ry="8" cy="-9"/>', text: textBlock(volume, 9, 4) });
  return `<g transform="translate(${pos.x},${pos.y})">${pod}${containerShapes.join('')}${volumeShape}</g>`;
}

function drawWorker({ name, pos, side, pods }) {
  const place = slot => at(slot.x, slot.y * side);          // inverse l'emplacement si side = -1
  const content = hexagon('containerRuntime', place(RUNTIME_SLOT), 84, 'node-part')
    + pods.map((pod, i) => drawPod(pod, place(POD_SLOTS[i]))).join('');
  return drawNode({ key: 'node', name, pos, side, content });
}

function drawNetworkAndOutside() {
  return hexagon('services', SERVICES, 146, 'network', 13)
    + hexagon('ingress', INGRESS, 118, 'network', 12)
    + OUTSIDE.map(([key, pos]) => hexagon(key, pos, 120, 'external', 11)).join('');
}

function drawInterfaces() {
  return INTERFACES.map(i => hexagon(i.key, i.pos, i.width, i.type, i.fontSize)).join('');
}

// Assemble le schéma. L'ordre = ordre de superposition (le dernier est dessiné au-dessus).
function drawDiagram(svg) {
  svg.innerHTML = [
    drawCluster(),
    `<path class="link" d="${LINKS}"/>`,
    drawControlPlane(),
    ...WORKERS.map(drawWorker),
    drawNetworkAndOutside(),
    drawInterfaces(),
  ].join('');
}
