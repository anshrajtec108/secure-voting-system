import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';
import Region from './region.model.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    alternateNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    voterId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    regionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Region,
            key: 'id',
        },
        onDelete: 'SET NULL',
        allowNull: true,
    },
    alternateRegionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Region,
            key: 'id',
        },
        onDelete: 'SET NULL',
        allowNull: true,
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    block: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    attemptLogin: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
}, {
    tableName: 'Users',
    timestamps: true,
    underscored: true,
});

export default User;
