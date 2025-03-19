"use client";

import { useState } from "react";
import { Clientes, columns } from "./columns";
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

async function getData(): Promise<Clientes[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "Activo",
      email: "m@example.com",
    },
    // ...
  ];
}

export default function Ventas() {
  // Estado para controlar si la tarjeta está abierta o cerrada
  const [isOpen, setIsOpen] = useState(false);

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
  const [cantidad, setCantidad] = useState<string>("");

  // Función para manejar el cambio de cliente
  const handleClienteChange = (cliente: Cliente | undefined) => {
    setSelectedCliente(cliente);
    console.log("Cliente seleccionado:", cliente);

    // Reseteamos el negocio cuando cambia el cliente
    setSelectedNegocio(undefined);
    setNegocioId("");
  };

  // Función para manejar el cambio de negocio
  const handleNegocioChange = (negocio: Negocio | undefined) => {
    setSelectedNegocio(negocio);
    console.log("Negocio seleccionado:", negocio);
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
      setCantidad("");
    }
  };

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
          <Card className="w-[400px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <CardHeader>
              <CardTitle>Crear Venta</CardTitle>
              <CardDescription>
                Formulario para crear una nueva venta
              </CardDescription>
            </CardHeader>
            <CardContent>
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

              {/* Componente de selección de producto */}
              <ProductoSelect
                value={productoId}
                onChangeProducto={handleProductoChange}
                onInputChange={setProductoId}
                disabled={!negocioId}
              />

              <p className="py-2">Cantidad</p>
              <Input
                placeholder="Cantidad"
                className="placeholder:text-placeholder w-full py-2"
                value={cantidad}
                onChange={handleCantidadChange}
                type="number"
                disabled={!productoId}
              />
            </CardContent>
            <CardFooter className="flex justify-between py-2">
              <Button variant="outline" onClick={toggleCard}>
                Cancelar
              </Button>
              <Button onClick={toggleCard}>Guardar</Button>
            </CardFooter>
          </Card>
        )}

        <h1 className="text-3xl font-light py-5">
          Estas son las ventas registradas
        </h1>
        <div className="container mx-auto py-5">
          {/* <DataTable columns={columns} data={data} /> */}
        </div>
      </section>
    </div>
  );
}
