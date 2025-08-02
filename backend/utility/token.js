import jwt from "jsonwebtoken";

const generateToken = (userId, res)=>{
const token = jwt.sign({
    userId
}, process.env.JWT_SECRET_KEY, {
    expiresIn: '5d'

})

return token;
}
export default generateToken;
