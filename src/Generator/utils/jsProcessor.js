// JavaScript processing utilities

export function processJavaScript(js, globalElements = []) {
  if (!js.trim()) return { globalElements };
  
  const scriptId = getUniqueId();
  const containerId = getUniqueId();
  
  globalElements.push({
    id: scriptId,
    name: 'code',
    settings: {
      code: js,
      execute: true,
      codeType: 'js',
      _position: 'after',
    },
  });
  
  return {
    container: {
      id: containerId,
      name: 'container',
      settings: { _hidden: true },
      children: [scriptId],
    },
    globalElements
  };
}

// Helper function to generate unique IDs
function getUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
