import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("----------------------------------------------------");
  console.log("Deploying AlphaGate Smart Contract to Botchain Testnet...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (deployer) {
    console.log("Deployer Address:", deployer.address);
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer Balance:", ethers.formatEther(balance), "BHR");
  }

  const AlphaGate = await ethers.getContractFactory("AlphaGate");
  const alphagate = await AlphaGate.deploy();

  await alphagate.waitForDeployment();
  const contractAddress = await alphagate.getAddress();

  console.log("====================================================");
  console.log("AlphaGate contract successfully deployed!");
  console.log("Deployed Contract Address:", contractAddress);
  console.log("Network: Botchain Testnet (Chain ID: 968)");
  console.log("RPC URL: https://rpc.bohr.life");
  console.log("Block Explorer: https://scan.bohr.life/address/" + contractAddress);
  console.log("====================================================");
  console.log("\nNext Steps:");
  console.log("1. Copy this address into your .env.local file:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Or update NEXT_PUBLIC_CONTRACT_ADDRESS in lib/contract.ts");
  console.log("3. Verify on Botchain Explorer (https://scan.bohr.life) if code verification is enabled.");
  console.log("----------------------------------------------------\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
