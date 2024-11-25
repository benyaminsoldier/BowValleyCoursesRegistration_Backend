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
      roleID = 1
        break
      case 'Student': 
      roleID = 2
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
  
    return result.recordset[0];               // Return the first user found (or undefined if not found)
  };

  export const GetAllPrograms = async ()=>{
    
    const pool  =  await poolPromise
    const result = await pool 
    .request()
    .query('SELECT P.ProgramType, C.CourseCode, C.CourseName, C.TermID, C.CourseDescription, C.CourseDay, C.CourseTime, C.Campus, C.DeliveryMode, C.ClassSize,C.BelongsTo FROM PROGRAM P JOIN COURSE C ON P.PROGRAMCODE = C.BELONGSTO')

    return result.recordset
  }

export const AddCourseToStudentCourseList = async (course, student)=>{
  const pool = await poolPromise
  await pool.request()
  .input('IDCourse', sql.VarChar, course.IDCourse)
  .input('username', sql.NVarChar, student.username)
  .query('DECLARE @ID INT ' +
          'SELECT @ID=UserID  FROM [USER] WHERE USERNAME = @username ' + 
          'insert into courseattendance values(@IDCourse,@ID)')
}
 