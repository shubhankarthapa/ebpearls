import User from "../models/user.model.js";

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