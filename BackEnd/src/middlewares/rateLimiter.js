// rateLimiter.js
import rateLimit from 'express-rate-limit';

// Create a rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 23 requests per 
    handler: async (req, res, next) => {
        console.log('Too many requests, please try again later');
        
        res.status(429).json({
            status: 'error',
            message: 'Too many requests, please try again later.'
        });
        
    }
});

export default apiLimiter;
