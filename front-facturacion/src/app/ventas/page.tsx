"use client"; // Esto marca el archivo como un componente de cliente

import { useState } from "react"
import { Clientes, columns } from "./columns"
// import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

async function getData(): Promise<Clientes[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "Activo",
      email: "m@example.com",
    },
    // ...
  ]
}

export default function ventas() {

  // Estado para controlar si la tarjeta está abierta o cerrada
  const [isOpen, setIsOpen] = useState(false)

  // Función para alternar el estado de la tarjeta
  const toggleCard = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="container mx-auto py-10">
        <div className="py-5">
          <Button onClick={toggleCard} className="w-[180px] h-[40px]">{isOpen ? "Cerrar venta" : "+ Crear venta"}</Button>
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
              <CardDescription>Formulario para crear una nueva venta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-2" >Nombre del Cliente</p>
              <Input placeholder="Nombre del Cliente" className="placeholder:text-placeholder w-[200px] py-2" />
              <p className="py-2">Seleccione Negocio del cliente</p>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Nombre del negocio" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="dark">Nombre de negocio</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="py-2">Productos</p>
              <div className="flex space-x-2">
                <Input placeholder="Producto" className="placeholder:text-placeholder w-[200px] py-2" />
                
                {/* Select de Unidad al lado del Input de Producto */}
                <Select>
                  <SelectTrigger className="h-[40px] w-[100px]">
                    <SelectValue placeholder="Unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Unidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="py-2" >Cantidad</p>
              <Input placeholder="Cantidad" className="placeholder:text-placeholder w-[200px] py-2" />
            </CardContent>
            <CardFooter className="flex justify-center py-2">
              <Button onClick={toggleCard}>Cerrar</Button>
            </CardFooter>
          </Card>
        )}

        <h1 className="text-3xl font-light py-5">Estas son las ventas registradas</h1>
        <div className="container mx-auto py-5">
          {/* <DataTable columns={columns} data={data} /> */}
        </div>
      </section>
    </div>
  )
}
