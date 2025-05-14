import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  getRectOfNodes, // Pour le zoom sur les enfants
  getTransformForBounds // Pour le zoom
} from 'reactflow';
import 'reactflow/dist/style.css'; // Assurez-vous que c'est importé
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { inesMadaniPrecreatedData } from './inesMadaniTrajectoryData'; 
import { PeriodNode, EventNode, ElementNode } from './CustomNodes';

const nodeTypes = {
  period: PeriodNode,
  event: EventNode,
  element: ElementNode,
};

const API_URL = 'http://localhost:5001/api/trajectories';

function TrajectoryApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project, getNodes, getNode, setViewport } = useReactFlow(); // Ajout de getNodes, getNode

  const [trajectories, setTrajectories] = useState([]);
  const [currentTrajectoryId, setCurrentTrajectoryId] = useState(null);
  const [currentTrajectoryName, setCurrentTrajectoryName] = useState('');
  const [newTrajectoryName, setNewTrajectoryName] = useState('');

  const reactFlowWrapper = useRef(null);

  const fetchTrajectories = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setTrajectories(response.data);
    } catch (error) {
      console.error("Error fetching trajectories:", error);
    }
  }, []);

  useEffect(() => {
    fetchTrajectories();
  }, [fetchTrajectories]);

  const onConnect = useCallback((params) => {
    const linkType = prompt("Type de lien (produit, engendre, influe sur, mène à):", "est lié à");
    if (linkType) {
      const newEdge = {
        ...params,
        id: uuidv4(),
        type: 'smoothstep', // Type de lien plus esthétique
        label: linkType,
        markerEnd: { type: 'arrowclosed' }, // Ajoute une flèche
        style: { strokeWidth: 1.5, stroke: '#546e7a' }, // Style du lien
        labelStyle: { fill: '#333', fontWeight: 500, fontSize: 11 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 2,
        labelBgStyle: { fill: '#fff', fillOpacity: 0.7 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }
  }, [setEdges]);

  const addNode = useCallback((type, parentId = null) => {
    const label = prompt(`Entrez le nom/texte pour ce nouveau ${type}:`, `Nouveau ${type}`);
    if (!label) return; // User cancelled

    const id = uuidv4();
    let newNode;
    let position;
    const parentNode = parentId ? getNode(parentId) : null;

    if (parentNode) {
        const childNodes = getNodes().filter(n => n.parentNode === parentId);
        position = { x: 20, y: (childNodes.length * 80) + 40 }; // Positionnement simple à l'intérieur du parent
        // Zoom sur le parent après ajout
        setTimeout(() => { // léger délai pour que le noeud soit rendu
            const nodesToFit = [parentNode, ...childNodes, {id, position, width:150, height:50}]; // Inclut le nouveau noeud estimé
            const rect = getRectOfNodes(nodesToFit);
            const transform = getTransformForBounds(rect, parentNode.width, parentNode.height, 0.1, 2);
            setViewport({ x: transform[0], y: transform[1], zoom: transform[2] }, { duration: 300 });
        }, 100);


    } else if (reactFlowWrapper.current) {
        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        position = project({
            x: bounds.width / 2 - 150, // Ajuster pour la taille du noeud
            y: bounds.height / 2 - 100,
        });
    } else {
        position = { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 };
    }

    switch (type) {
      case 'Période':
        newNode = { id, type: 'period', position, data: { label } };
        break;
      case 'Événement':
        if (!parentId) { alert("Sélectionnez une Période."); return; }
        newNode = { id, type: 'event', position, parentNode: parentId, extent: 'parent', data: { label } };
        break;
      default: // Fait, Contexte, Vécu, Action, Encapacitation
        if (!parentId) { alert("Sélectionnez un Événement."); return; }
        newNode = { id, type: 'element', position, parentNode: parentId, extent: 'parent', data: { label, elementType: type, id } };
        break;
    }
    setNodes((nds) => nds.concat(newNode));
  }, [project, getNode, getNodes, setNodes, setViewport]);


  const onNodeDoubleClick = useCallback((event, node) => {
    const newLabel = prompt(`Modifier le nom/texte:`, node.data.label);
    if (newLabel !== null && newLabel !== node.data.label) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
    }
  }, [setNodes]);

  const onEdgeDoubleClick = useCallback((event, edge) => {
    const newLabel = prompt("Modifier le texte du lien:", edge.label || "");
    if (newLabel !== null && newLabel !== edge.label) {
      setEdges((eds) =>
        eds.map((e) => (e.id === edge.id ? { ...e, label: newLabel } : e))
      );
    }
  }, [setEdges]);

  const handleCreateTrajectory = async () => {
    if (!newTrajectoryName.trim()) { alert("Nom du sujet requis."); return; }
    try {
      const response = await axios.post(API_URL, { subjectName: newTrajectoryName, nodes: [], edges: [] });
      const { id, subjectName } = response.data;
      setTrajectories(prev => [...prev, { id, subjectName }]);
      setCurrentTrajectoryId(id);
      setCurrentTrajectoryName(subjectName);
      setNodes([]);
      setEdges([]);
      setNewTrajectoryName('');
      // alert(`Trajectoire "${subjectName}" créée et chargée.`);
    } catch (error) { console.error("Erreur création:", error); alert("Échec création."); }
  };

  const handleLoadTrajectory = async (trajectoryIdToLoad) => {
    try {
      const response = await axios.get(`${API_URL}/${trajectoryIdToLoad}`);
      const trajectoryData = response.data;
      setNodes(trajectoryData.nodes || []);
      setEdges(trajectoryData.edges || []);
      setCurrentTrajectoryId(trajectoryIdToLoad);
      setCurrentTrajectoryName(trajectoryData.subjectName);
      // alert(`Trajectoire "${trajectoryData.subjectName}" chargée.`);
    } catch (error) { console.error("Erreur chargement:", error); alert("Échec chargement."); }
  };

  const handleSaveTrajectory = async () => {
    if (!currentTrajectoryId) { alert("Aucune trajectoire chargée."); return; }
    try {
      // React Flow ajoute des propriétés internes aux nodes/edges, il faut les nettoyer pour la sauvegarde
      const cleanNodes = nodes.map(({ selected, dragging, ...rest }) => ({...rest, data: {...rest.data}}));
      const cleanEdges = edges.map(({ selected, ...rest }) => ({...rest, data: {...rest.data}}));

      const payload = {
        subjectName: currentTrajectoryName,
        nodes: cleanNodes,
        edges: cleanEdges,
      };
      await axios.put(`${API_URL}/${currentTrajectoryId}`, payload);
      alert(`Trajectoire "${currentTrajectoryName}" sauvegardée !`);
      fetchTrajectories();
    } catch (error) { console.error("Erreur sauvegarde:", error); alert("Échec sauvegarde."); }
  };

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      let allNodeIdsToDelete = new Set(deletedNodes.map(n => n.id));
      let currentNodes = getNodes(); // Utiliser la version la plus à jour

      function findChildrenRecursive(parentId) {
        currentNodes.forEach(n => {
          if (n.parentNode === parentId) {
            allNodeIdsToDelete.add(n.id);
            if (n.type === 'period' || n.type === 'event') { // Si le parent est un conteneur
              findChildrenRecursive(n.id);
            }
          }
        });
      }

      deletedNodes.forEach(node => {
        if (node.type === 'period' || node.type === 'event') {
          findChildrenRecursive(node.id);
        }
      });
      
      setEdges((eds) => eds.filter(edge => 
        !allNodeIdsToDelete.has(edge.source) && !allNodeIdsToDelete.has(edge.target)
      ));
      // La suppression des noeuds eux-mêmes est gérée par onNodesChange si on ne le surcharge pas complètement
    },
    [getNodes, setEdges]
  );

  const getSelectedNode = () => nodes.find(n => n.selected);

  const loadPrecreatedInesMadani = () => {
  const { nodes: precreatedNodes, edges: precreatedEdges } = inesMadaniPrecreatedData();
  
  // Simuler la création/chargement d'une trajectoire pour ces données
  const precreatedTrajectoryId = 'ines-madani-precreated';
  const precreatedTrajectoryName = "Inès Madani (Prédéfinie)";

  // Vérifier si elle existe déjà dans la liste (pour éviter doublons si re-cliqué)
  const existing = trajectories.find(t => t.id === precreatedTrajectoryId);
  if (!existing) {
      setTrajectories(prev => [...prev, {id: precreatedTrajectoryId, subjectName: precreatedTrajectoryName}]);
  }

  setCurrentTrajectoryId(precreatedTrajectoryId);
  setCurrentTrajectoryName(precreatedTrajectoryName);
  setNodes(precreatedNodes);
  setEdges(precreatedEdges);
  alert(`Trajectoire prédéfinie "${precreatedTrajectoryName}" chargée.`);

  // Sauvegarder automatiquement cette trajectoire prédéfinie au backend (in-memory)
  // pour qu'elle apparaisse dans la liste des sauvegardées si l'utilisateur la modifie et sauvegarde
  const payload = {
    subjectName: precreatedTrajectoryName,
    nodes: precreatedNodes.map(({ selected, dragging, ...rest }) => ({...rest, data: {...rest.data}})),
    edges: precreatedEdges.map(({ selected, ...rest }) => ({...rest, data: {...rest.data}})),
  };
  
  axios.put(`${API_URL}/${precreatedTrajectoryId}`, payload)
    .catch(err => {
        // Si elle n'existe pas, on la crée
        if (err.response && err.response.status === 404) {
             axios.post(API_URL, { id: precreatedTrajectoryId, ...payload})
                .then(() => fetchTrajectories()) // Rafraichir la liste
                .catch(creationError => console.error("Error auto-creating precreated trajectory:", creationError));
        } else {
            console.error("Error auto-saving precreated trajectory:", err);
        }
    }).then(() => fetchTrajectories()); // Rafraichir la liste
};

  return (
    <div className="app-container">
      <div className="main-controls-bar">
        <input
          type="text"
          placeholder="Nom du Sujet (Nouvelle Trajectoire)"
          value={newTrajectoryName}
          onChange={(e) => setNewTrajectoryName(e.target.value)}
        />
        <button onClick={handleCreateTrajectory}>Créer & Charger Trajectoire</button>
        <button onClick={handleSaveTrajectory} disabled={!currentTrajectoryId}>
          Sauvegarder Trajectoire Actuelle
        </button>
      </div>
      <div className="status-bar">
        {currentTrajectoryId ? (
          <span>Trajectoire active : <strong>{currentTrajectoryName}</strong></span>
        ) : (
          <span>Aucune trajectoire chargée. Créez-en une ou chargez-en une depuis la barre latérale.</span>
        )}
      </div>
      <div className="content-area">
        <div className="sidebar">
          <div className="trajectory-list">
            <h3>Trajectoires Sauvegardées :</h3>
            {trajectories.length === 0 ? (
              <p>Aucune trajectoire pour le moment.</p>
            ) : (
              <ul>
                {trajectories.map(t => (
                  <li key={t.id}>
                    <span>{t.subjectName}</span>
                    <button onClick={() => handleLoadTrajectory(t.id)}>Charger</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
           <div className="node-actions">
             <h3>Actions sur Nœuds :</h3>
              <button onClick={() => addNode('Période')}>Ajouter Période</button>
              <button onClick={() => {
                  const selected = getSelectedNode();
                  if (selected && selected.type === 'period') addNode('Événement', selected.id);
                  else alert("Sélectionnez une Période pour y ajouter un Événement.");
              }} disabled={!getSelectedNode() || getSelectedNode()?.type !== 'period'}>
                Ajouter Événement (à la Période sél.)
              </button>
              {['Fait', 'Contexte', 'Vécu', 'Action', 'Encapacitation'].map(type => (
                <button style={{marginTop:'5px', width:'100%'}} key={type} onClick={() => {
                  const selected = getSelectedNode();
                  if (selected && selected.type === 'event') addNode(type, selected.id);
                  else alert("Sélectionnez un Événement pour y ajouter un Élément.");
                }} disabled={!getSelectedNode() || getSelectedNode()?.type !== 'event'}>
                  {`Ajouter ${type} (à l'Événement sél.)`}
                </button>
              ))}
           </div>
           <div className="precreated-trajectory" style={{marginTop: '20px'}}>
              <h3>Exemple Prédéfinie :</h3>
              <button onClick={loadPrecreatedInesMadani} style={{width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9575cd'}}>
                  Charger Cas Inès Madani
              </button>
           </div>
        </div>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onNodesDelete={onNodesDelete}
            nodeTypes={nodeTypes}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
          >
            <Background color="#aaa" gap={16} />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ReactFlowProvider>
      <TrajectoryApp />
    </ReactFlowProvider>
  );
}