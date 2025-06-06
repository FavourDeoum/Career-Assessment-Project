import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SchoolApplicationForm from './SchoolApplicationForm';

const SchoolApplicationFormWrapper = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();

  const school = { id: schoolId };

  const handleBack = () => {
    navigate(`/explore/school/${schoolId}`);
  };

  return <SchoolApplicationForm school={school} onBack={handleBack} />;
};

export default SchoolApplicationFormWrapper;
