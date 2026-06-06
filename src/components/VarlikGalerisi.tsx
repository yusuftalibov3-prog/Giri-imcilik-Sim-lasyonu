import React, { useState } from "react";
import { Plane, Car, Ship, Palette, Home, ArrowUpRight, Trophy, ShieldCheck, Coins, Sparkles, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LuxuryAsset } from "../types";

interface VarlikGalerisiProps {
  balance: number;
  luxuryAssets: LuxuryAsset[];
  onPurchaseAsset: (assetId: string) => void;
}

export function VarlikGalerisi({
  balance,
  luxuryAssets,
  onPurchaseAsset,
}: VarlikGalerisiProps) {
  const [activeTab, setActiveTab] = useState<"all" | "hangar" | "garaj" | "liman" | "tablo" | "konak">("all");
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("tr-TR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Counting category totals
  const totalInHangar = luxuryAssets.filter((a) => a.category === "hangar").length;
  const ownedInHangar = luxuryAssets.filter((a) => a.category === "hangar" && a.purchased).length;

  const totalInGaraj = luxuryAssets.filter((a) => a.category === "garaj").length;
  const ownedInGaraj = luxuryAssets.filter((a) => a.category === "garaj" && a.purchased).length;

  const totalInLiman = luxuryAssets.filter((a) => a.category === "liman").length;
  const ownedInLiman = luxuryAssets.filter((a) => a.category === "liman" && a.purchased).length;

  const totalTablo = luxuryAssets.filter((a) => a.category === "tablo").length;
  const ownedTablo = luxuryAssets.filter((a) => a.category === "tablo" && a.purchased).length;

  const totalKonak = luxuryAssets.filter((a) => a.category === "konak").length;
  const ownedKonak = luxuryAssets.filter((a) => a.category === "konak" && a.purchased).length;

  const handleBuyAsset = (asset: LuxuryAsset) => {
    if (balance < asset.cost) {
      setPurchaseStatus("Yetersiz nakit bakiye!");
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }
    
    onPurchaseAsset(asset.id);
    setPurchaseStatus(`Tebrikler! ${asset.name} satın alındı ve envanterinize eklendi.`);
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  const filteredAssets = activeTab === "all"
    ? luxuryAssets
    : luxuryAssets.filter((a) => a.category === activeTab);

  return (
    <div className="flex flex-col gap-6 select-none max-w-xl mx-auto">
      {/* Title */}
      <div className="flex flex-col text-left">
        <span className="text-blue-600 font-mono text-[10px] uppercase tracking-widest font-semibold text-left block leading-none">
          PRESTİJ MAĞAZALARI VE SHOWROOM
        </span>
        <h1 className="text-2xl font-bold font-display text-slate-800 tracking-tight mt-0.5 text-left">
          Eşyalar
        </h1>
      </div>

      {/* Screen D Top Categories Grid list */}
      <div className="grid grid-cols-3 gap-3">
        {/* Garaj Store Button */}
        <div
          onClick={() => setActiveTab("garaj")}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 text-center items-center justify-center ${
            activeTab === "garaj" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs scale-[1.02]" : "bg-white border-slate-200 hover:border-slate-350"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-105">
            <Car size={16} />
          </div>
          <span className="text-[11px] font-bold text-slate-800 mt-1">Garaj</span>
          <span className="text-[9px] text-blue-600 font-mono font-bold leading-none mt-0.5">
            {ownedInGaraj}/{totalInGaraj} Araç
          </span>
        </div>

        {/* Hangar Store Button */}
        <div
          onClick={() => setActiveTab("hangar")}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 text-center items-center justify-center ${
            activeTab === "hangar" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs scale-[1.02]" : "bg-white border-slate-200 hover:border-slate-350"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-105">
            <Plane size={16} />
          </div>
          <span className="text-[11px] font-bold text-slate-800 mt-1">Hangar</span>
          <span className="text-[9px] text-cyan-600 font-mono font-bold leading-none mt-0.5">
            {ownedInHangar}/{totalInHangar} Uçak
          </span>
        </div>

        {/* Liman Store Button */}
        <div
          onClick={() => setActiveTab("liman")}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 text-center items-center justify-center ${
            activeTab === "liman" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs scale-[1.02]" : "bg-white border-slate-200 hover:border-slate-350"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-105">
            <Ship size={16} />
          </div>
          <span className="text-[11px] font-bold text-slate-800 mt-1">Liman</span>
          <span className="text-[9px] text-indigo-600 font-mono font-bold leading-none mt-0.5">
            {ownedInLiman}/{totalInLiman} Yat
          </span>
        </div>
      </div>

      {/* Stores Category Names resembling Image 2 */}
      {activeTab === "all" && (
        <div className="flex flex-col gap-3">
          <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-left">
            Eşya Mağazaları
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div onClick={() => setActiveTab("garaj")} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500/50 hover:shadow-2xs transition duration-300">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded flex items-center justify-center border border-amber-200 shrink-0">
                  🚘
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-800">Otomobil Galerisi</h4>
                  <p className="text-[9.5px] text-slate-500">Klasik ve modern hiper spor arabalar</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold whitespace-nowrap">{ownedInGaraj} adet</span>
            </div>

            <div onClick={() => setActiveTab("hangar")} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500/50 hover:shadow-2xs transition duration-300">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded flex items-center justify-center border border-cyan-200 shrink-0">
                  ✈️
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-800">Hava Taşıtı Mağazası</h4>
                  <p className="text-[9.5px] text-slate-500">Muazzam helikopterler ve jetler</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold whitespace-nowrap">{ownedInHangar} adet</span>
            </div>

            <div onClick={() => setActiveTab("liman")} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500/50 hover:shadow-2xs transition duration-300">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center border border-blue-200 shrink-0">
                  🚢
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-800">Yat Mağazası</h4>
                  <p className="text-[9.5px] text-slate-500">Üstün deniz canavarları ve giga-yatlar</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold whitespace-nowrap">{ownedInLiman} adet</span>
            </div>

            <div onClick={() => setActiveTab("tablo")} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500/50 hover:shadow-2xs transition duration-300">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded flex items-center justify-center border border-purple-200 shrink-0">
                  🎨
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-800">Sanat ve Tablolar</h4>
                  <p className="text-[9.5px] text-slate-500">Müzayede sarayından CEO tabloları</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold whitespace-nowrap">{ownedTablo} adet</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and reset back buttons */}
      {activeTab !== "all" && (
        <div className="flex justify-between items-center border-b border-slate-200 pb-2 text-left">
          <span className="text-xs font-bold text-slate-500 uppercase font-mono text-left">
            Katalog: {activeTab === "garaj" ? "Garaj" : activeTab === "hangar" ? "Hangar" : activeTab === "liman" ? "Liman" : activeTab === "tablo" ? "Tablo" : "Boğaz Konakları"}
          </span>
          <button
            onClick={() => setActiveTab("all")}
            className="text-[10px] text-blue-650 font-bold tracking-tight bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-105 transition cursor-pointer"
          >
            ← GERI DÖN
          </button>
        </div>
      )}

      {purchaseStatus && (
        <p className="text-xs text-center font-bold bg-emerald-50 text-emerald-800 py-2 rounded border border-emerald-205 border-dashed animate-pulse">
          {purchaseStatus}
        </p>
      )}

      {/* List Filter Panel */}
      <div className="flex flex-col gap-3.5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${
              asset.purchased
                ? "bg-emerald-50/15 border-emerald-400"
                : "bg-white border-slate-200 hover:border-slate-350"
            }`}
          >
            <div className="flex items-center gap-3.5 text-left">
              {/* Asset Badge */}
              <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 text-lg relative group shrink-0">
                <span className="scale-100 group-hover:scale-110 transition-transform">
                  {asset.imagePlaceholder.split(" ")[0]}
                </span>
                {asset.purchased && (
                  <div className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5" title="Satın alındı">
                    <ShieldCheck size={9} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="text-left">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 justify-start">
                  {asset.name}
                  {asset.purchased && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono font-bold px-1.5 py-0.5 rounded">
                      Envanterde
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                  {asset.description}
                </p>
                <div className="flex items-center gap-1.5 text-[9px] text-blue-600 font-mono mt-1 font-bold justify-start">
                  <ArrowUpRight size={10} /> +{(asset.boostMultiplier * 100).toFixed(0)}% Pasif Gelir Boostu
                </div>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto shrink-0 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
              {asset.purchased ? (
                <div className="flex items-center sm:justify-end gap-1 text-emerald-700 font-sans font-bold text-xs justify-end">
                  <Trophy size={12} /> Sahipli
                </div>
              ) : (
                <button
                  id={`purchase-asset-${asset.id}`}
                  onClick={() => handleBuyAsset(asset)}
                  disabled={balance < asset.cost}
                  className={`w-full sm:w-auto px-4 py-1.5 rounded text-xs font-bold font-sans tracking-tight transition ${
                    balance >= asset.cost
                      ? "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-2xs"
                      : "bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Satın Al ({formatCurrency(asset.cost)})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress tracking dashboard - resembling "Koleksiyonlar" from Image 2 */}
      {activeTab === "all" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs">
          <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-left">
            Koleksiyon İlerlemeleri
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Eski Paralar Card */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex gap-3 h-20 items-center">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-200 rounded flex items-center justify-center text-lg shrink-0">
                ⭐
              </div>
              <div className="flex-grow min-w-0 text-left">
                <span className="text-xs font-bold text-slate-800 block text-left">Eski Paralar</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block text-left truncate">Tarihi nümismatik seti</span>
                <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
                  <div className="bg-amber-600 h-full" style={{ width: `${(ownedTablo / (totalTablo || 1)) * 100}%` }} />
                </div>
                <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono mt-1">
                  <span>Tamamlama</span>
                  <span>{ownedTablo} / {totalTablo}</span>
                </div>
              </div>
            </div>

            {/* Nadir Tablolar Card */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex gap-3 h-20 items-center">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded flex items-center justify-center text-lg shrink-0">
                🎨
              </div>
              <div className="flex-grow min-w-0 text-left">
                <span className="text-xs font-bold text-slate-800 block text-left">Nadir Tablolar</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block text-left truncate">Sanat müzayedesi başarısı</span>
                <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${(ownedTablo / (totalTablo || 1)) * 100}%` }} />
                </div>
                <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono mt-1">
                  <span>Tamamlama</span>
                  <span>{ownedTablo} / {totalTablo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
