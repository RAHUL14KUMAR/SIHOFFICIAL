const expressAsyncHandler = require("express-async-handler");
const department = require("../models/departmentSchema");

const createDepartment=expressAsyncHandler(async(req,res)=>{
    const {name,email,role}=req.user;
    const {deptName,district}=req.body;

    try{
        if(role=="admin"){
            const dept=await department.create({
                deptName,district
            })
            return res.status(200).json(dept);
        }
    }catch(error){
        res.status(500).json(error);
    }
})

module.exports={
    createDepartment
}