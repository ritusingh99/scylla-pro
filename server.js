// server.js

const express = require("express");
const cors = require("cors");
const startTCPServers = require("./lib/startTcpServers");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

startTCPServers.startTCPServers();
// Mount device routes
app.use("/devices", deviceRoutes);

// Start the Express server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
