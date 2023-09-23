const expressAsyncHandler = require("express-async-handler");
const complaint = require("../models/complaintSchema");

const analytics=expressAsyncHandler(async(req,res)=>{
    try{
        const complain=await complaint.find({status:"RESOLVED"});
        const a=complain.length;


        const complains=await complaint.find({status:"PARTIALLY-RESOLVED"});
        const b=complains.length;

        const comp=await complaint.find({status:"UN-RESOLVED"});
        const c=comp.length;

        res.status(200).json({"solved":a,"partiallyResolved":b,"unresolved":c})

    }catch(error){
        res.status(500).json(error);
    }
})

module.exports={
    analytics
}