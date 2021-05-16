const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongodb=require('./mongodb')
 function initialize(passport,getUserByUsername,getUserById){
    const authenticateUser=async (username,password,done)=>{
        const user=await getUserByUsername(username)
        if(user==null){
            return await done(null,false,{messages: 'No user with that username'})
        }
        try{
            if(await bcrypt.compare(password, user.password)){
                return await done(null,user)
            }
            else{
                return await done(null,false,{messages:'Wrong password'})
            }
        }catch(e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'username',passwordField: 'password'/*,session: false*/}//input username,pass
    ,authenticateUser))
    passport.serializeUser((user,done)=> done(null,user.id))
    passport.deserializeUser((id,done)=>{ return done(null,getUserById(id)) })
}
module.exports={initialize:initialize}   