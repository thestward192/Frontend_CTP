import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  ubicaciones: { id: number; nombre: string }[];
  nombre: string | null;
  email: string | null;
  usuarioId: number | null; // Agregar usuarioId aquí
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [ubicaciones, setUbicaciones] = useState<{ id: number; nombre: string }[]>([]);
  const [nombre, setNombre] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null); // Nuevo estado para usuarioId
  const navigate = useNavigate();

  const isTokenExpired = (exp: number) => {
    const now = Date.now() / 1000;
    return exp < now;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (!payload.role || !payload.ubicaciones || isTokenExpired(payload.exp)) {
          logout(); // Si no hay role o ubicaciones o el token ha expirado, cerramos sesión
          return;
        }

        setRole(payload.role);
        setUbicaciones(payload.ubicaciones || []);
        setNombre(payload.nombre || null);
        setEmail(payload.email || null);
        setUsuarioId(payload.sub || null); // Establecer usuarioId desde el payload del token
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al analizar el token:', error);
        logout(); // Si hay algún error con el token, cerrar sesión
      }
    } else {
      logout();
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (!payload.role || !payload.ubicaciones || isTokenExpired(payload.exp)) {
        logout();
        return;
      }

      setRole(payload.role);
      setUbicaciones(payload.ubicaciones || []);
      setNombre(payload.nombre || null);
      setEmail(payload.email || null);
      setUsuarioId(payload.sub || null); // Establecer usuarioId al iniciar sesión
      setIsAuthenticated(true);

      if (payload.role === 'Administrador') {
        navigate('/MenuAdmin');
      } else if (payload.role === 'Docente') {
        navigate('/MenuDocente');
      } else {
        logout(); // Si el rol no es permitido, cerramos la sesión
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setRole(null);
    setUbicaciones([]);
    setNombre(null);
    setEmail(null);
    setUsuarioId(null); // Limpiar usuarioId al cerrar sesión
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, ubicaciones, nombre, email, usuarioId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
