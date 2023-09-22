const express = require("express");
// const { createDepartment } = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");
const { createDistrict, getAllDistrict } = require("../controllers/districtController");

const router = express.Router();

router.post("/addDistrict", protect, createDistrict);

router.get("/getDistrict",protect,getAllDistrict);

module.exports = router;
