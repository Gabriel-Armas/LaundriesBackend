//nombre, descripcion, precio por kilo, activo

const {sequelize,Servicio} = require('../models/index')
const {Op} = require('sequelize')

const createService = async (data) => {

    const {
        nombre,
        descripcion,
        precioPorKilo,
        activo
    } = data;
    try{

        const nuevoServicio = await Servicio.create({
            nombre:nombre,
            descripcion:descripcion,
            precio_por_kilo: precioPorKilo,
            activo:activo
        });

        return nuevoServicio;

    } catch (error){
        throw error;
    }
}



//metodo para editar un servicio dependiendo de 
const editService = async (id,data) => {

    try {
        const servicioEncontrado = await Servicio.findByPk(id);

        if (!servicioEncontrado) {
            throw new Error('Servicio no encontrado');
        }
        
        const updateData = {};
        if (data.nombre) updateData.nombre = data.nombre;
        if (data.descripcion) updateData.descripcion = data.descripcion;
        if (data.precioPorKilo) updateData.precio_por_kilo = data.precioPorKilo;
        if (data.activo !== undefined) updateData.activo = data.activo;

        // Ahora actualizamos con los datos mapeados
        const servicioActualizado = await servicioEncontrado.update(updateData);

        return servicioActualizado;

    } catch (error) {
        throw error; // Lanza el error original (es mejor para depurar)
    }
    
}


const deleteService = async (id) => {
    try {
        const servicioEncontrado = await Servicio.findByPk(id);
        if (!servicioEncontrado) throw new Error('Servicio no encontrado');

        //lo desactivamos:
        servicioEncontrado.activo = false;
        await servicioEncontrado.save();

        return { message: "Servicio desactivado correctamente (Soft Delete)" }
    } catch (error) {
        throw error;
    }
}

const getAllServices = async () => {
    try {
        const obtainedServices = await Servicio.findAll();

        return obtainedServices; 
        
    } catch (error) {
        throw error; 
    }

}

const getAllActiveServices = async () => {
    try {
        const activeServices = await Servicio.findAll({
            where: {
                activo: true
            }
        });

        return activeServices;
        
    } catch (error) {
        throw error;
    }
}

module.exports ={
    createService,
    editService,
    deleteService,
    getAllServices,
    getAllActiveServices
}