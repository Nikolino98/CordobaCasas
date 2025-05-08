# Córdoba Casas Finder

## Overview

A property listing platform for Córdoba, Argentina. This application allows users to search, filter, and list properties in the city. Built with React, Express, MySQL, and modern web technologies.

## Features

- User authentication and profile management
- Property listing with detailed information
- Advanced property search and filtering
- Responsive design for all devices
- RESTful API with MySQL database storage

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MySQL Server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nikolino98/cordoba-casas-finder.git
   cd cordoba-casas-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a MySQL database:
   ```sql
   CREATE DATABASE cordoba_casas;
   ```

4. Configure environment variables:
   - Copy `.env` and update with your local configuration

5. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173, and the API will be running on http://localhost:3001.

## Database Structure

- **users**: User accounts and authentication
- **properties**: Property listings with details

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: User login

### Properties
- `GET /api/properties`: Get all properties (with filtering)
- `GET /api/properties/:id`: Get property by ID
- `POST /api/properties`: Create a new property
- `PUT /api/properties/:id`: Update a property
- `DELETE /api/properties/:id`: Delete a property

### Users
- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile

## License

This project is licensed under the MIT License.

## Authors

- Nikolino98 (GitHub)