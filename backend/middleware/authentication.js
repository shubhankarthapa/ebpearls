import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { response } from "express";


const isAuthenticated = async (req, res, next) => {
    let token;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    if (!token) {
        return res.status(401).json({
            status: false,
            message: "No token provided. Please provide a valid token in the Authorization header"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        if (!decodedToken) {
            return res.status(401).json({
                status: false,
                message: "Invalid token"
            })
        }

        const user = await User.findById(decodedToken.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        req.user = user;
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid token"
        })
    }

    next();

}

export default isAuthenticated;


