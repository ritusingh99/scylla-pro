const { PrismaClient } = require("@prisma/client");

class DeviceDataHandler {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async saveDeviceData(deviceId, data) {
    try {
      await this.prisma.DeviceData.create({
        data: {
          device: {
            connect: { id: deviceId },
          },
          data,
        },
      });
      console.log("Device data saved successfully");
    } catch (error) {
      console.error("Error saving device data:", error);
      throw error;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

module.exports = DeviceDataHandler;
