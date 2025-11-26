const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(20),
    },
    correo: {
        type: DataTypes.STRING(100),
        unique: true,
    }
    }, {
    tableName: 'cliente',
    underscored: true,
    timestamps: false,
});

module.exports = Cliente;