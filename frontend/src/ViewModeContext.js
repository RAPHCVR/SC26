// frontend/src/ViewModeContext.js
import React, { createContext, useState, useContext } from 'react';

const ViewModeContext = createContext();

export const useViewMode = () => useContext(ViewModeContext);

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('temporal'); // 'temporal' or 'lifePlans'

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};