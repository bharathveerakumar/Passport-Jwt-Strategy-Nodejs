const passport=require('passport')
const localStrategy=require('passport-local').Strategy
const jwtPas=require('passport-jwt')
const jwtStrategy=jwtPas.Strategy
const jwtExtract=jwtPas.ExtractJwt
const userModel=require('./model')
const bcrypt=require('bcrypt')


passport.use(new localStrategy(async (username, password, done)=>{
    console.log('passport local')
    let user=userModel.extractUser(username)
    if(user){
        const hashKey=await bcrypt.compare(password, user.password)
        if(hashKey) return done(null, user)
        else return done('Password Don\'t Match', null)
    }
    else return done('User not found', false)
}))

passport.use(new jwtStrategy({
    jwtFromRequest:extract,
    secretOrKey:'secret'
}, async (jwtp, done)=>{
    done(null, jwtp)
}))

function extract(req){
    return req.session.token
}
