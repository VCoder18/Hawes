import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // --- AUTHENTIFICATION SUPPRIMÉE ---
  // On retourne simplement les enfants sans bloquer
  return <>{children}</>;
};

export default ProtectedRoute;
