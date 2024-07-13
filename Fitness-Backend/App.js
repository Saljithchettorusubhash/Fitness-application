import express from "express"
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import verifyRouter from './routes/verifyToken.route.js'
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json())
app.use(cookieParser())
console.log("test")
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use('/api/verify',verifyRouter)

app.listen(8800,()=>{
    console.log("server is running")
})