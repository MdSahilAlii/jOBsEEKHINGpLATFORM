import { Navigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRedirect;