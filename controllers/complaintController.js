const expressAsyncHandler = require("express-async-handler");
const complaint=require("../models/complaintSchema");

// create a complaint done bty citizen
const createComplaint=expressAsyncHandler(async(req,res)=>{
    const {email,name}=req.user
    const {description,image,department,district}=req.body;
    try{
        const complain=await complaint.create({
            raisedBy:email,description,image,department,district
        });

        res.status(200).json(complain);
    }catch(error){
        res.status(500).json(error);
    }
})

// the complaint which is seen by nodal officer
const complaintSeen=expressAsyncHandler(async(req,res)=>{
    try{
        const {designation,role}=req.user;
        const complain=await complaint.find({district:designation[1],department:designation[2],pathToTravel:[]});

        if(complain && designation[0]=="nodalofficer"){
            res.status(200).json(complain);
        }else{
            res.status(404).json("no compliant found");
        }
    }catch(error){
        res.status(500).json(error);
    }
})

// add pathToTravel and description of particular complaint done byNodalOfficer
const addNodeToPath=expressAsyncHandler(async(req,res)=>{
    const complainId=req.params.id;
    const {designation,name,email,role}=req.user;
    const {department,description,post}=req.body;

    const complain=await complaint.findById(complainId);

    try{
        if(designation[0]=="nodalofficer" && complain){
            complain.pathToTravel.push({
                assignedDept:department,
                assignedDist:complain.district,
                assignedPost:post
            })
            // complain.descriptionByNodalOfficer=description;
            await complain.save();

            res.status(200).json("path and desciption has been added to complain");
        }else{
            res.status(404).json("you are not required to perform opertion");
        }
    }catch(error){
        res.status(500).json(error);
    }
})

// add commments to a particular complaint
const addComment=expressAsyncHandler(async(req,res)=>{
    const complainId=req.params.id;
    const {email,name,role}=req.user
    const {comment}=req.body
    try{
        const complain=await complaint.findById(complainId);
        if(complain){
            complain.comments.push({
                comment:comment,
                commentBy:name
            })

            await complain.save();
            res.status(200).json("add commment on complain");
        }
    }catch(error){
        res.status(500).json(error);
    }
})

//show thw all complain belong to the particular officer/department in the partcular district
const complaintAssignedToOfficer=expressAsyncHandler(async(req,res)=>{
    const {designation,name,email}=req.user;
    try{
        //TODO: refactor dont use filter
       const complain=await complaint.find({district:designation[1]});
       if(complain){
        const filterComplaint=complain.filter(comp=>{
            return comp.pathToTravel.some(dept=>designation[2]===dept.assignedDept);
        })
        if(filterComplaint){
            return res.status(200).json(filterComplaint);
        }else{
            return res.json(404).json("no filter complain found");
        }
       }else{
        console.log("no complain found");
        return res.status(400).json("no complain found")
       }
    }catch(error){
        res.status(500).json(error);
    }
})

// particular officer update the the status of complaint solved
// TODO :HOW WE UODATE MARK AS DONE
const updateStatus=expressAsyncHandler(async(req,res)=>{
    const complainId=req.params.id;
    // see which officer logged in
    const {designation,name,email}=req.user;
    try{
        const complain=await complaint.findById(complainId);
        if(complain){
            const isComplain=complain.pathToTravel.find(compl=>compl.assignedDept===designation[2]);

            if(isComplain){
                complain.pathToTravel
            }
        }
    }catch(error){
        res.status(500).json(error);
    }
})

// complain to travel just like the path given or complain seen by hte officers who are in the path to travel.

const toTravel=expressAsyncHandler(async(req,res)=>{

})

module.exports={
    createComplaint,
    complaintSeen,
    complaintAssignedToOfficer,
    addComment,addNodeToPath
}