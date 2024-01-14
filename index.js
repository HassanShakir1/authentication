const express=require('express')
const mongoose=require('mongoose')

require('dotenv').config();

const app=express()
const port=9000
const router=require('./routes/user')
const databaseURL = process.env.database_URL;

app.use(express.json())
app.use('/auth',router)


mongoose.connect(databaseURL)
const db=mongoose.connection

db.on("error",console.error.bind(console,"database  connection error"))
db.once('open',()=>{
    console.log("database connected")
})

app.listen(port,()=>{
    console.log(`server is running on port:${port}`);
})