import React from "react";
import { useNavigate, useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "./../../contexts/AuthContext";

const PrivateRoute = ({ role, loginPath, children }) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    // User is not authenticated
    if (loginPath) return <Navigate to={loginPath} state={{ from: location }} replace />;
    navigate(-1);
    return null;
  }

  if (role && user.role !== role) {
    // User is authenticated but does not have the required role
    if (loginPath) return <Navigate to="/login" state={{ from: location }} replace />;
    navigate(-1);
    return null;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
