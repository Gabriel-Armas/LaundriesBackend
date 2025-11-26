const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models'); //Importamos para sincronizar

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API Clientes funcionando ' }));

//Obtener clientes 
app.get('/servicios', async (req, res) => {
    try {
        
        const servicios = await Cliente.findAll();
        
        res.json(servicios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
    });

async function main() {
    try {
        await sequelize.sync({ alter: true }); //Creamos la tabla si no existe
        console.log('Tabla CLIENTE sincronizada');
        app.listen(port, () => console.log(`Server en puerto ${port}`));
    } catch (error) {
        console.error('Error DB:', error);
    }
}
main();