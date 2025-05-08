/*
  # Initial Schema Setup

  1. Tables
    - `admin` table for single administrator
      - `id` (int, primary key)
      - `username` (varchar, unique)
      - `password` (varchar)
      - `created_at` (timestamp)
    
    - `properties` table for property listings
      - `id` (int, primary key)
      - `title` (varchar)
      - `description` (text)
      - `price` (decimal)
      - `address` (varchar)
      - `city` (varchar)
      - `neighborhood` (varchar)
      - `bedrooms` (int)
      - `bathrooms` (int)
      - `area` (decimal)
      - `images` (json) - Array of image URLs
      - `property_type` (enum: 'venta'/'alquiler')
      - `status` (enum: 'active'/'paused')
      - `maintenance_fee` (decimal)
      - `requirements` (text)
      - `location_coordinates` (varchar)
      - Timestamps
*/

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create properties table
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
);

-- Insert default admin user (password: admin123)
INSERT INTO admin (username, password) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere')
ON DUPLICATE KEY UPDATE username = username;