import * as dataModel from '../model/dataModel.js'
import {hashPassword, comparePasswords} from '../utils/bcryption.js'
import {generateToken} from '../utils/generateToken.js'

export const LogOutUser = async (req,res)=>{
    res.clearCookie('token', { path: '/' })
    res.status(200).json({message: 'Logged Out successfully'});
}
export const SignInUser = async (req, res)=>{
    class SignupError{
        constructor(message){
            this.message = message
        }
    }
    let user = req.body
    try{
        const {password, ...rest} = user
        const hash = await hashPassword(password)
        const userData = {...rest, password: hash}
        await dataModel.SignInNewUser(userData)

        console.log(user)
        if(user.role === 'Student') user = {...user, ['RoleID']: 1}
        else if(user.role === 'Admin') user = {...user, ['RoleID']: 2}
        else throw new SignupError("Invalid role")

        console.log(user)

        const token = generateToken({
            RoleID : user.RoleID
            })

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
        res.status(200).json({newUserData: userData});
    }
    catch(error){

        if(error instanceof SignupError) res.status(401).json({error: error.message })
        
        else res.status(500).json({ error: error.message })
    }
}

export const LoginUser = async (req, res)=>{

    const {username, password} = req.body   
    class LoginError{
        constructor(message){
            this.message = message
        }
    }
    try{          
        const user = await dataModel.FindUser(username)
        if(!user || !comparePasswords(password, user.Password)) throw new LoginError('Invalid Credentials.')            
        const {Password, RoleID, ...rest} = user
        const token = generateToken({RoleID: RoleID})
        const userData = {userID: rest.UserID, firstName: rest.FirstName, lastName: rest.LastName, email: rest.Email, phone: rest.Phone, birthday: rest.Birthday, program: rest.ProgramCode, department: rest.Department ,username: rest.Username, role: RoleID===1?'Student': 'Admin'}
        
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', maxAge: 3600000})
        res.status(200).json({ userData: userData});
    }
    catch(error){

        if(error instanceof LoginError) res.status(401).json({ error: error.message })
        
        else res.status(500).json({ error: error.message });
    }

}

export const GetAllPrograms = async (req, res)=>{
    
    try{
        const programs = await dataModel.GetAllPrograms()
        res.status(200).json({programs: programs, message: 'Programs delivered successfully.' })
        console.log(`programs requested by: ${req.url}`)
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });       
    }

}

export const AddCourseToStudentList = async (req, res)=>{
    console.log('add Course request made....')
    const {courseCode,studentID} = req.params
    try{
        await dataModel.AddCourseToStudentCourseList(courseCode,studentID) //uniqueness granted through front end and DB primary key for course attendace.
        res.status(200).json({message: `Hello, Course (${courseCode}) has been added succesfully to your course bucket.` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });    
    }
    

}
export const DropCourseFromStudentList = async (req, res)=>{
    const {studentID} = req.params
    const {courseCode} = req.query
    try{
        await dataModel.DropCourseFromStudentList(courseCode, studentID)
        res.status(200).json({message: `Course [${courseCode}] has been removed succesfully to your course bucket.` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });  
    }
}

export const CreateNewCourse = async (req,res)=>{
    console.log(req.body)
    const course = req.body
    try{
        await dataModel.CreateNewCourse(course)
        res.status(200).json({message: `Hello, ${course.CourseName}(${course.CourseCode}) has been created succesfully.` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });   
    }
}

export const EditCourse = async (req, res)=>{
    console.log(req.body)
    const {courseCode} = req.params
    const payload = req.body
    try{
        await dataModel.EditCourse(courseCode, payload)
        res.status(200).json({message: `Hello, Course(${courseCode}) has been edited succesfully.` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });   
    }
}

export const DeleteCourse = async(req, res)=>{
    const {courseCode} = req.params
    console.log(req.params)
    try{
        await dataModel.DeleteCourse(courseCode)
        res.status(200).json({message: `Hello, Course[${courseCode}] has been deleted succesfully.` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });   
    }
}

export const ProcessPCRS = async(req,res)=>{
    const pcrs = req.body
    try{
        await dataModel.SavePCRS(pcrs)
        const msgInfo = await dataModel.GetLastPCRS()
        res.status(200).json({message: `Hello ${msgInfo.Sender_Name}, your PCRS has been received successfully under PCRS_ID#${msgInfo.PCRS_ID}.` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });   
    }
}

export const GetAllPCRS = async (req,res)=>{

    try{
        const recordSet = await dataModel.GetAllPCRS()
        res.status(200).json({...recordSet, message: `RecordSet delivered succesfully` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });   
    }
}

export const GetAllStudents = async (req,res)=>{
    console.log('Student Courses requested')
    try{
        const recordSet = await dataModel.GetAllStudents()
        res.status(200).json({...recordSet, message: `RecordSet delivered succesfully` })

    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });   
    }
}

export const GetStudentCourses= async (req,res)=>{
    
    const { studentID } = req.params

    try{
        if(isNaN(studentID)) return
        const recordSet = studentID? await dataModel.GetStudentCourses(studentID) : []
        console.log(recordSet)
        res.status(200).json({courses: recordSet, message: `Courses delivered succesfully` })
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: error.message });   
    }
}