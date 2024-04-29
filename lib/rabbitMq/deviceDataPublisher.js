const amqp = require("amqplib");

class DeviceDataPublisher {
  constructor(queueName) {
    this.connectionUrl = "amqp://guest:guest@localhost:5672";
    this.queueName = queueName;
  }

  async publishData(deviceId, data) {
    try {
      const connection = await amqp.connect(this.connectionUrl);
      const channel = await connection.createChannel();

      await channel.assertQueue(this.queueName, { durable: true });

      const message = {
        deviceId: "662ffd85e487a6fb724c324b",
        data: data,
      };

      await channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message))
      );
      console.log("Device data published to queue");

      await channel.close();
      await connection.close();
    } catch (error) {
      console.error("Error publishing device data:", error);
    }
  }
}

module.exports = DeviceDataPublisher;
