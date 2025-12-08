// // hardhat.config.cjs

// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// // Read environment variables
// const RPC_URL ="https://sepolia.infura.io/v3/eb035b0a49e541c98c04dcdf95e3bf85";
// const PRIVATE_KEY="0xdd9f418f2c95b591b023f5169180d6740e663b06c640f68794cfce0901796d04";

// // Ensure the variables exist
// if (!RPC_URL || !PRIVATE_KEY) {
//   throw new Error("Please set RPC_URL and PRIVATE_KEY in your .env file");
// }

// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     sepolia: {
//       url: RPC_URL,            // string
//       accounts: [PRIVATE_KEY], // array of strings
//     },
//   },
// };



// hardhat.config.cjs

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Read environment variables from .env
const RPC_URL = process.env.RPC_URL || "https://sepolia.infura.io/v3/eb035b0a49e541c98c04dcdf95e3bf85";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xdd9f418f2c95b591b023f5169180d6740e663b06c640f68794cfce0901796d04";

// Ensure the variables exist
if (!RPC_URL || !PRIVATE_KEY) {
  throw new Error("Please set RPC_URL and PRIVATE_KEY in your .env file");
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
