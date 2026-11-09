"use client";

import React, { useState, useMemo } from "react";
import { EventRecord, EventStatus } from "@/lib/contract";
import { EventCard } from "./EventCard";
import { Search, RotateCw, Compass, Terminal, PlusCircle } from "lucide-react";

interface EventExplorerProps {
  events: EventRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onHostClick: () => void;
}

export function EventExplorer({
  events,
  isLoading,
  onRefresh,
  onHostClick,
}: EventExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "upcoming" | "available" | "past">("all");
  const [sortBy, setSortBy] = useState<"newest" | "date" | "popular">("newest");

  const filteredEvents = useMemo(() => {
    const now = BigInt(Math.floor(Date.now() / 1000));

    let list = events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterTab === "upcoming") {
        return evt.eventDate > now && evt.status === EventStatus.Active;
      }
      if (filterTab === "available") {
        return (
          evt.eventDate > now &&
          evt.status === EventStatus.Active &&
          evt.totalAttendees < evt.maxAttendees
        );
      }
      if (filterTab === "past") {
        return evt.eventDate <= now;
      }

      return true;
    });

    if (sortBy === "date") {
      list.sort((a, b) => Number(a.eventDate - b.eventDate));
    } else if (sortBy === "popular") {
      list.sort((a, b) => Number(b.totalAttendees - a.totalAttendees));
    } else {
      list.sort((a, b) => Number(b.id - a.id));
    }

    return list;
  }, [events, searchQuery, filterTab, sortBy]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Public Alpha Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mainText tracking-tight">
              Active Alpha & Beta Waves
            </h2>
            <p className="text-xs sm:text-sm text-secondaryText mt-0.5">
              Discover closed testnet rounds and claim verifiable whitelist passes directly to your wallet.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <span className="text-xs font-mono font-bold text-accent bg-card px-3 py-2 rounded-xl border border-border">
              {filteredEvents.length} {filteredEvents.length === 1 ? "Wave" : "Waves"} Active
            </span>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh on-chain records"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:border-accent text-secondaryText hover:text-mainText text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-accent" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-card/50 p-2 rounded-2xl border border-border/80">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-secondaryText absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocol, dApp endpoint, or wave..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-mainText placeholder:text-secondaryText/60 focus:outline-none focus:border-accent transition-colors font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Waves" },
              { id: "upcoming", label: "Active" },
              { id: "available", label: "Open Quota" },
              { id: "past", label: "Concluded" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterTab === tab.id
                    ? "bg-gradient-to-r from-accent to-secondaryAccent text-white shadow-glow"
                    : "bg-background text-secondaryText border border-border hover:text-mainText"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-background border border-border text-secondaryText text-xs font-bold focus:outline-none focus:border-accent [color-scheme:dark]"
            >
              <option value="newest">Newest Drops</option>
              <option value="date">Closing Soon</option>
              <option value="popular">Most Claimed</option>
            </select>
          </div>
        </div>

        {/* Content Feed */}
        {isLoading && events.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-card/40 border border-border border-dashed">
            <RotateCw className="w-8 h-8 text-accent animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-mainText">Indexing Alpha Waves from Botchain Testnet...</p>
            <p className="text-xs text-secondaryText mt-1">Reading campaigns from verified smart contract at Chain 968.</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 px-6 text-center rounded-3xl bg-card/30 border border-border border-dashed max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4 text-accent">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-mainText">No Alpha Waves Found</h3>
            <p className="text-xs text-secondaryText mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No campaign matches your query "${searchQuery}".`
                : "No testing waves are open under this filter. Launch your protocol's round!"}
            </p>
            <button
              onClick={onHostClick}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-secondaryAccent text-white text-xs font-bold shadow-glow hover:opacity-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch First Alpha Wave</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id.toString()} event={evt} onActionComplete={onRefresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
