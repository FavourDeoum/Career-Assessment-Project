import React from 'react';
import { useCase } from '../contexts/CaseContext';

const SomeComponent = () => {
  const { basement, setBasement } = useCase();

  // Use basement and setBasement as needed

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default SomeComponent;