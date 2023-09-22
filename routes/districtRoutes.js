const express = require("express");
// const { createDepartment } = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");
const createDistrict = require("../models/createDistrict");

const router = express.Router();

router.post("/addDistrict", protect, createDistrict);

module.exports = router;
