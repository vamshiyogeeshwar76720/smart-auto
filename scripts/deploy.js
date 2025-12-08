// import { ethers } from "hardhat";

// async function main() {
//   const EmiContract = await ethers.getContractFactory("EmiAutoPay");
//   const emi = await EmiContract.deploy();
//   await emi.deployed();

//   console.log("Contract deployed to:", emi.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });




// scripts/deploy.js (CommonJS version)
import hre from "hardhat";


async function main() {
  console.log("Deploying EmiAutoPay contract...");

  // 1. Get contract factory
  const EmiContract = await hre.ethers.getContractFactory("EmiAutoPay");

  // 2. Deploy
  const emi = await EmiContract.deploy();
  

  console.log("EmiAutoPay deployed to:", emi.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

