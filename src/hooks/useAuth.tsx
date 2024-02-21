import { createContext, useContext, useMemo } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import * as jose from "jose";

type ContextType = {
  token: any;
  setToken: (data: any) => Promise<void>;
  refreshToken: (data: any) => Promise<void>;
  user: any;
  login: (data: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<ContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useLocalStorage("token", "");
  const [user, setUser] = useLocalStorage("user", {
    name: "",
    username: "",
    email: "",
    profileImage: "",
    coverImage: "",
  });

  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: any) => {
    setToken(data);

    let decoded = jose.decodeJwt(data) as any;
    setUser({
      name: decoded.name,
      username: decoded.username,
      email: decoded.email,
      profileImage: decoded.profileImage,
      coverImage: decoded.coverImage,
    });

    // navigate("/", {replace: true})
    window.location.href = "/";
  };

  const refreshToken = async (data: any) => {
    setToken(data);

    let decoded = jose.decodeJwt(data) as any;
    setUser({
      name: decoded.name,
      username: decoded.username,
      email: decoded.email,
      profileImage: decoded.profileImage,
      coverImage: decoded.coverImage,
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setToken(null);
    setUser({
      username: "",
      email: "",
    });

    // navigate("/sign-in", { replace: true });
    window.location.href = "/sign-in";
  };

  const value = useMemo(
    () => ({
      token,
      setToken,
      refreshToken,
      user,
      login,
      logout,
    }),
    [token]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useContext must be used inside the AuthProvider");
  }

  return context;
};
