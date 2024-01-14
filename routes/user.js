const user=require('../controller/controller')
const express=require('express')
const router=express.Router()
const {model}=require("mongoose")

router.post('/signup',user.signup)
router.post('/login',user.login)
router.delete('/delete',user.delete_user)
router.patch('/patch',user.update_name)
router.patch('/age',user.update_age)
router.patch('/pass',user.update_pass)


module.exports=router