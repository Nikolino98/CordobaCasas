import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

let pool;

export const connectToDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'cordoba_casas',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    const connection = await pool.getConnection();
    console.log('MySQL connection established');
    connection.release();
    
    await initializeDatabase();
    
    return pool;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    // Create admin user table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create properties table with enhanced fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        address VARCHAR(255),
        city VARCHAR(100),
        neighborhood VARCHAR(100),
        bedrooms INT,
        bathrooms INT,
        area DECIMAL(10, 2),
        images JSON,
        property_type ENUM('venta', 'alquiler') NOT NULL,
        status ENUM('active', 'paused') DEFAULT 'active',
        maintenance_fee DECIMAL(10, 2),
        requirements TEXT,
        location_coordinates VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Check if admin exists, if not create default admin
    const [admins] = await pool.query('SELECT * FROM admin LIMIT 1');
    if (admins.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await pool.query(
        'INSERT INTO admin (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('Default admin user created');
    }
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default { connectToDatabase, query };