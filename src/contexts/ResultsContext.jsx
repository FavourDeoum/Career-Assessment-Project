// src/contexts/ResultsContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ResultsContext = createContext(null);

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state for context if needed

  // You might want to move the main fetch logic here or keep it in CareerDashboard
  // For now, CareerDashboard will set results via a setter provided by this context.

  const value = {
    results,
    setResults, // CareerDashboard will use this
    isLoading,  // CareerDashboard will use this
    setIsLoading, // CareerDashboard will use this
  };

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>;
};