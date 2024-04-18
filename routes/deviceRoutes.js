// routes/deviceRoutes.js

const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const addDevices = require("../addDevices");

// Route to save a new device
router.post("/", deviceController.createDevice);
router.get("/", deviceController.getAllDevices);
router.delete("/:id", deviceController.deleteDevice);
router.put("/:id", deviceController.updateDevice);
router.get("/migration", addDevices.createDeviceRecords);
module.exports = router;
