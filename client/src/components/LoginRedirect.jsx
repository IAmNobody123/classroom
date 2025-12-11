// LoginRedirect.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

const LoginRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    console.log("usuario2",user);
    // Redirigir según el rol
    switch (user.rol_id) {
      case 'director':
        return <Navigate to="/dashboard" replace />;
      case 'docente':
        return <Navigate to="/dashboardDocente" replace />;
      case 'estudiante':
        return <Navigate to="/home" replace />;
      default:
        return <Navigate to="/404" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

export default LoginRedirect;
