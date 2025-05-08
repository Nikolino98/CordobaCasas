import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * Get a user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} - User object
 */
export const getUserById = async (id) => {
  try {
    const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users[0];
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

/**
 * Get a user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} - User object
 */
export const getUserByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0];
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

/**
 * Get a user by username
 * @param {string} username - Username
 * @returns {Promise<Object>} - User object
 */
export const getUserByUsername = async (username) => {
  try {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const users = await query(sql, [username]);
    return users[0];
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user without password
 */
export const createUser = async (userData) => {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const result = await query(sql, [
      userData.username,
      userData.email,
      hashedPassword
    ]);
    
    // Return user without password
    return {
      id: result.insertId,
      username: userData.username,
      email: userData.email
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user
 */
export const updateUser = async (id, userData) => {
  try {
    // If password is being updated, hash it
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const fields = Object.keys(userData)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(userData), id];
    
    const sql = `UPDATE users SET ${fields} WHERE id = ?`;
    await query(sql, values);
    
    // Return user without password
    const { password, ...userWithoutPassword } = userData;
    return { id, ...userWithoutPassword };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Authenticate a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} - User object or null
 */
export const authenticateUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) return null;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

export default {
  getUserById,
  getUserByEmail,
  getUserByUsername,
  createUser,
  updateUser,
  authenticateUser
};