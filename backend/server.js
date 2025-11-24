import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './model/db.js'
import userRoute from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRouter.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;



app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:[
    "http://localhost:5173",
    "https://role-based-auth-system-5efj.vercel.app"
  ], credentials: true}))

app.use(express.urlencoded({ extended: true}))

app.use('/api/auth', userRoute)
app.use('/api/user', userRouter)

app.get('/',(req, res)=>{
    res.send("server is runing....")
})



app.listen(PORT, ()=>{
    connectDB()
    console.log(`server is running on port ${PORT}`)
} )

