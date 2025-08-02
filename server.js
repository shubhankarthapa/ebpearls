import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./backend/route/user.route.js";
import blogRoutes from "./backend/route/blog.route.js";
import db from "./backend/db/mongodb.js"



const app = express();
const PORT = process.env.PORT || 3000

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const apiPrefix = "/api";
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/blogs`, blogRoutes);



 
app.listen(PORT, () => {
    db();
    console.log('app is running...')
})




