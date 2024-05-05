// routes/deviceRoutes.js

const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const deviceProfileController = require("../controllers/deviceProfileController");
const testCOntroller = require("../controllers/test");
const { createDeviceCode } = require("../controllers/deviceCode");

// Route to save a new device
router.post("/", deviceController.createDevice);
router.get("/", deviceController.getAllDevices);
router.delete("/:id", deviceController.deleteDevice);
router.put("/:id", deviceController.updateDevice);

// device profile connections
router.post("/code", createDeviceCode);
router.post("/profile", deviceProfileController.addDeviceProfile);
router.get("/test", testCOntroller.test);

module.exports = router;
