// ===== Contenu du schéma =====
// Un seul endroit pour modifier les textes, libellés et liens de documentation.
//   name  : titre affiché dans le panneau de descriptif
//   label : texte dans l'hexagone ("|" = retour à la ligne)
//   doc   : chemin de la page de documentation (ajouté à DOC)
//   text  : descriptif bref affiché au clic

const DOC = 'https://kubernetes.io/docs/';

const ELEMENTS = {
  // --- Grands ensembles ---
  cluster: { name: 'Cluster Kubernetes', doc: 'concepts/overview/components/',
    text: 'Ensemble de nœuds (un Control Plane et des workers) qui exécutent vos applications conteneurisées.' },
  controlPlane: { name: 'Control Plane', doc: 'concepts/overview/components/#control-plane-components',
    text: 'Prend les décisions globales (planification, détection des pannes) et expose l’API du cluster.' },
  node: { name: 'Nœud worker', doc: 'concepts/architecture/nodes/',
    text: 'Machine (VM ou physique) qui exécute les Pods. Elle héberge kubelet, kube-proxy, un runtime de conteneurs et un plugin CNI.' },

  // --- Composants du Control Plane ---
  apiServer: { name: 'kube-apiserver', label: 'kube-|apiserver', doc: 'reference/command-line-tools-reference/kube-apiserver/',
    text: 'Point d’entrée de l’API Kubernetes : authentifie, valide les requêtes et reste le seul composant à dialoguer avec etcd.' },
  etcd: { name: 'etcd', label: 'etcd', doc: 'tasks/administer-cluster/configure-upgrade-etcd/',
    text: 'Base clé-valeur distribuée et cohérente : source de vérité de l’état du cluster.' },
  scheduler: { name: 'kube-scheduler', label: 'kube-|scheduler', doc: 'concepts/scheduling-eviction/kube-scheduler/',
    text: 'Choisit le nœud qui accueillera chaque nouveau Pod selon les ressources, contraintes et affinités.' },
  controllerManager: { name: 'kube-controller-manager', label: 'kube-|controller-|manager', doc: 'concepts/architecture/controller/',
    text: 'Exécute les boucles de contrôle (Node, Deployment, Job…) qui rapprochent l’état réel de l’état désiré.' },
  cloudControllerManager: { name: 'cloud-controller-manager', label: 'cloud-|controller-|manager', doc: 'concepts/architecture/cloud-controller/',
    text: 'Relie le cluster au fournisseur cloud : nœuds, routes, load balancers.' },

  // --- Composants et interfaces d'un nœud ---
  kubelet: { name: 'kubelet', label: 'kubelet', doc: 'reference/command-line-tools-reference/kubelet/',
    text: 'Agent de chaque nœud : reçoit les Pods de l’API server, démarre leurs conteneurs via le runtime et remonte leur état.' },
  kubeProxy: { name: 'kube-proxy', label: 'kube-|proxy', doc: 'reference/command-line-tools-reference/kube-proxy/',
    text: 'Maintient sur chaque nœud les règles réseau (iptables/IPVS) qui implémentent les Services.' },
  containerRuntime: { name: 'Container runtime', label: 'container|runtime', doc: 'setup/production-environment/container-runtimes/',
    text: 'Exécute réellement les conteneurs via la CRI (containerd, CRI-O…).' },
  cni: { name: 'CNI', label: 'CNI|(réseau)', doc: 'concepts/extend-kubernetes/compute-storage-net/network-plugins/',
    text: 'Plugin réseau (Calico, Cilium, Flannel…) : donne une IP à chaque Pod et relie les Pods de nœuds différents.' },

  // --- Réseau ---
  services: { name: 'Services', label: 'Services', doc: 'concepts/services-networking/service/',
    text: 'Point d’accès stable (IP et nom DNS) qui répartit le trafic vers un ensemble de Pods.' },
  ingress: { name: 'Ingress', label: 'Ingress', doc: 'concepts/services-networking/ingress/',
    text: 'Règles de routage HTTP(S) de l’extérieur vers les Services, appliquées par un Ingress controller.' },

  // --- Hors cluster ---
  kubectl: { name: 'kubectl', label: 'kubectl|(client)', doc: 'reference/kubectl/',
    text: 'Ligne de commande qui pilote le cluster via l’API server (apply, get, logs…).' },
  cloudApi: { name: 'API du cloud', label: 'API du|cloud', doc: 'tasks/administer-cluster/running-cloud-controller/',
    text: 'API du fournisseur (AWS, Azure, GCP…), pilotée par le cloud-controller-manager.' },
  internet: { name: 'Internet (clients)', label: 'Internet|(clients)', doc: 'concepts/services-networking/',
    text: 'Clients externes dont le trafic entre dans le cluster via Ingress ou un Service de type LoadBalancer.' },

  // --- Dans un Pod ---
  pod: { name: 'Pod', doc: 'concepts/workloads/pods/',
    text: 'Plus petite unité déployable : un ou plusieurs conteneurs qui partagent réseau et volumes.' },
  container: { name: 'Conteneur', doc: 'concepts/containers/',
    text: 'Processus applicatif isolé, issu d’une image, exécuté à l’intérieur d’un Pod.' },
  volume: { name: 'Volume', doc: 'concepts/storage/volumes/',
    text: 'Espace de stockage monté dans les conteneurs d’un Pod, qui survit au redémarrage d’un conteneur. Éphémère (emptyDir) ou persistant (PVC).' },
};
