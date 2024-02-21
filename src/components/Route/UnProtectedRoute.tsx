import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const UnProtectedRoute = ({ children }: any) => {
    
  const { token } = useAuth();
  if (token) {
    // token is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};
