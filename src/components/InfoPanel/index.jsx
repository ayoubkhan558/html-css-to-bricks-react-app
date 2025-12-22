import React from 'react';
import { FaQuestionCircle, FaExclamationTriangle, FaEnvelope, FaWhatsapp, FaInfoCircle, FaPaperPlane, FaSpinner, FaCog } from 'react-icons/fa';
import './InfoPanel.scss';

const InfoPanel = ({
    onTutorialOpen,
    onLimitationsOpen,
    onAboutOpen,
    onAIPromptOpen,
    onAISettingsOpen,
    aiTemplates,
    isQuickGenerating
}) => {
    return (
        <aside className="panel-info">
            <div className="panel__left">
                <button
                    onClick={onAIPromptOpen}
                    className="button outline-secondary panel__btn panel__btn--ai"
                    title="Open AI Assistant"
                    style={{ minWidth: '150px' }}
                >
                    <FaPaperPlane size={16} />
                    <span>Ask AI</span>
                    <span className="beta">Beta</span>
                    {isQuickGenerating && (
                        <FaSpinner className="spinning" style={{ marginLeft: '4px' }} />
                    )}
                </button>
                <button
                    onClick={onAISettingsOpen}
                    className="button secondary panel__btn panel__btn--settings"
                    title="AI Settings"
                >
                    <FaCog size={16} />
                </button>
            </div>
            <div className="panel__right">
                <button onClick={onTutorialOpen} className="button secondary panel__btn">
                    <FaQuestionCircle size={16} />
                    <span>Tutorial</span>
                </button>
                <button onClick={onLimitationsOpen} className="button secondary panel__btn">
                    <FaExclamationTriangle size={16} />
                    <span>Limitations</span>
                </button>
                <a
                    href="mailto:ayoubkhan558@hotmail.com?subject=Brickify%20Feedback&body=Hi%20Ayoub,"
                    className="button secondary panel__btn"
                >
                    <FaEnvelope size={16} />
                    <span>Feedback</span>
                </a>
                <a
                    href="https://wa.me/923347812124"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button secondary panel__btn"
                >
                    <FaWhatsapp size={16} />
                    <span>WhatsApp</span>
                </a>
                <button onClick={onAboutOpen} className="button secondary panel__btn">
                    <FaInfoCircle size={16} />
                    <span>About</span>
                </button>
                <div className="panel__text">
                    v1.0
                </div>
            </div>
        </aside>
    );
};

export default InfoPanel;
