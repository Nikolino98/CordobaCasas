import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../models/propertyModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/properties
 * @desc    Get all properties with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      bedrooms: req.query.bedrooms,
      neighborhood: req.query.neighborhood,
      propertyType: req.query.propertyType,
      limit: req.query.limit,
      offset: req.query.offset
    };
    
    const properties = await getAllProperties(filters);
    res.json(properties);
  } catch (error) {
    console.error('Error in GET /properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

/**
 * @route   GET /api/properties/:id
 * @desc    Get a property by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const property = await getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error in GET /properties/:id:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

/**
 * @route   POST /api/properties
 * @desc    Create a new property
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    // Add user ID from authenticated user
    const propertyData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const newProperty = await createProperty(propertyData);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error in POST /properties:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

/**
 * @route   PUT /api/properties/:id
 * @desc    Update a property
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if property exists
    const property = await getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Check if user owns the property
    if (property.user_id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }
    
    const updatedProperty = await updateProperty(req.params.id, req.body);
    res.json(updatedProperty);
  } catch (error) {
    console.error('Error in PUT /properties/:id:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete a property
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if property exists
    const property = await getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Check if user owns the property
    if (property.user_id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this property' });
    }
    
    const success = await deleteProperty(req.params.id);
    if (success) {
      res.json({ message: 'Property removed' });
    } else {
      res.status(500).json({ error: 'Failed to delete property' });
    }
  } catch (error) {
    console.error('Error in DELETE /properties/:id:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;