
const express=require('express')

const applicationRouter=express.Router() 
const prisma=require('../prisma')
const { getApplication,postApplication,updateApplicationStatus } = require('../controllers/application.controller')

// post /api/applications 

applicationRouter.post('/',postApplication)


// get /api/applications 
applicationRouter.get("/",getApplication)

//patch /api/applications/:id

applicationRouter.patch("/:id",updateApplicationStatus)


module.exports=applicationRouter