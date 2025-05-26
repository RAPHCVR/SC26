import React from 'react';

const TreeView = ({ nodes, onNodeClick }) => {
  const buildTree = (allNodes) => {
    const tree = [];
    const nodeMap = {}; // For quick lookup

    // Initialize map and top-level nodes (periods)
    allNodes.forEach(node => {
      nodeMap[node.id] = { ...node, children: [] };
      if (!node.parentNode) {
        if (node.type === 'period') { // Assuming periods are top-level
          tree.push(nodeMap[node.id]);
        }
      }
    });

    // Populate children for events and elements
    allNodes.forEach(node => {
      if (node.parentNode && nodeMap[node.parentNode]) {
        if (node.type === 'event' && nodeMap[node.parentNode].type === 'period') {
          nodeMap[node.parentNode].children.push(nodeMap[node.id]);
        } else if (node.type === 'element' && nodeMap[node.parentNode].type === 'event') {
          // Check if parent (event) is already part of a period's children
          let eventNodeInTree = null;
          tree.forEach(p => {
             const foundEvent = p.children.find(ev => ev.id === node.parentNode);
             if (foundEvent) eventNodeInTree = foundEvent;
          });
          if (eventNodeInTree) {
             eventNodeInTree.children.push(nodeMap[node.id]);
          } else {
             // This case might happen if an event has no period parent, or data is inconsistent
             // Or if we decide to list events without parents too (not typical for this structure)
          }
        }
      }
    });
    return tree;
  };

  const hierarchy = buildTree(nodes);

  const renderNode = (node, level = 0) => (
    <li key={node.id} style={{ paddingLeft: `${level * 20}px`, cursor: 'pointer' }} 
        onClick={() => onNodeClick(node.id)}
        title={node.data.label}>
      {node.data.label} ({node.type})
      {node.children && node.children.length > 0 && (
        <ul>{node.children.map(child => renderNode(child, level + 1))}</ul>
      )}
    </li>
  );

  if (!nodes || nodes.length === 0) {
    return <p>Aucun élément à afficher dans l'arborescence.</p>;
  }

  return (
    <div className="tree-view-container">
      <h3>Arborescence du Projet</h3>
      <ul>
        {hierarchy.map(node => renderNode(node))}
      </ul>
    </div>
  );
};

export default TreeView;
