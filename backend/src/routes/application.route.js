
const express=require('express')

const applicationRouter=express.Router() 
const prisma=require('../prisma')
const { getApplication } = require('../controllers/application.controller')

// post /api/applications 

applicationRouter.post('/',async(req,res)=>{


    const errors=validateApplication(req.body)


    if(errors.length>0){
        return res.status(400).json({error:"Validation failed ",details:error})
    }

    const {name,mobile,amount,purpose,language}=req.body ;


    try{
         const application=await prisma.application.create({
            data:{
                name:name.trim(),
                mobile:mobile.trim() ,
                amount:Number(amount),
                purpose:purpose.trim(),
                language:language
            },
            select:{
                id:true,
                name:true,
                createdAt:true 
            }
         })

         res.status(201).json({ message: "Application submitted successfully", application })
    }catch(err){
        res.status(500).json({ error: "An error occurred while submitting the application" })
    }
})


// get /api/applications 
applicationRouter.get("/",getApplication)

//patch /api/applications/:id

applicationRouter.patch("/:id",async(req,res)=>{
     const {id}=req.params 

     const {status}=req.body 

     const validStatus=['approved','rejected']

     if(!status || !validStatus.includes(status)){
        return res.status(400).json({error:`status must be 'approved' or 'rejected' `})
     }

     try{
         const application=await prisma.application.update({
            where:{id:id},
            data:{status:status}
         })
         res.json(application)


     }catch(err){

        if(err.code==='P2025'){
            return res.status
        }
        console.error(err)
        res.status(500).json({error:"An error occurred while updating the application"})
     }
})


module.exports=applicationRouter