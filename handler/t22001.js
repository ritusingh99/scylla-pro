const DeviceDataPublisher = require("../lib/rabbitMq/deviceDataPublisher");

async function t22001(clientInfo) {
  console.log("coming her inseide");
  const deviceId = "12345";
  const data = {
    data: "extracted data",
  };

  try {
    const queueName = "device_data_queue";
    const publisher = new DeviceDataPublisher(queueName);
    await publisher.publishData(deviceId, data);
    console.log("Device data published to queue successfully");
  } catch (error) {
    console.error("Error publishing device data:", error);
  }
}

module.exports = { t22001 };
