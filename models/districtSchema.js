const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const districtSchema = new Schema({
  district: {
    type: String,
  },
});

module.exports = mongoose.model("districts", districtSchema);
