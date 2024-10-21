import { ServerError, SecurityError, ErrorCode } from "../models/log.model.js";
// Function to log server errors
export const logServerError = async (code,message, status, metadata = {}) => {
    try {
        const errorCode = await ErrorCode.findOne({ where: { code } });

        if (!errorCode) {
            throw new Error('Error code for server error not found');
        }

        await ServerError.create({
            errorCodeId: errorCode.id,
            message,
            solve: null, // You can update this as needed
            status,
            metadata,
        });
    } catch (error) {
        console.error('Failed to log server error:', error);
    }
};

// Function to log security errors
export const logSecurityError = async (code,message, status, metadata = {}) => {
    try {
        const errorCode = await ErrorCode.findOne({ where: { code } });

        if (!errorCode) {
            throw new Error('Error code for security error not found');
        }

        await SecurityError.create({
            errorCodeId: errorCode.id,
            message,
            solve: null, // You can update this as needed
            status,
            metadata,
        });
    } catch (error) {
        console.error('Failed to log security error:', error);
    }
};

// Helper function to handle error logging based on type
export const logErrorToDatabase = async (code,errorType, message, status, metadata = {}) => {
    if (errorType === 'server') {
        await logServerError(code, message, status, metadata);
    } else if (errorType === 'security') {
        await logSecurityError(code, message, status, metadata);
    } else {
        console.error('Unknown error type:', errorType);
    }
};
