"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Ventas = {
  id: string;
  nroVenta: string;
  clienteId: number;
  negocioId: number;
  total: number;
  cajaId: number;
  fechaCreacion: string;
  clienteNombre: string; // Agregado para mostrar en la tabla
  negocioNombre: string; // Agregado para mostrar en la tabla
  cajaNombre: string;
};

export const columns: ColumnDef<Ventas>[] = [
  {
    accessorKey: "nroVenta",
    header: "Número de venta",
  },
  {
    accessorKey: "clienteNombre", // Ahora se usa el nombre en lugar del ID
    header: "Cliente",
  },
  {
    accessorKey: "negocioNombre", // Ahora se usa el nombre en lugar del ID
    header: "Negocio",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "cajaNombre",
    header: "Caja",
  },
  {
    accessorKey: "fechaCreacion",
    header: "Fecha de creación",
  },
];
