import { app } from "./app.js";
import dotenv from 'dotenv';
import mongoose from "mongoose";
const port = process.env.PORT || 3000;
dotenv.config();

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(db).then(() => console.log('database connection established!'));

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});