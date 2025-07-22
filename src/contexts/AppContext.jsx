import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [showNodeClass, setShowNodeClass] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('html');
  const [cssTarget, setCssTarget] = useState('class');
  const [styleHandling, setStyleHandling] = useState('inline');

  return (
    <AppContext.Provider value={{
      // UI State
      showNodeClass, 
      setShowNodeClass,
      activeTagIndex,
      setActiveTagIndex,
      activeTab,
      setActiveTab,
      
      // Code Generation Settings
      cssTarget,
      setCssTarget,
      styleHandling,
      setStyleHandling
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
