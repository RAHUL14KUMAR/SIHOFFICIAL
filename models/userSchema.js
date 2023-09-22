const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const officerSchema = new Schema({
  post: {
    type: String,
  },
  dist: {
    type: String,
  },
  dept: {
    type: String,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    adharCardNumber: {
      type: String,
    },
    role: {
      type: String,
      default: "citizen",
    },
    designation: {
      type: Array,
    },
  },
  {
    timeStamps: true,
  }
);
module.exports = mongoose.model("users", userSchema);
