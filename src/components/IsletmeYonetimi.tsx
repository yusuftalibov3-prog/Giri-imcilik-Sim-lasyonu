import React, { useState } from "react";
import { Store, Coffee, Cpu, Car, Package, Ship, Briefcase, Orbit, Plus, Combine, HelpCircle, Sparkles, Tv } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Business } from "../types";

interface IsletmeYonetimiProps {
  balance: number;
  businesses: Business[];
  onEstablishBusiness: (businessId: string) => void;
  onMergeBusinesses: (businessId: string) => void;
  onWatchAdForPassiveGift: () => void;
}

// Icon Mapping helper
export const BusinessIcon = ({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) => {
  switch (name) {
    case "Store": return <Store size={size} className={className} />;
    case "Coffee": return <Coffee size={size} className={className} />;
    case "Cpu": return <Cpu size={size} className={className} />;
    case "Car": return <Car size={size} className={className} />;
    case "Package": return <Package size={size} className={className} />;
    case "Ship": return <Ship size={size} className={className} />;
    case "Briefcase": return <Briefcase size={size} className={className} />;
    case "Orbit": return <Orbit size={size} className={className} />;
    default: return <Store size={size} className={className} />;
  }
};

export function IsletmeYonetimi({
  balance,
  businesses,
  onEstablishBusiness,
  onMergeBusinesses,
  onWatchAdForPassiveGift,
}: IsletmeYonetimiProps) {
  const [showEstablishModal, setShowEstablishModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeStatus, setMergeStatus] = useState<string | null>(null);

  // Filter established (level > 0)
  const establishedList = businesses.filter((b) => b.level > 0);
  const totalHourlyIncome = establishedList.reduce((acc, b) => acc + (b.level * b.hourlyIncomePerLevel), 0);
  const currentSlotsCount = establishedList.length;

  const formatCurrency = (val: number) => {
    return val.toLocaleString("tr-TR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleMergeAction = (businessId: string) => {
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    
    // Merge cost is 50% of the cost of current level
    const mergeCost = biz.currentCost * 0.6;
    if (balance < mergeCost) {
      setMergeStatus("Yetersiz Nakit Bakiye!");
      setTimeout(() => setMergeStatus(null), 3000);
      return;
    }

    onMergeBusinesses(businessId);
    setMergeStatus(`${biz.name} başarıyla birleştirildi! Saatlik gelir seviyesi katlandı.`);
    setTimeout(() => {
      setMergeStatus(null);
      setShowMergeModal(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-6 select-none max-w-xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col">
        <span className="text-blue-600 font-mono text-[10px] uppercase tracking-widest font-semibold text-left">
          PASİF GELİR KAYNAĞI
        </span>
        <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight text-left">
          İşletme Yönetimi
        </h1>
      </div>

      {/* Screen B Top Display 1: Hourly Passive Income Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
              Saatlik Toplam Gelir
            </p>
            <h2 className="text-2xl font-black font-mono text-emerald-600 tracking-tight mt-1">
              + {formatCurrency(totalHourlyIncome)}
            </h2>
          </div>
          <button
            onClick={onWatchAdForPassiveGift}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition cursor-pointer font-sans"
          >
            <Tv size={13} className="text-blue-600" />
            <span className="font-semibold text-[10px]">Hızlı Kâr Al</span>
          </button>
        </div>
      </div>

      {/* Screen B Main Body Menu Buttons: Buy & Merge */}
      <div className="grid grid-cols-2 gap-4">
        {/* Establish Button */}
        <button
          onClick={() => setShowEstablishModal(true)}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-slate-700 hover:bg-slate-50/50 transition text-center gap-2 cursor-pointer shadow-xs group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Plus size={20} />
          </div>
          <span className="font-display font-bold text-xs text-slate-800">Girişim Kur</span>
          <span className="text-[9px] text-slate-400">Yeni şirketler kurun</span>
        </button>

        {/* Merge Button */}
        <button
          onClick={() => setShowMergeModal(true)}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-slate-700 hover:bg-slate-50/50 transition text-center gap-2 cursor-pointer shadow-xs group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Combine size={18} />
          </div>
          <span className="font-display font-bold text-xs text-slate-800">Girişim Ortaklıkları</span>
          <span className="text-[9px] text-slate-400">Şirket karlarını katlayın</span>
        </button>
      </div>

      {/* Dynamic List Section: Şirketlerim (0/10) */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">
            Şirketlerim ({currentSlotsCount}/10)
          </span>
          <span className="text-[9px] text-slate-400 font-mono">En fazla 10 girişim kapasitesi</span>
        </div>

        {establishedList.length === 0 ? (
          /* Screen B Placeholder card */
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center text-slate-500 gap-2">
            <HelpCircle size={28} className="text-slate-300 animate-pulse" />
            <p className="font-sans font-bold text-xs text-slate-600">
              Henüz faal bir girişiminiz yok.
            </p>
            <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
              Bir girişimci olarak ilk şirketinizi kurun ve uyurken de pasif nakit kazanın.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {establishedList.map((biz) => (
              <motion.div
                key={biz.id}
                layoutId={`corp-${biz.id}`}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 transition shadow-xs text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <BusinessIcon name={biz.iconName} size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-800 text-xs flex items-center gap-1.5 justify-start">
                      {biz.name}
                      <span className="bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                        Seviye {biz.level}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 max-w-[280px] leading-tight text-left">
                      {biz.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] text-emerald-600 font-mono font-bold">
                    +{formatCurrency(biz.hourlyIncomePerLevel * biz.level)}/sa
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                    Seviye Kârı: {formatCurrency(biz.hourlyIncomePerLevel)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL / BOTTOM DRAWER: Bir İşletme Kur */}
      <AnimatePresence>
        {showEstablishModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="font-display font-bold text-sm text-slate-800">Girişim Kurulumu</span>
                <button
                  onClick={() => setShowEstablishModal(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded border border-slate-200 cursor-pointer"
                >
                  Kapat
                </button>
              </div>

              <div className="p-4 max-h-[350px] overflow-y-auto flex flex-col gap-3">
                {businesses.map((biz) => {
                  const maxed = currentSlotsCount >= 10 && biz.level === 0;
                  const canBuy = balance >= biz.baseCost && !maxed;
                  return (
                    <div
                      key={biz.id}
                      className={`relative p-3 rounded-lg border transition-all flex items-center justify-between ${
                        biz.level > 0
                          ? "bg-blue-50/50 border-blue-150"
                          : "bg-stone-50/50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded flex items-center justify-center border border-slate-200">
                          <BusinessIcon name={biz.iconName} size={18} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-display font-bold text-xs text-slate-800 flex items-center gap-1.5 justify-start">
                            {biz.name}
                            {biz.level > 0 && (
                              <span className="bg-blue-100 text-blue-800 text-[8px] px-1.5 rounded font-mono font-bold">
                                Kurulu: Lvl {biz.level}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {biz.description}
                          </p>
                          <p className="text-[9px] text-[#2563eb] font-mono mt-1 font-bold">
                            Saatlik Kâr: +{formatCurrency(biz.hourlyIncomePerLevel)}/sa
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {biz.level > 0 ? (
                          <button
                            id={`upgrade-biz-${biz.id}`}
                            onClick={() => onEstablishBusiness(biz.id)}
                            disabled={balance < biz.currentCost}
                            className={`px-3 py-1 rounded font-sans text-[10px] font-bold ${
                              balance >= biz.currentCost
                                ? "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            Seviye Artır ({formatCurrency(biz.currentCost)})
                          </button>
                        ) : (
                          <button
                            id={`buy-biz-${biz.id}`}
                            onClick={() => onEstablishBusiness(biz.id)}
                            disabled={!canBuy}
                            className={`px-3 py-1 rounded font-sans text-[10px] font-semibold ${
                              canBuy
                                ? "bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                            title={maxed ? "10 şirket limiti dolu!" : "Yetersiz bakiye"}
                          >
                            {maxed ? "Kota Dolu" : `Sektöre Gir (${formatCurrency(biz.baseCost)})`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 px-4 py-3 text-[10px] text-slate-400 flex justify-between border-t border-slate-200">
                <span>Her şirket kurulumu size kalıcı pasif gelir sağlar.</span>
                <span>Limit: 10 Adet</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL / BOTTOM DRAWER: Şirket Birleşmeleri */}
      <AnimatePresence>
        {showMergeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 max-w-md w-full rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Combine size={16} className="text-blue-600" /> Şirket Ortaklıkları Portalı
                </span>
                <button
                  onClick={() => setShowMergeModal(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded border border-slate-200 cursor-pointer"
                >
                  Kapat
                </button>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <p className="text-[11px] text-slate-500 leading-normal text-left">
                  Ortaklık birleşmeleri (M&A), faal girişimlerinizin yapılarını optimize eder. Birleşme koordinasyonu karşılığında saatlik kâr çarpanlarınızı kalıcı olarak{" "}
                  <span className="text-blue-600 font-bold">2.5X</span> seviyesine çıkararak verimliliği artırır.
                </p>

                {mergeStatus && (
                  <p className="text-xs text-center font-semibold bg-blue-50 text-blue-700 py-1.5 rounded border border-blue-200 animate-pulse">
                    {mergeStatus}
                  </p>
                )}

                <div className="flex flex-col gap-2.5 mt-2">
                  {establishedList.map((biz) => {
                    const mergeCost = biz.currentCost * 0.6;
                    const canMerge = balance >= mergeCost;
                    return (
                      <div key={biz.id} className="bg-white p-3 rounded-lg flex items-center justify-between border border-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="text-blue-600 text-left">
                            <BusinessIcon name={biz.iconName} size={16} />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-800">{biz.name}</p>
                            <p className="text-[9px] text-[#2563eb] font-mono">Maliyet: {formatCurrency(mergeCost)}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleMergeAction(biz.id)}
                          className={`px-2.5 py-1 rounded text-[9px] font-sans font-bold ${
                            canMerge
                              ? "bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          Sinerji Birleştir
                        </button>
                      </div>
                    );
                  })}

                  {establishedList.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">
                      Sinerji birleşmeleri başlatmak için önce en az 1 faal şirkete sahip olmalısınız.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 px-4 py-3 text-[10px] text-slate-400 text-center border-t border-slate-200">
                Girişimlerinizin kurumsal yönetim kalitesini yükseltir.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
