import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';
import Region from "./region.model.js"

const ElectionOfficer = sequelize.define('ElectionOfficer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    electionOfficerId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'Election_Officers',
    timestamps: true,
    underscored: true,
});

export default ElectionOfficer;
