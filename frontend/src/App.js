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
  getRectOfNodes,
  getTransformForBounds
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { inesMadaniPrecreatedData } from './inesMadaniTrajectoryData';
import { PeriodNode, EventNode, ElementNode } from './CustomNodes';
import { autoLayout } from './layoutUtils';

const nodeTypes = {
  period: PeriodNode,
  event: EventNode,
  element: ElementNode,
};

const API_URL = 'http://localhost:5001/api/trajectories';

function TrajectoryApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project, getNodes, getNode, setViewport, fitView } = useReactFlow();

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
        type: 'smoothstep',
        label: linkType,
        markerEnd: { type: 'arrowclosed' },
        style: { strokeWidth: 1.5, stroke: '#546e7a' },
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
    if (!label) return;

    const id = uuidv4();
    let newNode;
    let position;
    const parentNode = parentId ? getNode(parentId) : null;

    const DEFAULT_NODE_WIDTH = 150;
    const DEFAULT_NODE_HEIGHT = 50;

    if (parentNode) {
      const childNodes = getNodes().filter(n => n.parentNode === parentId);
      position = { x: 20, y: (childNodes.length * 80) + 40 }; // Simple positioning within parent

      setTimeout(() => {
        const nodesToFit = [
            parentNode, 
            ...childNodes, 
            // Include a representation of the new node for accurate bounds calculation
            { 
                id, 
                position, 
                width: DEFAULT_NODE_WIDTH, // Use default or estimated size
                height: DEFAULT_NODE_HEIGHT,
                parentNode: parentId // Important for getRectOfNodes with parent nodes
            }
        ];
        // Ensure parentNode has width and height for getTransformForBounds
        const parentWidth = parentNode.width || 500; // Fallback if not set
        const parentHeight = parentNode.height || 300; // Fallback if not set

        const rect = getRectOfNodes(nodesToFit.map(n => getNode(n.id) || n)); // Use actual node if available
        const transform = getTransformForBounds(rect, parentWidth, parentHeight, 0.1, 2);
        setViewport({ x: transform[0], y: transform[1], zoom: transform[2] }, { duration: 300 });
      }, 100);
    } else if (reactFlowWrapper.current) {
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      position = project({
        x: bounds.width / 2 - DEFAULT_NODE_WIDTH / 2,
        y: bounds.height / 2 - DEFAULT_NODE_HEIGHT / 2,
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
    const newLabel = prompt("Modifier le nom/texte:", node.data.label);
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
    } catch (error) { console.error("Erreur chargement:", error); alert("Échec chargement."); }
  };

  const handleSaveTrajectory = async () => {
    if (!currentTrajectoryId) { alert("Aucune trajectoire chargée."); return; }
    try {
      const cleanNodes = nodes.map(({ selected, dragging, positionAbsolute, ...rest }) => ({...rest, data: {...rest.data}}));
      const cleanEdges = edges.map(({ selected, ...rest }) => rest); // Edges usually don't have problematic extra data like nodes

      const payload = {
        subjectName: currentTrajectoryName,
        nodes: cleanNodes,
        edges: cleanEdges,
      };
      await axios.put(`${API_URL}/${currentTrajectoryId}`, payload);
      alert(`Trajectoire "${currentTrajectoryName}" sauvegardée !`);
      fetchTrajectories(); // Refresh list in case name was changed on backend (though not implemented here)
    } catch (error) { console.error("Erreur sauvegarde:", error); alert("Échec sauvegarde."); }
  };

  const handleAutoLayout = useCallback(() => {
    setNodes((nds) => {
      const updatedNodes = autoLayout(nds, getNodes); // Pass getNodes if layout needs current state
      // Fit view after layout applied and nodes potentially re-rendered
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 });
      }, 0);
      return updatedNodes;
    });
  }, [setNodes, fitView, getNodes]);

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      const allNodeIdsToDelete = new Set(deletedNodes.map(n => n.id));
      const currentGraphNodes = getNodes(); // Use the most up-to-date nodes from the store

      function findChildrenRecursive(parentId) {
        currentGraphNodes.forEach(n => {
          if (n.parentNode === parentId) {
            allNodeIdsToDelete.add(n.id);
            // If the child is also a container, recurse
            if (n.type === 'period' || n.type === 'event') {
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
      // Node deletion itself is handled by React Flow's internal onNodesChange
      // if we don't completely override its behavior.
    },
    [getNodes, setEdges] 
  );

  const getSelectedNode = () => nodes.find(n => n.selected);

  const loadPrecreatedInesMadani = async () => {
    const { nodes: precreatedNodes, edges: precreatedEdges } = inesMadaniPrecreatedData();
    const precreatedTrajectoryId = 'ines-madani-precreated';
    const precreatedTrajectoryName = "Inès Madani (Prédéfinie)";

    const existing = trajectories.find(t => t.id === precreatedTrajectoryId);
    if (!existing) {
      setTrajectories(prev => [...prev, {id: precreatedTrajectoryId, subjectName: precreatedTrajectoryName}]);
    }

    setCurrentTrajectoryId(precreatedTrajectoryId);
    setCurrentTrajectoryName(precreatedTrajectoryName);
    setNodes(precreatedNodes);
    setEdges(precreatedEdges);
    // Fit view after loading these extensive nodes
    setTimeout(() => fitView({ padding: 0.1, duration: 500 }), 100);


    const payload = {
      subjectName: precreatedTrajectoryName,
      nodes: precreatedNodes.map(({ selected, dragging, positionAbsolute, ...rest }) => ({...rest, data: {...rest.data}})),
      edges: precreatedEdges.map(({ selected, ...rest }) => rest),
    };

    try {
        // Try to update it if it exists (e.g., user loaded, modified, then re-clicked "load predefined")
        await axios.put(`${API_URL}/${precreatedTrajectoryId}`, payload);
    } catch (err) {
        // If it doesn't exist (404), create it.
        if (err.response && err.response.status === 404) {
            try {
                await axios.post(API_URL, { id: precreatedTrajectoryId, ...payload }); // Backend should handle 'id' if provided
            } catch (creationError) {
                console.error("Error auto-creating precreated trajectory:", creationError);
            }
        } else {
            console.error("Error auto-saving precreated trajectory (PUT failed):", err);
        }
    } finally {
        fetchTrajectories(); // Refresh the list from backend
        alert(`Trajectoire prédéfinie "${precreatedTrajectoryName}" chargée et synchronisée.`);
    }
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
        <button onClick={handleAutoLayout}>Disposition automatique</button>
      </div>
      <div className="status-bar">
        {currentTrajectoryId ? (
          <span>Trajectoire active : <strong>{currentTrajectoryName}</strong></span>
        ) : (
          <span>Aucune trajectoire chargée. Créez-en une ou chargez-en une.</span>
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
            <button 
              onClick={() => {
                const selected = getSelectedNode();
                if (selected && selected.type === 'period') addNode('Événement', selected.id);
                else alert("Sélectionnez une Période pour y ajouter un Événement.");
              }} 
              disabled={!getSelectedNode() || getSelectedNode()?.type !== 'period'}>
              Ajouter Événement (à Période sél.)
            </button>
            {['Fait', 'Contexte', 'Vécu', 'Action', 'Encapacitation'].map(type => (
              <button style={{marginTop:'5px', width:'100%'}} key={type} 
                onClick={() => {
                  const selected = getSelectedNode();
                  if (selected && selected.type === 'event') addNode(type, selected.id);
                  else alert("Sélectionnez un Événement pour y ajouter un Élément.");
                }} 
                disabled={!getSelectedNode() || getSelectedNode()?.type !== 'event'}>
                {`Ajouter ${type} (à Événement sél.)`}
              </button>
            ))}
          </div>
          <div className="precreated-trajectory" style={{marginTop: '20px'}}>
            <h3>Exemple Prédéfini :</h3>
            <button onClick={loadPrecreatedInesMadani} style={{width: '100%', backgroundColor: '#d1c4e9', borderColor: '#9575cd'}}>
              Charger Cas Inès Madani
            </button>
          </div>
        </div>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            minZoom={0.01}
            maxZoom={10}
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