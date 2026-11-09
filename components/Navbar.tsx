"use client";

import React from "react";
import { WalletConnect } from "./WalletConnect";
import { Compass, User, PlusCircle, ShieldCheck, Zap } from "lucide-react";

interface NavbarProps {
  activeTab: "explore" | "my-events" | "create";
  onTabChange: (tab: "explore" | "my-events" | "create") => void;
  totalEventsCount: number;
}

export function Navbar({ activeTab, onTabChange, totalEventsCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-xl border-b border-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onTabChange("explore")}
          className="flex items-center gap-3.5 cursor-pointer group select-none shrink-0"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent via-purple-600 to-secondaryAccent flex items-center justify-center text-white shadow-glow group-hover:scale-105 group-hover:rotate-1 transition-all">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-mainText via-purple-200 to-accent bg-clip-text text-transparent">
                AlphaGate
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-accent/15 text-accent border border-accent/30 tracking-wider">
                Protocol
              </span>
            </div>
            <p className="text-[11px] text-secondaryText hidden sm:flex items-center gap-1.5 font-medium">
              <span>Capped Whitelist Engine</span>
              <span className="text-border">•</span>
              <span className="text-emerald-400 font-mono">Botchain 968</span>
            </p>
          </div>
        </div>

        {/* Center Pill Switcher (Studio Navigation) */}
        <nav className="hidden md:flex items-center p-1.5 rounded-2xl bg-card border border-border/90 shadow-inner">
          <button
            onClick={() => onTabChange("explore")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "explore"
                ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                : "text-secondaryText hover:text-mainText hover:bg-white/5"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Alpha Waves</span>
            {totalEventsCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                  activeTab === "explore"
                    ? "bg-white/20 text-white"
                    : "bg-background text-secondaryText border border-border"
                }`}
              >
                {totalEventsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange("my-events")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "my-events"
                ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                : "text-secondaryText hover:text-mainText hover:bg-white/5"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>My Whitelist Passes</span>
          </button>

          <button
            onClick={() => onTabChange("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "create"
                ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                : "text-secondaryText hover:text-mainText hover:bg-white/5"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Campaign</span>
          </button>
        </nav>

        {/* Right side: Wallet Connector */}
        <div className="flex items-center gap-3">
          <WalletConnect />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-lg px-2 py-2">
        <button
          onClick={() => onTabChange("explore")}
          className={`flex-1 flex flex-col items-center py-1.5 rounded-xl text-[11px] font-bold transition-all ${
            activeTab === "explore" ? "text-accent bg-accent/10" : "text-secondaryText"
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Alpha Waves</span>
        </button>

        <button
          onClick={() => onTabChange("my-events")}
          className={`flex-1 flex flex-col items-center py-1.5 rounded-xl text-[11px] font-bold transition-all ${
            activeTab === "my-events" ? "text-accent bg-accent/10" : "text-secondaryText"
          }`}
        >
          <ShieldCheck className="w-4 h-4 mb-0.5" />
          <span>My Passes</span>
        </button>

        <button
          onClick={() => onTabChange("create")}
          className={`flex-1 flex flex-col items-center py-1.5 rounded-xl text-[11px] font-bold transition-all ${
            activeTab === "create" ? "text-accent bg-accent/10" : "text-secondaryText"
          }`}
        >
          <PlusCircle className="w-4 h-4 mb-0.5" />
          <span>Launch</span>
        </button>
      </div>
    </header>
  );
}
