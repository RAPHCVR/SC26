// frontend/src/App.js
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  getRectOfNodes,
  getTransformForBounds,
  useStore
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { inesMadaniPrecreatedData } from './inesMadaniTrajectoryData';
import { PeriodNode, EventNode, ElementNode } from './CustomNodes';
import TreeView from './TreeView';
import { autoLayout } from './layoutUtils';
import { ViewModeProvider, useViewMode } from './ViewModeContext';

const nodeTypes = {
  period: PeriodNode,
  event: EventNode,
  element: ElementNode,
};

const API_URL = '/api/trajectories';

const SIMPLIFIED_VIEW_ZOOM_THRESHOLD = 0.3;
const BASE_ARROW_SIZE = 20;
const MIN_ARROW_SCALE = 0.4;
const MAX_ARROW_SCALE = 1.5;
const SIMPLIFIED_ARROW_SIZE = 7;

function TrajectoryAppContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project, getNodes, getNode, setViewport, fitView, fitBounds } = useReactFlow();

  const [trajectories, setTrajectories] = useState([]);
  const [currentTrajectoryId, setCurrentTrajectoryId] = useState(null);
  const [currentTrajectoryName, setCurrentTrajectoryName] = useState('');
  const [newTrajectoryName, setNewTrajectoryName] = useState('');

  // Filter states
  const [includeTagsInput, setIncludeTagsInput] = useState('');
  const [excludeTagsInput, setExcludeTagsInput] = useState('');
  const [locationTagsInput, setLocationTagsInput] = useState('');
  const [personTagsInput, setPersonTagsInput] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({});


  const reactFlowWrapper = useRef(null);
  const currentZoom = useStore((store) => store.transform[2]);
  const { viewMode, setViewMode, alwaysMinimalist, setAlwaysMinimalist } = useViewMode(); 

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

  const adjustMarkersForZoom = useCallback((edgesToAdjust, zoomLevel) => {
    if (!edgesToAdjust) return [];
    return edgesToAdjust.map(edge => {
      let newMarkerWidth;
      let newMarkerHeight;

      if (alwaysMinimalist || zoomLevel < SIMPLIFIED_VIEW_ZOOM_THRESHOLD) {
        newMarkerWidth = SIMPLIFIED_ARROW_SIZE;
        newMarkerHeight = SIMPLIFIED_ARROW_SIZE;
      } else {
        const scale = 1 / zoomLevel;
        const scaledSize = BASE_ARROW_SIZE * scale;
        newMarkerWidth = Math.max(
          BASE_ARROW_SIZE * MIN_ARROW_SCALE,
          Math.min(scaledSize, BASE_ARROW_SIZE * MAX_ARROW_SCALE)
        );
        newMarkerHeight = newMarkerWidth;
      }
      return {
        ...edge,
        markerEnd: {
          ...(edge.markerEnd || { type: 'arrowclosed' }),
          width: newMarkerWidth,
          height: newMarkerHeight,
        },
      };
    });
  }, [alwaysMinimalist]);


  useEffect(() => {
    setEdges(prevEdges => adjustMarkersForZoom(prevEdges, currentZoom));
  }, [currentZoom, setEdges, adjustMarkersForZoom, alwaysMinimalist]);

  // Apply filters and update node/edge appearance
  useEffect(() => {
    if (Object.keys(activeFilters).length === 0 && nodes.every(n => !n.data.isDimmed)) {
        // If no filters and no nodes are dimmed, no need to process
        // also ensure edges are not dimmed
        if (edges.every(e => !e.className?.includes('dimmed-edge'))) return;
    }
  
    const {
      includeTags = [],
      excludeTags = [],
      locationTags = [],
      personTags = [],
      startDate,
      endDate,
    } = activeFilters;

    const hasActiveFilters = 
        includeTags.length > 0 ||
        excludeTags.length > 0 ||
        locationTags.length > 0 ||
        personTags.length > 0 ||
        startDate ||
        endDate;

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (!hasActiveFilters) {
          return { ...node, data: { ...node.data, isDimmed: false } };
        }

        let match = true;
        const nodeData = node.data || {};
        const nodeTags = (nodeData.tags || []).map(t => t.toLowerCase());
        const nodeLocationTags = (nodeData.locationTags || []).map(t => t.toLowerCase());
        const nodePersonTags = (nodeData.personTags || []).map(t => t.toLowerCase());

        if (includeTags.length > 0) {
          match = match && includeTags.every(tag => nodeTags.includes(tag) || nodeLocationTags.includes(tag) || nodePersonTags.includes(tag));
        }
        if (excludeTags.length > 0) {
          match = match && !excludeTags.some(tag => nodeTags.includes(tag) || nodeLocationTags.includes(tag) || nodePersonTags.includes(tag));
        }
        if (locationTags.length > 0) {
          match = match && locationTags.every(tag => nodeLocationTags.includes(tag));
        }
        if (personTags.length > 0) {
          match = match && personTags.every(tag => nodePersonTags.includes(tag));
        }

        let matchesDates = true; // Assume true if no date filters
        if (startDate || endDate) {
          const nodeStartDate = nodeData.startDate ? new Date(nodeData.startDate) : null;
          const nodeEndDate = nodeData.endDate ? new Date(nodeData.endDate) : null;
          const nodeSingleDate = nodeData.date ? new Date(nodeData.date) : null;
          const filterStartDateObj = startDate ? new Date(startDate) : null;
          const filterEndDateObj = endDate ? new Date(endDate) : null;
          if (!nodeStartDate && !nodeEndDate && !nodeSingleDate) {
            matchesDates = false; // Node has no date info, so it cannot match an active date filter
          } else if (nodeStartDate && nodeEndDate) { // Node is a period
            matchesDates = 
                (!filterStartDateObj || (nodeEndDate.getTime() >= filterStartDateObj.getTime())) && 
                (!filterEndDateObj || (nodeStartDate.getTime() <= filterEndDateObj.getTime()));
          } else if (nodeSingleDate) { // Node is a point in time
            matchesDates = 
                (!filterStartDateObj || (nodeSingleDate.getTime() >= filterStartDateObj.getTime())) && 
                (!filterEndDateObj || (nodeSingleDate.getTime() <= filterEndDateObj.getTime()));
          } else {
            matchesDates = false;
          }
          match = match && matchesDates;
        }
        
        return { ...node, data: { ...node.data, isDimmed: !match } };
      })
    );

    setEdges(prevEdges => 
        prevEdges.map(edge => {
            // An edge is dimmed if either its source or target node is dimmed (after the node update)
            // Or if there are active filters and the edge itself doesn't have specific filterable data (which is usually the case)
            // For now, simple logic: if no active filters, edge is not dimmed. Otherwise, it *could* be dimmed based on its nodes.
            if (!hasActiveFilters) {
                return { ...edge, className: edge.className?.replace('dimmed-edge', '').trim() };
            }
            // Check connected nodes after nodes state has been updated. This requires a more complex effect dependency or check.
            // For now, we'll rely on a subsequent re-render or a slightly delayed check.
            // A simple heuristic: if ANY filter is active, edges CAN be dimmed. We'll rely on CSS for nodes.
            // This part needs refinement to specifically dim edges connected to dimmed nodes.
            // A placeholder for more complex edge dimming:
            // const sourceNode = getNodes().find(n => n.id === edge.source);
            // const targetNode = getNodes().find(n => n.id === edge.target);
            // if (sourceNode?.data.isDimmed || targetNode?.data.isDimmed) {
            //    return { ...edge, className: `${edge.className || ''} dimmed-edge`.trim() };
            // }
            return { ...edge, className: edge.className?.replace('dimmed-edge', '').trim() }; // Default to not dimmed, CustomNode will handle its look
        })
    );

  }, [activeFilters, setNodes, setEdges, getNodes]); // Added getNodes here for potential edge dimming logic

  const handleApplyFilters = () => {
    setActiveFilters({
      includeTags: includeTagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      excludeTags: excludeTagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      locationTags: locationTagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      personTags: personTagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      startDate: startDateFilter,
      endDate: endDateFilter,
    });
  };

  const handleClearFilters = () => {
    setIncludeTagsInput('');
    setExcludeTagsInput('');
    setLocationTagsInput('');
    setPersonTagsInput('');
    setStartDateFilter('');
    setEndDateFilter('');
    setActiveFilters({});
  };


  const onConnect = useCallback((params) => {
    const linkType = prompt("Type de lien (produit, engendre, influe sur, mène à, motive, contextualise, permet, facilite, débouche sur, se concrétise par, précède, aboutit à, est suivi de, résulte en, provoque, dans un contexte de, vise à, démontre):", "est lié à");
    if (linkType) {
      let initialMarkerWidth;
      let initialMarkerHeight;
      if (alwaysMinimalist || currentZoom < SIMPLIFIED_VIEW_ZOOM_THRESHOLD) {
        initialMarkerWidth = SIMPLIFIED_ARROW_SIZE;
        initialMarkerHeight = SIMPLIFIED_ARROW_SIZE;
      } else {
        const scale = 1 / currentZoom;
        const scaledSize = BASE_ARROW_SIZE * scale;
        initialMarkerWidth = Math.max(
            BASE_ARROW_SIZE * MIN_ARROW_SCALE,
            Math.min(scaledSize, BASE_ARROW_SIZE * MAX_ARROW_SCALE)
        );
        initialMarkerHeight = initialMarkerWidth;
      }
      const newEdge = {
        ...params,
        id: uuidv4(),
        type: 'smoothstep',
        label: linkType,
        markerEnd: { type: 'arrowclosed', width: initialMarkerWidth, height: initialMarkerHeight },
        style: { strokeWidth: 2.5, stroke: '#546e7a' },
        labelStyle: { fill: '#333', fontWeight: 500, fontSize: 11 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 2,
        labelBgStyle: { fill: '#fff', fillOpacity: 0.7 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }
  }, [setEdges, currentZoom, alwaysMinimalist]);

  const addNode = useCallback((type, parentId = null) => {
    const label = prompt(`Entrez le nom/texte pour ce nouveau ${type}:`, `Nouveau ${type}`);
    if (!label) return;

    const id = uuidv4();
    let newNodeData = { label }; // Base data
    // Prompt for additional data for new nodes
    if (type !== 'Période' && type !== 'Événement') { // i.e. for Fait, Contexte, etc.
        const tagsStr = prompt("Tags (séparés par virgule):", "");
        if (tagsStr) newNodeData.tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
        const locTagsStr = prompt("Tags Lieu (séparés par virgule):", "");
        if (locTagsStr) newNodeData.locationTags = locTagsStr.split(',').map(t => t.trim()).filter(Boolean);
        const personTagsStr = prompt("Tags Personne (séparés par virgule):", "");
        if (personTagsStr) newNodeData.personTags = personTagsStr.split(',').map(t => t.trim()).filter(Boolean);
        const nodeDate = prompt("Date (YYYY-MM-DD ou laisser vide si période):", "");
        if (nodeDate) newNodeData.date = nodeDate;
    } else if (type === 'Période' || type === 'Événement') {
        const startDate = prompt("Date de début (YYYY-MM-DD, optionnel):", "");
        if (startDate) newNodeData.startDate = startDate;
        const endDate = prompt("Date de fin (YYYY-MM-DD, optionnel):", "");
        if (endDate) newNodeData.endDate = endDate;
    }


    let newNode;
    let position;
    const parentNode = parentId ? getNode(parentId) : null;

    const DEFAULT_NODE_WIDTH = 150;
    const DEFAULT_NODE_HEIGHT = 50;

    if (parentNode) {
      const childNodes = getNodes().filter(n => n.parentNode === parentId);
      position = { x: 20, y: (childNodes.length * 80) + 40 }; 
      setTimeout(() => {
        const nodesToFit = [ parentNode, ...childNodes, { id, position, width: DEFAULT_NODE_WIDTH, height: DEFAULT_NODE_HEIGHT, parentNode: parentId }];
        const parentWidth = parentNode.width || 500; 
        const parentHeight = parentNode.height || 300;
        const rect = getRectOfNodes(nodesToFit.map(n => getNode(n.id) || n)); 
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
        newNode = { id, type: 'period', position, data: newNodeData };
        break;
      case 'Événement':
        if (!parentId) { alert("Sélectionnez une Période."); return; }
        newNode = { id, type: 'event', position, parentNode: parentId, extent: 'parent', data: newNodeData };
        break;
      default: // Fait, Contexte, Vécu, Action, Encapacitation
        if (!parentId) { alert("Sélectionnez un Événement."); return; }
        newNode = { id, type: 'element', position, parentNode: parentId, extent: 'parent', data: { ...newNodeData, elementType: type, id } };
        break;
    }
    setNodes((nds) => nds.concat(newNode));
  }, [project, getNode, getNodes, setNodes, setViewport, getRectOfNodes, fitBounds]);

  const onNodeDoubleClick = useCallback((event, node) => {
    const newLabel = prompt("Modifier le nom/texte:", node.data.label);
    if (newLabel !== null && newLabel !== node.data.label) {
      const updatedNodeData = { ...node.data, label: newLabel };
      // Allow editing other fields too
      const tagsStr = prompt("Modifier Tags (séparés par virgule):", (node.data.tags || []).join(', '));
      if (tagsStr !== null) updatedNodeData.tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      
      const locTagsStr = prompt("Modifier Tags Lieu:", (node.data.locationTags || []).join(', '));
      if (locTagsStr !== null) updatedNodeData.locationTags = locTagsStr.split(',').map(t => t.trim()).filter(Boolean);

      const personTagsStr = prompt("Modifier Tags Personne:", (node.data.personTags || []).join(', '));
      if (personTagsStr !== null) updatedNodeData.personTags = personTagsStr.split(',').map(t => t.trim()).filter(Boolean);

      if (node.type === 'Période' || node.type === 'Événement') {
        const startDate = prompt("Modifier Date de début (YYYY-MM-DD):", node.data.startDate || "");
        if (startDate !== null) updatedNodeData.startDate = startDate;
        const endDate = prompt("Modifier Date de fin (YYYY-MM-DD):", node.data.endDate || "");
        if (endDate !== null) updatedNodeData.endDate = endDate;
      } else if (node.type === 'element') {
        const nodeDate = prompt("Modifier Date (YYYY-MM-DD):", node.data.date || "");
        if (nodeDate !== null) updatedNodeData.date = nodeDate;
      }

      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: updatedNodeData } : n
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
      setEdges(adjustMarkersForZoom([], currentZoom));
      setNewTrajectoryName('');
      handleClearFilters(); // Clear filters on new trajectory
    } catch (error) { console.error("Erreur création:", error); alert("Échec création."); }
  };

  const handleLoadTrajectory = async (trajectoryIdToLoad) => {
    try {
      const response = await axios.get(`${API_URL}/${trajectoryIdToLoad}`);
      const trajectoryData = response.data;
      setNodes(trajectoryData.nodes || []);
      setEdges(adjustMarkersForZoom(trajectoryData.edges || [], currentZoom));
      setCurrentTrajectoryId(trajectoryIdToLoad);
      setCurrentTrajectoryName(trajectoryData.subjectName);
      handleClearFilters(); // Clear filters on load
      setTimeout(() => fitView({ padding: 0.1, duration: 300 }), 100);
    } catch (error) { console.error("Erreur chargement:", error); alert("Échec chargement."); }
  };

  const handleSaveTrajectory = async () => {
    if (!currentTrajectoryId) { alert("Aucune trajectoire chargée."); return; }
    try {
      // Remove transient properties like isDimmed before saving
      const cleanNodes = nodes.map(({ selected, dragging, positionAbsolute, data, ...rest }) => {
        // eslint-disable-next-line no-unused-vars
        const { isDimmed, ...restData } = data; 
        return {...rest, data: restData};
      });

      const edgesToSave = edges.map(edge => {
        // eslint-disable-next-line no-unused-vars
        const { selected, className, ...restOfEdge } = edge; // Remove className used for dimming
        return {
          ...restOfEdge,
          markerEnd: { // Save base marker size
            ...(edge.markerEnd || { type: 'arrowclosed' }),
            width: BASE_ARROW_SIZE,
            height: BASE_ARROW_SIZE,
          }
        };
      });
      const payload = {
        subjectName: currentTrajectoryName,
        nodes: cleanNodes,
        edges: edgesToSave,
      };
      await axios.put(`${API_URL}/${currentTrajectoryId}`, payload);
      alert(`Trajectoire "${currentTrajectoryName}" sauvegardée !`);
      fetchTrajectories(); 
    } catch (error) { console.error("Erreur sauvegarde:", error); alert("Échec sauvegarde."); }
  };

  const handleAutoLayout = useCallback(() => {
    setNodes((nds) => {
      const updatedNodes = autoLayout(nds, getNodes); 
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 });
      }, 0);
      return updatedNodes;
    });
  }, [setNodes, fitView, getNodes]);

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      const allNodeIdsToDelete = new Set(deletedNodes.map(n => n.id));
      const currentGraphNodes = getNodes(); 
      function findChildrenRecursive(parentId) {
        currentGraphNodes.forEach(n => {
          if (n.parentNode === parentId) {
            allNodeIdsToDelete.add(n.id);
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
    },
    [getNodes, setEdges] 
  );

  const getSelectedNode = () => nodes.find(n => n.selected);

  const loadPrecreatedInesMadani = async () => {
    const { nodes: precreatedNodesData, edges: precreatedEdgesData } = inesMadaniPrecreatedData();
    const precreatedTrajectoryId = 'ines-madani-precreated';
    const precreatedTrajectoryName = "Inès Madani (Prédéfinie)";

    const existing = trajectories.find(t => t.id === precreatedTrajectoryId);
    if (!existing) {
      setTrajectories(prev => [...prev, {id: precreatedTrajectoryId, subjectName: precreatedTrajectoryName}]);
    }
    setCurrentTrajectoryId(precreatedTrajectoryId);
    setCurrentTrajectoryName(precreatedTrajectoryName);
    const adjustedPrecreatedEdges = adjustMarkersForZoom(precreatedEdgesData, currentZoom);
    setNodes(precreatedNodesData); // Data now includes tags, dates etc.
    setEdges(adjustedPrecreatedEdges);
    handleClearFilters(); // Clear filters for precreated
    setTimeout(() => fitView({ padding: 0.1, duration: 500 }), 100);

    const edgesToSaveForPrecreated = precreatedEdgesData.map(edge => {
        // eslint-disable-next-line no-unused-vars
        const { selected, ...restOfEdge } = edge;
        return {
          ...restOfEdge,
          markerEnd: {
            ...(edge.markerEnd || { type: 'arrowclosed' }),
            width: BASE_ARROW_SIZE, 
            height: BASE_ARROW_SIZE,
          }
        };
      });
    const payload = {
      subjectName: precreatedTrajectoryName,
      nodes: precreatedNodesData.map(({ selected, dragging, positionAbsolute, ...rest }) => ({...rest, data: {...rest.data}})),
      edges: edgesToSaveForPrecreated,
    };
    try {
        await axios.put(`${API_URL}/${precreatedTrajectoryId}`, payload);
    } catch (err) {
        if (err.response && err.response.status === 404) {
            try {
                await axios.post(API_URL, { id: precreatedTrajectoryId, ...payload }); 
            } catch (creationError) {
                console.error("Error auto-creating precreated trajectory:", creationError);
            }
        } else {
            console.error("Error auto-saving precreated trajectory (PUT failed):", err);
        }
    } finally {
        fetchTrajectories(); 
        alert(`Trajectoire prédéfinie "${precreatedTrajectoryName}" chargée et synchronisée.`);
    }
  };

  const handleNodeSelectFromTreeView = useCallback((nodeId) => {
    const node = getNode(nodeId);
    if (node) {
      const nodeToFit = { ...node, width: node.width || 150, height: node.height || 50 };
      const bounds = getRectOfNodes([nodeToFit]);
      fitBounds(bounds, { padding: 0.2, duration: 600 });
      setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === nodeId, })));
    }
  }, [getNode, fitBounds, setNodes, getRectOfNodes]);

  return (
    <div className="app-container">
      <div className="main-controls-bar">
        {/* Trajectory Management */}
        <input
          type="text"
          placeholder="Nom du Sujet (Nouvelle Trajectoire)"
          value={newTrajectoryName}
          onChange={(e) => setNewTrajectoryName(e.target.value)}
        />
        <button onClick={handleCreateTrajectory}>Créer & Charger</button>
        <button onClick={handleSaveTrajectory} disabled={!currentTrajectoryId}>
          Sauvegarder
        </button>
        <button onClick={handleAutoLayout}>Auto-Layout</button>
        <button 
          onClick={() => setAlwaysMinimalist(prev => !prev)}
          style={{ backgroundColor: alwaysMinimalist ? '#a5d6a7' : '#eceff1' }}
        >
          {alwaysMinimalist ? "Désactiver" : "Activer"} Toujours Minimaliste
        </button>
        <div className="view-mode-toggle">
          <span>Mode d'affichage: </span>
          <button onClick={() => setViewMode('temporal')} disabled={viewMode === 'temporal'}>Temporel</button>
          <button onClick={() => setViewMode('lifePlans')} disabled={viewMode === 'lifePlans'}>Plans de Vie</button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="filter-controls-bar">
        <input type="text" placeholder="Inclure tags (ex: tag1,tag2)" value={includeTagsInput} onChange={e => setIncludeTagsInput(e.target.value)} />
        <input type="text" placeholder="Exclure tags (ex: tagA,tagB)" value={excludeTagsInput} onChange={e => setExcludeTagsInput(e.target.value)} />
        <input type="text" placeholder="Tags Lieu (ex: Paris,Syrie)" value={locationTagsInput} onChange={e => setLocationTagsInput(e.target.value)} />
        <input type="text" placeholder="Tags Personne (ex: AnissaM)" value={personTagsInput} onChange={e => setPersonTagsInput(e.target.value)} />
        <input type="date" title="Date de début filtre" value={startDateFilter} onChange={e => setStartDateFilter(e.target.value)} />
        <input type="date" title="Date de fin filtre" value={endDateFilter} onChange={e => setEndDateFilter(e.target.value)} />
        <button onClick={handleApplyFilters}>Appliquer Filtres</button>
        <button onClick={handleClearFilters}>Effacer Filtres</button>
      </div>

      <div className="status-bar">
        {currentTrajectoryId ? (
          <span>Trajectoire : <strong>{currentTrajectoryName}</strong> | Vue : <strong>{viewMode === 'temporal' ? 'Temporelle' : 'Plans de Vie'}</strong></span>
        ) : (
          <span>Aucune trajectoire chargée.</span>
        )}
      </div>
      <div className="content-area">
        <div className="sidebar">
          <div className="trajectory-list">
            <h3>Trajectoires Sauvegardées :</h3>
            {trajectories.length === 0 ? (
              <p>Aucune trajectoire.</p>
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
                else alert("Sélectionnez une Période.");
              }} 
              disabled={!getSelectedNode() || getSelectedNode()?.type !== 'period'}>
              Ajouter Événement
            </button>
            {['Fait', 'Contexte', 'Vécu', 'Action', 'Encapacitation'].map(type => (
              <button style={{marginTop:'5px', width:'100%'}} key={type} 
                onClick={() => {
                  const selected = getSelectedNode();
                  if (selected && selected.type === 'event') addNode(type, selected.id);
                  else alert("Sélectionnez un Événement.");
                }} 
                disabled={!getSelectedNode() || getSelectedNode()?.type !== 'event'}>
                {`Ajouter ${type}`}
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
        <div className="treeview-panel-right">
          <TreeView nodes={nodes} onNodeClick={handleNodeSelectFromTreeView} />
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ReactFlowProvider>
      <ViewModeProvider>
        <TrajectoryAppContent />
      </ViewModeProvider>
    </ReactFlowProvider>
  );
}
