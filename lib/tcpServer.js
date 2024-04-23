const net = require("net");

const clients = new Map();
const deviceToClientMapping = new Map();

function createTCPServer(port) {
  const server = net.createServer();

  // Event listener for when a new connection is established
  server.on("connection", (socket) => {
    console.log("A new connection has been established.");

    // Generate a unique identifier for the client
    const clientId = generateUniqueId();

    // Add the client socket to the clients map
    clients.set(clientId, socket);

    // Event listener for incoming data
    socket.on("data", (data) => {
      console.log(`Data received from ${clientId}: ${data}`);

      // Parse the device name from the received data (assuming it's part of the data)
      const deviceName = parseDeviceNameFromData(data);

      // Map the device name to the client ID
      deviceToClientMapping.set(deviceName, clientId);

      // Send a response to the client
      const response = `Hello from the server, ${clientId}!`;
      socket.write(response);
    });

    // Event listener for when the client disconnects
    socket.on("end", () => {
      console.log(`The client ${clientId} has disconnected.`);
      clients.delete(clientId);

      // Remove the device-to-client mapping for the disconnected client
      const deviceName = [...deviceToClientMapping.entries()].find(
        ([_, value]) => value === clientId
      )[0];
      deviceToClientMapping.delete(deviceName);
    });

    // Event listener for errors
    socket.on("error", (err) => {
      console.error(`Socket error from ${clientId}: ${err}`);
    });
  });

  // Start the server and listen on the specified port
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  return { server, clients, deviceToClientMapping };
}

// Helper function to generate a unique identifier for clients
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Helper function to send data to a client associated with a specific device
function sendDataToDevice(deviceName, data) {
  const clientId = deviceToClientMapping.get(deviceName);
  if (clientId) {
    const socket = clients.get(clientId);
    if (socket) {
      socket.write(data);
    } else {
      console.error(`Client with ID ${clientId} not found.`);
    }
  } else {
    console.error(`No client associated with device ${deviceName}.`);
  }
}

// Helper function to parse the device name from the received data (you'll need to implement this)
function parseDeviceNameFromData(data) {
  // Implement your logic here to parse the device name from the received data
  // For example, if the data starts with the device name followed by a colon, you could do:
  const [deviceName] = data.toString().split(":");
  return deviceName;
}

module.exports = createTCPServer;
