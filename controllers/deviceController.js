// controllers/deviceController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { Device } = prisma;

exports.createDevice = async (req, res) => {
  try {
    const { name, timestamp, deviceProfile } = req.body;

    // Create a new device in the database
    const device = await prisma.device.create({
      data: {
        name,
        timestamp,
        deviceProfile,
      },
    });

    res.json(device);
    console.log(device);
  } catch (error) {
    console.error("Error saving device:", error);
    res.status(500).json({ error: "Failed to save device" });
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
      where: {
        id: id.toString(),
      },
    });
    res.json({ message: "device deleted successfully" });
    console.log("device is deleted");
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ error: "Failed to delete device" });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, timestamp, deviceProfile } = req.body;

    const updatedDevice = await prisma.device.update({
      where: { id: id.toString() },
      data: {
        name,
        timestamp,
        deviceProfile,
      },
    });
    res.json(updatedDevice);
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ error: "Failed to update device" });
  }
};
