const express = require("express");
const protect = require("../middleware/authMiddleware");
const { analytics } = require("../controllers/analyticsController");

const router = express.Router();
router.get("/analysis",analytics);


module.exports = router;
