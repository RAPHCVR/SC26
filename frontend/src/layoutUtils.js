// Provides a simple automatic layout for nodes within their parent containers.
export function autoLayout(nodes) {
  // Default dimensions and spacing constants for layout calculation.
  const widthDefault = { period: 280, event: 220, element: 160 };
  const heightDefault = { period: 170, event: 160, element: 50 };
  
  const eventSpacing = 40; // Horizontal spacing between event nodes within a period.
  const elementSpacing = 60; // Vertical spacing between element nodes within an event.
  
  // Vertical offsets to position children below the parent's label/header area.
  const periodHeaderYOffset = 45; 
  const eventHeaderYOffset = 50;

  // Horizontal offsets for children from the parent's left edge.
  const eventXOffset = 30;
  const elementXOffset = 60;

  // Create a new array of nodes to avoid mutating the original state directly.
  const newNodes = nodes.map(n => ({ ...n }));

  // 1. Layout Event nodes within their parent Period nodes.
  // Events are typically laid out horizontally.
  const events = newNodes.filter(n => n.type === 'event');
  const groupedEventsByParent = events.reduce((acc, eventNode) => {
    if (!eventNode.parentNode) return acc; // Skip events without a parent
    acc[eventNode.parentNode] = acc[eventNode.parentNode] || [];
    acc[eventNode.parentNode].push(eventNode);
    return acc;
  }, {});

  Object.values(groupedEventsByParent).forEach(eventList => {
    eventList.forEach((eventNode, index) => {
      const eventWidth = eventNode.width || widthDefault.event;
      eventNode.position = {
        x: eventXOffset + index * (eventWidth + eventSpacing),
        y: periodHeaderYOffset,
      };
    });
  });

  // 2. Layout Element nodes within their parent Event nodes.
  // Elements are typically laid out vertically.
  const elements = newNodes.filter(n => n.type === 'element');
  const groupedElementsByParent = elements.reduce((acc, elementNode) => {
    if (!elementNode.parentNode) return acc; // Skip elements without a parent
    acc[elementNode.parentNode] = acc[elementNode.parentNode] || [];
    acc[elementNode.parentNode].push(elementNode);
    return acc;
  }, {});

  Object.values(groupedElementsByParent).forEach(elementList => {
    elementList.forEach((elementNode, index) => {
      const elementHeight = elementNode.height || heightDefault.element;
      elementNode.position = {
        x: elementXOffset,
        y: eventHeaderYOffset + index * (elementHeight + elementSpacing),
      };
    });
  });
  
  // Note: This function does not explicitly resize parent nodes.
  // Parent node resizing based on children content is handled within CustomNode components (PeriodNode, EventNode).
  // This layout positions top-level Period nodes based on their existing positions;
  // it does not attempt to arrange Period nodes relative to each other.

  return newNodes;
}