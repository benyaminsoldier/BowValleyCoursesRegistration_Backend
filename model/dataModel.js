import sql from 'mssql'
import {poolPromise} from '../config/dbConnection.js'


export const SignInNewUser = async(user)=>{
  const pool = await poolPromise;

    const {
        firstName, 
        lastName, 
        email, 
        countryCode, 
        phone ,
        birthday,
        department,
        program,
        username,
        password,
        role
    } = user

    let programCode
    switch(program)
    {
      case 'Diploma (2 years)': 
      programCode = 'SD-DIP'
        break
      case 'Post-Diploma (1 year)': 
      programCode = 'SD-PDIP'
        break
      case 'Certificate (6 months)': 
      programCode = 'SD-CERT'
        break
    }
    let roleID
    switch(role)
    {
      case 'Admin': 
      roleID = 2
        break
      case 'Student': 
      roleID = 1
        break
    }

    await pool
    .request()
    .input('firstName', sql.NVarChar, firstName)
    .input('lastName', sql.NVarChar, lastName)
    .input('email', sql.NVarChar, email)
    .input('phone', sql.NVarChar, phone)
    .input('birthday', sql.Date, birthday)
    .input('department', sql.NVarChar, department)
    .input('programCode', sql.VarChar, programCode)
    .input('username', sql.NVarChar, username)
    .input('password', sql.NVarChar, password)
    .input('roleID', sql.Int, roleID)
    .query('INSERT INTO [USER] VALUES(@firstName,@lastName,@email,@phone,@birthday,@department,@programCode,@username,@password,@roleID)');
}

export const FindUser = async (username) => {
    const pool = await poolPromise; 

    // Run a parameterized query to safely fetch user by username
    const result = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM [User] WHERE username = @username');
      console.log(result.recordset[0])
  
    return result.recordset[0];               // Return the first user found (or undefined if not found)
  };

  export const GetAllPrograms = async ()=>{
    
    const pool  =  await poolPromise
    const result = await pool 
    .request()
    .query('SELECT * FROM PROGRAM P JOIN COURSE C ON P.PROGRAMCODE = C.BELONGSTO')

    return result.recordset
  }

export const GetStudentCourses = async (studentID) => {
  const pool = await poolPromise
  const result = await pool.request()
  .input('StudentID', sql.VarChar, studentID)
  .query( 'SELECT * FROM COURSEATTENDANCE A JOIN COURSE C ON a.CourseCode = c.CourseCode WHERE a.UserID = @StudentID ')
  return result.recordset
}

export const AddCourseToStudentCourseList = async (courseCode, studentID)=>{
  const pool = await poolPromise
  await pool.request()
  .input('IDCourse', sql.VarChar, courseCode)
  .input('studentID', sql.NVarChar, studentID)
  .query('insert into courseattendance values(@IDCourse,@studentID)')
}
 export const DropCourseFromStudentList = async (courseCode, studentID) =>{
    const pool = await poolPromise
    await pool.request()
    .input('IDCourse', sql.VarChar, courseCode)
    .input('studentID', sql.NVarChar, studentID)
    .query('DELETE FROM COURSEATTENDANCE WHERE COURSECODE = @IDCourse AND USERID = @studentID')
 }
 export const CreateNewCourse = async (course)=>{
    console.log(course)
    const pool = await poolPromise
    await pool.request()
    .input('CourseID', sql.VarChar, course.CourseCode)
    .input('CourseName', sql.NVarChar, course.CourseName)
    .input('SeasonName', sql.NVarChar, course.SeasonName) // conversion required
    .input('CourseDescription', sql.NVarChar, course.Description)
    .input('CourseDay', sql.NVarChar, course.CourseDay) 
    .input('CourseTime', sql.NVarChar, course.CourseTime)
    .input('Campus', sql.NVarChar, course.Campus)
    .input('DeliveryMode', sql.NVarChar, course.DeliveryMode)
    .input('ClassSize', sql.Int, course.ClassSize)
    .input('BelongsTo', sql.VarChar, course.ParentProgram) 
    .query( 'declare @termid int ' +
            'select @termid = t.termid from term t where t.SeasonName = @SeasonName ' +
            'insert into course values(@CourseID, @CourseName, @termid, @CourseDescription, @CourseDay, @CourseTime, @Campus, @DeliveryMode, @ClassSize, @BelongsTo)')
 }

 export const EditCourse = async (courseCode, payload)=>{
    console.log(payload)
    const pool = await poolPromise
    await pool.request()
    .input('CourseCode', sql.VarChar, courseCode)
    .input('CourseName', sql.NVarChar, payload.CourseName)
    .input('SeasonName', sql.NVarChar, payload.SeasonName) // conversion required
    .input('CourseDescription', sql.NVarChar, payload.Description)
    .input('CourseDay', sql.NVarChar, payload.CourseDay) 
    .input('CourseTime', sql.NVarChar, payload.CourseTime)
    .input('Campus', sql.NVarChar, payload.Campus)
    .input('DeliveryMode', sql.NVarChar, payload.DeliveryMode)
    .input('ClassSize', sql.Int, payload.ClassSize)
    .input('BelongsTo', sql.VarChar, payload.BelongsTo) 
    .query( 'declare @termid int ' +
            'select @termid = t.termid from term t where t.SeasonName = @SeasonName ' +
            'UPDATE COURSE SET CourseName = @CourseName, TermID = @termid, CourseDescription = @CourseDescription, CourseDay=@CourseDay, CourseTime=@CourseTime, Campus=@Campus, DeliveryMode=@DeliveryMode, ClassSize=@ClassSize, BelongsTo=@BelongsTo WHERE COURSECODE = @CourseCode')
 }
 
 export const DeleteCourse = async (courseCode)=>{
    const pool = await poolPromise
    await pool.request()
    .input('CourseCode', sql.VarChar, courseCode)
    .query('DELETE FROM COURSE WHERE COURSECODE = @CourseCode')
 }

export const SavePCRS = async (pcrs)=>{
    const pool = await poolPromise
    await pool.request()
    .input('Message', sql.NVarChar, pcrs.Message)
    .input('Date', sql.Date, pcrs.Date)
    .input('SenderEmail', sql.NVarChar, pcrs.Sender_Email)
    .input('SenderName', sql.NVarChar, pcrs.Sender_Name)


    .query('INSERT INTO MESSAGE VALUES(@Message, @Date, @SenderEmail, @SenderName)')
}

 export const GetLastPCRS = async()=>{
    const pool = await poolPromise
    const result = await pool.request()
    .query('SELECT * FROM MESSAGE WHERE PCRS_ID = (SELECT MAX(PCRS_ID) FROM MESSAGE)')
    return result.recordset[0]
 }

 export const GetAllPCRS = async()=>{
  const pool = await poolPromise
  const result = await pool.request()
  .query('SELECT * FROM MESSAGE')
  return result.recordset
 }

 export const GetAllStudents = async()=>{
  const pool = await poolPromise
  const result = await pool.request()
  .query('SELECT * FROM [USER] WHERE ROLEID = 2')
  return result.recordset
 }