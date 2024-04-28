// lib/redis/redisClient.js
const redis = require("redis");

// Create a Redis client
const redisClient = redis.createClient();

// Connect to Redis
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((error) => {
    console.error("Error connecting to Redis:", error);
  });

// Function to store client information in Redis
async function storeClientInfo(clientId, clientInfo) {
  try {
    await redisClient.set(clientId, JSON.stringify(clientInfo));
  } catch (error) {
    console.error("Error storing client info:", error);
  }
}

// Function to remove client information from Redis
async function removeClientInfo(clientId) {
  try {
    await redisClient.del(clientId);
  } catch (error) {
    console.error("Error removing client info:", error);
  }
}

// Function to subscribe to messages for a specific client
function subscribeToClient(clientId, callback) {
  const subscriber = redisClient.duplicate();
  subscriber
    .connect()
    .then(() => {
      subscriber.subscribe(clientId, (message) => {
        callback(message);
      });
    })
    .catch((error) => {
      console.error(`Error subscribing to client ${clientId}:`, error);
    });
}

// Function to publish a message to a specific client
async function publishToClient(clientId, message) {
  try {
    await redisClient.publish(clientId, message);
  } catch (error) {
    console.error(`Error publishing to client ${clientId}:`, error);
  }
}

module.exports = {
  storeClientInfo,
  removeClientInfo,
  subscribeToClient,
  publishToClient,
};
