const { PrismaClient } = require("@prisma/client");
const { createTCPServer } = require("./tcpServer");

const prisma = new PrismaClient();

async function startTCPServers() {
  try {
    // Fetch all device profiles from the database
    const deviceProfiles = await prisma.DeviceProfile.findMany();

    // Create a TCP server for each unique port
    const portToServerMap = new Map();
    for (const profile of deviceProfiles) {
      const { port } = profile;
      if (!portToServerMap.has(port)) {
        const { server, clients, deviceToClientMapping } =
          createTCPServer(port);
        portToServerMap.set(port, { server, clients, deviceToClientMapping });
      }
    }

    console.log("TCP servers started successfully");
  } catch (error) {
    console.error("Error starting TCP servers:", error);
  }
}
module.exports = { startTCPServers };
