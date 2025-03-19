"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

// Definición de tipos para los clientes
export interface Cliente {
  id: string;
  farmacia: string;
  nombre: string;
  apellido: string;
  estado: number;
}

interface ClienteSelectProps {
  value?: string;
  onChangeCliente: (cliente: Cliente | undefined) => void;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
}

// Interfaz para la respuesta de la API
interface ClientesResponse {
  clients: Array<{
    id: number;
    farmacia?: string;
    nombre: string;
    apellido: string;
    estado: number;
  }>;
  total: number;
}

const ClienteSelect = ({
  value,
  onChangeCliente,
  onInputChange,
  disabled = false,
}: ClienteSelectProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const APIUrl = process.env.NEXT_PUBLIC_APP_API_URL;

  // Efecto para cerrar la lista desplegable cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Efecto para configurar el cliente seleccionado cuando se pasa un valor
  useEffect(() => {
    if (value && clientes.length > 0) {
      const cliente = clientes.find((c) => c.id === value);
      setSelectedCliente(cliente);
      if (cliente) {
        setSearchTerm(
          `${cliente.farmacia ? `${cliente.farmacia} - ` : ""}${
            cliente.nombre
          } ${cliente.apellido}`
        );
      }
    }
  }, [value, clientes]);

  // Cargar clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // Obtenemos el token del localStorage
        const token = localStorage.getItem("token");

        // Configuramos el header de autorización
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get<ClientesResponse>(
          `${APIUrl}/api/getAllClientes`,
          config
        );

        console.log("clientes", response.data);

        // Extraemos el array de clientes de la respuesta y convertimos IDs a string
        if (response.data && response.data.clients) {
          const clientesConvertidos = response.data.clients.map((cliente) => ({
            ...cliente,
            id: String(cliente.id), // Convertimos id a string
            farmacia: cliente.farmacia || "", // Aseguramos que farmacia siempre tenga un valor
          }));
          setClientes(clientesConvertidos);
        } else {
          console.error("Formato de respuesta inesperado:", response.data);
          setClientes([]);
        }
      } catch (error) {
        console.error("Error fetching clientes:", error);
        setClientes([]);
      }
    };

    fetchClientes();
  }, [APIUrl]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    // Si el campo está vacío, limpiamos la selección
    if (!value.trim()) {
      onChangeCliente(undefined);
      if (onInputChange) {
        onInputChange("");
      }
      setSelectedCliente(undefined);
    }
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setSearchTerm(
      `${cliente.farmacia ? `${cliente.farmacia} - ` : ""}${cliente.nombre} ${
        cliente.apellido
      }`
    );
    setIsOpen(false);
    onChangeCliente(cliente);

    if (onInputChange) {
      onInputChange(cliente.id);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  // Filtramos los clientes activos (estado === 1) y por término de búsqueda
  const filteredClientes =
    clientes.length > 0
      ? clientes
          .filter((cliente) => cliente.estado === 1)
          .filter((cliente) => {
            if (!searchTerm) return true;
            const clienteInfo =
              `${cliente.farmacia} ${cliente.nombre} ${cliente.apellido}`.toLowerCase();
            return clienteInfo.includes(searchTerm.toLowerCase());
          })
      : [];

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="py-2">Seleccione Cliente</p>

      {/* Campo de búsqueda */}
      <Input
        type="text"
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        disabled={disabled}
        className="w-full placeholder:text-black"
      />

      {/* Lista desplegable de clientes */}
      {isOpen && searchTerm && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredClientes.length > 0 ? (
            filteredClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectCliente(cliente)}
              >
                <div className="font-medium">
                  {cliente.farmacia ? `${cliente.farmacia} - ` : ""}
                  {cliente.nombre} {cliente.apellido}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No hay clientes disponibles
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClienteSelect;
