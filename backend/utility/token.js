import jwt from "jsonwebtoken";

const generateToken = (userId, res)=>{
const token = jwt.sign({
    userId
}, process.env.JWT_SECRET, {
    expiresIn: '5d'

})
res.cookie('session', token, {
    maxAge: 5*24*60*60*1000, 
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
})

}
export default generateToken;
