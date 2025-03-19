"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definición de tipos - Asegúrate de que esta interfaz coincida exactamente con la definida en tu página
export interface Cliente {
  id: string; // Cambiado a string solamente para que coincida con la definición en ventas.tsx
  farmacia: string;
  nombre: string;
  apellido: string;
  estado: number;
}

interface ClienteSelectProps {
  value?: string;
  onChangeCliente: (cliente: Cliente | undefined) => void;
  onInputChange?: (value: string) => void;
}

// Interfaz para la respuesta de la API
interface ClientesResponse {
  clients: Array<{
    id: number; // La API devuelve números como IDs
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
}: ClienteSelectProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const APIUrl = process.env.NEXT_PUBLIC_APP_API_URL;

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

  const handleChangeCliente = (value: string) => {
    const selectedCliente = clientes.find((cliente) => cliente.id === value);
    onChangeCliente(selectedCliente);

    // Solo llama a onInputChange si se ha pasado como prop
    if (onInputChange) {
      onInputChange(value);
    }
  };

  // Filtramos los clientes activos (estado === 1)
  const filteredClientes =
    clientes.length > 0
      ? clientes
          .filter((cliente) => cliente.estado === 1)
          // Si hay un término de búsqueda, filtramos por él
          .filter((cliente) => {
            if (!searchTerm) return true;
            const clienteFullInfo =
              `${cliente.farmacia} - ${cliente.nombre} ${cliente.apellido}`.toLowerCase();
            return clienteFullInfo.includes(searchTerm.toLowerCase());
          })
      : [];

  return (
    <div>
      <p className="py-2">Seleccione Cliente</p>
      <Select value={value} onValueChange={handleChangeCliente}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona un cliente" />
        </SelectTrigger>
        <SelectContent>
          {filteredClientes.length > 0 ? (
            filteredClientes.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.id}>
                {cliente.farmacia ? `${cliente.farmacia} - ` : ""}
                {cliente.nombre} {cliente.apellido}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-results" disabled>
              No hay clientes disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClienteSelect;
