"use client";

import React, { useMemo } from "react";
import { EventRecord, EventStatus } from "@/lib/contract";
import { Radio, ShieldCheck, Users, Zap, Terminal } from "lucide-react";
import { useAccount } from "wagmi";

interface StatsProps {
  events: EventRecord[];
  isLoading: boolean;
}

export function Stats({ events, isLoading }: StatsProps) {
  const { address } = useAccount();

  const stats = useMemo(() => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const totalEvents = events.length;

    let upcomingCount = 0;
    let totalRSVPsCount = 0;
    let createdByMeCount = 0;

    events.forEach((evt) => {
      if (evt.status === EventStatus.Active && evt.eventDate > now) {
        upcomingCount++;
      }
      totalRSVPsCount += Number(evt.totalAttendees);

      if (address && evt.creator.toLowerCase() === address.toLowerCase()) {
        createdByMeCount++;
      }
    });

    return {
      totalEvents,
      upcomingCount,
      totalRSVPsCount,
      createdByMeCount,
    };
  }, [events, address]);

  const statItems = [
    {
      label: "Alpha Campaigns",
      value: isLoading ? "..." : stats.totalEvents.toString(),
      sub: "Broadcast on Botchain",
      icon: Terminal,
      color: "text-accent",
    },
    {
      label: "Open Testing Waves",
      value: isLoading ? "..." : stats.upcomingCount.toString(),
      sub: "Quota available to claim",
      icon: Zap,
      color: "text-emerald-400",
    },
    {
      label: "Whitelisted Testers",
      value: isLoading ? "..." : stats.totalRSVPsCount.toString(),
      sub: "Verified on-chain passes",
      icon: Users,
      color: "text-secondaryAccent",
    },
    {
      label: "Launched By You",
      value: !address ? "—" : isLoading ? "..." : stats.createdByMeCount.toString(),
      sub: address ? "Your active campaigns" : "Connect MetaMask",
      icon: ShieldCheck,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-card/70 border border-border p-3 sm:p-4 backdrop-blur-md shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
            {statItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3.5 px-3 ${
                    idx > 0 ? "pt-3 lg:pt-0" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-mainText font-mono tracking-tight leading-none">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-secondaryText uppercase tracking-wider mt-0.5">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
