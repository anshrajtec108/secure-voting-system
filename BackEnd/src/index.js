import dotenv from 'dotenv';
import sequelize from './config/mysqlConnet.js';
import app from './app.js';
import { db } from './models/index.model.js';


//https://ipapi.co/json/
dotenv.config();

const port = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await  db
        const server = app.listen(port, () => {
            console.log(`Express server is running at PORT ${port}`);
        });

    } catch (error) {
        console.error('Unable to create tables:', error);
    }
};

startServer();
