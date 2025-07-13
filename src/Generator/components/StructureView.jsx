import React from 'react';
import './StructureView.scss';

const StructureView = ({ data, globalClasses }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const elementsById = data.reduce((acc, el) => {
    acc[el.id] = { ...el, children: [] };
    return acc;
  }, {});

  const roots = [];
  data.forEach(el => {
    if (el.parent && elementsById[el.parent]) {
      elementsById[el.parent].children.push(elementsById[el.id]);
    } else {
      roots.push(elementsById[el.id]);
    }
  });

  const getElementName = (element) => {
    if (element.settings?._cssGlobalClasses?.length > 0) {
      const classId = element.settings._cssGlobalClasses[0];
      const globalClass = globalClasses.find(gc => gc.id === classId);
      if (globalClass) {
        return `.${globalClass.name}`;
      }
    }
    return element.label || element.name;
  };

  const renderTree = (nodes) => (
    <ul>
      {nodes.map(node => (
        <li key={node.id}>
          <span>{getElementName(node)}</span>
          {node.children.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="structure-view">
      {renderTree(roots)}
    </div>
  );
};

export default StructureView;