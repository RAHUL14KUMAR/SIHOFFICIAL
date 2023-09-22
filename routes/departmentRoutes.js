const express = require("express");
const {
  createDepartment,
  seeAllTheDepartmentDistrictWise,
} = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addDepartment", protect, createDepartment);
router.post("/departmentInDistrict", protect, seeAllTheDepartmentDistrictWise);

module.exports = router;
