import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyForm from '../components/properties/PropertyForm';
import { useProperties } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error, fetchPropertyById, updateProperty } = useProperties();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPropertyById(parseInt(id));
    }
  }, [id, fetchPropertyById]);

  useEffect(() => {
    if (property) {
      document.title = `Editar: ${property.title} | Córdoba Casas`;
      
      // Check if user is authorized to edit this property
      if (user && property.user_id !== user.id) {
        navigate('/');
      }
    }
  }, [property, user, navigate]);

  const handleSubmit = async (data: any) => {
    if (id) {
      await updateProperty(parseInt(id), data);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>Propiedad no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Editar propiedad</h1>
          <p className="text-blue-100">Actualiza la información de tu propiedad</p>
        </div>
        
        <div className="p-6">
          <PropertyForm initialData={property} onSubmit={handleSubmit} isEditing={true} />
        </div>
      </div>
    </div>
  );
};

export default EditPropertyPage;