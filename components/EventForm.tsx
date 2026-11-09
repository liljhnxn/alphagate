"use client";

import React, { useState } from "react";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { botchainTestnet } from "@/lib/wagmi";
import { GATHERLY_ABI, GATHERLY_CONTRACT_ADDRESS } from "@/lib/contract";
import { Calendar, Globe, Users, Type, AlignLeft, Sparkles, Loader2, CheckCircle2, AlertCircle, ExternalLink, Zap, Eye, Terminal } from "lucide-react";

interface EventFormProps {
  onSuccess: () => void;
  onViewEvents: () => void;
}

export function EventForm({ onSuccess, onViewEvents }: EventFormProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("100");

  const [formError, setFormError] = useState<string | null>(null);

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

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;
  const isSubmitting = isWritePending || isConfirming;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isConnected) {
      setFormError("Please connect your MetaMask wallet before launching an alpha wave.");
      return;
    }

    if (isWrongNetwork) {
      setFormError("Please switch your network to Botchain Testnet (Chain ID 968).");
      return;
    }

    if (!title.trim()) {
      setFormError("Campaign title cannot be empty.");
      return;
    }

    if (!description.trim()) {
      setFormError("Campaign description cannot be empty.");
      return;
    }

    if (!location.trim()) {
      setFormError("Target dApp URL, Repo, or Testnet endpoint cannot be empty.");
      return;
    }

    if (!dateTime) {
      setFormError("Please specify a future close date and time for this round.");
      return;
    }

    const selectedTimestamp = Math.floor(new Date(dateTime).getTime() / 1000);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (selectedTimestamp <= currentTimestamp) {
      setFormError("Campaign close date must be in the future.");
      return;
    }

    const max = parseInt(maxAttendees, 10);
    if (isNaN(max) || max <= 0) {
      setFormError("Tester quota allocation must be greater than zero.");
      return;
    }

    try {
      writeContract({
        address: GATHERLY_CONTRACT_ADDRESS,
        abi: GATHERLY_ABI,
        functionName: "createEvent",
        args: [
          title.trim(),
          description.trim(),
          location.trim(),
          BigInt(selectedTimestamp),
          BigInt(max),
        ],
      });
    } catch (err: any) {
      setFormError(err?.message || "Failed to submit transaction.");
    }
  };

  React.useEffect(() => {
    if (isConfirmed) {
      setTitle("");
      setDescription("");
      setLocation("");
      setDateTime("");
      setMaxAttendees("100");
      setFormError(null);
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  // Quick Date Helpers
  const setQuickDate = (hoursFromNow: number) => {
    const targetDate = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateFormatted = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}-${pad(
      targetDate.getDate()
    )}T${pad(targetDate.getHours())}:${pad(targetDate.getMinutes())}`;
    setDateTime(dateFormatted);
  };

  const previewDate = dateTime ? new Date(dateTime) : new Date(Date.now() + 86400000);
  const previewMonth = previewDate.toLocaleDateString("en-US", { month: "short" });
  const previewDay = previewDate.toLocaleDateString("en-US", { day: "numeric" });
  const previewTime = previewDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 text-xs font-bold mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Launchpad Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mainText tracking-tight">
            Launch Alpha Testing Campaign
          </h2>
          <p className="text-xs sm:text-sm text-secondaryText mt-1">
            Publish a capped on-chain testing round. Community members secure slots with their wallets without bots or fake signups.
          </p>
        </div>

        {/* Success Banner */}
        {isConfirmed && (
          <div className="mb-8 p-5 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300 shadow-xl">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-mainText">Alpha Wave Successfully Deployed!</h4>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Your testing campaign is live on Botchain Testnet and accepting whitelist reservations.
                </p>
                {txHash && (
                  <a
                    href={`https://scan.bohr.life/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1.5 font-mono"
                  >
                    <span>Tx Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onViewEvents}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-glow hover:opacity-95"
              >
                View Active Waves
              </button>
              <button
                onClick={() => resetWrite()}
                className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-secondaryText hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {(formError || writeError) && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-sm">Deployment Failed</h4>
              <p className="mt-0.5">{formError || writeError?.message}</p>
            </div>
          </div>
        )}

        {/* 2-Column Creator Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 7 Columns */}
          <div className="lg:col-span-7 rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-2xl relative">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campaign Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2">
                  Campaign / Protocol Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText">
                    <Type className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Botchain Perpetual DEX Closed Alpha Wave 1"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-mainText placeholder:text-secondaryText/50 focus:outline-none focus:border-accent transition-colors text-sm font-medium"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2">
                  Testing Objectives & Details *
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 text-secondaryText pointer-events-none">
                    <AlignLeft className="w-4 h-4" />
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Specify testing criteria, bug bounties, feedback channels, or eligible requirements..."
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-mainText placeholder:text-secondaryText/50 focus:outline-none focus:border-accent transition-colors text-sm font-medium resize-y"
                  />
                </div>
              </div>

              {/* dApp URL / Repo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2">
                  Target dApp URL, Testnet Endpoint, or Repo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., https://alpha.dex.botchain or github.com/protocol/core"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-mainText placeholder:text-secondaryText/50 focus:outline-none focus:border-accent transition-colors text-sm font-mono font-medium"
                  />
                </div>
              </div>

              {/* Close Date with Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondaryText">
                    Round Close Date & Time *
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-secondaryText">Quick:</span>
                    <button
                      type="button"
                      onClick={() => setQuickDate(48)}
                      className="px-2 py-0.5 rounded bg-background border border-border text-accent hover:border-accent text-[10px] font-bold"
                    >
                      48 Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(168)}
                      className="px-2 py-0.5 rounded bg-background border border-border text-accent hover:border-accent text-[10px] font-bold"
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickDate(336)}
                      className="px-2 py-0.5 rounded bg-background border border-border text-accent hover:border-accent text-[10px] font-bold"
                    >
                      14 Days
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-mainText focus:outline-none focus:border-accent transition-colors text-sm font-medium [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Max Allocation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondaryText mb-2">
                  Maximum Tester Quota (Cap) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText">
                    <Users className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(e.target.value)}
                    placeholder="e.g., 100"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-mainText font-mono focus:outline-none focus:border-accent transition-colors text-sm font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-accent via-purple-600 to-secondaryAccent text-white font-black text-sm sm:text-base shadow-glow hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>
                        {isWritePending ? "Signing Deployment..." : "Broadcasting to Botchain..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Broadcast Alpha Wave to Botchain</span>
                    </>
                  )}
                </button>

                {!isConnected && (
                  <p className="text-center text-xs text-secondaryText mt-2 font-medium">
                    MetaMask wallet connection required to write to the blockchain.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: 5 Columns Live Pass Preview */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-secondaryText flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-accent" />
                <span>Live Alpha Pass Preview</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Auto-Updating
              </span>
            </div>

            {/* Ticket Preview Card */}
            <div className="rounded-3xl bg-card border border-accent/40 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent/25 via-purple-800/30 to-secondaryAccent/25 border border-accent/40 flex flex-col items-center justify-center text-center p-1 shrink-0">
                    <span className="text-[10px] font-black uppercase text-accent tracking-wider leading-none">
                      EXPIRY
                    </span>
                    <span className="text-sm font-black text-mainText leading-none mt-1">
                      {previewMonth} {previewDay}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-accent px-2 py-0.5 rounded-md bg-accent/15 border border-accent/25">
                      WAVE #PREVIEW
                    </span>
                    <span className="text-xs text-secondaryText mt-0.5 block font-medium">
                      Closes {previewTime}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Open Quota</span>
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-mainText tracking-tight mb-2">
                {title.trim() || "Protocol Name / Alpha Wave 1"}
              </h3>

              <p className="text-xs text-secondaryText leading-relaxed line-clamp-3 mb-4">
                {description.trim() || "Your testing objectives, guidelines, and feedback details will be recorded immutable on Botchain Testnet."}
              </p>

              <div className="flex items-center gap-2 text-xs text-secondaryText mb-2">
                <Globe className="w-4 h-4 text-secondaryAccent shrink-0" />
                <span className="font-mono font-medium truncate">{location.trim() || "https://protocol.xyz/testnet"}</span>
              </div>

              {/* Perforated Divider */}
              <div className="relative py-3 my-1">
                <div className="border-t border-dashed border-border/80 w-full" />
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-r border-border/80" />
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-l border-border/80" />
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-secondaryText flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span>Tester Allocation</span>
                </span>
                <span className="font-mono font-bold text-mainText">
                  0 / {maxAttendees || "100"} Claimed
                </span>
              </div>

              <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/60 mb-4">
                <div className="h-full bg-gradient-to-r from-accent to-secondaryAccent w-0" />
              </div>

              <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent/20 to-secondaryAccent/20 border border-accent/30 text-center text-xs font-bold text-accent">
                Sample Claim Pass Button (Ready for Community)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
