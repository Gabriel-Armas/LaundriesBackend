const { Op } = require('sequelize');
const { Cliente } = require('../models/index');

const createClient = async (data) => {
    const {
        nombre,
        telefono,
        correo
    } = data;

    try {
        const nuevoCliente = await Cliente.create({
            nombre: nombre,
            telefono: telefono,
            correo: correo
        })

        return nuevoCliente;

    } catch (error) {
        throw new Error('El cliente no pudo ser creado correctamente: ' + error.message);
    }
}

const getClient = async (id) => {
    try {
        const clienteObtenido = await Cliente.findByPk(id);

        if (!clienteObtenido) {
            throw new Error('El cliente no pudo ser encontrado');
        }

        return clienteObtenido;

    } catch (error) {
        throw error;
    }
}

// Método modificado para aceptar búsqueda inteligente
const getAllClients = async (terminoBusqueda) => {
    try {
        let opciones = {};

        // Si hay termino de búsqueda, aplicamos el filtro inteligente
        if (terminoBusqueda) {
            opciones = {
                where: {
                    [Op.or]: [
                        // por CORREO 
                        { correo: { [Op.iLike]: `%${terminoBusqueda}%` } },

                        // por Telefono 
                        { telefono: { [Op.like]: `%${terminoBusqueda}%` } },

                        // por NOMBRE
                        { nombre: { [Op.iLike]: `%${terminoBusqueda}%` } }
                    ]
                }
            };
        }

        // Si terminoBusqueda viene vacío, findAll(opciones) traerá todo
        const allClients = await Cliente.findAll(opciones);
        return allClients;

    } catch (error) {
        throw error;
    }
}

const editClient = async (id, data) => {
    try {
        const client = await Cliente.findByPk(id);

        if (!client) {
            throw new Error('Error, el cliente no ha sido encontrado')
        }

        const newData = {}
        if (data.nombre) newData.nombre = data.nombre
        if (data.telefono) newData.telefono = data.telefono
        if (data.correo) newData.correo = data.correo

        const updatedClient = await client.update(newData);

        return updatedClient;

    } catch (error) {
        throw error;
    }
}

const deleteClient = async (id) => {
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            throw new Error('Error, el cliente no ha sido encontrado');
        }

        await cliente.destroy();
        return { message: "Cliente eliminado correctamente" }

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createClient,
    getClient,
    getAllClients,
    editClient,
    deleteClient,
}