import { query } from '../config/db.js';

export const getAllProperties = async (filters = {}) => {
  try {
    let sql = 'SELECT * FROM properties WHERE 1=1';
    const params = [];
    
    if (filters.minPrice) {
      sql += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    
    if (filters.maxPrice) {
      sql += ' AND price <= ?';
      params.push(filters.maxPrice);
    }
    
    if (filters.bedrooms) {
      sql += ' AND bedrooms >= ?';
      params.push(filters.bedrooms);
    }
    
    if (filters.neighborhood) {
      sql += ' AND neighborhood LIKE ?';
      params.push(`%${filters.neighborhood}%`);
    }
    
    if (filters.propertyType) {
      sql += ' AND property_type = ?';
      params.push(filters.propertyType);
    }
    
    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(filters.limit));
      
      if (filters.offset) {
        sql += ' OFFSET ?';
        params.push(parseInt(filters.offset));
      }
    }
    
    const properties = await query(sql, params);
    return properties.map(property => ({
      ...property,
      images: JSON.parse(property.images || '[]')
    }));
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const sql = 'SELECT * FROM properties WHERE id = ?';
    const properties = await query(sql, [id]);
    if (properties.length === 0) return null;
    
    const property = properties[0];
    return {
      ...property,
      images: JSON.parse(property.images || '[]')
    };
  } catch (error) {
    console.error('Error getting property by ID:', error);
    throw error;
  }
};

export const createProperty = async (propertyData) => {
  try {
    const {
      title, description, price, address, city, neighborhood,
      bedrooms, bathrooms, area, images, property_type, 
      maintenance_fee, requirements, location_coordinates
    } = propertyData;
    
    const sql = `
      INSERT INTO properties (
        title, description, price, address, city, neighborhood,
        bedrooms, bathrooms, area, images, property_type,
        maintenance_fee, requirements, location_coordinates
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      title, description, price, address, city, neighborhood,
      bedrooms, bathrooms, area, JSON.stringify(images || []), property_type,
      maintenance_fee, requirements, location_coordinates
    ];
    
    const result = await query(sql, params);
    return { id: result.insertId, ...propertyData };
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    if (propertyData.images) {
      propertyData.images = JSON.stringify(propertyData.images);
    }
    
    const fields = Object.keys(propertyData)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(propertyData), id];
    
    const sql = `UPDATE properties SET ${fields} WHERE id = ?`;
    await query(sql, values);
    
    return { id, ...propertyData };
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const sql = 'DELETE FROM properties WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

export const togglePropertyStatus = async (id) => {
  try {
    const sql = `
      UPDATE properties 
      SET status = CASE 
        WHEN status = 'active' THEN 'paused'
        ELSE 'active'
      END
      WHERE id = ?
    `;
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error toggling property status:', error);
    throw error;
  }
};

export default {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyStatus
};