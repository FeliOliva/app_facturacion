"use client";

import { useState, useEffect } from "react";
import type { Ventas } from "./columns";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ClienteSelect, { Cliente } from "@/components/client-select";
import NegocioSelect, { Negocio } from "@/components/negocio-select";
import ProductoSelect, { Producto } from "@/components/producto-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

const APIUrl = process.env.NEXT_PUBLIC_APP_API_URL;

// Interfaz para los productos en el carrito
interface ProductoCarrito {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

async function fetchVentas(token: string, page: number): Promise<{ ventas: Ventas[], totalPages: number, lastVentaNumber: number }> {
  try {
    const response = await fetch(`${APIUrl}/api/ventas?page=${page}&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.statusText}`);
    }

    const data = await response.json();
    const ventas = data.ventas.map((venta: any) => ({
      ...venta,
      clienteNombre: `${venta.cliente.nombre} ${venta.cliente.apellido}`,
      negocioNombre: venta.negocio.nombre,
      cajaNombre: venta.caja.nombre,
    }));

    // Extraer el último número de venta para la secuencia
    let lastVentaNumber = 0;
    if (ventas.length > 0) {
      // Buscar el valor numérico más alto en los números de venta
      ventas.forEach((venta: any) => {
        if (venta.nroVenta && venta.nroVenta.startsWith('V')) {
          const numPart = parseInt(venta.nroVenta.substring(1), 10);
          if (!isNaN(numPart) && numPart > lastVentaNumber) {
            lastVentaNumber = numPart;
          }
        }
      });
    }

    return { 
      ventas, 
      totalPages: data.totalPages || 1, 
      lastVentaNumber 
    };
  } catch (error) {
    console.error("Error en fetchVentas:", error);
    return { ventas: [], totalPages: 1, lastVentaNumber: 0 };
  }
}

export default function Ventas() {
  const [data, setData] = useState<Ventas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [lastVentaNumber, setLastVentaNumber] = useState(0);

  // Estados para cliente y negocio
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>(
    undefined
  );
  const [clienteId, setClienteId] = useState<string>("");

  const [selectedNegocio, setSelectedNegocio] = useState<Negocio | undefined>(
    undefined
  );
  const [negocioId, setNegocioId] = useState<string>("");

  // Estado para producto
  const [selectedProducto, setSelectedProducto] = useState<
    Producto | undefined
  >(undefined);
  const [productoId, setProductoId] = useState<string>("");

  // Estado para cantidad
  const [cantidad, setCantidad] = useState<string>("1");

  // Nuevo estado para la lista de productos seleccionados
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoCarrito[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró el token de autenticación");
      setLoading(false);
      return;
    }

    const getData = async () => {
      const result = await fetchVentas(token, page);
      setData(result.ventas);
      setTotalPages(result.totalPages);
      setLastVentaNumber(result.lastVentaNumber);
      setLoading(false);
    };

    getData();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Función para manejar el cambio de cliente
  const handleClienteChange = (cliente: Cliente | undefined) => {
    setSelectedCliente(cliente);
    if (cliente?.id) {
      setClienteId(cliente.id.toString());
    } else {
      setClienteId("");
    }
    console.log("Cliente seleccionado:", cliente);

    // Reseteamos el negocio cuando cambia el cliente
    setSelectedNegocio(undefined);
    setNegocioId("");
    // También limpiamos los productos seleccionados al cambiar de cliente
    setProductosSeleccionados([]);
  };

  // Función para manejar el cambio de negocio
  const handleNegocioChange = (negocio: Negocio | undefined) => {
    setSelectedNegocio(negocio);
    if (negocio?.id) {
      setNegocioId(negocio.id.toString());
    } else {
      setNegocioId("");
    }
    console.log("Negocio seleccionado:", negocio);
    // Limpiamos los productos seleccionados al cambiar de negocio
    setProductosSeleccionados([]);
  };

  // Función para manejar el cambio de producto
  const handleProductoChange = (producto: Producto | undefined) => {
    setSelectedProducto(producto);
    console.log("Producto seleccionado:", producto);
  };

  // Función para manejar el cambio de cantidad
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(e.target.value);
  };

  // Función para agregar un producto al listado
  const agregarProducto = () => {
    if (selectedProducto && cantidad) {
      const cantidadNum = parseInt(cantidad);

      if (cantidadNum <= 0) {
        alert("La cantidad debe ser mayor a 0");
        return;
      }

      // Verificar si el producto ya está en el carrito
      const productoExistente = productosSeleccionados.find(
        (p) => p.id === selectedProducto.id
      );

      if (productoExistente) {
        // Actualizar la cantidad si el producto ya existe
        setProductosSeleccionados(
          productosSeleccionados.map((p) =>
            p.id === selectedProducto.id
              ? { ...p, cantidad: p.cantidad + cantidadNum }
              : p
          )
        );
      } else {
        // Agregar nuevo producto al carrito
        setProductosSeleccionados([
          ...productosSeleccionados,
          {
            id: selectedProducto.id,
            nombre: selectedProducto.nombre,
            precio: selectedProducto.precio || 0,
            cantidad: cantidadNum,
          },
        ]);
      }

      // Resetear el producto y la cantidad
      setSelectedProducto(undefined);
      setProductoId("");
      setCantidad("1");
    }
  };

  // Función para eliminar un producto del listado
  const eliminarProducto = (id: string) => {
    setProductosSeleccionados(productosSeleccionados.filter((p) => p.id !== id));
  };

  // Calcular el total de la venta
  const calcularTotal = () => {
    return productosSeleccionados.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  };
  
  // Función para guardar la venta completa
  const guardarVenta = async () => {
    if (!selectedCliente || !selectedNegocio || productosSeleccionados.length === 0) {
      alert("Debe seleccionar cliente, negocio y al menos un producto");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      // Generar número de venta correlativo basado en el último número
      const nuevoNumeroVenta = lastVentaNumber + 1;
      const nroVenta = `V${nuevoNumeroVenta.toString().padStart(5, '0')}`;

      // Preparar los detalles de la venta
      const detalles = productosSeleccionados.map(producto => ({
        precio: producto.precio,
        cantidad: producto.cantidad,
        productoId: parseInt(producto.id)
      }));

      // Crear el objeto de venta
      const ventaData = {
        nroVenta: nroVenta,
        clienteId: parseInt(clienteId),
        negocioId: parseInt(negocioId),
        cajaId: 1, // Este valor debería ser dinámico en un entorno real
        rol_usuario: 0, // Este valor debería ser dinámico en un entorno real
        detalles: detalles
      };

      console.log("Datos a enviar:", ventaData);

      // Realizar la petición POST
      const response = await fetch(`${APIUrl}/api/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ventaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al guardar la venta: ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Venta guardada exitosamente:", responseData);

      // Actualizar el último número de venta
      setLastVentaNumber(nuevoNumeroVenta);

      // Actualizar la lista de ventas
      const result = await fetchVentas(token, page);
      setData(result.ventas);
      setTotalPages(result.totalPages);

      // Cerrar el modal y limpiar todo
      toggleCard();

      // Mostrar mensaje de éxito
      alert("Venta guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      alert(`Error al guardar la venta: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Función para alternar el estado de la tarjeta
  const toggleCard = () => {
    setIsOpen(!isOpen);

    // Reseteamos los estados cuando se cierra la tarjeta
    if (isOpen) {
      setSelectedCliente(undefined);
      setClienteId("");
      setSelectedNegocio(undefined);
      setNegocioId("");
      setSelectedProducto(undefined);
      setProductoId("");
      setCantidad("1");
      setProductosSeleccionados([]);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="container mx-auto py-10">
        <div className="py-5">
          <Button onClick={toggleCard} className="w-[180px] h-[40px]">
            {isOpen ? "Cerrar venta" : "+ Crear venta"}
          </Button>
        </div>

        {/* Fondo oscuro que aparece cuando la tarjeta se abre */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        )}

        {/* Condición para mostrar la tarjeta solo si isOpen es verdadero */}
        {isOpen && (
          <Card className="w-[550px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-h-[90vh] flex flex-col">
            <CardHeader>
              <CardTitle>Crear Venta</CardTitle>
              <CardDescription>
                Formulario para crear una nueva venta
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {/* Componente de selección de cliente */}
              <ClienteSelect
                value={clienteId}
                onChangeCliente={handleClienteChange}
                onInputChange={setClienteId}
              />

              {/* Componente de selección de negocio */}
              <NegocioSelect
                clienteId={clienteId}
                value={negocioId}
                onChangeNegocio={handleNegocioChange}
                onInputChange={setNegocioId}
                disabled={!clienteId}
              />

              {/* Sección de productos con botón de agregar */}
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Agregar Productos</h3>
                <div className="flex space-x-3" >
                  <ProductoSelect
                    value={productoId}
                    onChangeProducto={handleProductoChange}
                    onInputChange={setProductoId}
                    disabled={!negocioId}
                  />
                  <Input
                    placeholder="Cant."
                    className="placeholder:text-placeholder w-14"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    type="number"
                    min="1"
                    disabled={!productoId}
                  />

                  <Button
                    onClick={agregarProducto}
                    disabled={!selectedProducto || !cantidad}
                    size="sm"
                  >
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Lista de productos seleccionados */}
              {productosSeleccionados.length > 0 && (
                <div className="mt-4 border rounded-md">
                  <h3 className="font-medium p-2 bg-gray-100 rounded-t-md">
                    Productos seleccionados
                  </h3>
                  <ScrollArea className="h-60 overflow-y-auto">
                    <div className="p-2">
                      {productosSeleccionados.map((producto) => (
                        <div
                          key={producto.id}
                          className="flex justify-between items-center py-1 border-b last:border-b-0"
                        >
                          <div className="flex-grow">
                            <div className="font-medium h-5">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">
                              ${producto.precio} x {producto.cantidad} = ${(producto.precio * producto.cantidad).toFixed(2)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarProducto(producto.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-2 font-medium text-right text-white bg-bgheader rounded-b-md">
                    Total: ${calcularTotal().toFixed(2)}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between py-4 border-t">
              <Button variant="outline" onClick={toggleCard}>
                Cancelar
              </Button>
              <Button
                onClick={guardarVenta}
                disabled={!selectedCliente || !selectedNegocio || productosSeleccionados.length === 0 || isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar Venta"}
              </Button>
            </CardFooter>
          </Card>
        )}

        <h1 className="text-3xl font-light py-5">
          Estas son las ventas registradas
        </h1>
        <div className="container mx-auto py-5">
          <DataTable columns={columns} data={data} />
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="ghost" onClick={handlePrevPage} disabled={page === 1}>
            Anterior
          </Button>
          <span>Página {page} de {totalPages}</span>
          <Button variant="ghost" onClick={handleNextPage} disabled={page === totalPages}>
            Siguiente
          </Button>
        </div>
      </section>
    </div>
  );
}