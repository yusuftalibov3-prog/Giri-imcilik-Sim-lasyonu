import React from "react";
import { User, Sparkles, Building, Coins, TrendingUp, ShieldCheck, Ship, Target, Grid, HelpCircle, Home, Trophy, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Business, CryptoAsset, LuxuryAsset, StockAsset, RealEstateAsset, DailyGoal } from "../types";

interface CeoProfiliProps {
  balance: number;
  businesses: Business[];
  cryptoAssets: CryptoAsset[];
  stocks: StockAsset[];
  realEstates: RealEstateAsset[];
  luxuryAssets: LuxuryAsset[];
  adsDisabled: boolean;
  onDisableAds: () => void;
  totalClicks: number;
  dailyGoals: DailyGoal[];
  onClaimGoalReward: (id: string) => void;
}

export function CeoProfili({
  balance,
  businesses,
  cryptoAssets,
  stocks,
  realEstates,
  luxuryAssets,
  adsDisabled,
  onDisableAds,
  totalClicks,
  dailyGoals,
  onClaimGoalReward,
}: CeoProfiliProps) {

  const formatCurrency = (val: number) => {
    return val.toLocaleString("tr-TR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Math Calculations for overall Combined wealth
  const cryptoValuation = cryptoAssets.reduce((acc, c) => acc + c.amountOwned * c.currentPrice, 0);
  const stockValuation = stocks.reduce((acc, s) => acc + s.amountOwned * s.currentPrice, 0);
  const realEstateValuation = realEstates.reduce((acc, r) => acc + r.amountOwned * r.currentPrice, 0);
  
  const businessValuation = businesses
    .filter((b) => b.level > 0)
    .reduce((acc, b) => acc + b.currentCost, 0);

  // Luxury subsets
  const ownedHangarVal = luxuryAssets.filter((a) => a.category === "hangar" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
  const ownedGarajVal = luxuryAssets.filter((a) => a.category === "garaj" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
  const ownedLimanVal = luxuryAssets.filter((a) => a.category === "liman" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
  const ownedTabloVal = luxuryAssets.filter((a) => a.category === "tablo" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
  const ownedKonakVal = luxuryAssets.filter((a) => a.category === "konak" && a.purchased).reduce((acc, a) => acc + a.cost, 0);

  const totalCombinedWealth = balance + cryptoValuation + stockValuation + realEstateValuation + businessValuation + ownedHangarVal + ownedGarajVal + ownedLimanVal + ownedTabloVal + ownedKonakVal;

  const getGoalProgressValue = (goal: DailyGoal) => {
    if (goal.targetType === "clicks") return totalClicks;
    if (goal.targetType === "businesses") return businesses.filter((b) => b.level > 0).length;
    if (goal.targetType === "crypto") return cryptoAssets.reduce((acc, c) => acc + c.amountOwned * c.currentPrice, 0);
    if (goal.targetType === "estate") return realEstates.reduce((acc, r) => acc + r.amountOwned, 0);
    return 0;
  };

  const getGlobalRank = (wealth: number) => {
    if (wealth <= 0) return 150000;
    if (wealth < 1000) return Math.floor(150000 - (wealth / 1000) * 10000);
    if (wealth < 10000) return Math.floor(140000 - ((wealth - 1000) / 9000) * 40000);
    if (wealth < 100000) return Math.floor(100000 - ((wealth - 10000) / 90000) * 50000);
    if (wealth < 1000000) return Math.floor(50000 - ((wealth - 100000) / 900000) * 35005);
    if (wealth < 10000000) return Math.floor(14995 - ((wealth - 1000000) / 9000000) * 13000);
    if (wealth < 100000000) return Math.floor(1995 - ((wealth - 10000000) / 90000000) * 1800);
    if (wealth < 500000000) return Math.floor(195 - ((wealth - 100000000) / 400000000) * 185);
    return Math.max(1, Math.floor(10 - Math.min(9, wealth / 1000000000)));
  };

  const getLeagueName = (rank: number) => {
    if (rank > 50000) return "Bronz Ligi 🥉";
    if (rank > 5000) return "Gümüş Ligi 🥈";
    if (rank > 250) return "Altın Ligi 🥇";
    if (rank > 10) return "Platin Ligi 💎";
    return "Şampiyonlar Ligi 🏆";
  };

  const playerRank = getGlobalRank(totalCombinedWealth);
  
  const leaderboardList = [
    { name: "Zeynep Sabancı", rank: Math.max(1, playerRank - 2), wealth: totalCombinedWealth * 1.35 + 450, isPlayer: false },
    { name: "Melis Koç", rank: Math.max(1, playerRank - 1), wealth: totalCombinedWealth * 1.15 + 150, isPlayer: false },
    { name: "Siz (Holding CEO)", rank: playerRank, wealth: totalCombinedWealth, isPlayer: true },
    { name: "Can Ülker", rank: playerRank + 1, wealth: totalCombinedWealth * 0.82 + (totalCombinedWealth === 0 ? 100 : 0), isPlayer: false },
    { name: "Barış Eczacıbaşı", rank: playerRank + 2, wealth: totalCombinedWealth * 0.61 + (totalCombinedWealth === 0 ? 50 : 0), isPlayer: false },
  ];

  if (playerRank === 1) {
    leaderboardList[0].rank = 1;
    leaderboardList[0].name = "Siz (Holding CEO)";
    leaderboardList[0].isPlayer = true;
    leaderboardList[0].wealth = totalCombinedWealth;

    leaderboardList[1].rank = 2;
    leaderboardList[1].name = "Zeynep Sabancı";
    leaderboardList[1].isPlayer = false;
    leaderboardList[1].wealth = totalCombinedWealth * 0.95;

    leaderboardList[2].rank = 3;
    leaderboardList[2].name = "Melis Koç";
    leaderboardList[2].isPlayer = false;
    leaderboardList[2].wealth = totalCombinedWealth * 0.88;
  } else if (playerRank === 2) {
    leaderboardList[0].rank = 1;
    leaderboardList[0].name = "Zeynep Sabancı";
    leaderboardList[0].wealth = totalCombinedWealth * 1.15;

    leaderboardList[1].rank = 2;
    leaderboardList[1].name = "Siz (Holding CEO)";
    leaderboardList[1].isPlayer = true;
    leaderboardList[1].wealth = totalCombinedWealth;

    leaderboardList[2].rank = 3;
    leaderboardList[2].name = "Melis Koç";
    leaderboardList[2].wealth = totalCombinedWealth * 0.92;
  }

  // Level classification based on wealth
  const getRank = (wealth: number) => {
    if (wealth < 5000) return "Sokak Çırağı";
    if (wealth < 50000) return "Acemi Spekülatör";
    if (wealth < 500000) return "Semt Girişimcisi";
    if (wealth < 5000000) return "Milyoner Melek Yatırımcı";
    if (wealth < 50000000) return "Borsa Spekülatörü";
    if (wealth < 500000000) return "Holding Lordu";
    return "Dünya Finans Konseyi Başkanı";
  };

  const getRankIconText = (wealth: number) => {
    if (wealth < 5000) return "💼";
    if (wealth < 50000) return "💰";
    if (wealth < 500000) return "📈";
    if (wealth < 5000000) return "👑";
    return "🪬";
  };

  const getNextGoal = (wealth: number) => {
    if (wealth < 5000) return 5000;
    if (wealth < 50000) return 50000;
    if (wealth < 500000) return 500000;
    if (wealth < 5000000) return 5000000;
    if (wealth < 50000000) return 50000000;
    if (wealth < 500000000) return 500000000;
    return 1000000000;
  };

  const currentGoal = getNextGoal(totalCombinedWealth);
  const progressPct = Math.min(100, (totalCombinedWealth / currentGoal) * 100);

  // Exact 8 Categories resembling Image 1
  const statsCategories = [
    {
      title: "Bakiye",
      amount: formatCurrency(balance),
      desc: "Kullanılabilir Nakit",
      themeBg: "bg-blue-50 border border-blue-105",
      themeText: "text-blue-700",
      icon: <Coins size={14} className="text-blue-600" />
    },
    {
      title: "İşletmeler",
      amount: formatCurrency(businessValuation),
      desc: `${businesses.filter(b => b.level > 0).length} Şirket Yatırımı`,
      themeBg: "bg-rose-50 border border-rose-105",
      themeText: "text-rose-700",
      icon: <Building size={14} className="text-rose-600" />
    },
    {
      title: "Hisseler",
      amount: formatCurrency(stockValuation),
      desc: `${stocks.filter(s => s.amountOwned > 0).length} Borsa Portföyü`,
      themeBg: "bg-amber-50 border border-amber-105",
      themeText: "text-amber-700",
      icon: <TrendingUp size={14} className="text-amber-600" />
    },
    {
      title: "Gayrimenkul",
      amount: formatCurrency(realEstateValuation),
      desc: `${realEstates.reduce((acc, r) => acc + r.amountOwned, 0)} Ticari Mülkler`,
      themeBg: "bg-purple-50 border border-purple-105",
      themeText: "text-purple-700",
      icon: <Building size={14} className="text-purple-600" />
    },
    {
      title: "Taşıma",
      amount: formatCurrency(ownedHangarVal + ownedGarajVal + ownedLimanVal),
      desc: "Showroom Araç Envanteri",
      themeBg: "bg-emerald-50 border border-emerald-105",
      themeText: "text-emerald-700",
      icon: <Ship size={14} className="text-emerald-600" />
    },
    {
      title: "Koleksiyonlar",
      amount: formatCurrency(ownedTabloVal),
      desc: "Nadir Sanat Başyapıtları",
      themeBg: "bg-indigo-50 border border-indigo-105",
      themeText: "text-indigo-700",
      icon: <Grid size={14} className="text-indigo-600" />
    },
    {
      title: "Kripto varlıklar",
      amount: formatCurrency(cryptoValuation),
      desc: "DeFi ve Altcoin Yatırımı",
      themeBg: "bg-cyan-50 border border-cyan-105",
      themeText: "text-cyan-700",
      icon: <Sparkles size={14} className="text-cyan-600" />
    },
    {
      title: "Konak",
      amount: formatCurrency(ownedKonakVal),
      desc: "Prestij Malikaneleri",
      themeBg: "bg-teal-50 border border-teal-105",
      themeText: "text-teal-700",
      icon: <Home size={14} className="text-teal-600" />
    }
  ];

  const handleBuyAdFreeProfile = () => {
    if (balance >= 50000 && !adsDisabled) {
      onDisableAds();
    }
  };

  return (
    <div className="flex flex-col gap-5 select-none max-w-xl mx-auto">
      {/* Profil Header */}
      <div className="flex justify-between items-center text-left">
        <div className="flex items-center gap-2.5 text-left">
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <User size={16} />
          </div>
          <div className="text-left">
            <span className="text-blue-600 font-mono text-[10px] uppercase tracking-widest font-semibold block leading-none text-left">
              KULLANICI STATÜSÜ
            </span>
            <h1 className="text-lg font-bold font-display text-slate-800 tracking-tight mt-0.5 text-left">
              Profil
            </h1>
          </div>
        </div>
        <div className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded font-mono font-medium">
          BAĞLAN
        </div>
      </div>

      {/* Top Display: 'Profil' title, custom Servet and wealth progress bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 opacity-[0.03] bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:12px_12px] w-full h-full pointer-events-none" />

        <div className="flex justify-between items-start text-left">
          <div className="text-left">
            <span className="text-slate-400 text-[10px] font-sans uppercase font-bold tracking-widest block leading-none text-left">
              SERVET
            </span>
            <span className="text-3xl font-extrabold font-mono text-slate-800 tracking-tight mt-1.5 block text-left">
              {formatCurrency(totalCombinedWealth)}
            </span>
          </div>
          <span className="text-2xl" title="Sıralama Unvanı">
            {getRankIconText(totalCombinedWealth)}
          </span>
        </div>

        {/* Wealth Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>

          <div className="flex justify-between text-[8px] text-slate-500 mt-1.5 font-mono">
            <span>UNVAN: <strong className="text-slate-800 text-[9.5px] font-sans">{getRank(totalCombinedWealth)}</strong></span>
            <span className="text-[9.5px]">{progressPct.toFixed(1)}%</span>
          </div>
        </div>

        {/* Global Rank and League */}
        <div className="border-t border-slate-100 mt-4.5 pt-4.5 flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">DÜNYA SIRALAMASI</span>
            <span className="text-sm font-mono font-bold text-blue-700 mt-0.5 block">#{playerRank.toLocaleString("tr-TR")}. Sıra</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">GÜNCEL LİGİNİZ</span>
            <span className="text-sm font-sans font-extrabold text-slate-700 mt-0.5 block">{getLeagueName(playerRank)}</span>
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2.5">
          {statsCategories.map((card, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col justify-between h-20 shadow-xs transition ${card.themeBg}`}
            >
              <div className="flex justify-between items-center text-slate-500 text-left">
                <span className="text-[10.5px] font-bold font-display tracking-tight text-slate-800 uppercase">
                  {card.title}
                </span>
                {card.icon}
              </div>

              <div className="text-left">
                <p className={`font-mono text-[13.5px] font-black leading-none ${card.themeText}`}>
                  {card.amount}
                </p>
                <p className="text-[8.5px] text-slate-500 mt-1 font-sans font-medium text-left">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Günlük Hedefler (Daily Goals) Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-blue-600" size={18} />
          <div>
            <h3 className="font-sans font-black text-slate-800 text-sm">Günlük Hedefler</h3>
            <span className="text-[10px] text-slate-400 block font-mono">GÖREVLERİ TAMAMLA VE EK BONUSLAR KAZAN</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {dailyGoals.map((goal) => {
            const currentVal = getGoalProgressValue(goal);
            const rawPct = (currentVal / goal.targetValue) * 100;
            const progressValuePct = Math.min(100, Math.max(0, goal.completed ? 100 : rawPct));
            
            return (
              <div key={goal.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-slate-800 font-sans">{goal.title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">{goal.description}</span>
                  </div>
                  
                  {goal.claimed ? (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full font-bold font-mono">
                      <CheckCircle2 size={10} /> ALINDI
                    </span>
                  ) : goal.completed ? (
                    <button
                      onClick={() => onClaimGoalReward(goal.id)}
                      className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xs cursor-pointer uppercase tracking-wider transition-all"
                    >
                      ÖDÜLÜ TOPLA
                    </button>
                  ) : (
                    <span className="shrink-0 text-[10.5px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full font-mono">
                      {formatCurrency(goal.reward)}
                    </span>
                  )}
                </div>

                {/* Progress bar inside the goal */}
                <div className="mt-1">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progressValuePct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${goal.claimed ? 'bg-slate-400' : 'bg-blue-600'}`}
                    />
                  </div>
                  <div className="flex justify-between text-[8.5px] text-slate-400 mt-1 font-mono">
                    <span>İlerleme: {currentVal.toLocaleString("tr-TR")} / {goal.targetValue.toLocaleString("tr-TR")}</span>
                    <span>{progressValuePct.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Küresel Sıralama (Global Leaderboard) Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-amber-500" size={18} />
          <div>
            <h3 className="font-sans font-black text-slate-800 text-sm">Finans Liderlik Tablosu</h3>
            <span className="text-[10px] text-slate-400 block font-mono">RAKİPLERİNİ GEÇEREK EN ZENGİN CEO OL</span>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-slate-50">
          {leaderboardList.map((competitor, idx) => {
            const isPlayer = competitor.isPlayer;
            return (
              <div
                key={idx}
                className={`flex justify-between items-center px-4 py-3 text-xs transition-all ${
                  isPlayer
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 font-bold border-l-3 border-blue-600"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-black ${
                    competitor.rank === 1
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : competitor.rank === 2
                      ? "bg-slate-100 text-slate-700 border border-slate-200"
                      : competitor.rank === 3
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-slate-50 text-slate-500 border border-slate-100"
                  }`}>
                    {competitor.rank}
                  </span>
                  
                  <div className="flex flex-col text-left">
                    <span className={`font-sans ${isPlayer ? 'text-blue-800 font-extrabold text-[12.5px]' : 'text-slate-700 font-semibold'}`}>
                      {competitor.name}
                    </span>
                    {isPlayer && (
                      <span className="text-[8.5px] uppercase tracking-wider text-indigo-500 font-semibold block font-mono">BU SİZSİNİZ</span>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col">
                  <span className={`font-mono ${isPlayer ? 'text-blue-950 font-extrabold text-[13px]' : 'text-slate-500'}`}>
                    {formatCurrency(competitor.wealth)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom section showing total active clicks */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-500 font-mono shadow-xs text-left">
        <span>Tıklama Sayacı:</span>
        <span className="text-slate-800 font-black">{totalClicks} tık</span>
      </div>

      {/* Special Card: NO MORE ADS! - Hemen devre dışı bırak. */}
      {!adsDisabled && (
        <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shrink-0 text-sm">
              📳
            </div>
            <div className="text-left">
              <h4 className="font-sans font-black text-blue-700 text-xs text-left">
                REKLAMSIZ OYNA
              </h4>
              <p className="text-[10px] text-slate-500 text-left mt-0.5 max-w-[260px] leading-tight">
                Sürekli reklamlar olmadan oynamak ister misin? Oyun içi bakiye kullanarak reklamları kapatabilirsin.
              </p>
            </div>
          </div>

          <button
            onClick={handleBuyAdFreeProfile}
            disabled={balance < 50000}
            className={`shrink-0 px-3 py-1.5 rounded text-[9.5px] font-extrabold uppercase transition-all ${
              balance >= 50000
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
            }`}
          >
            Kapat ($50.000)
          </button>
        </div>
      )}
    </div>
  );
}
