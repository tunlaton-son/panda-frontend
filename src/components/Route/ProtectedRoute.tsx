import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = ({ children }: any) => {
    
  const { token } = useAuth();
  if (!token) {
    // token is not authenticated
    return <Navigate to="/sign-in" />;
  }
  return children;
};
