import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/userModel.js";


const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    });
};

const getUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    res.status(500).json({
        status: 'success',
        data: users
    });
});

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet!'
    });
};

export { getUser, getUsers, createUser, deleteUser, updateUser };