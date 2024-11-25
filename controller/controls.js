import * as dataModel from '../model/dataModel.js'
import bcrypt from 'bcrypt'
import generateJWT from '../utils/generateToken.js'


export const SignInUser = async (req, res)=>{

    const user = req.body
    try{
        let {password, ...rest} = user

       await dataModel.SignInNewUser(user)
       const token = generateJWT({
        id: user.id,
        role : user.role
        })
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({rest, message: 'Registered successfully' });
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
}

export const LoginUser = async (req, res)=>{
    const {username, password} = req.body
    try{
        const user = await dataModel.FindUser(username)
        if(!user && !bcrypt.compareSync(password, user.password ))
            return res.state(401).json(new Error('Invalid Credentials'))
        const {password, ...rest} = user
        const token = generateJWT({
            id: user.id,
            role : user.role
        })
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ ...rest, message: 'Logged in successfully' });

    }
    catch(e){
        console.log(e)
        res.status(500).json({ error: error.message });
    }

}

export const GetAllPrograms = async (req, res)=>{
    try{
        const programs = await dataModel.GetAllPrograms()
        res.status(200).json({programs, message: 'Programs delivered successfully' })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });       
    }

}

export const AddCourseToStudentList = async (req, res)=>{
    const{course, student} = req.body
    try{
        await dataModel.AddCourseToStudentCourseList(course,student) //uniqueness granted through front end and DB primary key for course attendace.
        res.status(200).json({message: `Hello ${student.firstName}, ${course.courseName}(${course.IDCourse}) has been added succesfully to your course bucket` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });    
    }
    

}