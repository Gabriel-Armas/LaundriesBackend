const serviceService = require ('../services/service.service')

const createService = async (req,res) => {

    try{
        const serviceData = req.body;
        const newService = await serviceService.createService(serviceData);

        return res.status(201).json({
            message: 'Servicio creado exitosamente',
            data: newService

        });
    }   
    catch (error) {
        console.error('Error al crear el servicio:', error)
        return res.status(500).json({
            message: 'Ha ocurrido un error al tratar de crear el servicio',
            error: error.message
        })

    }
    


}

const editService = async (req,res) => {
    try{

        const {id} = req.params; 
        const data = req.body;

        const editedService = await serviceService.editService(id,data); 

        return res.status(200).json({
            message: 'El servicio ha sido editado correctamente.',
            data: editedService
        });

    } catch (error){

        return res.status(500).json({
            message: 'Ha ocurrido un error al tratar de editar el servicio',
            error: error.message
        })
    }
}

const deleteService = async (req,res) => {
    try{

        const {id} = req.params; 

        const message = await serviceService.deleteService(id); 

        return res.status(200).json({
            message: 'El servicio ha sido eliminado correctamente.',
            data: message
        });

    } catch (error){

        return res.status(500).json({
            message: 'Ha ocurrido un error al tratar de eliminar el servicio',
            error: error.message
        })
    }
}


module.exports={
    createService,
    editService,
    deleteService
} 