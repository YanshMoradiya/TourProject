import express from 'express';
import { createUser, getUser, deleteUser, getUsers, updateUser } from './../Controller/userContoller.js';
import { signUp } from './../Controller/authContoller.js';


const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
export { userRouter };