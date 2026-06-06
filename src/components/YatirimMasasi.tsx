import React, { useState } from "react";
import { CreditCard, TrendingUp, Sparkles, ChevronRight, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface YatiririmMasasiProps {
  balance: number;
  clickLevel: number;
  clickIncome: number;
  clickUpgradeCost: number;
  onTapClick: (e: React.MouseEvent<any>) => void;
  onUpgradeClick: () => void;
  onWatchBoostAd: () => void;
  adBoostTimeLeft: number;
  adBoostCooldownTimeLeft: number;
}

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  text: string;
}

export function YatirimMasasi({
  balance,
  clickLevel,
  clickIncome,
  clickUpgradeCost,
  onTapClick,
  onUpgradeClick,
  onWatchBoostAd,
  adBoostTimeLeft,
  adBoostCooldownTimeLeft,
}: YatiririmMasasiProps) {
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [particleId, setParticleId] = useState(0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("tr-TR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCooldown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}sa ${m}dk`;
    }
    if (m > 0) {
      return `${m}dk ${s}sn`;
    }
    return `${s}sn`;
  };

  const handleAreaClick = (e: React.MouseEvent<any>) => {
    // Parent click for state updates
    onTapClick(e);

    // Dynamic numeric floating particle
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const multiplier = adBoostTimeLeft > 0 ? 2 : 1;
    const addedText = `+$${(clickIncome * multiplier).toFixed(2)}`;

    const newParticle: ClickParticle = {
      id: particleId,
      x,
      y,
      text: addedText,
    };

    setParticles((prev) => [...prev, newParticle]);
    setParticleId((id) => id + 1);

    // Remove particle after 800ms
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 800);
  };

  // Upgraded values description
  const nextClickIncome = clickIncome + 1.25 + (clickLevel * 0.45);
  const canUpgrade = balance >= clickUpgradeCost;

  return (
    <div className="flex flex-col gap-6 select-none max-w-xl mx-auto">
      {/* Dynamic Header Titles */}
      <div className="flex flex-col">
        <span className="text-blue-600 font-mono text-[10px] uppercase tracking-widest font-semibold text-left">
          GİRİŞİMCİ ANALİZ VE HAREKETLER
        </span>
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight text-left">
          Yatırım Masası
        </h1>
      </div>

      {/* Screen A Display 1: Clear Modern Blue Business Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-tr from-blue-600 to-indigo-700 border border-blue-500 rounded-2xl p-6 overflow-hidden shadow-md group text-white"
      >
        {/* Globe Overlay Texture / Gradients */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors duration-1000" />
        <div className="absolute right-6 top-6 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center bg-white/5">
          <CreditCard className="text-white" size={20} />
        </div>

        <div className="flex flex-col h-32 justify-between">
          <div className="text-left">
            <p className="text-[9px] text-blue-200 uppercase tracking-widest font-mono font-medium">
              KULLANILABİLİR BAKİYE
            </p>
            <motion.h2 
              key={balance}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold font-mono text-white tracking-tight mt-1 flex items-baseline gap-1"
            >
              {formatCurrency(balance)}
            </motion.h2>
          </div>

          <div className="flex justify-between items-end border-t border-white/15 pt-4">
            <div className="text-left">
              <p className="text-[8px] text-blue-200 uppercase tracking-wider font-mono">
                Girişimci Seviyesi
              </p>
              <p className="text-xs text-white font-sans font-semibold">
                Seviye {clickLevel}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-blue-200 uppercase tracking-wider font-mono">
                Hesap Statüsü
              </p>
              <p className="text-[10px] text-emerald-300 font-mono font-medium">
                KORUMALI & AKTİF
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Screen A Display 2: Upgrade Action Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={16} className="text-blue-600" />
            <h3 className="font-display font-bold text-slate-800 text-sm">
              Tıklama Başına Gelir
            </h3>
          </div>
          <p className="font-mono text-xs text-slate-500 mt-1">
            Mevcut: <span className="text-slate-800 font-bold">{formatCurrency(clickIncome)}</span> → Sonraki Seviye:{" "}
            <span className="text-blue-600 font-bold">{formatCurrency(nextClickIncome)}</span>
          </p>
        </div>

        <button
          id="btn-click-upgrade"
          onClick={onUpgradeClick}
          disabled={!canUpgrade}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs border transition-all flex items-center justify-center gap-2 ${
            canUpgrade
              ? "border-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 cursor-pointer shadow-xs"
              : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
          }`}
        >
          <Sparkles size={14} />
          Seviyeyi Yükselt ({formatCurrency(clickUpgradeCost)})
        </button>
      </div>

      {/* Screen A Display 3: Clean Desk Click Area */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-left">
          Karar Masası Tıklama Alanı
        </label>
        <button
          id="click-desktop-area"
          onClick={handleAreaClick}
          className="relative w-full min-h-[190px] bg-white border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center text-center p-6 cursor-pointer overflow-hidden transition-all duration-300 shadow-xs group active:scale-[0.96] select-none outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {/* Subtle desk background color change */}
          <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,_var(--tw-gradient-stops)) from-slate-100/30 via-transparent to-transparent pointer-events-none" />

          {/* Simple Desk Icon */}
          <div className="relative z-10 w-16 h-16 bg-blue-50 text-blue-600 group-hover:text-white group-hover:bg-blue-600 rounded-full flex items-center justify-center border border-blue-100 transition-all duration-300 shadow-xs group-hover:scale-110">
            <Target size={28} />
          </div>

          <p className="relative z-10 font-display font-bold text-slate-700 text-sm mt-4 group-hover:text-slate-900 transition-colors">
            Yatırım fonu biriktirmek için bu alana tıkla.
          </p>
          <p className="relative z-10 font-mono text-[10px] text-slate-400 group-hover:text-slate-500 mt-1 transition-colors">
            {adBoostTimeLeft > 0 ? "⚡ 2X KATLAYICI BOOST AKTİF" : "Her tıklamada bakiye akışı sağlar"}
          </p>

          {/* Floating dynamic points visual animation */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, y: p.y - 10, scale: 0.8 }}
                animate={{ opacity: 0, y: p.y - 70, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute font-mono font-black text-lg text-emerald-600 drop-shadow-xs pointer-events-none z-30"
                style={{ left: p.x, top: p.y }}
              >
                {p.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </button>
      </div>

      {/* Screen A Display 4: Ad boost activation area */}
      <motion.div
        whileHover={adBoostCooldownTimeLeft > 0 || adBoostTimeLeft > 0 ? {} : { scale: 1.01 }}
        onClick={() => {
          if (adBoostCooldownTimeLeft > 0 || adBoostTimeLeft > 0) return;
          onWatchBoostAd();
        }}
        className={`border rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm transition-all ${
          adBoostTimeLeft > 0
            ? "border-emerald-300 bg-emerald-50/20"
            : adBoostCooldownTimeLeft > 0
            ? "border-slate-200 bg-slate-50/50 cursor-not-allowed opacity-85"
            : "bg-white border-slate-200 hover:border-emerald-300 cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
            adBoostTimeLeft > 0
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : adBoostCooldownTimeLeft > 0
              ? "bg-slate-100 text-slate-400 border-slate-200"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}>
            <Zap size={18} className={adBoostTimeLeft > 0 ? "animate-bounce" : ""} />
          </div>
          <div className="text-left">
            <h4 className={`font-sans font-bold text-xs text-left ${adBoostCooldownTimeLeft > 0 ? "text-slate-500" : "text-slate-800"}`}>
              Geçici Zamanlı Büyüme Desteği
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
              {adBoostCooldownTimeLeft > 0 ? (
                <>Tekrar başvuru için lütfen bekleme süresinin dolmasını bekleyin.</>
              ) : (
                <>Reklam İzle: 30 Saniye Boyunca <span className="text-emerald-600 font-semibold font-mono">2X Tıklama Katlayıcı</span> ve Hızlı Kar!</>
              )}
            </p>
          </div>
        </div>

        <div>
          {adBoostTimeLeft > 0 ? (
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded font-mono text-[10px] font-bold">
              AKTİF ({adBoostTimeLeft} sn)
            </span>
          ) : adBoostCooldownTimeLeft > 0 ? (
            <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded font-mono text-[10px] font-bold flex items-center gap-1">
              {formatCooldown(adBoostCooldownTimeLeft)}
            </span>
          ) : (
            <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-1 rounded font-mono text-[10px] flex items-center gap-1 hover:text-slate-800 transition-all duration-300">
              BAŞLAT <ChevronRight size={10} />
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
