const { createTCPServer } = require("../lib/tcpServer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.addDeviceProfile = async (req, res) => {
  const { deviceProfileName, port } = req.body;

  try {
    // Check if the port is already in use
    const existingProfile = await prisma.deviceProfile.findUnique({
      where: { port: parseInt(port) },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Port is already in use" });
    }

    // Create a new deviceProfile
    const newDeviceProfile = await prisma.deviceProfile.create({
      data: {
        deviceProfileName,
        port: parseInt(port),
      },
    });

    // Create a TCP server on the specified port
    const { server, clients, deviceToClientMapping } = createTCPServer(port);

    res.json({ deviceProfile: newDeviceProfile, server });
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      res.status(400).json({ message: "Device profile name already exists" });
    } else {
      res.status(500).json({ message: "Error creating device profile" });
    }
  }
};
