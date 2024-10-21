import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';
import Region from './region.model.js';

// UserLog Model
const UserLog = sequelize.define('UserLog', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
    regionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Region,
            key: 'id',
        },
        allowNull: true,
    },
}, {
    tableName: 'UserLogs',
    timestamps: false,
});

// ElectionOfficerLog Model
const ElectionOfficerLog = sequelize.define('ElectionOfficerLog', {
    electionOfficerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
    regionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Region,
            key: 'id',
        },
        allowNull: true,
    },
}, {
    tableName: 'ElectionOfficerLogs',
    timestamps: false,
});

// AdminLog Model
const AdminLog = sequelize.define('AdminLog', {
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
}, {
    tableName: 'AdminLogs',
    timestamps: false,
});

// ErrorCode Model
const ErrorCode = sequelize.define('ErrorCode', {
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'ErrorCodes',
    timestamps: false,
});

// ServerError Model
const ServerError = sequelize.define('ServerError', {
    errorCodeId: {
        type: DataTypes.INTEGER,
        references: {
            model: ErrorCode,
            key: 'id',
        },
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    solve: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
}, {
    tableName: 'ServerErrors',
    timestamps: false,
});

// SecurityError Model
const SecurityError = sequelize.define('SecurityError', {
    errorCodeId: {
        type: DataTypes.INTEGER,
        references: {
            model: ErrorCode,
            key: 'id',
        },
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    solve: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
}, {
    tableName: 'SecurityErrors',
    timestamps: false,
});

// Associations

// UserLog belongs to Region
UserLog.belongsTo(Region, {
    foreignKey: 'regionId',
    as: 'region',
});

// ElectionOfficerLog belongs to Region
ElectionOfficerLog.belongsTo(Region, {
    foreignKey: 'regionId',
    as: 'region',
});

// ServerError belongs to ErrorCode
ServerError.belongsTo(ErrorCode, {
    foreignKey: 'errorCodeId',
    as: 'errorCode',
});

// SecurityError belongs to ErrorCode
SecurityError.belongsTo(ErrorCode, {
    foreignKey: 'errorCodeId',
    as: 'errorCode',
});



export {
    UserLog,
    ElectionOfficerLog,
    AdminLog,
    ErrorCode,
    ServerError,
    SecurityError,
};
