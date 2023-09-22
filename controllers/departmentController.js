const expressAsyncHandler = require("express-async-handler");
const department = require("../models/departmentSchema");

const createDepartment=expressAsyncHandler(async(req,res)=>{
    const {role}=req.user;
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

const seeAllTheDepartmentDistrictWise=expressAsyncHandler(async(req,res)=>{
    const {district}=req.body;
    const {role}=req.user;
    try{
        const department=await department.find({district:district})
        if(department && role=="admin"){
            res.status(200).json(department);
        }else{
            res.status(404).json("you are not admin")
        }
    }catch(error){
        res.status(500).json(error);
    }
})

module.exports={
    createDepartment,
    seeAllTheDepartmentDistrictWise
}