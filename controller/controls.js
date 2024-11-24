import * as dataModel from '../model/dataModel.js'
import bcrypt from 'bcrypt'
import generateJWT from '../utils/generateToken.js'

export const signInUser = async (req, res)=>{



}

export const LoginUser = async (req, res)=>{
    const {username, password} = req.body
    try{
        const user = await dataModel.FindUser(username)
        if(!user && !bcrypt.compareSync(password, user.password ))
            return res.state(401).json(new Error('Invalid Credentials'))

        const token = generateJWT({
            id: user.id,
            role : user.role
        })
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Logged in successfully' });
        console.log(req.hostname)
    }
    catch(e){
        console.log(e)
        res.status(500).json({ error: 'Internal server error' });
    }

}