const mongoose=require("mongoose")
require('dotenv').config()
const dbconnect=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("dbconnected successfully!!!")
    } catch (error) {
        console.log(error,"db not connected😒")
    }
}

module.exports=dbconnect