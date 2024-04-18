// 100 dummy devices
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function generateRandomDevices() {
  const names = ["device 1", "Device 2", "Device 3"];
  const deviceProfile = ["Profile A", "Profile B", "Profile C"];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const timestamp = new Date();
  const randomProfile =
    deviceProfile[Math.floor(Math.random() * deviceProfile.length)];

  return { name: randomName, timestamp, deviceProfile: randomProfile };
}

async function createDeviceRecords(req, res) {
  for (let i = 0; i < 100; i++) {
    const deviceData = generateRandomDevices();

    await prisma.device.create({ data: deviceData });
  }
  res.json("devicedata records successfully .");
}

module.exports = { createDeviceRecords };
// createDeviceRecords()
//   .catch((error) => {
//     console.error("Error creating device records:", error);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
