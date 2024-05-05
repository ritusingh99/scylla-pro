const { createTCPServer } = require("../lib/tcpServer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addDeviceProfile = async (req, res) => {
  const {
    name,
    port,
    manufacturer,
    model,
    deviceType,
    macAddress,
    serialNumber,
    userId,
    description,
  } = req.body;

  // Validation for required fields
  if (!name || !port) {
    return res
      .status(400)
      .json({ message: "Name, device profile name, and port are required" });
  }

  // Validation for port
  const parsedPort = parseInt(port);
  if (isNaN(parsedPort) || parsedPort <= 2000 || parsedPort > 60000) {
    return res.status(400).json({ message: "Invalid port number" });
  }

  try {
    // Check if the port is already in use
    const existingProfile = await prisma.DeviceProfile.findUnique({
      where: { port: parsedPort },
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Port is already in use" });
    }
    // Create a new deviceProfile
    const newDeviceProfile = await prisma.DeviceProfile.create({
      data: {
        name,
        port: parsedPort,
        manufacturer,
        model,
        deviceType,
        macAddress,
        serialNumber,
        userId,
        description,
      },
    });

    // Create a TCP server on the specified port
    const { server, clients, deviceToClientMapping } =
      createTCPServer(parsedPort);

    res.json({ deviceProfile: newDeviceProfile, server });
  } catch (error) {
    // console.log(error);
    if (error.code === "P2002") {
      // Unique constraint violation
      res.status(400).json({ message: "Device profile name already exists" });
    } else {
      res.status(500).json({ message: "Error creating device profile" });
    }
  }
};
