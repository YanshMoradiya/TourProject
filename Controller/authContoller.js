import { User, comparePassword } from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/apiError.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        _id: req.body._id,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

const logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError("please provide a valid email and password.", 400));
    };

    const user = await User.findOne({ email }).select('+password');
    const compare = await comparePassword(password, user.password);

    if (!user || !compare) {
        return next(new ApiError("please enter a valid password.", 401));
    };

    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        data: { user },
        token
    });
});

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("bearer")) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(req.headers)
    if (!token) {
        next(new ApiError('You are not logged in please login again...', 401));
    }

    next();
});

export { signUp, logIn, protect };