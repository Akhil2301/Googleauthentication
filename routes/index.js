const express =require('express');
const router=express.Router();
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const Story=require('../models/story')

router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login'
    })
})

router.get('/dashboard',ensureAuth,(req,res)=>{
    res.render('dashboard',{
       name:req.user.firstName,
    })
})
module.exports=router