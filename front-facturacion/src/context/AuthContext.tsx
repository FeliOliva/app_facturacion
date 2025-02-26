"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../config/axiosConfig";

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
//   register: (
//     nombre: string,
//     apellido: string,
//     numero: string,
//     pais: string,
//     provincia: string,
//     domicilio: string,
//     usuario: string,
//     email: string,
//     password: string
//   ) => Promise<void>;
//   loading: boolean;
}

// Creamos el contexto con un valor por defecto undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

// 📌 Componente Provider que envuelve la aplicación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

  const APIUrl = process.env.APP_API_URL || "http://localhost:3001"; // Variable de entorno pública

  // ✅ Cargar usuario si hay token en localStorage
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
          logout(); // Si el token es inválido, se hace logout
        }
      }
    //   setLoading(false);
    };

    loadUser();
  }, []);

  // ✅ Función para iniciar sesión
  const login = async (usuario: string, password: string) => {
    try {
        console.log("Datos enviados:", { usuario, password });
      const response = await axios.post(`${APIUrl}/login`, { usuario, password });
      console.log("Respuesta del servidor:", response.data);
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

  // ✅ Función para registrar un usuario
//   const register = async (
//     nombre: string,
//     apellido: string,
//     numero: string,
//     pais: string,
//     provincia: string,
//     domicilio: string,
//     usuario: string,
//     email: string,
//     password: string
//   ) => {
//     try {
//       await axios.post(`${APIUrl}/usuarios/registrarUsuario`, {
//         nombre, apellido, numero, pais, provincia, domicilio, usuario, email, password
//       });
//       console.log("Usuario registrado con éxito");
//     } catch (error) {
//       console.error("Error en el registro:", error);
//       throw new Error("Error al registrar el usuario");
//     }
//   };

  // ✅ Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, /* register, loading */ }}>
      {children}
    </AuthContext.Provider>
  );
};
