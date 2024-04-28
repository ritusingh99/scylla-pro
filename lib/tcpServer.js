// server/server.js
const net = require("net");
const {
  storeClientInfo,
  removeClientInfo,
  subscribeToClient,
} = require("../lib/redis/redisClient");
const { getHandler } = require("../handler/handler");

function createTCPServer(port) {
  const server = net.createServer();

  // Event listener for when a new connection is established
  server.on("connection", async (socket) => {
    const clientId = generateUniqueId();

    // Extract the port number from the _connectionKey
    const connectionKey = socket.server._connectionKey;
    const parts = connectionKey.split(":");
    const clientPort = parts[parts.length - 1];

    // Get the remote address of the client
    const clientAddress = socket.remoteAddress;

    // Create an object to store client information
    const clientInfo = {
      id: clientId,
      address: clientAddress,
      port: clientPort,
      socket: socket,
    };

    // Store the client information in Redis
    await storeClientInfo(clientId, clientInfo);

    console.log(
      `New client connected: ${clientId} (Address: ${clientAddress}, Port: ${clientPort})`
    );

    // Subscribe to messages for this client
    subscribeToClient(clientId, (message) => {
      socket.write(message);
    });

    // Get the appropriate handler based on the client's port
    const handler = getHandler(clientPort);

    // Event listener for incoming data
    socket.on("data", async (data) => {
      console.log(
        `Data received from ${clientId} (Address: ${clientAddress}, Port: ${clientPort}): ${data}`
      );

      // Call the appropriate handler for the client
      if (handler) {
        const handlerData = await handler(clientInfo);
        console.log("handlerData", handlerData);
      }
    });

    // Event listener for when the client disconnects
    socket.on("end", async () => {
      console.log(
        `Client disconnected: ${clientId} (Address: ${clientAddress}, Port: ${clientPort})`
      );
      await removeClientInfo(clientId);
    });

    // Event listener for errors
    socket.on("error", (err) => {
      console.error(
        `Socket error from ${clientId} (Address: ${clientAddress}, Port: ${clientPort}): ${err}`
      );
    });
  });

  // Start the server and listen on the specified port
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  return { server };
}

// Helper function to generate a unique identifier for clients
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = {
  createTCPServer,
};
