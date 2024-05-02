const DeviceDataPublisher = require("../lib/rabbitMq/deviceDataPublisher");
const {
  getClientInfoByImei,
  linkConnectionIdToClientId,
} = require("../lib/redis/redisClient");

async function t22001(clientInfo) {
  console.log("Coming here inside");

  const deviceId = "12345";
  const data = {
    data: "extracted data",
  };

  try {
    const queueName = "device_data_queue";
    const publisher = new DeviceDataPublisher(queueName);

    // Get the imei from the clientInfo object
    const imei = "clientInfo";

    // Set the connectionId to the imei
    const connectionId = imei;

    // Link the connectionId to the client ID in Redis
    await linkConnectionIdToClientId(connectionId, clientInfo.id);

    // Publish the device data to the queue
    await publisher.publishData(deviceId, data);
    console.log("Device data published to queue successfully");

    // Fetch the client information from Redis using the imei (connectionId)
    const clientData = await getClientInfoByImei(connectionId);
    if (clientData) {
      // Send the data back to the client using the client's socket
      const clientSocket = clientData.socket;
      clientSocket.write(JSON.stringify(data));
      console.log("Data sent back to the client");
    } else {
      console.log(`Client not found for connectionId (imei): ${connectionId}`);
    }
  } catch (error) {
    console.error("Error publishing device data:", error);
  }
}

module.exports = {
  t22001,
};
