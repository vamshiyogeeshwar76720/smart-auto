let provider;
let signer;
let contract;

// Your deployed Ethereum contract
const contractAddress = "0x8b29a91aa9d6c3AF8bc15160C45E7D321b485c64";

// Contract mapping for future networks
const contracts = {
  ethereum: {
    address: contractAddress,
    abi: contractABI,
  },

  // polygon: {
  //   address: contractAddress,
  //   abi: contractABI,
  // },
};

//--------------------------------------------
// CONNECT WALLET
//--------------------------------------------
document.getElementById("connectWalletBtn").onclick = async () => {
  try {
    if (!window.ethereum) return alert("MetaMask not installed!");

    provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const account = await signer.getAddress();
    document.getElementById("account").innerText = "Wallet: " + account;

    const network = await provider.getNetwork();
    const netName = network.name.toLowerCase();

    document.getElementById("network").innerText = "Network: " + netName;

    if (!contracts[netName]) {
      alert("⚠ Unsupported network. Please switch to Ethereum Sepolia.");
      return;
    }

    contract = new ethers.Contract(
      contracts[netName].address,
      contracts[netName].abi,
      signer
    );

    alert("Wallet Connected!");
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed!");
  }
};

//--------------------------------------------
// CREATE EMI PLAN (Receiver)
//--------------------------------------------
document.getElementById("createPlanBtn").onclick = async () => {
  try {
    const sender = document.getElementById("sender").value;
    const emiAmount = ethers.utils.parseEther(
      document.getElementById("emiAmount").value
    );
    const interval = Number(document.getElementById("intervalSelect").value);
    const totalAmount = ethers.utils.parseEther(
      document.getElementById("totalAmount").value
    );

    const network = await provider.getNetwork();
    const netName = network.name;

    const tx = await contract.createEmiPlan(
      sender,
      emiAmount,
      interval,
      totalAmount
    );

    await tx.wait();
    alert("EMI Plan Created Successfully!");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
};

//--------------------------------------------
// DEPOSIT FUNDS (Sender)
//--------------------------------------------
document.getElementById("depositBtn").onclick = async () => {
  try {
    const depositAmount = ethers.utils.parseEther(
      document.getElementById("depositAmount").value
    );

    const tx = await contract.depositFunds({ value: depositAmount });
    await tx.wait();

    alert("Deposit Successful!");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
};

//--------------------------------------------
// CHECK CONTRACT BALANCE
//--------------------------------------------
document.getElementById("checkBalanceBtn").onclick = async () => {
  try {
    const balance = await contract.getContractBalance();
    document.getElementById("contractBalance").innerText =
      ethers.utils.formatEther(balance) + " ETH";
  } catch (err) {
    console.error(err);
  }
};

//--------------------------------------------
// LOAD ACTIVE EMI PLAN
//--------------------------------------------
document.getElementById("loadPlanBtn").onclick = async () => {
  try {
    const p = await contract.plan();

    document.getElementById("planSender").innerText = p.sender;
    document.getElementById("planReceiver").innerText = p.receiver;
    document.getElementById("planEmiAmount").innerText =
      ethers.utils.formatEther(p.emiAmount);
    document.getElementById("planInterval").innerText = p.interval + " sec";
    document.getElementById("planTotalAmount").innerText =
      ethers.utils.formatEther(p.totalAmount);
    document.getElementById("planPaid").innerText = ethers.utils.formatEther(
      p.amountPaid
    );
    document.getElementById("planNextPayment").innerText = new Date(
      p.nextPaymentTime * 1000
    ).toLocaleString();

    // document.getElementById("planSenderNetwork").innerText = p.senderNetwork;
    document.getElementById("planStatus").innerText = p.isActive
      ? "ACTIVE"
      : "COMPLETED";
  } catch (err) {
    console.error(err);
    alert("Error loading plan!");
  }
};

// let provider;
// let signer;
// let contract;
// let account;

// const contractAddress = "0x8b29a91aa9d6c3AF8bc15160C45E7D321b485c64"; // Replace with your deployed address
// // const contractABI = await fetch("abi.js")
// //   .then((res) => res.json())
// //   .then((data) => data.abi);

// // --- Wallet Connection ---
// const contracts = {
//   ethereum: {
//     address: "0x8b29a91aa9d6c3AF8bc15160C45E7D321b485c64",
//     abi: contractABI,
//   },
//   bsc: { address: "0xBSC_ADDRESS", abi: contractABI },
//   polygon: { address: "0xPOLYGON_ADDRESS", abi: contractABI },
// };

// document.getElementById("connectWalletBtn").onclick = async () => {
//   try {
//     if (!window.ethereum) return alert("MetaMask not installed!");
//   provider = new ethers.providers.Web3Provider(window.ethereum);
//   await provider.send("eth_requestAccounts", []);
//   signer = provider.getSigner();

//   const network = await provider.getNetwork();
//   // Use correct contract based on network
//   const netName = network.name.toLowerCase();
//   if (!contracts[netName]) {
//     alert("Unsupported network!");
//     return;
//   }

//   contract = new ethers.Contract(
//     contracts[netName].address,
//     contracts[netName].abi,
//     signer
//   );
// };

// // --- Create EMI Plan ---
// document.getElementById("createPlanBtn").onclick = async () => {
//   try {
//     const sender = document.getElementById("sender").value;
//     const emiAmount = ethers.utils.parseEther(
//       document.getElementById("emiAmount").value
//     );
//     const interval = Number(document.getElementById("intervalSelect").value);
//     const totalAmount = ethers.utils.parseEther(
//       document.getElementById("totalAmount").value
//     );

//     const networkName = (await provider.getNetwork()).name;

//     const tx = await contract.createEmiPlan(
//       sender,
//       networkName,
//       emiAmount,
//       interval,
//       totalAmount
//     );
//     await tx.wait();
//     alert("EMI Plan Created Successfully!");
//   } catch (err) {
//     console.error(err);
//     alert("Error: " + err.message);
//   }
// };

// // --- Deposit Funds ---
// document.getElementById("depositBtn").onclick = async () => {
//   try {
//     const depositAmount = ethers.utils.parseEther(
//       document.getElementById("depositAmount").value
//     );
//     const tx = await contract.depositFunds({ value: depositAmount });
//     await tx.wait();
//     alert("Deposit Successful!");
//   } catch (err) {
//     console.error(err);
//     alert("Error: " + err.message);
//   }
// };

// // --- Check Contract Balance ---
// document.getElementById("checkBalanceBtn").onclick = async () => {
//   try {
//     const balance = await contract.getContractBalance();
//     document.getElementById("contractBalance").innerText =
//       ethers.utils.formatEther(balance) + " ETH";
//   } catch (err) {
//     console.error(err);
//     alert("Error: " + err.message);
//   }
// };

// // After creating or fetching plan
// document.getElementById("senderNetwork").innerText =
//   "Sender Network: " + plan.senderNetwork;
