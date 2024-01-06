import { app } from "./app.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION...');
    server.close(() => {
        process.exit(1);
    });
});

const port = process.env.PORT || 3000;
dotenv.config();

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(db).then(() => console.log('database connection established!'));

const server = app.listen(port, () => {
    console.log(`server is running on ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTED...');
    server.close(() => {
        process.exit(1);
    });
});

