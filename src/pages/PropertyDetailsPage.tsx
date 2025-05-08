import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  MapPin, Bed, Bath, Square, Clock, Home, Phone, Mail, Pencil, Trash2, ArrowLeft, AlertCircle 
} from 'lucide-react';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error, fetchPropertyById, deleteProperty } = useProperties();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPropertyById(parseInt(id));
    }
  }, [id, fetchPropertyById]);

  useEffect(() => {
    if (property) {
      document.title = `${property.title} | Córdoba Casas`;
    }
  }, [property]);

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  const handleDelete = async () => {
    if (!property) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      try {
        await deleteProperty(property.id);
        toast.success('Propiedad eliminada correctamente');
        navigate('/');
      } catch (error) {
        toast.error('Error al eliminar la propiedad');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
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
        <Link 
          to="/"
          className="mt-4 inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  const isOwner = user && property.user_id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link 
        to="/"
        className="inline-flex items-center text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a resultados
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Property Header */}
        <div className="relative">
          <img 
            src={property.image_url || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'} 
            alt={property.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          
          <div className="absolute top-0 right-0 m-4">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              {property.property_type}
            </div>
          </div>
          
          {isOwner && (
            <div className="absolute top-0 left-0 m-4 flex space-x-2">
              <Link 
                to={`/properties/edit/${property.id}`}
                className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleDelete}
                className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Property Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-1" />
                <p>
                  {property.address}, {property.neighborhood}, {property.city}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(property.price)}
              </p>
            </div>
          </div>
          
          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Bed className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-sm text-gray-500">Dormitorios</span>
              <span className="font-semibold">{property.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Bath className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-sm text-gray-500">Baños</span>
              <span className="font-semibold">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Square className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-sm text-gray-500">Área</span>
              <span className="font-semibold">{property.area} m²</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Home className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-sm text-gray-500">Tipo</span>
              <span className="font-semibold">{property.property_type}</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {property.description || 'No hay descripción disponible para esta propiedad.'}
            </p>
          </div>
          
          {/* Contact Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Información de contacto</h2>
            {property.contact_info ? (
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                <span>{property.contact_info}</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                <span>Contacta al propietario a través de la plataforma</span>
              </div>
            )}
          </div>
          
          {/* Publication Date */}
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Publicado el {formatDate(property.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;