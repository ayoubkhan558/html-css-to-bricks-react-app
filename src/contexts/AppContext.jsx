import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [showNodeClass, setShowNodeClass] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('html');
  const [inlineStyleHandling, setInlineStyleHandling] = useState('inline');

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
      inlineStyleHandling,
      setInlineStyleHandling
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
