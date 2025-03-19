"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedNegocio, setSelectedNegocio] = useState<Negocio | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
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

  // Efecto para configurar el negocio seleccionado cuando se pasa un valor
  useEffect(() => {
    if (value && negocios.length > 0) {
      const negocio = negocios.find((n) => n.id === value);
      setSelectedNegocio(negocio);
      if (negocio) {
        setSearchTerm(`${negocio.nombre} - ${negocio.direccion}`);
      }
    }
  }, [value, negocios]);

  // Efecto para limpiar cuando cambia el clienteId
  useEffect(() => {
    if (!clienteId) {
      setSearchTerm("");
      setSelectedNegocio(undefined);
      setNegocios([]);
    }
  }, [clienteId]);

  // Cargar negocios desde la API cuando cambia el clienteId
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
  }, [APIUrl, clienteId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    // Si el campo está vacío, limpiamos la selección solo si se ha escrito algo antes
    if (!value.trim() && selectedNegocio) {
      onChangeNegocio(undefined);
      if (onInputChange) {
        onInputChange("");
      }
      setSelectedNegocio(undefined);
    }
  };

  const handleSelectNegocio = (negocio: Negocio) => {
    setSelectedNegocio(negocio);
    setSearchTerm(`${negocio.nombre} - ${negocio.direccion}`);
    setIsOpen(false);
    onChangeNegocio(negocio);

    if (onInputChange) {
      onInputChange(negocio.id);
    }
  };

  const handleFocus = () => {
    if (clienteId) {
      setIsOpen(true);
    }
  };

  // Filtramos los negocios activos (estado === 1) y por término de búsqueda
  const filteredNegocios =
    negocios.length > 0
      ? negocios
          .filter((negocio) => negocio.estado === 1)
          .filter((negocio) => {
            if (!searchTerm) return true;
            const negocioInfo =
              `${negocio.nombre} ${negocio.direccion}`.toLowerCase();
            return negocioInfo.includes(searchTerm.toLowerCase());
          })
      : [];

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="py-2">Seleccione Negocio del Cliente</p>

      {/* Campo de búsqueda */}
      <Input
        type="text"
        placeholder={
          loading
            ? "Cargando negocios..."
            : !clienteId
            ? "Seleccione un cliente primero"
            : "Buscar negocio..."
        }
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        disabled={disabled || loading || !clienteId}
        className="w-full placeholder:text-black"
      />

      {/* Lista desplegable de negocios - ahora se muestra al hacer focus, incluso sin texto */}
      {isOpen && !disabled && clienteId && !loading && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredNegocios.length > 0 ? (
            filteredNegocios.map((negocio) => (
              <div
                key={negocio.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectNegocio(negocio)}
              >
                <div className="font-medium">{negocio.nombre}</div>
                <div className="text-xs text-gray-500">{negocio.direccion}</div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No hay negocios disponibles
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NegocioSelect;
