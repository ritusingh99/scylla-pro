const vm = require("vm");

exports.test = function (req, res) {
  const a = 4;
  const b = 5;

  // Example usage
  const userProvidedCode = `
    (function(a, b) {
      return a + b;
    })
  `;

  const result = processUserFunction(userProvidedCode, a, b);
  res.json({ message: "Test route working", result: result });
};

function processUserFunction(userCode, ...args) {
  try {
    // Create a new sandboxed context
    const sandbox = {};
    vm.createContext(sandbox);

    // Execute the user-provided code in the sandboxed context
    const userFunction = vm.runInContext(userCode, sandbox, { timeout: 1000 });

    // Execute the user function with the provided arguments
    const result = userFunction(...args);

    // Send the response after successful execution
    return sendResponse({ success: true, result: result });
  } catch (error) {
    // Handle any errors that occurred during execution
    console.error("Error executing user-provided code:", error);
    return sendResponse({ success: false, error: "An error occurred" });
  }
}

function sendResponse(response) {
  console.log(response);
  return response;
}

// const vm = require("vm");
// // const { getCodeFromDatabase } = require("./database");

// exports.test = async function (req, res) {
//   try {
//     // Example usage
//     const userProvidedCode = `
//       log("hello world 2")
//       const endpoint = \`https://devicefinder.orbiwise.com/api/v1/users\`
//       log(\`endpoint IP.: \${endpoint}\`);
//       import {Api, stats, addDeviceProfiles, addDevices, deleteDevices, deleteUsers, deleteDeviceProfiles} from "services"
//       // ... rest of the user-provided code ...
//     `;

//     // Process the user-provided code and imports
//     const result = await processUserCode(userProvidedCode);

//     res.json({ message: "Test route working", result: result });
//   } catch (error) {
//     console.error("Error in test route:", error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// };

// // Services
// async function processUserCode(userCode) {
//   try {
//     // Create a custom module loader
//     const moduleLoader = createCustomModuleLoader();

//     // Execute the user-provided code in a sandboxed environment
//     const result = await executeUserCode(userCode, moduleLoader);

//     // Send the response after successful execution
//     return sendResponse({ success: true, result: result });
//   } catch (error) {
//     // Handle any errors that occurred during execution
//     console.error("Error processing user code:", error);
//     return sendResponse({ success: false, error: "An error occurred" });
//   }
// }

// // Helpers
// function createCustomModuleLoader() {
//   return async function (moduleName) {
//     try {
//       // Retrieve the module code from the database
//       const moduleCode = await getCodeFromDatabase(moduleName);

//       // Create a new sandboxed context for the module
//       const moduleContext = vm.createContext({ exports: {} });

//       // Execute the module code in the sandboxed context
//       vm.runInContext(moduleCode, moduleContext);

//       return moduleContext.exports;
//     } catch (error) {
//       throw new Error(`Module '${moduleName}' not found.`);
//     }
//   };
// }

// function executeUserCode(userCode, moduleLoader) {
//   return new Promise((resolve, reject) => {
//     try {
//       // Create a new sandboxed context
//       const sandbox = {
//         log: console.log,
//         info: { params: {} },
//         args: {},
//         result: {},
//         require: moduleLoader,
//       };
//       vm.createContext(sandbox);

//       // Execute the user-provided code in the sandboxed context
//       vm.runInContext(userCode, sandbox, { timeout: 1000 });

//       resolve(sandbox.result);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// function sendResponse(response) {
//   console.log(response);
//   return response;
// }
