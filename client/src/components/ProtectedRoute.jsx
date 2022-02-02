import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated && <Outlet />;
};
export default ProtectedRoute;
