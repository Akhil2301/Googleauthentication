const express=require('express');
const path=require('path');
const mongoose = require('mongoose');

const dotenv=require('dotenv');
const morgan=require('morgan');

const hbs=require('express-handlebars');
const passport= require('passport');
const session = require('express-session');

var MongoDBStore = require('connect-mongo')

const connectDB=require('./config/db');
dotenv.config({path:'./config/config.env'})
//passport config
require('./config/passport')(passport);

connectDB();
const app=express();

if(process.env.NODE_ENV==''){
   app.use(morgan('dev'))
}
app.engine('hbs',hbs.engine({defaultLayout:'main',extname:'hbs'}))
app.set('view engine','hbs')

app.use((req,res,next)=>{
  if(!req.user){
      res.header('cache-control','private,no-cache,no-store,must revalidate')
      res.header('express','-1')
      res.header('paragrm','no-cache')
  }
  next();
});

// var store = new MongoDBStore({
//    uri: 'mongodb://localhost:27017/loginauth',
//    collection: 'sessions'
//  });
 
//  // Catch errors
//  store.on('error', function(error) {
//    console.log(error);
//  });
 

app.use(session({
   secret: 'keyboard cat',   
   resave: false,
   saveUninitialized: false,
   store: MongoDBStore.create({
     mongoUrl:process.env.MONGO_URI
   })
 })
 )
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
 

app.use(express.static(path.join(__dirname,'','public')))
//Routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));

const PORT=process.env.PORT||3000
app.listen(PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    ) 