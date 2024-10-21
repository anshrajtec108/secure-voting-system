import { DataTypes } from 'sequelize';
import sequelize from '../config/mysqlConnet.js';
import bcrypt from 'bcrypt';

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    adminId:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNo1: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNo2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
 
}, {
    tableName: 'Admins',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        }
    }
});

export default Admin;
