const express = require('express')
const summaryRouter = express.Router()
const prisma = require('../prisma')


// get /api/summary 
summaryRouter.get('/',async(req ,res)=>{

    try{
         const [totalApplications,totalAmount,pending,approved,rejected]=await Promise.all([
            prisma.application.count(),
            prisma.application.aggregate({_sum:{amount:true}}),
            prisma.application.count({where:{status:"pending"}}),
            prisma.application.count({where:{status:"approved"}}),
            prisma.application.count({where:{status:"rejected"}})
         ])

         res.json({
            total_applications:totalApplications,
            total_amount:totalAmount._sum.amount ?? 0,
            pending:pending,
            approved:approved,
            rejected:rejected
         })
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
})

module.exports = summaryRouter