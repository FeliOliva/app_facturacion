"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../config/axiosConfig";
import { useRouter } from "next/navigation"; 


// 📌 Definimos la estructura del usuario después de decodificar el token
interface User {
  id: string;
  usuario: string;
  password: string;
  rol: number;
  estado: number;
}

// 📌 Definimos los tipos del contexto de autenticación
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
}

// Creamos el contexto con un valor por defecto undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// 📌 Componente Provider que envuelve la aplicación
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter(); 

  const APIUrl = process.env.NEXT_PUBLIC_APP_API_URL; 

  useEffect(() => {
    const loadUser = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decodedUser: User = jwtDecode(storedToken);
          setUser(decodedUser);
          setToken(storedToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        } catch (error) {
          console.error("Error al decodificar el token:", error);
          logout();
        }
      }
    };

    loadUser();
  }, []);

  const login = async (usuario: string, password: string) => {
    try {
      const response = await axios.post(
        `${APIUrl}/login`,
        { usuario, password },
        { withCredentials: true }
      );
      const newToken = response.data.token;

      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      const decodedUser: User = jwtDecode(newToken);
      setUser(decodedUser);
      setToken(newToken);
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error("Error al iniciar sesión");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
