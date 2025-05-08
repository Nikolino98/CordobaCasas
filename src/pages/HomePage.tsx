import React, { useEffect, useState } from 'react';
import { useProperties } from '../contexts/PropertyContext';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyFilter from '../components/properties/PropertyFilter';
import { Building, AlertCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const { properties, loading, error, fetchProperties } = useProperties();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    document.title = 'Córdoba Casas | Encuentra tu propiedad ideal';
  }, []);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Encuentra tu hogar ideal en Córdoba
        </h1>
        <p className="text-lg md:text-xl mb-4 max-w-2xl">
          Explora las mejores propiedades disponibles en toda la ciudad. Casas, departamentos y más.
        </p>
      </div>

      {/* Filters */}
      <PropertyFilter onFilter={handleFilter} />

      {/* Properties Section */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Propiedades disponibles
        </h2>
        <span className="text-gray-600">
          {properties.length} {properties.length === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 text-gray-600 p-8 rounded-lg flex flex-col items-center justify-center">
          <Building className="w-12 h-12 mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No se encontraron propiedades</h3>
          <p className="text-center">
            No hay propiedades que coincidan con tus criterios de búsqueda. Intenta con otros filtros.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;