import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { response } from "express";


const isAuthenticated = async (req, res, next) => {

    const token = req.cookies.session

    if (!token) {
        return res.status(401).json({
            status: false,
            message: "no user logged in"
        })

    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!decodedToken) {
        return res.status(401).json({
            status: false,
            message: "invalid token"
        })
    }

    const user = await User.findById(decodedToken.UserId).select('-password');

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "user not found"
        })
    }
    req.user = user;

    next();

}

export default isAuthenticated;


