import mongoose, { Schema } from "mongoose";
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        require: [true, 'please provide a valid email address...'],
        unique: true,
        validate: [isEmail, 'Please provide a valid email address'],
        lowercase: true
    },
    photo: String,
    password: {
        type: String,
        select: false,
        require: [true, 'please provide a password...'],
        minlength: 8,
        validator: {
            validate: function (value) {
                return this.password === value;
            }
        },
        message: "Please provide a valid password",
    },
    passwordConfirm: {
        type: String,
        require: [true, 'please confirm your password...'],
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
});

const comparePassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', UserSchema);
export { User, comparePassword };