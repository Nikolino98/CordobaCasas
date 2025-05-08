import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, Bed, Bath, Square, Tag } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    price: number;
    image_url: string;
    address: string;
    city: string;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    property_type: string;
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link 
      to={`/properties/${property.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.image_url || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2 bg-blue-600 text-white px-2 py-1 rounded-md text-sm font-medium">
          {property.property_type}
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {property.title}
          </h3>
        </div>
        
        <p className="text-xl font-bold text-blue-600 mb-2">
          {formatPrice(property.price)}
        </p>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <p className="text-sm line-clamp-1">
            {property.neighborhood}, {property.city}
          </p>
        </div>
        
        <div className="border-t border-gray-100 pt-3">
          <div className="flex justify-between">
            <div className="flex items-center text-gray-600">
              <Bed className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Square className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.area} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;