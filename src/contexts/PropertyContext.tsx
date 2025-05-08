import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { propertiesApi } from '../services/api';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url: string;
  contact_info: string;
  property_type: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  neighborhood?: string;
  propertyType?: string;
  limit?: number;
  offset?: number;
}

interface PropertyContextType {
  properties: Property[];
  property: Property | null;
  loading: boolean;
  error: string | null;
  filters: PropertyFilters;
  fetchProperties: (newFilters?: PropertyFilters) => Promise<void>;
  fetchPropertyById: (id: number) => Promise<void>;
  createProperty: (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProperty: (id: number, propertyData: Partial<Property>) => Promise<void>;
  deleteProperty: (id: number) => Promise<void>;
  setFilters: (newFilters: PropertyFilters) => void;
  clearError: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<PropertyFilters>({});

  // Fetch properties with filters
  const fetchProperties = async (newFilters?: PropertyFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update filters if new ones are provided
      const currentFilters = newFilters || filters;
      if (newFilters) {
        setFiltersState(newFilters);
      }
      
      const data = await propertiesApi.getAll(currentFilters);
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single property by ID
  const fetchPropertyById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getById(id);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
      console.error('Error fetching property:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new property
  const createProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.create(propertyData);
      setProperties([data, ...properties]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
      console.error('Error creating property:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a property
  const updateProperty = async (id: number, propertyData: Partial<Property>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.update(id, propertyData);
      setProperties(properties.map(p => p.id === id ? { ...p, ...data } : p));
      if (property && property.id === id) {
        setProperty({ ...property, ...data });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      console.error('Error updating property:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a property
  const deleteProperty = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await propertiesApi.delete(id);
      setProperties(properties.filter(p => p.id !== id));
      if (property && property.id === id) {
        setProperty(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
      console.error('Error deleting property:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set filters
  const setFilters = (newFilters: PropertyFilters) => {
    setFiltersState(newFilters);
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  // Load properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        property,
        loading,
        error,
        filters,
        fetchProperties,
        fetchPropertyById,
        createProperty,
        updateProperty,
        deleteProperty,
        setFilters,
        clearError
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

// Custom hook to use property context
export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};