const mongoose=require("mongoose")

const mong=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    },
    cnfpassword:{
        type:String,
        required:true
    }
})
const model=mongoose.model("signupdata",mong)
module.exports=model;