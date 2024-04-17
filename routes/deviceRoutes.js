// routes/deviceRoutes.js

const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");

// Route to save a new device
router.post("/", deviceController.createDevice);
router.get("/", deviceController.getAllDevices);
router.delete("/:id", deviceController.deleteDevice);
router.put("/:id", deviceController.updateDevice);
module.exports = router;
