"use client";

import React from "react";
import { Zap, ExternalLink, ShieldCheck, Cpu, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/80 bg-background/90 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-gradient-to-t from-accent/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-border/60">
          {/* Brand info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-secondaryAccent flex items-center justify-center text-white shadow-glow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-mainText via-accent-light to-accent bg-clip-text text-transparent">
                AlphaGate
              </span>
            </div>
            <p className="text-xs font-bold text-accent">
              Decentralized Alpha Access. Capped On-Chain Whitelists.
            </p>
            <p className="text-xs text-secondaryText leading-relaxed max-w-sm">
              AlphaGate is a verifiable on-chain beta testing and allowlist engine built natively on Botchain Testnet. Protocol teams deploy capped testing waves without bots, and community testers verify passes on-chain.
            </p>
          </div>

          {/* Network details */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mainText flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <span>Network Telemetry</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-secondaryText font-mono">
              <li>
                <span className="text-secondaryText/70">Network:</span>{" "}
                <span className="text-mainText">Botchain Testnet</span>
              </li>
              <li>
                <span className="text-secondaryText/70">Chain ID:</span>{" "}
                <span className="text-accent">968</span>
              </li>
              <li>
                <span className="text-secondaryText/70">Gas Token:</span>{" "}
                <span className="text-mainText">BHR (Bohr)</span>
              </li>
              <li>
                <span className="text-secondaryText/70">Contract:</span>{" "}
                <a
                  href="https://scan.bohr.life/address/0x83963800D206199e472816CCA3Fa8d5bA4C9E751#code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  0x8396...E751 (Verified)
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mainText flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-secondaryAccent" />
              <span>Protocol Resources</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://scan.bohr.life"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondaryText hover:text-accent flex items-center gap-1 transition-colors"
                >
                  <span>Botchain Explorer (scan.bohr.life)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://rpc.bohr.life"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondaryText hover:text-accent flex items-center gap-1 transition-colors font-mono"
                >
                  <span>RPC: https://rpc.bohr.life</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400 text-xs pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Non-Custodial & Verified</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondaryText">
          <p>© {new Date().getFullYear()} AlphaGate Protocol. Powered by Botchain Testnet.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live On-Chain Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
