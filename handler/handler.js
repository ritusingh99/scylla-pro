// server/handlers.js
const { t22001 } = require("./t22001");

const handlers = {
  22001: t22001,
  // Add more handlers for other ports if needed
};

function getHandler(port) {
  return handlers[port];
}

module.exports = {
  getHandler,
};
