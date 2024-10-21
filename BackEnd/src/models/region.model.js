import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';

const Region = sequelize.define('Region', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    regionName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'Regions',
    timestamps: true,

});

export default Region;
