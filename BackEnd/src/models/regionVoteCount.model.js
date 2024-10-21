import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';
import Party from './party.model.js';
import Region from './region.model.js';

const RegionVoteCount = sequelize.define('RegionVoteCount', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        onDelete: 'CASCADE',
        allowNull: false,
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'RegionVoteCounts',
    timestamps: true,

});

export default RegionVoteCount;
