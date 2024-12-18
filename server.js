import express from 'express'
import cookieParser from 'cookie-parser';      // Middleware to parse cookies from incoming requests
import dotenv from 'dotenv'
import {router} from './routes/userRoutes.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());                       // Parse cookies attached to client requests
app.use( //CORS policies.
    cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'], // we dont need auth header since using cookies.
      credentials: true,
    })
  );
  app.use('/api/v1', router)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
})

