const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models'); 
const orderRoutes = require('./src/routes/order.routes'); // <--- IMPORTAR

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/ordenes', orderRoutes); // VAMOS AGREGANDO LAS RUTAS DE NUESTRO ARCHIVO DE RUTAS

app.get('/', (req, res) => res.json({ message: 'API Ordenes funcionando' }));

async function main() {
    try {
        // alter: true ajusta las tablas si hay cambios
        await sequelize.sync({ alter: true }); 
        console.log(' Tablas VENTA y ORDEN_SERVICIO sincronizadas');
        app.listen(port, () => console.log(` Server en puerto ${port}`));
    } catch (error) {
        console.error(' Error DB:', error);
    }
}
main();