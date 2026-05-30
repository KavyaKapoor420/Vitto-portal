const express = require('express')
const cors=require('cors')

const applicationRouter=require('./routes/application.route')
const summaryRouter=require('./routes/summary.route')

const app=express()

app.use(cors())
app.use(express.json())

app.use('/api/applications',applicationRouter)
app.use('/api/summary',summaryRouter)

app.get("/",(req,res)=>{
    res.json({message:"Welcome to the Loan Application API" })
})

module.exports=app