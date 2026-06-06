import React, { useState, useEffect } from "react";
import { Play, Sparkles, X, Heart, ShieldAlert, Coins } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdBarProps {
  onAwardCash: (amount: number) => void;
  onActivateBoost: (seconds: number) => void;
  adsDisabled: boolean;
  onDisableAds: () => void;
  balance: number;
}

const FUNNY_ADS = [
  {
    title: "Corporate Gold Eau de Parfum",
    description: "Büyük kararlar, büyük parfümler gerektirir. Başarı Kokusu!",
    sponsor: "Imperial Luxe Parfüm",
    duration: 5,
    rewardType: "cash",
    rewardAmount: 1500,
    accent: "#C1A063",
  },
  {
    title: "CryptoMiner Ultra-Profit v4",
    description: "Ayda %600 kazanç vaat eden saadet zincirimize hemen katılın!",
    sponsor: "PonziFinans A.Ş.",
    duration: 6,
    rewardType: "boost",
    rewardAmount: 30, // seconds
    accent: "#00C8FF",
  },
  {
    title: "Özel Jet Kiralamada %20 İndirim",
    description: "Havalimanlarında sıra beklemeyin. Doğrudan CEO hangarından!",
    sponsor: "SkyLux Executive",
    duration: 5,
    rewardType: "boost",
    rewardAmount: 60, // seconds
    accent: "#A78BFA",
  },
  {
    title: "Zengin Olmanın Sırları Kitabı",
    description: "Her sabah 04:00'te uyanarak kendinizi nasıl yıpratırsınız? Şimdi Al!",
    sponsor: "CEO Akademi Yayınları",
    duration: 4,
    rewardType: "cash",
    rewardAmount: 43.61, // custom boost amount from Screen A
    accent: "#10B981",
  },
];

export function AdBar({
  onAwardCash,
  onActivateBoost,
  adsDisabled,
  onDisableAds,
  balance,
}: AdBarProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [watchMessage, setWatchMessage] = useState("");

  const disableCost = 50000; // $50,000 cash in-game to disable ads

  // Rotate ads every 15 seconds
  useEffect(() => {
    if (adsDisabled) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % FUNNY_ADS.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [adsDisabled]);

  const activeAd = FUNNY_ADS[currentAdIndex];

  // Handle the countdown timer and reward triggers cleanly using useEffect to avoid state update during rendering
  useEffect(() => {
    if (!isWatching) return;
    if (adTimer <= 0) {
      handleAdReward();
      return;
    }

    const interval = setInterval(() => {
      setAdTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWatching, adTimer]);

  const handleWatchAd = () => {
    setIsWatching(true);
    setAdTimer(activeAd.duration);
    setWatchMessage("Reklam oynatılıyor...");
  };

  const handleAdReward = () => {
    if (activeAd.rewardType === "cash") {
      onAwardCash(activeAd.rewardAmount);
      setWatchMessage(`Tebrikler! Hesabınıza $${activeAd.rewardAmount.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} yatırıldı.`);
    } else {
      onActivateBoost(activeAd.rewardAmount);
      setWatchMessage(`Tebrikler! ${activeAd.rewardAmount} Saniye Boyunca 2X Kazanç Boostu Etkinleştirildi.`);
    }
    setTimeout(() => {
      setIsWatching(false);
    }, 2500);
  };

  const buyAdFree = () => {
    if (balance >= disableCost) {
      onDisableAds();
    }
  };

  if (adsDisabled) return null;

  return (
    <>
      {/* Sticky Ad Slot just above Bottom Bar */}
      <div className="w-full bg-slate-50 border-t border-slate-250 px-4 py-2.5 flex flex-col md:flex-row items-center justify-between text-xs gap-2 select-none shadow-xs">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold tracking-wider">
            SPONSORLU
          </span>
          <p className="text-slate-700 font-medium text-[11.5px] text-left">
            <span style={{ color: activeAd.accent }} className="font-bold">
              [{activeAd.sponsor}]
            </span>{" "}
            {activeAd.title} -{" "}
            <span className="text-slate-500 font-normal">{activeAd.description}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleWatchAd}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded transition-colors cursor-pointer text-[10px] shadow-xs"
          >
            <Play size={10} fill="white" className="stroke-white" />
            İzle & Kazan ({activeAd.rewardType === "cash" ? `$${activeAd.rewardAmount.toLocaleString("tr-TR")}` : "2X Boost"})
          </button>

          <button
            onClick={buyAdFree}
            disabled={balance < disableCost}
            className={`text-[10px] px-2 py-1 rounded font-mono border transition-all ${
              balance >= disableCost
                ? "border-red-600 text-red-600 hover:bg-red-50 cursor-pointer font-bold"
                : "border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed"
            }`}
            title="Sonsuza dek reklamları kaldırmak için satın al."
          >
            REKLAMSIZ OYNA (${disableCost.toLocaleString("tr-TR")})
          </button>
        </div>
      </div>

      {/* Animated Advertising Player Modal */}
      <AnimatePresence>
        {isWatching && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 max-w-md w-full rounded-xl overflow-hidden shadow-2xl relative"
            >
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="text-blue-600" size={18} />
                  <span className="font-display font-bold text-slate-700 uppercase tracking-widest text-[10px]">
                    CEO TV REKLAM SİMÜLATÖRÜ
                  </span>
                </div>
                {adTimer === 0 ? (
                  <button
                    onClick={() => setIsWatching(false)}
                    className="p-1 rounded bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                    Kalan Süre: {adTimer} sn
                  </span>
                )}
              </div>

              <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-blue-50 text-blue-600"
                >
                  {activeAd.rewardType === "cash" ? (
                    <Coins size={32} />
                  ) : (
                    <Sparkles size={32} />
                  )}
                </div>

                <p className="text-[10px] text-blue-600 tracking-widest uppercase font-mono font-bold">
                  {activeAd.sponsor} Sunar
                </p>
                <h3 className="text-xl font-bold font-display text-slate-900 tracking-tight">{activeAd.title}</h3>
                <p className="text-sm text-slate-600 px-4 leading-relaxed">{activeAd.description}</p>

                {/* Progress Visualizer */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: activeAd.duration, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                  />
                </div>

                <p className="text-xs text-emerald-600 font-bold mt-2">
                  {watchMessage}
                </p>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <Heart size={10} className="text-red-500" /> Tamamlandığında ödülünüz otomatik
                bakiye hesabınıza aktarılacaktır.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
