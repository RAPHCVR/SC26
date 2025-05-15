export function autoLayout(nodes) {
  const widthDefault = { period: 350, event: 300, element: 180 };
  const heightDefault = { period: 250, event: 200, element: 60 };
  const eventSpacing = 50;
  const elementSpacing = 20;
  const periodHeaderYOffset = 60;
  const eventHeaderYOffset = 40;
  const eventXOffset = 20;
  const elementXOffset = 20;

  const newNodes = nodes.map(n => ({ ...n }));

  // 1. Reposition events within their parent periods
  const events = newNodes.filter(n => n.type === 'event');
  const groupedEvents = events.reduce((acc, ev) => {
    if (!ev.parentNode) return acc;
    acc[ev.parentNode] = acc[ev.parentNode] || [];
    acc[ev.parentNode].push(ev);
    return acc;
  }, {});
  Object.values(groupedEvents).forEach(evs => {
    evs.forEach((ev, i) => {
      const w = ev.width || widthDefault.event;
      ev.position = {
        x: eventXOffset + i * (w + eventSpacing),
        y: periodHeaderYOffset,
      };
    });
  });

  // 2. Reposition elements within their parent events
  const elements = newNodes.filter(n => n.type === 'element');
  const groupedEls = elements.reduce((acc, el) => {
    if (!el.parentNode) return acc;
    acc[el.parentNode] = acc[el.parentNode] || [];
    acc[el.parentNode].push(el);
    return acc;
  }, {});
  Object.values(groupedEls).forEach(els => {
    els.forEach((el, i) => {
      const h = el.height || heightDefault.element;
      el.position = {
        x: elementXOffset,
        y: eventHeaderYOffset + i * (h + elementSpacing),
      };
    });
  });

  return newNodes;
}