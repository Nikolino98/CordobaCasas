import React, { useEffect } from 'react';
import PropertyForm from '../components/properties/PropertyForm';
import { useProperties } from '../contexts/PropertyContext';

const AddPropertyPage: React.FC = () => {
  const { createProperty } = useProperties();
  
  useEffect(() => {
    document.title = 'Publicar propiedad | Córdoba Casas';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Publicar nueva propiedad</h1>
          <p className="text-blue-100">Completa el formulario con la información de tu propiedad</p>
        </div>
        
        <div className="p-6">
          <PropertyForm onSubmit={createProperty} />
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;