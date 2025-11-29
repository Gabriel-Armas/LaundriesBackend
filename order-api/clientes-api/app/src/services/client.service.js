const {Cliente} = require('../models/index');

const createClient = async (data) => {
    const {
            nombre,
            telefono,
            correo
        }=data;

    try{

        const nuevoCliente = await Cliente.create({
            nombre:nombre,
            telefono:telefono,
            correo:correo
        })

        return nuevoCliente;

    }catch (error){
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

const getAllClients = async () =>{
    try {
        const allClients = await Cliente.findAll()
        return allClients;


    } catch (error) {
        throw error;
    }

}

const editClient = async (id,data) => {

    try{
        const client = await Cliente.findByPk(id);

        if (!client) {
            throw new Error('Error, el cliente no ha sido encontrado')
        }

        const newData = {}
        if (data.nombre) newData.nombre= data.nombre
        if (data.telefono) newData.telefono= data.telefono
        if (data.correo) newData.correo= data.correo

        const updatedClient = await client.update(newData);

        return updatedClient; 

    } catch (error){
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
        return {message:"Cliente eliminado correctamente"}

    } catch (error) {
        throw error;
    }
}


module.exports={
    createClient,
    getClient,
    getAllClients,
    editClient,
    deleteClient,
}
