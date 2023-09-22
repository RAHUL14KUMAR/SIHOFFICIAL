const express = require("express");
const { createDepartment } = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addDepartment", protect, createDepartment);

module.exports = router;
