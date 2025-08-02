import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { response } from "express";


const isAuthenticated = async (req, res, next) => {

    let token = req.cookies.session;
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        return res.status(401).json({
            status: false,
            message: "no user logged in"
        })

    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decodedToken) {
            return res.status(401).json({
                status: false,
                message: "invalid token"
            })
        }


        const user = await User.findById(decodedToken.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "user not found"
            })
        }

        req.user = user;
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "invalid token"
        })
    }

    next();

}

export default isAuthenticated;


