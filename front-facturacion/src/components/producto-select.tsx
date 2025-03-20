"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

// Definición de tipos para los productos
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioInicial: number;
  medicion: string;
  fechaCreacion: string;
  estado: number;
  tipoUnidadId: number;
}

interface ProductoSelectProps {
  value?: string;
  onChangeProducto: (producto: Producto | undefined) => void;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
}

// Interfaz para la respuesta de la API
interface ProductosResponse {
  products: Array<{
    id: number;
    nombre: string;
    precio: number;
    precioInicial: number;
    medicion: string;
    fechaCreacion: string;
    estado: number;
    tipoUnidadId: number;
  }>;
  total: number;
}

const ProductoSelect = ({
  value,
  onChangeProducto,
  onInputChange,
  disabled = false,
}: ProductoSelectProps) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<
    Producto | undefined
  >();
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

  // Efecto para configurar el producto seleccionado cuando se pasa un valor
  useEffect(() => {
    if (value && productos.length > 0) {
      const producto = productos.find((p) => p.id === value);
      setSelectedProduct(producto);
      if (producto) {
        setSearchTerm(producto.nombre);
      }
    }
  }, [value, productos]);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Obtenemos el token del localStorage
        const token = localStorage.getItem("token");

        // Configuramos el header de autorización
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get<ProductosResponse>(
          `${APIUrl}/api/getAllProducts`,
          config
        );

        console.log("productos", response.data);

        // Extraemos el array de productos de la respuesta y convertimos IDs a string
        if (response.data && response.data.products) {
          const productosConvertidos = response.data.products.map(
            (producto) => ({
              ...producto,
              id: String(producto.id), // Convertimos id a string
            })
          );
          setProductos(productosConvertidos);
        } else {
          console.error("Formato de respuesta inesperado:", response.data);
          setProductos([]);
        }
      } catch (error) {
        console.error("Error fetching productos:", error);
        setProductos([]);
      }
    };

    fetchProductos();
  }, [APIUrl]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    // Si el campo está vacío, limpiamos la selección
    if (!value.trim()) {
      onChangeProducto(undefined);
      if (onInputChange) {
        onInputChange("");
      }
      setSelectedProduct(undefined);
    }
  };

  const handleSelectProducto = (producto: Producto) => {
    setSelectedProduct(producto);
    setSearchTerm(producto.nombre);
    setIsOpen(false);
    onChangeProducto(producto);

    if (onInputChange) {
      onInputChange(producto.id);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  // Filtramos los productos activos (estado === 1) y por término de búsqueda
  const filteredProductos =
    productos.length > 0
      ? productos
          .filter((producto) => producto.estado === 1)
          .filter((producto) => {
            if (!searchTerm) return true;
            const productoInfo =
              `${producto.nombre} ${producto.medicion}`.toLowerCase();
            return productoInfo.includes(searchTerm.toLowerCase());
          })
      : [];

  return (
    <div className="relative" ref={wrapperRef}>

      {/* Campo de búsqueda */}
      <Input
        type="text"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        disabled={disabled}
        className="w-80 placeholder:text-black"
      />

      {/* Lista desplegable de productos */}
      {isOpen && searchTerm && !disabled && (
        <div className="absolute z-10 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredProductos.length > 0 ? (
            filteredProductos.map((producto) => (
              <div
                key={producto.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectProducto(producto)}
              >
                <div className="font-medium">{producto.nombre}</div>
                <div className="text-xs text-gray-500">
                  {producto.medicion} - ${producto.precio.toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No hay productos disponibles
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductoSelect;
