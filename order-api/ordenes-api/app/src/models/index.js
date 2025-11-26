const sequelize = require('../config/database');
const Venta = require('./Venta');
const OrdenServicio = require('./OrdenServicio');

//Una Venta tiene muchos detalles
Venta.hasMany(OrdenServicio, { 
    foreignKey: 'id_venta', 
    as: 'items',
    onDelete: 'CASCADE' //Si borras una venta, se borran los items
});

//Un detalle pertenece a una Venta
OrdenServicio.belongsTo(Venta, { 
    foreignKey: 'id_venta', 
    as: 'venta' 
});

module.exports = {
    sequelize,
    Venta,
    OrdenServicio
};