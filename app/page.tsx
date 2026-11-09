"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { EventExplorer } from "@/components/EventExplorer";
import { EventForm } from "@/components/EventForm";
import { MyEvents } from "@/components/MyEvents";
import { Footer } from "@/components/Footer";
import { useReadContract, useAccount, useChainId, useSwitchChain } from "wagmi";
import { GATHERLY_ABI, GATHERLY_CONTRACT_ADDRESS, EventRecord } from "@/lib/contract";
import { botchainTestnet } from "@/lib/wagmi";
import { AlertTriangle, ArrowRightLeft } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"explore" | "my-events" | "create">("explore");
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  // Fetch all events directly from smart contract on Botchain Testnet
  const {
    data: rawEvents,
    isLoading,
    isRefetching,
    refetch,
  } = useReadContract({
    address: GATHERLY_CONTRACT_ADDRESS,
    abi: GATHERLY_ABI,
    functionName: "getAllEvents",
    query: {
      refetchInterval: 12000,
    },
  });

  const events: EventRecord[] = useMemo(() => {
    if (!rawEvents || !Array.isArray(rawEvents)) return [];
    return [...rawEvents].reverse(); // Newest first
  }, [rawEvents]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-mainText selection:bg-accent/30 selection:text-white">
      {/* Wrong Network Notification Banner */}
      {isWrongNetwork && (
        <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-3 shadow-lg">
          <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
          <span>
            You are connected to an unsupported network (Chain ID: {chainId}). AlphaGate operates exclusively on Botchain Testnet (Chain ID: 968).
          </span>
          <button
            onClick={() => switchChain({ chainId: botchainTestnet.id })}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 text-amber-300 hover:bg-slate-900 transition-colors text-xs font-semibold shrink-0"
          >
            <span>Switch to Botchain</span>
            <ArrowRightLeft className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Modern Console Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        totalEventsCount={events.length}
      />

      {/* Main Hub */}
      <main className="flex-1">
        {/* Dynamic Launchpad Hero */}
        <Hero
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Real Smart Contract Statistics HUD */}
        <Stats events={events} isLoading={isLoading || isRefetching} />

        {/* Dynamic Studio Views (Single-Page Experience) */}
        {activeTab === "explore" && (
          <EventExplorer
            events={events}
            isLoading={isLoading || isRefetching}
            onRefresh={handleRefresh}
            onHostClick={() => setActiveTab("create")}
          />
        )}

        {activeTab === "my-events" && (
          <MyEvents
            events={events}
            isLoading={isLoading || isRefetching}
            onRefresh={handleRefresh}
            onHostClick={() => setActiveTab("create")}
            onExploreClick={() => setActiveTab("explore")}
          />
        )}

        {activeTab === "create" && (
          <EventForm
            onSuccess={handleRefresh}
            onViewEvents={() => setActiveTab("explore")}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
