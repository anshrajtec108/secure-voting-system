import sequelize from '../config/mysqlConnet.js';
import Vote from './vote.model.js';
import User from './user.model.js';
import Party from './party.model.js';
import PartyPhoto from './partyPhoto.model.js';
import Region from './region.model.js';
import Admin from './admin.model.js';
import ElectionOfficer from './electionOfficer.model.js';
import RegionVoteCount from './regionVoteCount.model.js';
import {
    UserLog,
    ElectionOfficerLog,
    AdminLog,
    ErrorCode,
    ServerError,
    SecurityError,
} from './log.model.js';
// Associations

// Vote belongs to User
Vote.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

// Vote belongs to Party
Vote.belongsTo(Party, {
    foreignKey: 'partyId',
    as: 'party',
});

// User belongs to Region
User.belongsTo(Region, {
    foreignKey: 'regionId',
    as: 'region',
});

// User belongs to Alternate Region
User.belongsTo(Region, {
    foreignKey: 'alternateRegionId',
    as: 'alternateRegion',
});

// Party has many PartyPhotos
Party.hasMany(PartyPhoto, {
    foreignKey: 'partyId',
    as: 'photos',
    onDelete: 'CASCADE',
});

// PartyPhoto belongs to Party
PartyPhoto.belongsTo(Party, {
    foreignKey: 'partyId',
    as: 'party',
});

// ElectionOfficer belongs to Region
ElectionOfficer.belongsTo(Region, {
    foreignKey: 'regionId',
    as: 'region',
});

// RegionVoteCount belongs to Party
RegionVoteCount.belongsTo(Party, {
    foreignKey: 'partyId',
    as: 'party',
});

// RegionVoteCount belongs to Region
RegionVoteCount.belongsTo(Region, {
    foreignKey: 'regionId',
    as: 'region',
});

// Syncing all the models at once
const syncDatabase = async () => {
    try {
        // await sequelize.sync({ force: true });
        await sequelize.sync();
        // await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Failed to synchronize models:', error);
    }
};

syncDatabase();

export {
    Vote,
    User,
    Party,
    PartyPhoto,
    Region,
    Admin,
    ElectionOfficer,
    RegionVoteCount,
    sequelize as db,
};
