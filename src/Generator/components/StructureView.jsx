import React, { useState } from 'react';
import {
  BsSquare, BsCardHeading, BsTextParagraph, BsLayoutSplit,
  BsLayoutThreeColumns, BsCodeSlash, BsBricks, BsLayoutTextSidebarReverse,
  BsListUl, BsInputCursorText, BsInputCursor,
  BsMenuButtonWide, BsTextareaT, BsTag, BsImage, BsVectorPen,
  BsTable, BsLink45Deg
} from 'react-icons/bs';
import { RxButton } from "react-icons/rx";
import { BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6 } from "react-icons/bs";

import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import './StructureView.scss';

const ICONS = {
  // Layout
  section: <BsLayoutSplit />,
  container: <BsLayoutThreeColumns />,
  div: <BsSquare />,
  block: <BsBricks />,

  // Typography
  heading: <BsTypeH1 />,
  h1: <BsTypeH1 />,
  h2: <BsTypeH2 />,
  h3: <BsTypeH3 />,
  h4: <BsTypeH4 />,
  h5: <BsTypeH5 />,
  h6: <BsTypeH6 />,
  p: <BsTextParagraph />,
  span: <BsTextParagraph />,
  'text-basic': <BsTextParagraph />,

  // Navigation
  nav: <BsLayoutTextSidebarReverse />,
  menu: <BsListUl />,

  // Forms
  form: <BsInputCursorText />,

  // Media
  img: <BsImage />,
  picture: <BsImage />,
  figure: <BsImage />,
  svg: <BsVectorPen />,

  // Tables
  table: <BsTable />,
  thead: <BsTable />,
  tbody: <BsTable />,
  tr: <BsTable />,
  th: <BsTable />,
  td: <BsTable />,

  // Interactive
  a: <BsLink45Deg />,
  button: <RxButton />,

  // Code
  code: <BsCodeSlash />,
  pre: <BsCodeSlash />,

  // Default
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
      // icon: ICONS[element.name] || ICONS.default,
      icon: ICONS[element.settings.tag] || ICONS.default,
      label: element.name || 'div',
      // label: element.settings.tag || 'div',
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