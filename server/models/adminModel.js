import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

export const authenticateAdmin = async (username, password) => {
  try {
    const sql = 'SELECT * FROM admin WHERE username = ?';
    const admins = await query(sql, [username]);
    if (admins.length === 0) return null;
    
    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return null;
    
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  } catch (error) {
    console.error('Error authenticating admin:', error);
    throw error;
  }
};

export const updateAdminPassword = async (id, newPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const sql = 'UPDATE admin SET password = ? WHERE id = ?';
    await query(sql, [hashedPassword, id]);
    return true;
  } catch (error) {
    console.error('Error updating admin password:', error);
    throw error;
  }
};

export default {
  authenticateAdmin,
  updateAdminPassword
};