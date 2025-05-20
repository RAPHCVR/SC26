import React, { memo, useEffect, useState } from 'react';
import { Handle, Position, useStore, NodeResizer } from 'reactflow';

// Hook to calculate the bounding box of child nodes for a given parent node ID.
// This is used by parent nodes (Period, Event) to auto-adjust their size.
const useNodeChildBounds = (nodeId) => {
  // Access React Flow's internal store to get all nodes.
  // Filter nodes to get only direct children of the specified nodeId.
  const childNodes = useStore((store) => store.getNodes().filter(n => n.parentNode === nodeId));

  if (childNodes.length === 0) return null; // No children, no bounds to calculate.

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  childNodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    // Use actual node width/height if available, otherwise fallback to estimates.
    // These dimensions are relative to the parent node's coordinate system.
    const width = node.width || 150; 
    const height = node.height || 50;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  // Return the calculated width and height of the bounding box, adding some padding.
  return { 
    width: maxX - minX + 40, // 20px padding on each side
    height: maxY - minY + 60  // 30px padding on top/bottom (includes space for parent label)
  };
};

const PeriodNodeComponent = ({ id, data, selected }) => {
  const childBounds = useNodeChildBounds(id);
  const [size, setSize] = useState({ width: 350, height: 250 }); // Initial default size

  useEffect(() => {
    if (childBounds) {
      // Adjust size if childBounds are larger than current size.
      // This makes the node grow to accommodate children, but not shrink automatically.
      setSize(prevSize => ({
        width: Math.max(prevSize.width, childBounds.width),
        height: Math.max(prevSize.height, childBounds.height)
      }));
    }
  }, [childBounds]); // Re-run when childBounds change

  return (
    <div
      className={`custom-node period-node ${selected ? 'selected' : ''}`}
      style={{ width: size.width, height: size.height }}
    >
      <NodeResizer minWidth={200} minHeight={150} isVisible={selected} />
      <span className="custom-node-label">Période</span>
      <div className="element-node-text">{data.label}</div>
      {/* Handles are typically not needed for parent container nodes unless explicitly designed for linking */}
    </div>
  );
};

const EventNodeComponent = ({ id, data, selected }) => {
  const childBounds = useNodeChildBounds(id);
  const [size, setSize] = useState({ width: 300, height: 200 }); // Initial default size

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
      {/* Handles for event nodes if they can be directly linked, or if they act as pass-through for children */}
      {/* <Handle type="target" position={Position.Left} id={`target-event-${id}`} /> */}
      {/* <Handle type="source" position={Position.Right} id={`source-event-${id}`} /> */}
    </div>
  );
};

const ElementNodeComponent = ({ data, selected }) => {
  const elementType = data.elementType || 'Élément'; // Fallback elementType
  return (
    <div className={`custom-node element-node ${elementType.replace(/\s+/g, '-')} ${selected ? 'selected' : ''}`}>
      <NodeResizer minWidth={180} minHeight={60} isVisible={selected} />
      {/* Handles allow these nodes to be connected by edges. */}
      <Handle type="target" position={Position.Left} id={`target-element-${data.id}`} />
      <span className="custom-node-label">{elementType}</span>
      <div className="element-node-text">{data.label}</div>
      <Handle type="source" position={Position.Right} id={`source-element-${data.id}`} />
    </div>
  );
};

// Memoize components for performance, preventing re-renders if props haven't changed.
export const PeriodNode = memo(PeriodNodeComponent);
export const EventNode = memo(EventNodeComponent);
export const ElementNode = memo(ElementNodeComponent);