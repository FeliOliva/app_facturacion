"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Clientes = {
  id: string
  nombre: string
  apellido: string
  telefono: string
  negocioId: string
  estado: "Activo" | "Inactivo"
}

export const columns: ColumnDef<Clientes>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
  },
  {
    accessorKey: "estado",
    header: "Estado",
  },
  {
    accessorKey: "negocioId",
    header: "Negocio",
  },
  
]
