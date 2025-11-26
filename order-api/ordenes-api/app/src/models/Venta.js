const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const Venta = sequelize.define('Venta', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, //Genera UUID automáticamente
        primaryKey: true,
    },
    codigo_recogida: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique:true
    },
    fecha_recepcion: {
        type: DataTypes.DATE, //Mapea a TIMESTAMPTZ
        defaultValue: DataTypes.NOW,
    },
    anotaciones_generales: {
        type: DataTypes.TEXT,
    },
    costo_total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },

    //Referencias lógicas a los demas sistemas
    id_cliente: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    id_sucursal: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_empleado: {
        type: DataTypes.UUID,
        allowNull: false,
    }
    }, {
    tableName: 'venta',
    underscored: true,
    timestamps: false,
});



module.exports = Venta;