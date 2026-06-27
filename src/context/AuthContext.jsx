import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { getOrCreateDeviceId } from "../utils/device";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (email, password) => {
    const deviceId = getOrCreateDeviceId();

    const response = await api.post("/auth/login", {
      email,
      password,
      deviceId
    });

    localStorage.setItem("accessToken", response.data.accessToken);

    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    setUser(response.data.user);

    return response.data.user;
  };

  const register = async (formData) => {
    const deviceId = getOrCreateDeviceId();

    const response = await api.post("/auth/register", {
      ...formData,
      deviceId
    });

    localStorage.setItem("accessToken", response.data.accessToken);

    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    setUser(response.data.user);

    return response.data.user;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const deviceId = localStorage.getItem("deviceId");

      await api.post("/auth/logout", {
        refreshToken,
        deviceId
      });
    } catch (error) {
      console.log("Logout error ignored");
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const loadUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      loadUser();
    } else {
      setAuthLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
