const user=require('../module/module')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config();

const secretKey=process.env.secretKey

const generateAccessToken = (userid) => {
    const payload = {
        sub: userid
    };
    const option = {
        expiresIn: '1h'
    };
    return jwt.sign(payload, secretKey, option);
};

const generateRefreshToken = (userid) => {
    const payload = {
        sub: userid
    };
    const option = {
        expiresIn: '7d' // Set to an appropriate value
    };
    return jwt.sign(payload, secretKey, option);
};


const signup=async(req,res)=>{
    try{
        const {email,username,age,phone_number,address,city,password,con_password}=req.body
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if(!validator.isEmail(email)){
            res.status(500).json({message:"invalid email"})
            return
        }
        if(!passwordRegex.test(password)){
            res.status(500).json({message:'Password must be 8 digits, 1 uppercase alphabet, 1 special symbol, and 1 digit'})
            return
        }

        const existinguser=await user.findOne({email})

        if(existinguser){
            res.status(500).json({message:"user already exist"})
            return
        }

        if(con_password != password){
            res.status(500).json({message:"confirm password should match the password"})
            return
        }
        
        const phoneNumberString = phone_number.toString();
        if (phoneNumberString.length !== 12 || !phoneNumberString.startsWith("92")) {
            return res.status(400).json({ error: 'Phone number must be 12 digits long and start with "92".' });
        }

        if(city.toLowerCase() !=="karachi"){
            return res.status(500).json({ error: 'Sorry! we deliver within karachi only :(' });
        }
        const existnumber=await user.findOne({phone_number})
        if(existnumber){
            return res.status(500).json({ error: 'account with this number already exist :(' })
        }
        const bcryptpass=await bcrypt.hash(password,5)
        const createuser=new user({email,username,age,phone_number:phoneNumberString,address,city,password:bcryptpass,con_password:bcryptpass})
        const saveuser=await createuser.save()
        const userId=saveuser._id.toString()

        const accesstoken=generateAccessToken(userId)
        const refreshtoken=generateRefreshToken(userId)

        res.status(200).json({message:"user created successfully",saveuser,accesstoken,refreshtoken})
        return
    }catch(error){
        console.log(error)
        res.status(500).json({message:"something went wrong"})
        return
    }
}
const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const validuser=await user.findOne({email})

        if(!validuser){
            res.status(500).json({message:"invalid email"})
            return
        }

        const matchpass=await bcrypt.compare(password,validuser.password)

        if(!matchpass){
            res.status(500).json({message:"incorrect password"})
            return
        }

        const userId=validuser._id.toString()
        const accesstoken=generateAccessToken(userId)
        const refreshtoken=generateRefreshToken(userId)

        res.status(200).json({ message:"login successfully", user: validuser, accesstoken, refreshtoken, message: 'Login successfully' });

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
const delete_user = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validuser = await user.findOne({ email });

        if (!validuser) {
            res.status(500).json({ message: "User not found" });
            return;
        }

        const matchpass = await bcrypt.compare(password, validuser.password);

        if (!matchpass) {
            res.status(500).json({ message: "Incorrect password" });
            return;
        }

        const deleteuser = await user.findOneAndDelete({ email });
        res.status(200).json({ message: "User deleted", deletedUser: deleteuser });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
const update_name=async(req,res)=>{
    try{
        const {email,password,username}=req.body

        const validuser = await user.findOne({ email });

        if (!validuser) {
            res.status(500).json({ message: "User not found" });
            return;
        }

        const matchpass = await bcrypt.compare(password, validuser.password);

        if (!matchpass) {
            res.status(500).json({ message: "Incorrect password" });
            return;
        }

        const updatedUser = await user.findOneAndUpdate(
            { email },
            { $set: { username } },
            { new: true } // Set to true to return the updated document
        );

        res.status(200).json({message:"username updated"})
        return
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
const update_age=async (req,res)=>{
    try{
        const {email,password,age}=req.body

        const validuser = await user.findOne({ email });

        if (!validuser) {
            res.status(500).json({ message: "User not found" });
            return;
        }

        const matchpass = await bcrypt.compare(password, validuser.password);

        if (!matchpass) {
            res.status(500).json({ message: "Incorrect password" });
            return;
        }

        if(age<=17){
            res.status(500).json({message:"you should be 18 or more"})
        }
        const updatedage = await user.findOneAndUpdate(
            { email },
            { $set: { age } },
            { new: true } // Set to true to return the updated document
        );

        res.status(200).json({message:"age updated"})
        return
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
const update_pass=async(req,res)=>{
    try{
        const {email,password,new_pass}=req.body

        const validuser = await user.findOne({ email });

        if (!validuser) {
            res.status(500).json({ message: "User not found" });
            return;
        }

        const matchpass = await bcrypt.compare(password, validuser.password);

        if (!matchpass) {
            res.status(500).json({ message: "Incorrect password" });
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if(!passwordRegex.test(new_pass)){
            res.status(500).json({message:'Password must be 8 digits, 1 uppercase alphabet, 1 special symbol, and 1 digit'})
            return
        }
        const hashpass=await bcrypt.hash(new_pass,5)
        const updatedage = await user.findOneAndUpdate(
            { email },
            { $set: { password:hashpass,con_password:hashpass } },
            { new: true } // Set to true to return the updated document
        );

        res.status(200).json({message:"password updated"})
        return
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
module.exports={signup,login,delete_user,update_name,update_age,update_pass}