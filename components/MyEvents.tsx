"use client";

import React, { useState, useMemo } from "react";
import { EventRecord } from "@/lib/contract";
import { EventCard } from "./EventCard";
import { useAccount, useReadContract } from "wagmi";
import { ShieldCheck, Wallet, Terminal, PlusCircle, Compass } from "lucide-react";
import { GATHERLY_ABI, GATHERLY_CONTRACT_ADDRESS } from "@/lib/contract";

interface MyEventsProps {
  events: EventRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onHostClick: () => void;
  onExploreClick: () => void;
}

export function MyEvents({
  events,
  isLoading,
  onRefresh,
  onHostClick,
  onExploreClick,
}: MyEventsProps) {
  const { address, isConnected } = useAccount();
  const [subTab, setSubTab] = useState<"created" | "attending">("created");

  // Fetch campaign IDs claimed by connected user directly from smart contract
  const { data: rsvpdIdsRaw } = useReadContract({
    address: GATHERLY_CONTRACT_ADDRESS,
    abi: GATHERLY_ABI,
    functionName: "getEventsRSVPdByUser",
    args: [(address || "0x0000000000000000000000000000000000000000") as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const rsvpdIdSet = useMemo(() => {
    const set = new Set<string>();
    if (rsvpdIdsRaw && Array.isArray(rsvpdIdsRaw)) {
      rsvpdIdsRaw.forEach((id: bigint) => set.add(id.toString()));
    }
    return set;
  }, [rsvpdIdsRaw]);

  // Campaigns created by connected wallet
  const createdEvents = useMemo(() => {
    if (!address) return [];
    return events.filter(
      (evt) => evt.creator.toLowerCase() === address.toLowerCase()
    );
  }, [events, address]);

  // Campaigns user claimed a pass for
  const attendingEvents = useMemo(() => {
    if (!address) return [];
    return events.filter((evt) => rsvpdIdSet.has(evt.id.toString()));
  }, [events, address, rsvpdIdSet]);

  const displayedEvents = subTab === "created" ? createdEvents : attendingEvents;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondaryAccent/15 text-secondaryAccent border border-secondaryAccent/30 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Personal Pass Vault</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mainText tracking-tight">
              My Alpha Passes & Vault
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText mt-0.5">
              Manage your claimed testing whitelist slots or administrate campaigns you launched.
            </p>
          </div>

          {/* Sub-tabs */}
          {isConnected && (
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-card border border-border">
              <button
                onClick={() => setSubTab("created")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  subTab === "created"
                    ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                    : "text-secondaryText hover:text-mainText"
                }`}
              >
                Launched by You ({createdEvents.length})
              </button>
              <button
                onClick={() => setSubTab("attending")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  subTab === "attending"
                    ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                    : "text-secondaryText hover:text-mainText"
                }`}
              >
                Claimed Passes ({attendingEvents.length})
              </button>
            </div>
          )}
        </div>

        {/* Not connected state */}
        {!isConnected ? (
          <div className="py-20 px-6 text-center rounded-3xl bg-card/40 border border-border/80 border-dashed max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4 text-accent">
              <Wallet className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-mainText">Connect Your Web3 Wallet</h3>
            <p className="text-xs text-secondaryText mt-1.5 max-w-sm mx-auto">
              Connect MetaMask to view your active whitelist slots, access testing endpoints, and manage deployed campaigns.
            </p>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="py-20 px-6 text-center rounded-3xl bg-card/30 border border-border/80 border-dashed max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4 text-secondaryAccent">
              <Terminal className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-mainText">
              {subTab === "created"
                ? "No Alpha Campaigns Launched Yet"
                : "No Whitelist Slots Claimed"}
            </h3>
            <p className="text-xs text-secondaryText mt-1.5 max-w-sm mx-auto">
              {subTab === "created"
                ? "Deploy your protocol's first testing round with a fixed on-chain tester quota."
                : "Explore active alpha waves on Botchain and secure your testing pass!"}
            </p>
            {subTab === "created" ? (
              <button
                onClick={onHostClick}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-accent to-secondaryAccent text-white text-xs font-bold shadow-glow hover:opacity-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Launch an Alpha Wave</span>
              </button>
            ) : (
              <button
                onClick={onExploreClick}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border hover:border-accent text-mainText text-xs font-bold transition-all"
              >
                <Compass className="w-4 h-4 text-accent" />
                <span>Explore Open Waves</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((evt) => (
              <EventCard
                key={evt.id.toString()}
                event={evt}
                onActionComplete={onRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
