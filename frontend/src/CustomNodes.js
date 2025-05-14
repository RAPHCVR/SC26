import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useStore, NodeResizer } from 'reactflow';

// Hook pour la taille des enfants (simplifié)
const useNodeChildBounds = (nodeId) => {
  const nodes = useStore((store) => store.getNodes().filter(n => n.parentNode === nodeId));
  if (nodes.length === 0) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    const width = node.width || 150; // Estimation si pas de width
    const height = node.height || 50; // Estimation

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  return { width: maxX - minX + 40, height: maxY - minY + 60 }; // + padding
};


const PeriodNodeComponent = ({ id, data, selected }) => {
  const childBounds = useNodeChildBounds(id);
  const [size, setSize] = useState({ width: 350, height: 250 }); // Taille initiale

  useEffect(() => {
    if (childBounds) {
      setSize(prevSize => ({
        width: Math.max(prevSize.width, childBounds.width),
        height: Math.max(prevSize.height, childBounds.height)
      }));
    }
  }, [childBounds]);

  return (
    <div
      className={`custom-node period-node ${selected ? 'selected' : ''}`}
      style={{ width: size.width, height: size.height }}
    >
      <NodeResizer minWidth={200} minHeight={150} isVisible={selected} />
      <span className="custom-node-label">Période</span>
      <div className="element-node-text">{data.label}</div>
    </div>
  );
};

const EventNodeComponent = ({ id, data, selected }) => {
  const childBounds = useNodeChildBounds(id);
  const [size, setSize] = useState({ width: 300, height: 200 }); // Taille initiale

  useEffect(() => {
    if (childBounds) {
      setSize(prevSize => ({
        width: Math.max(prevSize.width, childBounds.width),
        height: Math.max(prevSize.height, childBounds.height)
      }));
    }
  }, [childBounds]);

  return (
    <div
      className={`custom-node event-node ${selected ? 'selected' : ''}`}
      style={{ width: size.width, height: size.height }}
    >
      <NodeResizer minWidth={150} minHeight={100} isVisible={selected} />
      <span className="custom-node-label">Événement</span>
      <div className="element-node-text">{data.label}</div>
    </div>
  );
};

const ElementNodeComponent = ({ data, selected }) => {
  const elementType = data.elementType || 'Élément';
  return (
    <div className={`custom-node element-node ${elementType} ${selected ? 'selected' : ''}`}>
      <NodeResizer minWidth={180} minHeight={60} isVisible={selected} />
      <Handle type="target" position={Position.Left} id={`target-${data.id}`} />
      <span className="custom-node-label">{elementType}</span>
      <div className="element-node-text">{data.label}</div>
      <Handle type="source" position={Position.Right} id={`source-${data.id}`} />
    </div>
  );
};

export const PeriodNode = memo(PeriodNodeComponent);
export const EventNode = memo(EventNodeComponent);
export const ElementNode = memo(ElementNodeComponent);