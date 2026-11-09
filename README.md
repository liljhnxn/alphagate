# AlphaGate

> **Decentralized Alpha Access. Capped On-Chain Whitelists.**

AlphaGate is a decentralized, high-performance Web3 allowlist and beta testing wave protocol built directly on the **Botchain Testnet** (Chain ID: `968`). AlphaGate empowers protocol builders to broadcast testing waves with verifiable, sybil-resistant tester quotas—eliminating bots, spam, and centralized Google Forms. Community testers secure their verifiable whitelist passes directly with their connected Web3 wallets.

All testing wave allocations, quotas, and claimed passes are stored immutable on the blockchain via a verified Solidity smart contract.

---

## 🌟 Key Features

- **Decentralized On-Chain Allowlist**: Wave allocations and tester passes are recorded directly in the smart contract—no centralized database, no backend server, no token, and no NFT requirements.
- **Single-Page Application Architecture**: Smooth, intuitive single-page console with seamless tab switching between *Alpha Waves*, *My Whitelist Passes*, and *Launch Campaign*.
- **Public Discovery Without Barriers**: Anyone can explore open testing rounds, target dApp endpoints, and quota counts without connecting a wallet.
- **Instant MetaMask Integration**: Connect with one click. Automatic detection for network ID `968` (Botchain Testnet) with one-click network switching.
- **Launchpad Studio with Live Pass Preview**: Broadcast testing rounds with custom tester caps, expiry dates, testing criteria, and target dApp/repo links with an interactive live pass preview.
- **Capacity & Quota Enforcement**: Prevents overbooking, duplicate claims, claims on expired waves, and claims on closed rounds at the blockchain layer.
- **Self-Service Slot Surrender**: Whitelisted testers can surrender their slot at any time to free up quota for other community members.
- **Admin Control**: Only the original protocol creator possesses permission to close their testing wave.
- **Live On-Chain Telemetry**: Dynamic real-time calculations for Total Alpha Campaigns, Open Testing Waves, Whitelisted Testers, and Launched Waves.

---

## 🏗️ Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Web3 / Blockchain Client**: wagmi v2, viem, TanStack Query
- **Wallet Support**: MetaMask & Injected EVM wallets
- **Smart Contract**: Solidity `^0.8.20`, Hardhat
- **Blockchain Network**: Botchain Testnet

---

## 🌐 Botchain Testnet Configuration

| Parameter | Configuration |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |
| **Currency Symbol** | `BHR` (Bohr) |
| **Verified Contract** | [`0xE9cD49688af28A3DA5A33e30EcEe2D4A581B47BA`](https://scan.bohr.life/address/0xE9cD49688af28A3DA5A33e30EcEe2D4A581B47BA#code) |

---

## 📂 Project Structure

```
AlphaGate/
├── app/
│   ├── globals.css         # Cyber-styled theme, glow accents, dark palette
│   ├── icon.svg            # Alpha shield vector favicon
│   ├── layout.tsx          # App root layout with font and metadata
│   ├── page.tsx            # Main single webpage integrating all sections
│   └── providers.tsx       # Wagmi and React Query providers
├── components/
│   ├── Navbar.tsx          # Navigation console with live wave count
│   ├── Hero.tsx            # Launchpad banner with instant action pills
│   ├── Stats.tsx           # Telemetry HUD (Waves, Allocations, Testers)
│   ├── EventExplorer.tsx   # Public alpha feed with search, filters & sort
│   ├── EventCard.tsx       # Alpha pass card with Claim, Surrender & Admin close
│   ├── MyEvents.tsx        # Personal vault: claimed passes & launched waves
│   ├── EventForm.tsx       # Launchpad studio with live pass preview
│   ├── WalletConnect.tsx   # MetaMask connection, network status & switcher
│   └── Footer.tsx          # Protocol footer with network indicators
├── contracts/
│   └── Gatherly.sol        # Core smart contract
├── test/
│   └── Gatherly.test.ts    # Comprehensive test suite covering all cases
├── scripts/
│   └── deploy.ts           # Deployment script targeting Botchain Testnet
├── lib/
│   ├── wagmi.ts            # Wagmi & Viem Botchain chain configuration
│   └── contract.ts         # Contract address, full ABI & TypeScript interfaces
├── hardhat.config.ts       # Hardhat configuration for Botchain Testnet
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Visual palette
└── .env.example            # Environment variables template
```

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+ or v20+)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) browser extension

### 2. Installation

Clone or navigate into the project directory and install dependencies:

```bash
npm install
```

### 3. Environment Setup

Configure your `.env.local` file:

```env
# Deployment Credentials (Hardhat)
BOTCHAIN_RPC_URL=https://rpc.bohr.life
PRIVATE_KEY=your_private_key_here

# Frontend Configuration (Next.js)
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.bohr.life
NEXT_PUBLIC_CONTRACT_ADDRESS=0x83963800D206199e472816CCA3Fa8d5bA4C9E751
```

---

## ⚡ Smart Contract Compilation & Testing

Compile the smart contract:

```bash
npx hardhat compile
```

Execute the unit tests:

```bash
npx hardhat test
```

All 22 unit tests verify:
- Wave creation and input validation (empty title, empty description, empty endpoint, past date, zero quota).
- On-chain wave retrieval and bulk listing.
- Slot reservations, capacity limits, and duplicate prevention.
- Slot surrender and capacity restoration.
- Access-controlled round closure restricted strictly to creators.
- Accurate emission of all contract events (`EventCreated`, `EventRSVP`, `RSVPCancelled`, `EventClosed`).

---

## 🚢 Deploying to Botchain Testnet

Ensure your deployer wallet has testnet `BHR` tokens for gas on Botchain Testnet.

Run the deployment script:

```bash
npx hardhat run scripts/deploy.ts --network botchain
```

---

## 💻 Running the Web Application

Start the local development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

To create an optimized production build:

```bash
npm run build
npm start
```

---

## 🦊 Connecting MetaMask to Botchain Testnet

1. Open MetaMask and click the network selector.
2. Select **Add Network** -> **Add a network manually**.
3. Enter the following details:
   - **Network Name**: `Botchain Testnet`
   - **New RPC URL**: `https://rpc.bohr.life`
   - **Chain ID**: `968`
   - **Currency Symbol**: `BHR`
   - **Block Explorer URL**: `https://scan.bohr.life`
4. Click **Save**.
5. Alternatively, launch AlphaGate and click the **"Switch to Botchain"** button in the header—AlphaGate will automatically prompt MetaMask to switch or add the network for you!

---

## 📄 License

MIT License. Built for the Botchain Web3 developer community.
