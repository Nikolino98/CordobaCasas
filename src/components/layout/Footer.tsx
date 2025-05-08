import React from 'react';
import { Home, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Córdoba Casas</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Encuentra las mejores propiedades en Córdoba, Argentina. Con nuestra plataforma 
              global podrás conectar con propietarios y agentes inmobiliarios de forma directa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/properties/add" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Publicar propiedad
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300">info@cordobacasas.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300">+54 351 123 4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <Home className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300">
                  Av. Hipólito Yrigoyen 660<br />
                  Córdoba, Argentina
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Córdoba Casas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;