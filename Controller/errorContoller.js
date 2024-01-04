import { ApiError } from "../utils/apiError.js";

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new ApiError(message, 400);
};

const HandleValidationError = (err, res) => {
    const error = Object.values(err.errors).map(el => el.message).join('. ');
    const message = `Invalid input data. ${error}`;
    return new ApiError(message, 400);
};

const handleDuplicationError = (err) => {
    const message = `Duplicate field value: ${err.keyValue.name}. try something different`;
    return new ApiError(message, 400);
};

const productionError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log('Errer : ', err);
        res.status(500).json({
            status: 'failed',
            message: 'Something went wrong!'
        });
    }
};

const developmentError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};


const errorHandlar = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (err.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        if (err.code == 11000) {
            error = handleDuplicationError(error);
        }
        if (err.name === 'ValidationError') {
            error = HandleValidationError(error);
        }
        productionError(error, res);
        return;
    } else if (process.env.NODE_ENV === 'development') {
        developmentError(err, res);
        return;
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
    return;
}

export { errorHandlar };