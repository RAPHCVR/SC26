// frontend/src/CustomNodes.js
import React, { memo, useEffect, useState } from 'react';
import { Handle, Position, useStore, NodeResizer } from 'reactflow';
import { useViewMode } from './ViewModeContext';

const useNodeChildBounds = (nodeId) => {
  const childNodes = useStore((store) => store.getNodes().filter(n => n.parentNode === nodeId));
  if (childNodes.length === 0) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  childNodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    const width = node.width || 150;
    const height = node.height || 50;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  return { width: maxX - minX + 40, height: maxY - minY + 60 };
};

const PeriodNodeComponent = ({ id, data, selected }) => {
  const currentZoom = useStore((store) => store.transform[2]);
  const { viewMode, alwaysMinimalist } = useViewMode();
  const zoomThreshold = 0.3; // SIMPLIFIED_VIEW_ZOOM_THRESHOLD
  const childBounds = useNodeChildBounds(id);
  const [size, setSize] = useState({ width: 350, height: 250 });

  useEffect(() => {
    if (!childBounds) return;
    const { width: cbWidth, height: cbHeight } = childBounds;
    setSize(prevSize => {
      const newWidth = Math.max(prevSize.width, cbWidth);
      const newHeight = Math.max(prevSize.height, cbHeight);
      if (newWidth !== prevSize.width || newHeight !== prevSize.height) {
        return { width: newWidth, height: newHeight };
      }
      return prevSize;
    });
  }, [childBounds?.width, childBounds?.height]);

  let containerClasses = `custom-node period-node ${selected ? 'selected' : ''}`;
  if (viewMode === 'lifePlans' && !alwaysMinimalist) {
    containerClasses += ' dim-parent-in-plan-view';
  }

  if (alwaysMinimalist || currentZoom < zoomThreshold) {
    return (
      <div
        className={`${containerClasses} simplified-node`} // simplified-node est utilisé par Period et Event
        style={{ width: '100px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
      >
        <span className="custom-node-label" style={{ fontSize: '10px', borderBottom: 'none', paddingBottom: '0', whiteSpace: 'normal' }}>{data.label}</span>
      </div>
    );
  } else {
    return (
      <div className={containerClasses} style={{ width: size.width, height: size.height }}>
        <NodeResizer minWidth={200} minHeight={150} isVisible={selected} />
        <span className="custom-node-label">Période</span>
        <div className="element-node-text">{data.label}</div>
      </div>
    );
  }
};

const EventNodeComponent = ({ id, data, selected }) => {
  const currentZoom = useStore((store) => store.transform[2]);
  const { viewMode, alwaysMinimalist } = useViewMode();
  const zoomThreshold = 0.3; // SIMPLIFIED_VIEW_ZOOM_THRESHOLD
  const childBounds = useNodeChildBounds(id);
  const [size, setSize] = useState({ width: 300, height: 200 });

  useEffect(() => {
    if (!childBounds) return;
    const { width: cbWidth, height: cbHeight } = childBounds;
    setSize(prevSize => {
      const newWidth = Math.max(prevSize.width, cbWidth);
      const newHeight = Math.max(prevSize.height, cbHeight);
      if (newWidth !== prevSize.width || newHeight !== prevSize.height) {
        return { width: newWidth, height: newHeight };
      }
      return prevSize;
    });
  }, [childBounds?.width, childBounds?.height]);

  let containerClasses = `custom-node event-node ${selected ? 'selected' : ''}`;
  if (viewMode === 'lifePlans' && !alwaysMinimalist) {
    containerClasses += ' dim-parent-in-plan-view';
  }

  if (alwaysMinimalist || currentZoom < zoomThreshold) {
    return (
      <div
        className={`${containerClasses} simplified-node`} // simplified-node est utilisé par Period et Event
        style={{ width: '80px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
      >
        <span className="custom-node-label" style={{ fontSize: '9px', borderBottom: 'none', paddingBottom: '0', whiteSpace: 'normal' }}>{data.label}</span>
      </div>
    );
  } else {
    return (
      <div className={containerClasses} style={{ width: size.width, height: size.height }}>
        <NodeResizer minWidth={150} minHeight={100} isVisible={selected} />
        <span className="custom-node-label">Événement</span>
        <div className="element-node-text">{data.label}</div>
      </div>
    );
  }
};

const ElementNodeComponent = ({ id, data, selected }) => {
  const currentZoom = useStore((store) => store.transform[2]);
  const { viewMode, alwaysMinimalist } = useViewMode();
  const zoomThreshold = 0.3; // SIMPLIFIED_VIEW_ZOOM_THRESHOLD
  const elementType = data.elementType || 'Élément';

  // Base classes for normal view, also used for simplified view for color/highlighting
  let elementClasses = `custom-node element-node ${elementType.replace(/\s+/g, '-')} ${selected ? 'selected' : ''}`;

  if (viewMode === 'lifePlans') {
    if (elementType === 'Action' || elementType === 'Encapacitation') {
      elementClasses += ' highlight-plan-element';
    } else {
      elementClasses += ' dim-plan-element';
    }
  }

  if (alwaysMinimalist || currentZoom < zoomThreshold) {
    let shapeSpecificClass = '';
    let shapeContent = null; // For Unicode symbols like stars

    switch (elementType) {
      case 'Fait':
        shapeSpecificClass = 'shape-square';
        break;
      case 'Contexte':
        shapeSpecificClass = 'shape-diamond';
        break;
      case 'Vécu':
        shapeSpecificClass = 'shape-circle';
        break;
      case 'Action':
        shapeSpecificClass = 'shape-triangle';
        break;
      case 'Encapacitation':
        shapeSpecificClass = 'shape-star';
        shapeContent = '★'; // Unicode star symbol
        break;
      default:
        shapeSpecificClass = 'shape-default-circle'; // Fallback shape
        break;
    }

    // Combine base styling for simplified elements, element-type specific classes (for color/effects), and shape class
    const finalSimplifiedClasses = `simplified-element-base ${elementClasses} ${shapeSpecificClass}`;

    return (
      <div
        className={finalSimplifiedClasses}
        style={{
          width: '30px', // Fixed size for all simplified elements
          height: '30px',
        }}
        title={data.label}
      >
        {shapeContent && <span className="shape-symbol">{shapeContent}</span>}
        <Handle type="target" position={Position.Left} id={`target-element-${data.id}-simple`} style={{width:'5px', height:'5px', left:'-3px', top:'50%', transform:'translateY(-50%)', zIndex: 5}} />
        <Handle type="source" position={Position.Right} id={`source-element-${data.id}-simple`} style={{width:'5px', height:'5px', right:'-3px', top:'50%', transform:'translateY(-50%)', zIndex: 5}}/>
      </div>
    );
  } else {
    // Normal view rendering
    return (
      <div className={elementClasses}>
        <NodeResizer minWidth={180} minHeight={60} isVisible={selected} />
        <Handle type="target" position={Position.Left} id={`target-element-${data.id}`} />
        <span className="custom-node-label">{elementType}</span>
        <div className="element-node-text">{data.label}</div>
        <Handle type="source" position={Position.Right} id={`source-element-${data.id}`} />
      </div>
    );
  }
};

export const PeriodNode = memo(PeriodNodeComponent);
export const EventNode = memo(EventNodeComponent);
export const ElementNode = memo(ElementNodeComponent);