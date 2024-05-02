const { PrismaClient } = require("@prisma/client");
const validator = require("validator");
const prisma = new PrismaClient();

exports.createDevice = async (req, res) => {
  try {
    const {
      name,
      deviceType,
      manufacturer,
      model,
      serialNumber,
      macAddress,
      firmwareVersion,
      ipAddress,
      status,
      lastSeenAt,
      deviceProfileId,
    } = req.body;

    // Required Fields Validation
    if (!name || !deviceType || !deviceProfileId) {
      return res
        .status(400)
        .json({ error: "Name, deviceType, and deviceProfileId are required" });
    }

    // Data Type Validation
    if (
      typeof name !== "string" ||
      typeof deviceType !== "string" ||
      typeof deviceProfileId !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid data type for name, deviceType, or deviceProfileId",
      });
    }

    // Field Length Validation
    if (name.length > 100) {
      return res
        .status(400)
        .json({ error: "Name cannot exceed 100 characters" });
    }

    // Unique Constraint Validation
    const existingDevice = await prisma.device.findFirst({
      where: {
        OR: [{ serialNumber: serialNumber }, { macAddress: macAddress }],
      },
    });

    if (existingDevice) {
      return res.status(400).json({
        error:
          "A device with the same serialNumber or macAddress already exists",
      });
    }

    // Associated Data Validation
    const deviceProfile = await prisma.deviceProfile.findUnique({
      where: { id: deviceProfileId },
    });

    if (!deviceProfile) {
      return res.status(400).json({ error: "Invalid deviceProfileId" });
    }

    // Input Sanitization (example using a library like validator.js)
    const sanitizedName = validator.escape(name);
    const sanitizedManufacturer = manufacturer
      ? validator.escape(manufacturer)
      : null;
    const sanitizedModel = model ? validator.escape(model) : null;

    // Create a new device in the database
    const device = await prisma.device.create({
      data: {
        name: sanitizedName,
        deviceType,
        manufacturer: sanitizedManufacturer,
        model: sanitizedModel,
        serialNumber,
        macAddress,
        firmwareVersion,
        ipAddress,
        status,
        lastSeenAt,
        deviceProfileId,
      },
    });

    res.status(201).json(device);
  } catch (error) {
    console.error("Error saving device:", error);
    res.status(500).json({ error: "Failed to save device" });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      deviceType,
      manufacturer,
      model,
      serialNumber,
      macAddress,
      firmwareVersion,
      ipAddress,
      status,
      lastSeenAt,
      deviceProfileId,
    } = req.body;

    // Required Fields Validation
    if (!name || !deviceType || !deviceProfileId) {
      return res
        .status(400)
        .json({ error: "Name, deviceType, and deviceProfileId are required" });
    }

    // Data Type Validation
    if (
      typeof name !== "string" ||
      typeof deviceType !== "string" ||
      typeof deviceProfileId !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid data type for name, deviceType, or deviceProfileId",
      });
    }

    // Field Length Validation
    if (name.length > 100) {
      return res
        .status(400)
        .json({ error: "Name cannot exceed 100 characters" });
    }

    // Unique Constraint Validation
    const existingDevice = await prisma.device.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ serialNumber: serialNumber }, { macAddress: macAddress }],
          },
        ],
      },
    });

    if (existingDevice) {
      return res.status(400).json({
        error:
          "A device with the same serialNumber or macAddress already exists",
      });
    }

    // Associated Data Validation
    const deviceProfile = await prisma.deviceProfile.findUnique({
      where: { id: deviceProfileId },
    });

    if (!deviceProfile) {
      return res.status(400).json({ error: "Invalid deviceProfileId" });
    }

    // Input Sanitization (example using a library like validator.js)
    const sanitizedName = validator.escape(name);
    const sanitizedManufacturer = manufacturer
      ? validator.escape(manufacturer)
      : null;
    const sanitizedModel = model ? validator.escape(model) : null;

    // Update the device in the database
    const updatedDevice = await prisma.device.update({
      where: { id },
      data: {
        name: sanitizedName,
        deviceType,
        manufacturer: sanitizedManufacturer,
        model: sanitizedModel,
        serialNumber,
        macAddress,
        firmwareVersion,
        ipAddress,
        status,
        lastSeenAt,
        deviceProfileId,
      },
    });

    res.json(updatedDevice);
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ error: "Failed to update device" });
  }
};
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany();
    res.json(devices);
    console.log("done");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch devices" });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDevice = await prisma.device.delete({
      where: { id },
    });
    res.json({ message: "Device deleted successfully" });
    console.log("Device is deleted");
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ error: "Failed to delete device" });
  }
};
