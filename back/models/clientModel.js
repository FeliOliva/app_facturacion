const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getClients = async (limit, page) => {
    try {
        const offset = (page - 1) * limit;

        const clients = await prisma.cliente.findMany({
            skip: offset,
            take: limit
        });

        const totalClients = await prisma.cliente.count();

        return {
            clients,
            total: totalClients,
            totalPages: Math.ceil(totalClients / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Error en getClients:", error);
        throw new Error("Error al obtener los clientes");
    }
};

const getClientById = async (id) => {
    try {
        return await prisma.cliente.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
        console.error("Error consultando clientes:", error);
        throw error;
    }
}

const addClient = async (data) => {
    try {
        console.log("cliente: ", data)
        return await prisma.cliente.create({ data })
    } catch (error) {
        console.error("Error consultando clientes:", error);
        throw error;
    }
}

const updateClient = async (id, data) => {
    try {
        console.log("Actualizando cliente con ID:", id);
        console.log("Datos recibidos:", data);

        return await prisma.cliente.update({
            where: { id: parseInt(id) },
            data
        });
    } catch (error) {
        console.error("Error actualizando cliente:", error);
        throw new Error("No se pudo actualizar el cliente");
    }
};


const deleteClient = async (id) => {
    try {
        const [rows] = await pool.execute("update cliente set estado = 0 where id = ?", [id]);
        return rows;
    } catch (error) {
        console.error("Error consultando clientes:", error);
        throw error;
    }
}

const upClient = async (id) => {
    try {
        const [rows] = await pool.execute("update cliente set estado = 1 where id = ?", [id]);
        return rows;
    } catch (error) {
        console.error("Error consultando clientes:", error);
        throw error;
    }
}
module.exports = { getClients, addClient, updateClient, deleteClient, upClient, getClientById };