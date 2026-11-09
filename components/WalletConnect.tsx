"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { botchainTestnet } from "@/lib/wagmi";
import { Wallet, AlertTriangle, ArrowRightLeft, LogOut, CheckCircle2, ChevronDown } from "lucide-react";

export function WalletConnect() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleConnect = () => {
    const metaMaskConnector =
      connectors.find((c) => c.id === "metaMask" || c.name.toLowerCase().includes("metamask")) ||
      connectors[0];

    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Wrong Network Warning & Switch Button */}
      {isWrongNetwork && (
        <button
          onClick={() => switchChain({ chainId: botchainTestnet.id })}
          disabled={isSwitching}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all animate-pulse"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{isSwitching ? "Switching..." : "Switch to Botchain (968)"}</span>
          <ArrowRightLeft className="w-3 h-3 ml-0.5" />
        </button>
      )}

      {/* Connected Network Indicator (When on Botchain) */}
      {isConnected && !isWrongNetwork && (
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Botchain Testnet</span>
        </div>
      )}

      {/* Wallet Button */}
      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow hover:opacity-95 active:scale-95 transition-all"
        >
          <Wallet className="w-4 h-4" />
          <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl bg-card border border-border hover:border-accent/50 transition-all text-mainText"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="font-mono">{truncateAddress(address!)}</span>
            <ChevronDown className="w-4 h-4 text-secondaryText" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-border shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-2 py-1.5 border-b border-border/60 mb-2">
                <p className="text-xs text-secondaryText">Connected Account</p>
                <p className="text-xs font-mono text-mainText break-all mt-0.5">{address}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>MetaMask Connected</span>
                </div>
              </div>

              {isWrongNetwork ? (
                <button
                  onClick={() => {
                    switchChain({ chainId: botchainTestnet.id });
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors mb-1.5"
                >
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Switch to Botchain
                  </span>
                  <ArrowRightLeft className="w-3 h-3" />
                </button>
              ) : (
                <div className="px-2 py-1 text-xs text-secondaryText mb-1 flex items-center justify-between">
                  <span>Network</span>
                  <span className="text-accent font-medium">Chain 968</span>
                </div>
              )}

              <button
                onClick={() => {
                  disconnect();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

