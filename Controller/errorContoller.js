import { AppError } from "../utils/appError.js";

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
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

const developmentError = (err, req, res) => {
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

    // if (process.env.NODE_ENV === 'production') {
    //     let error = { ...err };
    //     if (err.name === 'CastError') {
    //         error = handleCastErrorDB(error);
    //     }
    //     productionError(error, res);
    // } else if (process.env.NODE_ENV === 'development') {
    //     developmentError(err, req, res, next);
    // }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });

}

export { errorHandlar };