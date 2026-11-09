"use client";

import React from "react";
import { Compass, PlusCircle, Sparkles, ShieldCheck, Zap, Lock, Terminal } from "lucide-react";

interface HeroProps {
  onTabChange: (tab: "explore" | "my-events" | "create") => void;
  activeTab: "explore" | "my-events" | "create";
}

export function Hero({ onTabChange, activeTab }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-6 md:pt-12 md:pb-10 border-b border-border/60">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-gradient-to-r from-accent/15 via-secondaryAccent/10 to-purple-800/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Title Column */}
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border/80 text-xs font-semibold text-accent shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>Verifiable Whitelist Protocol</span>
              <span className="text-secondaryText">•</span>
              <span className="text-secondaryAccent font-bold">Botchain Testnet (968)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              Decentralized Alpha Access.{" "}
              <span className="bg-gradient-to-r from-accent via-purple-300 to-secondaryAccent bg-clip-text text-transparent">
                Capped Whitelists.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-secondaryText leading-relaxed max-w-xl">
              No bots. No Google forms. No fake signups. Protocol builders broadcast capped beta testing waves, and community members secure verifiable on-chain access passes directly through their Web3 wallets.
            </p>
          </div>

          {/* Right Action Switcher Hub */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-3">
            <button
              onClick={() => onTabChange("explore")}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "explore"
                  ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                  : "bg-card border border-border text-secondaryText hover:text-mainText hover:border-accent/40"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Alpha Waves</span>
            </button>

            <button
              onClick={() => onTabChange("my-events")}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "my-events"
                  ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                  : "bg-card border border-border text-secondaryText hover:text-mainText hover:border-accent/40"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>My Claimed Passes</span>
            </button>

            <button
              onClick={() => onTabChange("create")}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                  : "bg-card border border-border text-secondaryText hover:text-mainText hover:border-accent/40"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-accent" />
              <span>Launch Beta Wave</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
