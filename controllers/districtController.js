const expressAsyncHandler = require("express-async-handler");
const districtModel = require("../models/districtSchema");

const createDistrict=expressAsyncHandler(async(req,res)=>{
    const {role}=req.user;
    const {district}=req.body;

    try{
        if(role=="admin"){
            const dist=await districtModel.create({
                district
            })
            return res.status(200).json(dist);
        }
    }catch(error){
        res.status(500).json(error);
    }
})

module.exports={
    createDistrict
}