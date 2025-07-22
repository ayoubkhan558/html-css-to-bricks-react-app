import { getUniqueId } from './utils';
// JavaScript processing utilities

export function processJavaScript(js, parentId = '0') {
  if (!js || !js.trim()) return null;

  return {
    id: getUniqueId(),
    name: 'code',
    // parent: parentId,
    children: [],
    settings: {
      executeCode: true,
      noRoot: true,
      javascriptCode: js.trim()
    }
  };
}


