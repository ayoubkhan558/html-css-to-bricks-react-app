import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import './LimitationsModal.scss';

const LimitationsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal--lg limitations-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose}>
                    <FaTimes size={20} />
                </button>

                <div className="modal__content">
                    <h2><FaExclamationTriangle /> Known Limitations</h2>

                    <div className="limitation-section">
                        <h3>CSS Features</h3>
                        <ul>
                            <li>Complex CSS selectors (e.g., <code>:nth-child()</code>, <code>:has()</code>) may not be fully supported</li>
                            <li>Some advanced CSS properties might be added as custom CSS instead of mapped settings</li>
                            <li>Pseudo-elements (<code>::before</code>, <code>::after</code>) are preserved but may need manual adjustment</li>
                            <li>CSS Grid properties have limited mapping - complex grids may require custom CSS</li>
                        </ul>
                    </div>

                    <div className="limitation-section">
                        <h3>HTML Structure</h3>
                        <ul>
                            <li>Deeply nested structures (10+ levels) may have performance issues</li>
                            <li>SVG elements are converted but complex SVGs may need refinement</li>
                            <li>Custom web components are converted as generic containers</li>
                            <li>Form elements are supported but complex forms may need manual setup</li>
                        </ul>
                    </div>

                    <div className="limitation-section">
                        <h3>JavaScript</h3>
                        <ul>
                            <li>JavaScript is added as a code element - no automatic event binding</li>
                            <li>jQuery and other libraries need to be included separately in Bricks</li>
                            <li>Complex JS interactions may need to be rewritten for Bricks</li>
                        </ul>
                    </div>

                    <div className="limitation-section">
                        <h3>Bricks Builder Specific</h3>
                        <ul>
                            <li>Some Bricks-specific features (conditions, dynamic data) must be added manually</li>
                            <li>Global classes are created but may need organization in Bricks</li>
                            <li>Responsive breakpoints use Bricks defaults - custom breakpoints need manual setup</li>
                            <li>Animations and transitions are preserved but may need Bricks animation settings</li>
                        </ul>
                    </div>

                    <div className="limitation-note">
                        <h3>💡 Workaround</h3>
                        <p>For unsupported features, Brickify adds them as <strong>Custom CSS</strong> in the global class settings. You can then manually map these to Bricks settings or keep them as custom CSS.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LimitationsModal;
