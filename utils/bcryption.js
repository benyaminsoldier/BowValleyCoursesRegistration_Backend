import bcrypt from 'bcrypt'

export const hashPassword = (password)=>{
    try{
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash =  bcrypt.hashSync(password, salt)          
        return hash
        
    }
    catch(error){
        console.log(error)

    }
}
export const comparePasswords = (password, hash)=>{
    try{
        const passwordMatches =  bcrypt.compareSync(password, hash)          
        return passwordMatches
    }
    catch(error){
        console.log(error)
        return error
    }
}