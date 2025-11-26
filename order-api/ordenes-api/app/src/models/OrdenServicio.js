const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenServicio = sequelize.define('OrdenServicio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    //id_venta también se crea en las relaciones del index.js 
    id_venta:{
        type: DataTypes.UUID, //coincide con el tipo de ID de la tabla venta
        allowNull: false
    },

    id_servicio: {
        type: DataTypes.INTEGER, //Referencia lógica a Servicios API porque no podemos conectar con el otro microservicio directamente
        allowNull: false,
    },
    numero_prendas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    peso_kg: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    precio_aplicado: { //Snapshot
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    subtotal: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    detalles_prendas: {
        type: DataTypes.TEXT,
    },
    fecha_entrega_estimada: {
        type: DataTypes.DATE,
    },
    estado: {
        type: DataTypes.ENUM('RECIBIDO', 'LAVANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'),
        defaultValue: 'RECIBIDO',
    }
    }, {
    tableName: 'orden_servicio',
    underscored: true,
    timestamps: false,
});

module.exports = OrdenServicio;