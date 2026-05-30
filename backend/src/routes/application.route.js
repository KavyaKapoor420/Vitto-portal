
const express=require('express')

const applicationRouter=express.Router() 
const prisma=require('../prisma')

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

