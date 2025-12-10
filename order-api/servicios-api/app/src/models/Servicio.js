const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servicio = sequelize.define('Servicio', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Descripcion vacia' //se crea automaticamente si no se manda nada
    },
    precio_por_kilo: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
    }, {
    tableName: 'servicio',
    underscored: true, // Convierte camelCase a snake_case automáticamente
    timestamps: false, // Mi script SQL no tenía fechas de creación, lo dejamos false
});

module.exports = Servicio;