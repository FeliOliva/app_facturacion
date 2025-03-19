"use client";

import { useEffect, useState } from "react";
import { Clientes, columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";

const APIUrl = process.env.NEXT_PUBLIC_APP_API_URL;

async function fetchClientes(token: string): Promise<Clientes[]> {
  try {
    const response = await fetch( APIUrl + "/api/clientes?page=1&limit=3", {
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
    return data.clients || [];
  } catch (error) {
    console.error("Error en fetchClientes:", error);
    return [];
  }
}

export default function ClientesPage() {
  const [data, setData] = useState<Clientes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró el token de autenticación");
      setLoading(false);
      return;
    }

    const getData = async () => {
      const clientesData = await fetchClientes(token);
      setData(clientesData);
      setLoading(false);
    };

    getData();
  }, []);

  const cambiarEstadoCliente = async (id: number, estadoActual: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No se encontró el token de autenticación");
      return;
    }

    if (estadoActual === 0) {

      const nuevoEstado = estadoActual === 0 ? 1 : 0;

      try {
        const response = await fetch(`${APIUrl}/api/clientes/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        });
        if (!response.ok) {
          throw new Error("Error al actualizar el estado: " + response.statusText);
        }
        // Actualizar el estado localmente
        setData((prevData) =>
          prevData.map((cliente) =>
            cliente.id === id ? { ...cliente, estado: nuevoEstado } : cliente
          )
        );
        alert("El cliente ha sido activado");
      } catch (error) {
        console.error("Error en cambiarEstadoCliente:", error);
      }
    } else {

      const nuevoEstado = estadoActual === 1 ? 0 : 1;

      try {
        const response = await fetch(`${APIUrl}/api/clientes/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el estado: " + response.statusText);
        }
        // Actualizar el estado localmente
        setData((prevData) =>
          prevData.map((cliente) =>
            cliente.id === id ? { ...cliente, estado: nuevoEstado } : cliente
          )
        );
        alert("El cliente ha sido desactivado");
      } catch (error) {
        console.error("Error en cambiarEstadoCliente:", error);
      }
    }
  };



  // Pasar la función a las columnas
  const columns = baseColumns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }: { row: { original: Clientes } }) => {
          const cliente = row.original;
          return (
            <Button
              onClick={() => cambiarEstadoCliente(cliente.id, cliente.estado)}
            >
              {cliente.estado === 1 ? "Desactivar" : "Activar"}
            </Button>
          );
        },
      };
    }
    return col;
  });

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-light">Estos son los clientes disponibles</h1>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </div>
  );
}
