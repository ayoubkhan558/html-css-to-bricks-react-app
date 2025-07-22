import React, { useState } from 'react';
import {
  BsLayoutTextSidebar, BsSquare, BsCardHeading, BsTextParagraph,
  BsLayoutSplit, BsLayoutThreeColumns, BsCodeSlash, BsBricks
} from 'react-icons/bs';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import './StructureView.scss';

const ICONS = {
  section: <BsLayoutSplit />,
  container: <BsLayoutThreeColumns />,
  div: <BsSquare />,
  block: <BsBricks />,
  heading: <BsCardHeading />,
  'text-basic': <BsTextParagraph />,
  code: <BsCodeSlash />,
  default: <BsSquare />,
};

const StructureView = ({ data, globalClasses, activeIndex, showNodeClass }) => {
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

  const getElementInfo = (element) => {
    const info = {
      icon: ICONS[element.name] || ICONS.default,
      label: element.name || 'div',
      className: '',
    };

    if (element.settings?._cssGlobalClasses?.length > 0) {
      const classId = element.settings._cssGlobalClasses[0];
      const globalClass = globalClasses.find(gc => gc.id === classId);
      if (globalClass) {
        info.className = `.${globalClass.name}`;
      }
    }
    return info;
  };

  const TreeNode = ({ node }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children.length > 0;
    const { icon, label, className } = getElementInfo(node);
    const isActive = node._order === activeIndex;

    return (
      <li className={isActive ? 'active' : ''}>
        <div className={`node-content${isActive ? ' active' : ''}`} onClick={() => hasChildren && setIsOpen(!isOpen)}>
          <span className="node-toggle">
            {hasChildren ? (isOpen ? <FiChevronDown /> : <FiChevronRight />) : <span className="no-toggle"></span>}
          </span>
          <span className="node-icon">{icon}</span>
          {showNodeClass ? (
            <span className="node-class">{className}</span>
          ) : (
            <span className="node-tag">{label}</span>
          )}
        </div>
        {hasChildren && isOpen && (
          <ul>
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="structure-view">
      <ul>
        {roots.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </ul>
    </div>
  );
};

export default StructureView;