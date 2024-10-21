import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';
import User from './user.model.js';
import Party from './party.model.js';
import Region from './region.model.js';

const Vote = sequelize.define('Vote', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    partyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Party,
            key: 'id',
        },
        onDelete: 'CASCADE',
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
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Votes',
    timestamps: true,
    underscored: true,
});

export default Vote;
