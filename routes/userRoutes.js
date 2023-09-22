const express = require("express");
const {
  login,
  register,
  adminRegisterOfficier,
  putDesignation,
  allOfficerInAdminDashBoard,
  assignNodelOfficer,
  deleteOfficer,
  changeDesignation,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const { createDepartment } = require("../controllers/departmentController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/addOfficer", protect, adminRegisterOfficier);
router.post("/addDepartment", protect, createDepartment);

router.put("/addDesignation", protect, putDesignation);
router.put("/assignNodal/:id", protect, assignNodelOfficer);
router.put("/changeDesignation/:id", protect, changeDesignation);

router.get("/allOfficer", allOfficerInAdminDashBoard);

router.delete("/officer/:id", deleteOfficer);

module.exports = router;
