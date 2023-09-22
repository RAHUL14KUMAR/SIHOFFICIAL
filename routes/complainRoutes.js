const express = require("express");

const protect = require("../middleware/authMiddleware");
const { createComplaint, getComplaints, addNodeToPath, addNodalDescription, addComment } = require("../controllers/complaintController");

const router = express.Router();

router.post("/createComplain",protect, createComplaint);
router.get("/getComplaint",protect,getComplaints);

//TODO: comment and description is not tested
router.put('/addDescription',addNodalDescription);
router.put('/addNodeToPath/:id',protect,addNodeToPath);

router.put('/addComments',addComment);
// router.post("/register", register);
// router.post("/addOfficer", protect, adminRegisterOfficier);

// router.put("/addDesignation", protect, putDesignation);
// router.put("/changeDesignation/:id", protect, changeDesignation);

// router.get("/allOfficer",protect, allOfficerInAdminDashBoard);

// router.delete("/officer/:id", deleteOfficer);

module.exports = router;
