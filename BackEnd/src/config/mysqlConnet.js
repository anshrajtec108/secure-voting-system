import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('election', 'root', 'anshraj108', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

export default  sequelize;
