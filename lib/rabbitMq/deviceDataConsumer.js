const amqp = require("amqplib");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function consumeDeviceData(
  connectionUrl = "amqp://guest:guest@localhost:5672",
  queueName
) {
  try {
    const connection = await amqp.connect(connectionUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, async (message) => {
      try {
        const deviceData = JSON.parse(message.content.toString());
        const deviceName = "ritu"; // Assuming the device name is provided in the message
        const data = deviceData.data;

        // Fetch the device record based on the provided device name
        const device = await prisma.Device.findUnique({
          where: {
            id: "662ffd85e487a6fb724c324b",
            name: deviceName,
          },
        });

        if (!device) {
          console.log(`Device with name "${deviceName}" not found`);
          channel.ack(message);
          return;
        }

        // Save the device data using Prisma
        await prisma.DeviceData.create({
          data: {
            device: {
              connect: { id: device.id },
            },
            data: data,
          },
        });

        console.log("Device data saved to Prisma");
        channel.ack(message);
      } catch (error) {
        console.error("Error processing device data:", error);
        channel.ack(message); // Acknowledge the message to remove it from the queue
        // You can add additional error handling or logging logic here
      }
    });

    console.log("Waiting for device data messages...");
  } catch (error) {
    console.error("Error consuming device data:", error);
  }
}

// Usage example
const connectionUrl = "amqp://guest:guest@localhost:5672";
const queueName = "device_data_queue";
consumeDeviceData(connectionUrl, queueName);
