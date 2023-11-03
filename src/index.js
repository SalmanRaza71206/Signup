const express=require('express')
require('./db/db')
const path = require("path")
const model=require("./model/model")
const app=express()
const cors=require("cors")
const bcrypt=require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require("multer")

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('./public/uploads'));

const uploads = multer({  
    storage : multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, './public/uploads')
          },
          filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
        }    
        })       
   }).single("images")
  
app.post("/signup",uploads,async(req,res)=>{
    try{
        const password= req.body.password
        const confpassword=req.body.cnfpassword
        const mobile=req.body.mobile
        console.log("ji"+req.file)
        if(password===confpassword && mobile.length==10){
            const passHash=await bcrypt.hash(password,10);
        
         
                const data=new model({...req.body,image:req.file.filename,password:passHash,cnfpassword:passHash})
                
                const result =await data.save()
                res.send(req.file.filename)
            
                console.log(result)
              
          
        }else{
            if(mobile.length!=10){
                res.status(400).send("mbile length shoul be 10")
            }
            else{
            res.status(400).send("password unmatched")
        }
        }
       
      
    }
    catch(e){
        console.log(e)
        res.status(500).json({e:"error"})
    }

})
app.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await model.findOne({email})
    if(!user){
        res.status(401).send({message:"Unautorised user"})
    }
    const passencrypt= await bcrypt.compare( password,user.password)
        if(passencrypt){
            const token=await jwt.sign({
                "uniqueid":user._id},
               "uuijijokokokkoko"
            )
        res.json({token})
      
        }
        else{
          res.status(401).send({message:"password shi daal le"})
        }
      })
     
     
app.get("/alldata",async(req,res)=>{
const user= await model.find()
res.send({data:user})
})



app.listen(4000)