import { Navigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? children : <Navigate to="/auth/sign-in" replace />;
};

export default ProtectedRoute;