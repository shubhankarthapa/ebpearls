import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utility/token.js";

export const signup = async (req, res) => {
    try {
        
        if (!req.body) {
            return res.status(400).json({
                status: false,
                message: "Request body is missing. Please ensure you're sending JSON data with Content-Type: application/json"
            });
        }
        
        const { name, email, password, profile_url, gender, address, username } = req.body;

        if (!name || !email || !password || !profile_url || !gender || !address || !username) {
            return res.status(400).json({
                status: false,
                message: "All fields are required: name, email, password, profile_url, gender, address, username"
            });
        }

        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User with this email or username already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profile_url,
            gender,
            address,
            username
        });

        const savedUser = await newUser.save();

        
        const token = generateToken(savedUser._id, res);

        
        const userResponse = {
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            profile_url: savedUser.profile_url,
            gender: savedUser.gender,
            address: savedUser.address,
            username: savedUser.username,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        };

        res.status(201).json({
            status: true,
            message: "User registered successfully!",
            data: userResponse,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error during signup",
            error: error.message
        });
    }
};

    
export const login = async (req, res) => {
    try {
        
        if (!req.body) {
            return res.status(400).json({
                status: false,
                message: "Request body is missing. Please ensure you're sending JSON data with Content-Type: application/json"
            });
        }
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id, res);

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profile_url: user.profile_url,
            gender: user.gender,
            address: user.address,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            status: true,
            message: "Login successful!",
            data: userResponse,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error during login",
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('session', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: true,
            sameSite: 'strict'
        });

        res.status(200).json({
            status: true,
            message: "Logged out successfully!"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error during logout",
            error: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = req.user;
        
        res.status(200).json({
            status: true,
            message: "Profile fetched successfully!",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching profile",
            error: error.message
        });
    }
};

export const getUsers = async(req, res)=>{
    const loggedInUserId = req.user._id
    const filteredUsers = await User.find({
        _id: {$ne: loggedInUserId}
        
    }).select("-password");
    res.status(200).json({
        status: true,
        message: "user fetch successfully!",
        data: filteredUsers
    })

}