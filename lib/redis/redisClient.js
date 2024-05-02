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
    console.log("Publishing message to client with client ID:", clientId);
    await redisClient.publish(clientId, message);
  } catch (error) {
    console.error(`Error publishing to client ${clientId}:`, error);
  }
}

// Function to link connectionId (imei) to clientId in Redis
async function linkConnectionIdToClientId(connectionId, clientId) {
  try {
    await redisClient.set(`connection:${connectionId}`, clientId);
    console.log(`Linked connectionId ${connectionId} to clientId ${clientId}`);
  } catch (error) {
    console.error(`Error linking connectionId to clientId: ${error}`);
  }
}

// Function to get client information by imei (connectionId) from Redis
async function getClientInfoByImei(imei) {
  try {
    const clientId = await redisClient.get(`connection:${imei}`);
    if (clientId) {
      const clientInfo = JSON.parse(await redisClient.get(clientId));
      return clientInfo;
    }
    return null;
  } catch (error) {
    console.error(`Error getting client info by IMEI: ${error}`);
    return null;
  }
}

module.exports = {
  storeClientInfo,
  removeClientInfo,
  subscribeToClient,
  publishToClient,
  linkConnectionIdToClientId,
  getClientInfoByImei,
};
