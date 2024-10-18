import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // Lista opcional de roles permitidos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, role } = useAuth();

  // Verifica si el usuario no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si se definen roles y el rol del usuario no está en la lista de roles permitidos
  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado y cumple con los roles, retorna los hijos
  return <>{children}</>;
};

export default ProtectedRoute;
