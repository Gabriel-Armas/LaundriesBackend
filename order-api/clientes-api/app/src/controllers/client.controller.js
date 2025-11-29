const clientService = require('../services/client.service');

//Crear Cliente
const createClient = async (req, res) => {
    try {
        const data = req.body;
        const createdClient = await clientService.createClient(data);

        return res.status(201).json({
            message: 'Cliente creado satisfactoriamente.',
            data: createdClient
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        return res.status(500).json({
            message: 'El cliente no ha podido ser creado de forma efectiva',
            error: error.message
        });
    }
}

//Obtener un Cliente por ID
const getClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await clientService.getClient(id);

        return res.status(200).json({
            message: 'Cliente obtenido correctamente',
            data: client
        });
    } catch (error) {
        // Tip: Si el servicio dice "no encontrado", podrías devolver 404,
        // pero por simplicidad mantenemos el 500/400 aquí.
        return res.status(500).json({
            message: 'Error al obtener el cliente',
            error: error.message
        });
    }
}

//Obtener TODOS los clientes
const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        return res.status(200).json(clients);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener la lista de clientes',
            error: error.message
        });
    }
}

//Editar Cliente
const editClient = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body; // Recuerda: data es todo el body

        const updatedClient = await clientService.editClient(id, data);

        return res.status(200).json({
            message: 'Cliente actualizado correctamente',
            data: updatedClient
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el cliente',
            error: error.message
        });
    }
}

//Eliminar Cliente
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await clientService.deleteClient(id);

        return res.status(200).json({
            message: 'Cliente eliminado correctamente',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el cliente',
            error: error.message
        });
    }
}

module.exports = {
    createClient,
    getClient,
    getAllClients,
    editClient,
    deleteClient
};