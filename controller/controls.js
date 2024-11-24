import * as dataModel from '../model/dataModel'
import bcrypt from 'bcrypt'
import generateJWT from '../utils/generateToken'

const AuthenticateUser = async (req, res, next)=>{

    const users = await dataModel.GetUsers()
    for(let user of users)
        if(user.username == req.body.username )
            next()

}

const LoginUser = async (req, res)=>{
    const {username, password, role} = req.body
    try{
        const user = await dataModel.FindUser(username)
        if(!user && !bcrypt.compareSync(password, user.password ))
            return res.state(401).json(new Error('Invalid Credentials'))

        const token = generateJWT(user)
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Logged in successfully' });
    }
    catch(e){
        console.log(e)
        res.status(500).json({ error: 'Internal server error' });
    }

    


}