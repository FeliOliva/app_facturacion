import { Clientes, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Clientes[]> {
  // Fetch data from your API here.
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

export default async function pagos() {
  const data = await getData()

  return (
    <div className="flex flex-col min-h-screen">
    <section className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Pagos</h1>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
    </section>
    </div>
  )
}
