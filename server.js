const express=require('express')
const jwt=require('jsonwebtoken')
const multer=require('multer')
const session=require('express-session')
const bcrypt=require('bcrypt')
const passport=require('passport')
const flash=require('express-flash')
const http=require('http')


//Own Module import
require('./passport')
const User=require('./model')

const app=express()
app.listen(5000, ()=>console.log('listening'))


//Middlewares
app.use(multer().single('images'))
app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:"bharath",
    cookie:{
        httpOnly:true,
        maxAge:30000
    }
}))
app.use(flash())
app.use(passport.initialize())


app.post('/reg', isNotAuthenticated, async (req, res)=>{
    console.log('reg...')
    const hashKey=await bcrypt.hash(req.body.password, 10)
    const user={
        username:req.body.username,
        password:hashKey
    }
    User.addUser(user)
    const token=jwt.sign({user}, 'secret')
    req.session.token=token
    res.end()
})


app.post('/log', isNotAuthenticated, (req, res, next)=>{
    console.log('log...')
    passport.authenticate('local', {session:false}, (err, user)=>{
        if(err) return res.send(err)
        return res.redirect('/')
    })(req, res)
})


app.get('/', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send("welcome to my api")
})



function isNotAuthenticated(req, res, next){ 
    passport.authenticate('jwt', {session:false}, (err, cb)=>{
        if(cb) return res.redirect('/')
        else return next()
    })(req, res, next)
}
