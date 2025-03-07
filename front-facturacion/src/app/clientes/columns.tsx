"use client"

import { ColumnDef } from "@tanstack/react-table"


import { Button } from "@/components/ui/button"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Clientes = {
  id: number
  nombre: string
  apellido: string
  telefono: string
  negocioId: string
  estado: number
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
    cell: ({row}) => row.getValue("estado") === 1 ? "Activo" : "Inactivo",
  },
  {
    accessorKey: "negocioId",
    header: "Negocio",
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    id: "actions",
    cell: ({row}) => {
      return (
        <Button>
          {row.getValue("estado") === 1 ? "Desactivar" : "Activar"}
        </Button>
      )
    },
  },
]
