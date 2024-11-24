import sql from 'mssql'
import {poolPromise} from '../config/dbConnection'

export const FindUser = async (username) => {
    const pool = await poolPromise; 
  
    // Run a parameterized query to safely fetch user by username
    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');
  
    return result.recordset[0];               // Return the first user found (or undefined if not found)
  };

    
 