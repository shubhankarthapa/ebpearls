import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    profile_url: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    address: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    }
}, {timestamps: true}
);

const User = mongoose.model("User", userSchema)

export default User;
