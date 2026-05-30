
const express=require('express')

const applicationRouter=express.Router() 
const { getApplication,postApplication,updateApplicationStatus } = require('../controllers/application.controller')

applicationRouter.post('/',postApplication)

applicationRouter.get("/",getApplication)

applicationRouter.patch("/:id",updateApplicationStatus)
applicationRouter.patch("/:id/status",updateApplicationStatus)

module.exports=applicationRouter
