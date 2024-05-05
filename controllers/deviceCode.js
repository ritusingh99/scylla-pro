const acorn = require("acorn");
const { PrismaClient } = require("@prisma/client");
const validator = require("validator");
const prisma = new PrismaClient();

exports.createDeviceCode = async (req, res) => {
  try {
    const { code, devices } = req.body;

    // Required Fields Validation
    if (
      !code ||
      typeof code !== "object" ||
      Object.keys(code).length === 0 ||
      !devices ||
      !Array.isArray(devices) ||
      devices.length === 0
    ) {
      return res.status(400).json({
        error:
          "Code and devices are required, code must be a non-empty object, and devices must be a non-empty array",
      });
    }

    // Process each code file
    const compiledCode = {};
    for (const fileName in code) {
      const sanitizedCode = code[fileName].replace(
        /\/\/.*|\/\*[\s\S]*?\*\//g,
        ""
      ); // Remove comments

      try {
        acorn.parse(sanitizedCode, { ecmaVersion: "latest" });
        compiledCode[fileName] = sanitizedCode;
      } catch (parseError) {
        return res.status(400).json({
          error: `Code in file "${fileName}" contains syntax errors`,
          details: parseError.message,
        });
      }
    }

    // Check if all deviceIds exist in the database
    const deviceIds = devices.map((device) => device.toString());
    const existingDevices = await prisma.Device.findMany({
      where: { id: { in: deviceIds } },
    });

    if (existingDevices.length !== deviceIds.length) {
      return res
        .status(400)
        .json({ error: "One or more deviceIds are invalid" });
    }

    // Create a new DeviceCode in the database
    const deviceCode = await prisma.DeviceCode.create({
      data: {
        code,
        compiledCode,
        devices: { connect: deviceIds.map((deviceId) => ({ id: deviceId })) },
      },
    });

    res.status(201).json(deviceCode);
  } catch (error) {
    console.error("Error saving DeviceCode:", error);
    res.status(500).json({ error: "Failed to save DeviceCode" });
  }
};
