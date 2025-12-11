// import { Navigate } from 'react-router-dom';
// import  useAuth  from '../context/useAuth';

// export default function PrivateRoute({ children }) {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? children : <Navigate to="/" replace />;
// }
// components/PrivateRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default PrivateRoute;
