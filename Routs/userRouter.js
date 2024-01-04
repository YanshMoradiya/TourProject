import express from 'express';
import { createUser, getUser, deleteUser, getUsers, updateUser } from './../Controller/userContoller.js';

const userRouter = express.Router();
userRouter.route('/users').get(getUsers).post(createUser);
userRouter.route('/user/:id').get(getUser).patch(updateUser).delete(deleteUser);
export { userRouter };