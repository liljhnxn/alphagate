"use client";

import React, { useState } from "react";
import { EventRecord, EventStatus, GATHERLY_ABI, GATHERLY_CONTRACT_ADDRESS } from "@/lib/contract";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { botchainTestnet } from "@/lib/wagmi";
import { Calendar, Globe, Users, User, Shield, AlertCircle, CheckCircle2, Lock, XCircle, Loader2, ExternalLink, Zap, KeyRound } from "lucide-react";

interface EventCardProps {
  event: EventRecord;
  onActionComplete: () => void;
}

export function EventCard({ event, onActionComplete }: EventCardProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [actionType, setActionType] = useState<"rsvp" | "cancel" | "close" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  // Check if current connected user has claimed an alpha slot
  const { data: hasRSVPd, refetch: refetchRSVP } = useReadContract({
    address: GATHERLY_CONTRACT_ADDRESS,
    abi: GATHERLY_ABI,
    functionName: "hasUserRSVPd",
    args: [event.id, (address || "0x0000000000000000000000000000000000000000") as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const {
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isActionLoading = isWritePending || isConfirming;

  React.useEffect(() => {
    if (isConfirmed) {
      refetchRSVP();
      onActionComplete();
      setActionType(null);
    }
  }, [isConfirmed, onActionComplete, refetchRSVP]);

  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const isPast = event.eventDate <= nowSeconds;
  const isClosed = event.status === EventStatus.Closed;
  const isFull = event.totalAttendees >= event.maxAttendees;
  const isCreator = address && event.creator.toLowerCase() === address.toLowerCase();

  // Date formatting
  const dateObj = new Date(Number(event.eventDate) * 1000);
  const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });
  const dayNumber = dateObj.toLocaleDateString("en-US", { day: "numeric" });
  const timeString = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const fullDateString = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleClaimSlot = () => {
    if (!isConnected) {
      setActionError("Please connect your wallet first.");
      return;
    }
    if (isWrongNetwork) {
      setActionError("Switch to Botchain Testnet (Chain ID 968) to claim.");
      return;
    }
    setActionError(null);
    setActionType("rsvp");
    try {
      writeContract({
        address: GATHERLY_CONTRACT_ADDRESS,
        abi: GATHERLY_ABI,
        functionName: "rsvp",
        args: [event.id],
      });
    } catch (err: any) {
      setActionError(err?.message || "Slot claim failed");
    }
  };

  const handleSurrenderSlot = () => {
    if (!isConnected) return;
    if (isWrongNetwork) {
      setActionError("Switch to Botchain Testnet to surrender slot.");
      return;
    }
    setActionError(null);
    setActionType("cancel");
    try {
      writeContract({
        address: GATHERLY_CONTRACT_ADDRESS,
        abi: GATHERLY_ABI,
        functionName: "cancelRSVP",
        args: [event.id],
      });
    } catch (err: any) {
      setActionError(err?.message || "Slot release failed");
    }
  };

  const handleCloseWave = () => {
    if (!isConnected || !isCreator) return;
    if (isWrongNetwork) {
      setActionError("Switch to Botchain Testnet to close campaign.");
      return;
    }
    if (!window.confirm("Are you sure you want to close this testing wave? No more slots will be claimed.")) {
      return;
    }
    setActionError(null);
    setActionType("close");
    try {
      writeContract({
        address: GATHERLY_CONTRACT_ADDRESS,
        abi: GATHERLY_ABI,
        functionName: "closeEvent",
        args: [event.id],
      });
    } catch (err: any) {
      setActionError(err?.message || "Closing wave failed");
    }
  };

  const quotaPercent =
    Number(event.maxAttendees) > 0
      ? Math.min(100, Math.round((Number(event.totalAttendees) / Number(event.maxAttendees)) * 100))
      : 0;

  return (
    <div className="relative flex flex-col justify-between rounded-3xl bg-card border border-border/80 p-5 sm:p-6 hover:border-accent/60 transition-all duration-300 shadow-xl group hover:shadow-glow/15 overflow-hidden">
      {/* Top Header Badge Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Wave Badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent/25 via-purple-800/30 to-secondaryAccent/25 border border-accent/40 flex flex-col items-center justify-center text-center p-1 shrink-0 shadow-sm">
              <span className="text-[10px] font-black uppercase text-accent tracking-wider leading-none">
                EXPIRY
              </span>
              <span className="text-sm font-black text-mainText leading-none mt-1">
                {monthName} {dayNumber}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold text-accent px-2 py-0.5 rounded-md bg-accent/15 border border-accent/25">
                  WAVE #{event.id.toString()}
                </span>
              </div>
              <span className="text-xs text-secondaryText mt-0.5 block font-medium">
                Closes {timeString} • {fullDateString}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-1">
            {isClosed ? (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Round Closed</span>
              </span>
            ) : isPast ? (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                Wave Concluded
              </span>
            ) : isFull ? (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Quota Filled
              </span>
            ) : (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open Quota</span>
              </span>
            )}

            {hasRSVPd && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-accent/20 text-accent border border-accent/40 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                <span>Whitelist Pass Active</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-extrabold text-mainText tracking-tight group-hover:text-accent-light transition-colors line-clamp-1 mb-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-secondaryText leading-relaxed line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Environment / Repo Location */}
        <div className="flex items-center gap-2 text-xs text-secondaryText mb-2">
          <Globe className="w-4 h-4 text-secondaryAccent shrink-0" />
          <span className="truncate font-mono font-medium">{event.location}</span>
        </div>

        {/* Protocol Creator */}
        <div className="flex items-center gap-2 text-xs text-secondaryText mb-4">
          <User className="w-4 h-4 text-accent shrink-0" />
          <span className="text-secondaryText/80">Deployer:</span>
          <a
            href={`https://scan.bohr.life/address/${event.creator}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-accent hover:underline flex items-center gap-1"
          >
            <span>{truncateAddress(event.creator)}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          {isCreator && (
            <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.2 rounded font-bold">
              Your Campaign
            </span>
          )}
        </div>
      </div>

      {/* Ticket Perforated Divider */}
      <div className="relative py-3">
        <div className="border-t border-dashed border-border/80 w-full" />
        <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-r border-border/80" />
        <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-l border-border/80" />
      </div>

      {/* Bottom Action Section */}
      <div>
        {/* Quota Progress Bar */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-secondaryText flex items-center gap-1 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-accent" />
              <span>Tester Allocation</span>
            </span>
            <span className="font-mono font-bold text-mainText">
              {event.totalAttendees.toString()} / {event.maxAttendees.toString()} Claimed
            </span>
          </div>

          <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? "bg-amber-400"
                  : "bg-gradient-to-r from-accent via-purple-400 to-secondaryAccent"
              }`}
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>

        {/* Action Error Banner */}
        {(actionError || writeError) && (
          <div className="mb-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{actionError || writeError?.message}</span>
          </div>
        )}

        {/* Transaction Success */}
        {isConfirmed && (
          <div className="mb-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Slot Confirmed On-Chain!</span>
            </span>
            {txHash && (
              <a
                href={`https://scan.bohr.life/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline text-[10px] font-mono ml-2"
              >
                View Explorer
              </a>
            )}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex flex-col gap-2">
          {hasRSVPd ? (
            <button
              onClick={handleSurrenderSlot}
              disabled={isActionLoading || isPast}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-card border border-rose-500/40 text-rose-300 hover:bg-rose-500/15 active:scale-98 disabled:opacity-50 text-xs font-bold transition-all"
            >
              {isActionLoading && actionType === "cancel" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Surrendering Slot...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Surrender Whitelist Slot</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleClaimSlot}
              disabled={isActionLoading || isClosed || isPast || isFull}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-accent via-purple-600 to-secondaryAccent text-white shadow-glow hover:opacity-95 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all"
            >
              {isActionLoading && actionType === "rsvp" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Securing Slot on Botchain...</span>
                </>
              ) : isClosed ? (
                <span>Round Closed</span>
              ) : isPast ? (
                <span>Wave Expired</span>
              ) : isFull ? (
                <span>Quota Filled</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Claim Alpha Whitelist Slot</span>
                </>
              )}
            </button>
          )}

          {/* Close Campaign (Creator Only) */}
          {isCreator && !isClosed && (
            <button
              onClick={handleCloseWave}
              disabled={isActionLoading}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-background/80 border border-border text-secondaryText hover:text-rose-400 hover:border-rose-500/30 text-[11px] font-medium transition-colors"
            >
              {isActionLoading && actionType === "close" ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Closing Campaign...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Close Campaign (Admin)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
