import React, { createContext, useContext, useState } from 'react';

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [basement, setBasement] = useState(null);
  // Add other state variables as needed

  return (
    <CaseContext.Provider value={{ basement, setBasement }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};

