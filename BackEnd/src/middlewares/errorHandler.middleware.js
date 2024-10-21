import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js'

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        const { statusCode, message, errors, stack } = err;
        res.status(statusCode).json(new ApiResponse(statusCode, null, message, false, errors, stack));
    } else {
        res.status(500).json(new ApiResponse(500, null, `Internal Server Errorer from errorHandler${err}`, false, [], err.stack));
    }
};

export default errorHandler;
