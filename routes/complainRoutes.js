const express = require("express");

const protect = require("../middleware/authMiddleware");
const { createComplaint, getComplaints, addNodeToPath } = require("../controllers/complaintController");

const router = express.Router();

router.post("/createComplaint",protect, createComplaint);
router.get("/getComplainForNodalOfficer",protect,getComplaints);

router.put('/addNode',addNodeToPath);
// router.post("/register", register);
// router.post("/addOfficer", protect, adminRegisterOfficier);

// router.put("/addDesignation", protect, putDesignation);
// router.put("/changeDesignation/:id", protect, changeDesignation);

// router.get("/allOfficer",protect, allOfficerInAdminDashBoard);

// router.delete("/officer/:id", deleteOfficer);

module.exports = router;
