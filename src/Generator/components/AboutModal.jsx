import React from 'react';
import { FaLinkedin, FaGlobe, FaTimes } from 'react-icons/fa';
import './AboutModal.scss';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="about-modal-overlay">
      <div className="about-modal">
        <button className="about-modal__close" onClick={onClose}>
          <FaTimes size={20} />
        </button>
        
        <div className="about-modal__content">
          <h2>About Code2Bricks</h2>
          
          <div className="about-modal__author">
            <h3>Created by Ayoub Khan</h3>
            <p>Web Developer & Bricks Builder Expert</p>
            
            <div className="about-modal__links">
              <a 
                href="https://www.linkedin.com/in/ayoubkhan558" 
                target="_blank" 
                rel="noopener noreferrer"
                className="about-modal__link"
              >
                <FaLinkedin />
                <span>LinkedIn Profile</span>
              </a>
              
              <a 
                href="https://mayoub.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="about-modal__link"
              >
                <FaGlobe />
                <span>Portfolio Website</span>
              </a>
            </div>
          </div>
          
          <div className="about-modal__description">
            <p>Code2Bricks helps developers convert their HTML, CSS, and JavaScript into Bricks Builder's JSON structure, making it easier to migrate existing websites to Bricks Builder.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
