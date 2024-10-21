import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';
import Party from './party.model.js';

const PartyPhoto = sequelize.define('PartyPhoto', {
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
    photoURL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Party_Photos',
    timestamps: true,
    underscored: true,
});

export default PartyPhoto;
