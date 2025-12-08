import { ethers } from "hardhat";

async function main() {
  const EmiContract = await ethers.getContractFactory("EmiAutoPay");
  const emi = await EmiContract.deploy();
  await emi.deployed();

  console.log("Contract deployed to:", emi.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
