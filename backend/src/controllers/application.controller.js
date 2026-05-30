

const getApplication=async(req,res)=>{

    const {status,search}=req.query 
    const validStatus=['pending','approved','rejected']

    if(status && !validStatus.includes(status)){

        return res.status(400).json({error:`Status must be one of :${validStatus.join(", ")}`})
    }

    try{
        const applications=await prisma.application.findMany({
            where:{
                ...(status ? {status:status} : {}),

                ...(search ? {
                    OR:[
                        {
                            name:{contains:search,mode:'insensitive'}
                        },
                        {
                            mobile:{contains:search}
                        }
                    ]
                }:{})
            },
            orderBy:{
                createdAt:'desc'
            }
        }
    )
     res.json(applications)
    }catch(err){
        console.log(err)
        res.status(500).json({error:"An error occurred while fetching applications"})
    }
}


module.exports={getApplication}