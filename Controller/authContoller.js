import { User } from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken';

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        _id: req.body._id,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

export { signUp };