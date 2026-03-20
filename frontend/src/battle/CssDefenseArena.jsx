import React, { useState, useEffect } from "react";

const GAME_URL = "/css-defense/index.html";

export default function CssDefenseArena({ moduleTitle = "CSS Defense Protocol", onVictory, onExit }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [victoryPayload, setVictoryPayload] = useState(null);

  useEffect(() => {
    if (iframeLoaded) return;
    const timeout = setTimeout(() => {
      if (!iframeLoaded) {
        setIframeError(true);
      }
    }, 6000);
    return () => clearTimeout(timeout);
  }, [iframeLoaded]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "FLEXBOX_DEFENSE_WIN") {
        setVictoryPayload(event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClaimVictory = () => {
    if (!victoryPayload) return;
    onVictory?.(victoryPayload);
  };

  const victoryReceipt = victoryPayload
    ? new Date(victoryPayload.timestamp).toLocaleTimeString()
    : null;

  const connectionStatus = iframeError
    ? "Signal lost — open in new tab."
    : iframeLoaded
    ? "Defense grid online."
    : "Linking to simulation...";

  const signalStatus = victoryPayload
    ? `Victory packet received • Score ${victoryPayload.score}`
    : "Awaiting signed victory packet.";

  return (
    <div className="relative min-h-screen bg-[#040714] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 w-[70rem] h-[70rem] -translate-x-1/2 bg-[radial-gradient(circle,_rgba(59,130,246,0.25),_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-10">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.6em] text-cyan-200">CSS Fortress Protocol</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-[0_15px_40px_rgba(14,165,233,0.35)]">
            {moduleTitle || "CSS Module"} — Defense Trial
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-3xl mx-auto">
            Hold the line in the tower-defense simulation. Build turrets, reroute invading bugs, and keep the style system secure.
            Once you clear the final wave, the embedded telemetry feed will unlock your certificate automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] gap-8">
          <div className="rounded-[32px] border border-cyan-400/30 bg-white/5 backdrop-blur-xl shadow-[0_35px_120px_rgba(14,165,233,0.4)] p-4">
            <div className="rounded-[28px] bg-black/70 border border-white/10 overflow-hidden relative">
              {!iframeLoaded && !iframeError && (
                <div className="flex flex-col items-center justify-center h-[560px] text-slate-300 text-sm">
                  <div className="h-12 w-12 border-4 border-cyan-200 border-t-transparent rounded-full animate-spin mb-4" />
                  Initializing defense grid...
                </div>
              )}
              {iframeError && (
                <div className="flex flex-col items-center justify-center h-[560px] text-center text-slate-200 px-8">
                  <p className="text-lg font-semibold mb-3">Training grid unavailable here.</p>
                  <p className="text-sm text-slate-400 mb-5">
                    Launch the self-hosted Flexbox Defense build in a new tab, complete the waves, then return to finalize your victory.
                  </p>
                  <a
                    className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold"
                    href={GAME_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Defense Grid ↗
                  </a>
                </div>
              )}
              <iframe
                title="CSS Defense"
                src={GAME_URL}
                loading="lazy"
                className={`w-full min-h-[720px] lg:min-h-[860px] ${iframeLoaded ? "block" : "hidden"}`}
                allow="fullscreen"
                onLoad={() => {
                  setIframeLoaded(true);
                  setIframeError(false);
                }}
              />
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              Game courtesy of the open-source Flexbox Defense project by Channing Allen.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Mission Brief</p>
              <h2 className="text-2xl font-bold text-white mt-2">How to Secure the CSS Realm</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-300 text-lg">1.</span>
                  Build towers strategically to intercept incoming bugs.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-300 text-lg">2.</span>
                  Upgrade when you can to prevent style regressions.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-300 text-lg">3.</span>
                  Survive the complete set of waves to prove mastery.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-cyan-400/30 bg-black/30 p-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.5em] text-cyan-200">Victory Telemetry</p>
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70">Grid Link</p>
                <p className="text-sm text-slate-100">{connectionStatus}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70">Final Wave Signal</p>
                <p className="text-sm text-slate-100">{signalStatus}</p>
              </div>
              {victoryReceipt && (
                <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
                  Logged at {victoryReceipt}
                </p>
              )}
            </div>

            <button
              onClick={handleClaimVictory}
              disabled={!victoryPayload}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 py-3 text-lg font-black uppercase tracking-[0.3em] shadow-[0_25px_80px_rgba(14,165,233,0.45)] disabled:opacity-40"
            >
              {victoryPayload ? "Claim CSS Victory" : "Clear All Waves"}
            </button>
            <p className="text-xs text-center text-slate-400">
              {victoryPayload
                ? "Signal verified — finalize to claim your certificate."
                : "Button unlocks when we detect a signed victory packet from the embedded game."}
            </p>

            <button
              onClick={onExit}
              className="w-full rounded-2xl border border-white/20 bg-transparent py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              ← Back to Module Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
