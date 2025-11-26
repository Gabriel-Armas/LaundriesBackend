const express = require('express');
const cors = require('cors');
//Importamos sequelize para conectar y Servicio para consultar datos
const { sequelize, Servicio } = require('./src/models'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//Endpoint de prueba 
app.get('/', (req, res) => res.json({ message: 'API Servicios funcionando' }));

//Obtener servicios 
app.get('/servicios', async (req, res) => {
    try {
        
        const servicios = await Servicio.findAll();
        
        res.json(servicios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
    });

    async function main() {
    try {
        // Esto crea la tabla servicio en la BD si no existe
        await sequelize.sync({ alter: true }); 
        console.log(' Base de datos sincronizada correctamente');

        app.listen(port, () => {
        console.log(` Servicios API corriendo en puerto ${port}`);
        });
    } catch (error) {
        console.error(' Error fatal al conectar la BD:', error);
    }
}

main();