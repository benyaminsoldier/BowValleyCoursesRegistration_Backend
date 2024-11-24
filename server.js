import express from 'express'
import cookieParser from 'cookie-parser';      // Middleware to parse cookies from incoming requests
import dotenv from 'dotenv'
import {router} from './routes/userRoutes.js'

dotenv.config()

const Express = express()
Express.use(express.json())
Express.use(express.urlencoded({extended: true}))
Express.use(cookieParser());                       // Parse cookies attached to client requests
Express.use('/api/v1', router)

const PORT = process.env.PORT || 3001
Express.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})