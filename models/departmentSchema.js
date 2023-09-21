const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema=new Schema({
    deptName:{
        type:String
    },
    district:{
        type:String
    }
})

module.exports = mongoose.model("departments", departmentSchema);