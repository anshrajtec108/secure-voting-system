import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import helmet from 'helmet';


// Import Log model
// Import routers
import adminRouter from './routers/admin.router.js';
import userRouter from './routers/user.router.js';
import electionOfficerRouter from './routers/electionOfficer.router.js';

// Import middleware
import errorHandler from "./middlewares/errorHandler.middleware.js";
import apiLimiter from "./middlewares/rateLimiter.js";


const app = express();

// Middleware setup

app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLimiter)



const allowedDomains = ['http://localhost:5173'];
app.use((req, res, next) => {
    const origin = req.headers.origin || req.headers.referer;
console.log(origin);

    if (origin && !allowedDomains.includes(origin)) {
        console.log(origin);
        
        return res.status(403).json({ message: 'Access Denied: Unauthorized domain' });
    }
    next();
});

// Define routes
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/electionOfficer', electionOfficerRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
