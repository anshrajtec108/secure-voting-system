import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';

const Party = sequelize.define('Party', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    symbol: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    banner: {
        type: DataTypes.TEXT,
        allowNull: true, 
    },
}, {
    tableName: 'Parties',
    timestamps: true,
    underscored: true,
});

export default Party;
