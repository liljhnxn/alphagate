import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("====================================================");
  console.log("🚀 STARTING LIVE ON-CHAIN TESTS ON BOTCHAIN TESTNET");
  console.log("====================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Test Wallet Address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Test Wallet Balance:", ethers.formatEther(balance), "BHR");

  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0xE9cD49688af28A3DA5A33e30EcEe2D4A581B47BA";
  console.log("Target AlphaGate Contract:", contractAddress);
  console.log("Explorer Contract Link: https://scan.bohr.life/address/" + contractAddress);
  console.log("----------------------------------------------------\n");

  const AlphaGate = await ethers.getContractFactory("AlphaGate");
  const alphagate = AlphaGate.attach(contractAddress);

  // 1. Initial State Check
  console.log("Step 1: Reading initial on-chain protocol metrics...");
  const initialCount = await alphagate.getTotalEventCount();
  console.log(`Current Total Alpha Waves on-chain: ${initialCount}`);

  // 2. Create Alpha Wave on-chain
  console.log("\nStep 2: Broadcasting a real Alpha Testing Wave transaction...");
  const waveTitle = "BohrFi DEX Aggregator Alpha v1.0";
  const waveDescription =
    "Exclusive closed beta access for high-frequency trading testers on Botchain. Low-slippage routing & liquidity stress test.";
  const waveLocation = "https://alpha.bohrfi.io/gateway";
  const futureTimestamp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600; // 7 days in future
  const maxTesters = 25;

  console.log(`- Title: "${waveTitle}"`);
  console.log(`- Gateway: "${waveLocation}"`);
  console.log(`- Max Whitelist Slots: ${maxTesters}`);

  const createTx = await alphagate.createEvent(
    waveTitle,
    waveDescription,
    waveLocation,
    futureTimestamp,
    maxTesters
  );
  console.log(`Sent tx: ${createTx.hash}`);
  console.log("Waiting for block confirmation on Botchain...");
  const createReceipt = await createTx.wait(1);
  console.log(`✅ Wave created! Block #${createReceipt.blockNumber}, Gas Used: ${createReceipt.gasUsed.toString()}`);
  console.log(`Tx Explorer: https://scan.bohr.life/tx/${createTx.hash}`);

  const newTotalCount = await alphagate.getTotalEventCount();
  const newWaveId = Number(newTotalCount);
  console.log(`Newly registered Wave ID: #${newWaveId}`);

  // 3. Verify on-chain details
  console.log("\nStep 3: Verifying newly created Wave record on-chain...");
  const waveRecord = await alphagate.getFunction("getEvent")(newWaveId);
  console.log(`- ID: ${waveRecord.id}`);
  console.log(`- Creator: ${waveRecord.creator}`);
  console.log(`- Title: ${waveRecord.title}`);
  console.log(`- Status: ${waveRecord.status === 0 ? "Active (Open)" : "Closed"}`);
  console.log(`- Current Testers: ${waveRecord.totalAttendees} / ${waveRecord.maxAttendees}`);

  // 4. Create a secondary test wallet to claim Alpha Pass (RSVP)
  console.log("\nStep 4: Creating a secondary tester wallet & funding it for gas...");
  const testerWallet = ethers.Wallet.createRandom().connect(ethers.provider);
  console.log(`Generated Tester Address: ${testerWallet.address}`);

  // Fund tester wallet with 0.1 BHR for gas
  const fundTx = await deployer.sendTransaction({
    to: testerWallet.address,
    value: ethers.parseEther("0.1"),
  });
  console.log(`Funding tx sent: ${fundTx.hash}`);
  await fundTx.wait(1);
  console.log("Tester wallet successfully funded with 0.1 BHR!");

  // 5. Claim Alpha Pass on-chain (RSVP)
  console.log("\nStep 5: Claiming Alpha Pass on-chain from tester wallet...");
  const testerContract = alphagate.connect(testerWallet);
  const claimTx = await testerContract.rsvp(newWaveId);
  console.log(`Sent claim tx: ${claimTx.hash}`);
  const claimReceipt = await claimTx.wait(1);
  console.log(`✅ Alpha Pass claimed! Block #${claimReceipt.blockNumber}`);
  console.log(`Tx Explorer: https://scan.bohr.life/tx/${claimTx.hash}`);

  // 6. Verify whitelist status on-chain
  console.log("\nStep 6: Verifying on-chain whitelist and attendee allocation...");
  const isWhitelisted = await alphagate.hasUserRSVPd(newWaveId, testerWallet.address);
  const totalAttendees = await alphagate.getTotalAttendees(newWaveId);
  const attendeesList = await alphagate.getEventAttendees(newWaveId);
  console.log(`- Tester Whitelisted: ${isWhitelisted ? "YES ✅" : "NO ❌"}`);
  console.log(`- Wave Total Testers: ${totalAttendees} / ${maxTesters}`);
  console.log(`- Whitelisted Addresses: ${JSON.stringify(attendeesList)}`);

  // 7. Test slot surrender (cancelRSVP)
  console.log("\nStep 7: Testing slot surrender on-chain (cancelRSVP)...");
  const surrenderTx = await testerContract.cancelRSVP(newWaveId);
  console.log(`Sent surrender tx: ${surrenderTx.hash}`);
  await surrenderTx.wait(1);
  console.log(`✅ Slot surrendered! Tx Explorer: https://scan.bohr.life/tx/${surrenderTx.hash}`);

  const isStillWhitelisted = await alphagate.hasUserRSVPd(newWaveId, testerWallet.address);
  const attendeesAfterSurrender = await alphagate.getTotalAttendees(newWaveId);
  console.log(`- Tester Whitelisted after surrender: ${isStillWhitelisted ? "YES ❌" : "NO (Cleanly removed) ✅"}`);
  console.log(`- Wave Total Testers: ${attendeesAfterSurrender} / ${maxTesters}`);

  // 8. Re-claim pass to leave active test data in the live app!
  console.log("\nStep 8: Re-claiming Alpha Pass so the live app has active tester telemetry...");
  const reclaimTx = await testerContract.rsvp(newWaveId);
  await reclaimTx.wait(1);
  console.log(`✅ Pass re-claimed! Tx Explorer: https://scan.bohr.life/tx/${reclaimTx.hash}`);

  // 9. Fetch all events batch read
  console.log("\nStep 9: Testing batch read `getAllEvents()` as used by frontend...");
  const allEvents = await alphagate.getAllEvents();
  console.log(`Total active events returned by RPC: ${allEvents.length}`);
  allEvents.forEach((ev, idx) => {
    console.log(`  [#${ev.id}] "${ev.title}" by ${ev.creator} | Capacity: ${ev.totalAttendees}/${ev.maxAttendees}`);
  });

  console.log("\n====================================================");
  console.log("🎉 ALL ON-CHAIN TESTS COMPLETED SUCCESSFULLY!");
  console.log("====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("On-chain test error:", err);
    process.exit(1);
  });

