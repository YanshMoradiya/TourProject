import express from 'express';
import { userRouter } from './Routs/userRouter.js';
import { tourRouter } from './Routs/tourRouter.js';
import morgan from 'morgan';
import { errorHandlar } from './Controller/errorContoller.js';
import { ApiError } from './utils/apiError.js';

const app = express();
app.use(express.json());
app.use(express.static('./public'));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/', tourRouter);

app.all('*', (req, res, next) => {
    next(new ApiError(`this url ${req.url} is not found on server...`, 404));
});

app.use(errorHandlar);

export { app };