"use client";


import { useEffect, useState } from "react";
import { Clientes, columns } from "./columns";
import { DataTable } from "./data-table";

async function fetchClientes(token: string): Promise<Clientes[]> {
  try {
    const response = await fetch("http://localhost:3001/api/clientes?page=1&limit=3", {
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
    console.log("Datos recibidos:", data);
    return data.clientes || [];
  } catch (error) {
    console.error("Error en fetchClientes:", error);
    return [];
  }
}

export default function ClientesPage() {
  const [data, setData] = useState<Clientes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = "";

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

  if (loading) {
    return <div>Cargando...</div>; // Puedes poner un spinner o un mensaje de carga aquí
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </div>
  );
}
