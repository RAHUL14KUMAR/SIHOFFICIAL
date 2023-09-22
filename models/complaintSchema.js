const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nodalSchema=new Schema({
    assignedDept:{
        type:String
    },
    assignedDist:{
        type:String
    },
    assignedPost:{
        type:String
    },
    markDone:{
        type:Boolean,
        default:false
    }
});

const commentSchema=new Schema({
    comment:{
        type:String
    },
    commentBy:{
        type:String
    }
})

const complaintSchema=new Schema({
    raisedBy: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    department:{
        type:String,
    },
    district:{
        type:String,
    },
    pathToTravel:{
        type:[nodalSchema]
    },
    descriptionByNodalOfficer:{
        type:String
    },
    comments:{
        type:[commentSchema]
    },
    status:{
        type:Boolean,
        default:false
    },
    partiallySolved:{
        type:Boolean,
        default:false
    }
},  { 
    timeStamps: true 
})
module.exports = mongoose.model("complaints", complaintSchema);