const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    age:{
        required:true,
        type:Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for age.',
          },
    },
    phone_number:{
        required:true,
        type:Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for age.',
          },
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    password:{
        required:true,
        type:String,
    },
    con_password:{
        required:true,
        type:String,
    }
})
const user=mongoose.model('user',userSchema)

module.exports= user