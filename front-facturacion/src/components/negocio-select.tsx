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

// Definición de tipos para Negocio
export interface Negocio {
  id: string;
  nombre: string;
  direccion: string;
  fechaCreacion: string;
  estado: number;
  clienteId: string;
}

interface NegocioSelectProps {
  clienteId?: string;
  value?: string;
  onChangeNegocio: (negocio: Negocio | undefined) => void;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
}

// Interfaz para la respuesta de la API
interface NegociosResponse {
  negocios: Array<{
    id: number;
    nombre: string;
    direccion: string;
    fechaCreacion: string;
    estado: number;
    clienteId: number;
  }>;
  total: number;
}

const NegocioSelect = ({
  clienteId,
  value,
  onChangeNegocio,
  onInputChange,
  disabled = false,
}: NegocioSelectProps) => {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const APIUrl = process.env.NEXT_PUBLIC_APP_API_URL;

  useEffect(() => {
    const fetchNegocios = async () => {
      // No hacemos nada si no hay clienteId
      if (!clienteId) {
        setNegocios([]);
        return;
      }

      setLoading(true);
      try {
        // Obtenemos el token del localStorage
        const token = localStorage.getItem("token");

        // Configuramos el header de autorización
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get<NegociosResponse>(
          `${APIUrl}/api/getAllNegociosByCliente/${clienteId}`,
          config
        );

        console.log("negocios", response.data);

        // Extraemos el array de negocios de la respuesta y convertimos IDs a string
        if (response.data && response.data.negocios) {
          const negociosConvertidos = response.data.negocios.map((negocio) => ({
            ...negocio,
            id: String(negocio.id),
            clienteId: String(negocio.clienteId),
          }));
          setNegocios(negociosConvertidos);
        } else {
          console.error("Formato de respuesta inesperado:", response.data);
          setNegocios([]);
        }
      } catch (error) {
        console.error("Error fetching negocios:", error);
        setNegocios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNegocios();
  }, [APIUrl, clienteId]); // Ejecutamos el efecto cuando cambia el clienteId

  const handleChangeNegocio = (value: string) => {
    const selectedNegocio = negocios.find((negocio) => negocio.id === value);
    onChangeNegocio(selectedNegocio);

    // Solo llama a onInputChange si se ha pasado como prop
    if (onInputChange) {
      onInputChange(value);
    }
  };

  // Filtramos los negocios activos (estado === 1)
  const filteredNegocios =
    negocios.length > 0
      ? negocios.filter((negocio) => negocio.estado === 1)
      : [];

  return (
    <div>
      <p className="py-2">Seleccione Negocio del Cliente</p>
      <Select
        value={value}
        onValueChange={handleChangeNegocio}
        disabled={disabled || loading || !clienteId}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              loading
                ? "Cargando negocios..."
                : !clienteId
                ? "Seleccione un cliente primero"
                : "Seleccione un negocio"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {filteredNegocios.length > 0 ? (
            filteredNegocios.map((negocio) => (
              <SelectItem key={negocio.id} value={negocio.id}>
                {negocio.nombre} - {negocio.direccion}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-results" disabled>
              {loading
                ? "Cargando negocios..."
                : !clienteId
                ? "Seleccione un cliente primero"
                : "No hay negocios disponibles"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NegocioSelect;
