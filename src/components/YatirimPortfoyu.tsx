import React, { useState } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Wallet, Building, ArrowUpRight, ShieldCheck, LineChart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CryptoAsset, StockAsset, RealEstateAsset, NewsEvent } from "../types";

interface YatirimPortfoyuProps {
  balance: number;
  cryptoAssets: CryptoAsset[];
  stocks: StockAsset[];
  realEstates: RealEstateAsset[];
  onBuyCrypto: (id: string, usdAmount: number) => void;
  onSellCrypto: (id: string, fraction: number) => void;
  onBuyStock: (id: string, usdAmount: number) => void;
  onSellStock: (id: string, fraction: number) => void;
  onBuyRealEstate: (id: string) => void;
  onSellRealEstate: (id: string) => void;
  onTickMarkets: () => void;
  currentNews: NewsEvent | null;
  onTriggerNews: () => void;
}

export function YatirimPortfoyu({
  balance,
  cryptoAssets,
  stocks,
  realEstates,
  onBuyCrypto,
  onSellCrypto,
  onBuyStock,
  onSellStock,
  onBuyRealEstate,
  onSellRealEstate,
  onTickMarkets,
  currentNews,
  onTriggerNews,
}: YatirimPortfoyuProps) {
  const [subTab, setSubTab] = useState<"hisseler" | "gayrimenkul" | "kripto">("kripto");

  // Selected assets state for active trade panel
  const [selectedStock, setSelectedStock] = useState<StockAsset | null>(stocks[0] || null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(cryptoAssets[0] || null);
  
  const [tradeAction, setTradeAction] = useState<"buy" | "sell">("buy");
  const [tradeInput, setTradeInput] = useState<string>("100");
  const [tradeStatus, setTradeStatus] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return val.toLocaleString("tr-TR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Math totals
  const totalCryptoVal = cryptoAssets.reduce((acc, c) => acc + (c.amountOwned * c.currentPrice), 0);
  const totalStockVal = stocks.reduce((acc, s) => acc + (s.amountOwned * s.currentPrice), 0);
  const totalRealEstateVal = realEstates.reduce((acc, r) => acc + (r.amountOwned * r.currentPrice), 0);

  // Overall market performance calculation (average of changes)
  const avgCryptoChange = cryptoAssets.reduce((acc, c) => acc + c.changePct, 0) / (cryptoAssets.length || 1);
  const avgStockChange = stocks.reduce((acc, s) => acc + s.changePct, 0) / (stocks.length || 1);
  const avgEstateChange = realEstates.reduce((acc, r) => acc + r.changePct, 0) / (realEstates.length || 1);

  const handleStockTrade = () => {
    if (!selectedStock) return;
    const valueNum = parseFloat(tradeInput);
    if (isNaN(valueNum) || valueNum <= 0) {
      setTradeStatus("Hatalı tutar girildi.");
      setTimeout(() => setTradeStatus(null), 3500);
      return;
    }

    if (tradeAction === "buy") {
      if (balance < valueNum) {
        setTradeStatus("Yetersiz Nakit Bakiye!");
        setTimeout(() => setTradeStatus(null), 3500);
        return;
      }
      onBuyStock(selectedStock.id, valueNum);
      setTradeStatus(`Başarıyla ${formatCurrency(valueNum)} tutarında ${selectedStock.symbol} hissesi alındı.`);
    } else {
      if (selectedStock.amountOwned < valueNum) {
        setTradeStatus(`Yetersiz hisse senedi! En fazla ${selectedStock.amountOwned.toFixed(4)} pay satabilirsiniz.`);
        setTimeout(() => setTradeStatus(null), 3500);
        return;
      }
      onSellStock(selectedStock.id, valueNum);
      const refunded = valueNum * selectedStock.currentPrice;
      setTradeStatus(`Başarıyla ${valueNum.toFixed(4)} adet ${selectedStock.symbol} satılarak ${formatCurrency(refunded)} nakit alındı.`);
    }

    setTradeInput("");
    setTimeout(() => setTradeStatus(null), 3500);
  };

  const handleCryptoTrade = () => {
    if (!selectedCrypto) return;
    const valueNum = parseFloat(tradeInput);
    if (isNaN(valueNum) || valueNum <= 0) {
      setTradeStatus("Hatalı miktar girildi.");
      setTimeout(() => setTradeStatus(null), 3500);
      return;
    }

    if (tradeAction === "buy") {
      if (balance < valueNum) {
        setTradeStatus("Cüzdanda yetersiz nakit var!");
        setTimeout(() => setTradeStatus(null), 3500);
        return;
      }
      onBuyCrypto(selectedCrypto.id, valueNum);
      setTradeStatus(`Başarıyla ${formatCurrency(valueNum)} değerinde ${selectedCrypto.symbol} satın alındı.`);
    } else {
      if (selectedCrypto.amountOwned < valueNum) {
        setTradeStatus(`Varlık yetersiz! Max satılabilir: ${selectedCrypto.amountOwned.toFixed(6)} ${selectedCrypto.symbol}`);
        setTimeout(() => setTradeStatus(null), 3500);
        return;
      }
      onSellCrypto(selectedCrypto.id, valueNum);
      const outputCash = valueNum * selectedCrypto.currentPrice;
      setTradeStatus(`Satış başarılı: ${valueNum.toFixed(6)} ${selectedCrypto.symbol} karşılığı ${formatCurrency(outputCash)} bakiye eklendi.`);
    }

    setTradeInput("");
    setTimeout(() => setTradeStatus(null), 3500);
  };

  // Sparkline visual renderer
  const renderSparkline = (points: number[], color: string) => {
    if (points.length < 2) return null;
    const width = 75;
    const height = 15;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    });

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={coords.join(" ")}
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-5 select-none max-w-xl mx-auto">
      {/* Title block */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-blue-600 font-mono text-[10px] uppercase tracking-widest font-semibold text-left">
            GLOBAL YATIRIM SEKTÖRLERİ
          </span>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight text-left">
            Yatırım
          </h1>
        </div>
        <button
          onClick={onTickMarkets}
          className="flex items-center gap-1.2 text-[9px] text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded border border-blue-200 font-mono transition cursor-pointer"
          title="Tüm piyasa fiyatlarını dalgalandır"
        >
          <RefreshCw size={11} className="mr-0.5" /> PİYASAYI YENİLE
        </button>
      </div>

      {/* Anlık Haber Akışı (News Feed Block) */}
      <div className="bg-slate-950 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-semibold">
              Anlık Haber Akışı
            </span>
          </div>
          {currentNews && (
            <span className="text-[9px] font-mono text-slate-500">
              {currentNews.timeLabel}
            </span>
          )}
        </div>

        {currentNews ? (
          <div className="flex flex-col gap-2">
            <div className="text-xs md:text-sm font-semibold text-slate-200 tracking-tight text-left leading-relaxed">
              "{currentNews.headline}"
            </div>
            <div className="flex items-center gap-2 mt-1 self-start">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {currentNews.targetSymbol} ({currentNews.assetType === "crypto" ? "Kripto" : "Hisse"})
              </span>
              <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${currentNews.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentNews.isPositive ? '+' : '-'}{currentNews.changePct}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-left py-2">
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Piyasalarda şu anlık sakin bir seyir izleniyor. Ekonomi başlıklarını ve piyasayı dalgalandıran kritik haberleri tetiklemek için sağ üstteki <span className="text-blue-400 font-mono">PİYASAYI YENİLE</span> butonuna dokunun!
            </p>
          </div>
        )}
      </div>

      {/* Primary tab-switch header */}
      <div className="flex border-b border-slate-200 pb-0.5 justify-between">
        <button
          onClick={() => { setSubTab("hisseler"); setTradeInput(""); setTradeAction("buy"); }}
          className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            subTab === "hisseler"
              ? "border-[#2563eb] text-[#2563eb]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Hisseler
        </button>
        <button
          onClick={() => { setSubTab("gayrimenkul"); setTradeInput(""); }}
          className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            subTab === "gayrimenkul"
              ? "border-[#2563eb] text-[#2563eb]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Gayrimenkul
        </button>
        <button
          onClick={() => { setSubTab("kripto"); setTradeInput(""); setTradeAction("buy"); }}
          className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            subTab === "kripto"
              ? "border-[#2563eb] text-[#2563eb]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Kripto para
        </button>
      </div>

      {/* Subtab 1: HİSSELER PANEL */}
      {subTab === "hisseler" && (
        <div className="flex flex-col gap-4">
          {/* Top visual value card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-xs">
            <div className="absolute right-4 top-4 text-purple-500/10 pointer-events-none">
              <LineChart size={80} />
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest leading-none text-left">
              Toplam Hisse Senedi Değeri
            </p>
            <h2 className="text-2xl font-black font-mono text-purple-600 tracking-tight mt-1 text-left">
              {formatCurrency(totalStockVal)}
            </h2>
            <div className="flex items-center gap-1.5 mt-2.5">
              {avgStockChange >= 0 ? (
                <span className="text-emerald-600 text-[10px] font-mono font-bold flex items-center">
                  ▲ {avgStockChange.toFixed(2)} % (Piyasa)
                </span>
              ) : (
                <span className="text-red-500 text-[10px] font-mono font-bold flex items-center">
                  ▼ {avgStockChange.toFixed(2)} % (Piyasa)
                </span>
              )}
            </div>
          </div>

          {/* Quick Trade Setup Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Seçili Şirket:</span>
              {selectedStock && (
                <span className="text-slate-800 font-bold flex items-center gap-1">
                  <span style={{ color: selectedStock.color }}>■</span> {selectedStock.name} ({selectedStock.symbol})
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTradeAction("buy")}
                className={`flex-1 py-1.5 text-xs rounded font-sans font-bold transition cursor-pointer ${
                  tradeAction === "buy" ? "bg-purple-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                Satın Al
              </button>
              <button
                onClick={() => setTradeAction("sell")}
                className={`flex-1 py-1.5 text-xs rounded font-sans font-bold transition cursor-pointer ${
                  tradeAction === "sell" ? "bg-indigo-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                Hisse Satışı
              </button>
            </div>

            <div className="flex gap-2 mt-1">
              <input
                type="number"
                value={tradeInput}
                onChange={(e) => setTradeInput(e.target.value)}
                placeholder={
                  tradeAction === "buy"
                    ? "Yatırım Yapılacak USD ($)"
                    : `Satılacak Lot Miktarı (${selectedStock?.symbol})`
                }
                className="flex-1 bg-white text-slate-800 text-xs border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-purple-600 font-mono"
              />
              <button
                onClick={handleStockTrade}
                className="bg-white hover:bg-purple-50 hover:text-purple-600 font-semibold text-xs text-slate-700 px-5 rounded border border-slate-250 hover:border-purple-600 transition-all cursor-pointer"
              >
                Onayla
              </button>
            </div>

            {tradeStatus && (
              <p className="text-[11px] font-medium text-center text-amber-800 bg-amber-50 py-1.5 rounded border border-amber-200">
                {tradeStatus}
              </p>
            )}
          </div>

          {/* List showing available corporate papers */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-left">
              Borsa Endeks Kağıtları
            </span>
            <div className="flex flex-col gap-2">
              {stocks.map((stock) => {
                const isSelected = selectedStock?.id === stock.id;
                const valueOfOwned = stock.amountOwned * stock.currentPrice;
                return (
                  <div
                    key={stock.id}
                    onClick={() => { setSelectedStock(stock); setTradeInput("100"); }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-purple-50/50 border-purple-300 shadow-xs"
                        : "bg-white border border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded flex items-center justify-center border border-slate-200" style={{ backgroundColor: stock.color + "12" }}>
                        <span className="font-mono font-bold text-xs" style={{ color: stock.color }}>
                          {stock.symbol}
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-display font-bold text-xs text-slate-800 flex items-center gap-1.5 justify-start">
                          {stock.name}
                          {stock.amountOwned > 0 && (
                            <span className="bg-purple-100 text-purple-800 text-[8px] px-1.5 py-0.2 rounded font-mono font-bold">
                              Portföy: {stock.amountOwned.toFixed(3)} Lot
                            </span>
                          )}
                        </h4>
                        <p className="text-[9px] text-slate-500 font-mono leading-tight mt-0.5">
                          Lot Fiyatı: {formatCurrency(stock.currentPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      {renderSparkline(stock.priceHistory, stock.color)}
                      <div>
                        <span className="text-xs font-mono font-bold block text-slate-900">
                          {stock.amountOwned > 0 ? formatCurrency(valueOfOwned) : "$0.00"}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          stock.changePct >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}>
                          {stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: GAYRİMENKUL PANEL */}
      {subTab === "gayrimenkul" && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute right-4 top-4 text-blue-500/10 pointer-events-none">
              <Building size={80} />
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest leading-none text-left">
              Toplam Gayrimenkul Portföyü
            </p>
            <h2 className="text-2xl font-black font-mono text-blue-600 tracking-tight mt-1 text-left">
              {formatCurrency(totalRealEstateVal)}
            </h2>
            <div className="flex justify-between items-center mt-2.5">
              <span className="text-[10px] text-emerald-600 font-mono font-bold">
                Saatlik Kira Akışı: +{formatCurrency(realEstates.reduce((acc, r) => acc + (r.amountOwned * r.rentIncomePerHour), 0))}/sa
              </span>
              <span className="text-[9.5px] text-slate-400 font-mono">Tapulu Mülk: {realEstates.reduce((acc, r) => acc + r.amountOwned, 0)} Adet</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1 text-left">
              Yatırımlık Emlak & Ticari Yapılar
            </span>

            <div className="flex flex-col gap-3">
              {realEstates.map((estate) => {
                const canBuy = balance >= estate.currentPrice;
                const totalIncome = estate.amountOwned * estate.rentIncomePerHour;

                return (
                  <div
                    key={estate.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto text-left">
                      <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Building size={20} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-display font-bold text-xs text-slate-800">
                          {estate.name}
                        </h4>
                        <p className="text-[9.5px] text-emerald-600 font-mono mt-0.5 font-semibold">
                          Saatlik Kira: +{formatCurrency(estate.rentIncomePerHour)}/sa
                        </p>
                        <p className="text-[9px] text-slate-500 mt-0.5">
                          Fiyat: <span className="font-mono text-slate-750 font-bold">{formatCurrency(estate.currentPrice)}</span>
                        </p>
                        {estate.amountOwned > 0 && (
                          <div className="flex gap-2 mt-1">
                            <span className="bg-emerald-50 text-emerald-700 text-[8.5px] px-2 py-0.5 rounded font-bold font-mono border border-emerald-100">
                              Sahip Olunan: {estate.amountOwned} adet
                            </span>
                            <span className="bg-blue-50 text-blue-700 text-[8.5px] px-2 py-0.5 rounded font-bold font-mono border border-blue-100">
                              Toplam Gelir: {formatCurrency(totalIncome)}/sa
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 shrink-0">
                      {estate.amountOwned > 0 && (
                        <button
                          onClick={() => onSellRealEstate(estate.id)}
                          className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 text-[10.5px] font-semibold transition cursor-pointer whitespace-nowrap"
                        >
                          Geri Satılsın (%10 Kom.)
                        </button>
                      )}
                      <button
                        onClick={() => onBuyRealEstate(estate.id)}
                        disabled={!canBuy}
                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10.5px] font-bold border transition ${
                          canBuy
                            ? "bg-emerald-600 border-emerald-500 text-white cursor-pointer hover:bg-emerald-500"
                            : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Mülk Satın Al
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: KRİPTO PARA PANEL */}
      {subTab === "kripto" && (
        <div className="flex flex-col gap-4">
          {/* Top Display 1: Light blue card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute right-4 top-4 text-blue-500/10 pointer-events-none">
              <Wallet size={80} />
            </div>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest leading-none text-left">
              Toplam Kripto Para Değeri
            </p>
            <h2 className="text-2xl font-black font-mono text-blue-600 tracking-tight mt-1 text-left">
              {formatCurrency(totalCryptoVal)}
            </h2>
            <div className="flex items-center gap-1.5 mt-2.5">
              {avgCryptoChange >= 0 ? (
                <span className="text-emerald-600 text-[10px] font-mono font-bold flex items-center">
                  ▲ {avgCryptoChange.toFixed(2)} % (Piyasa)
                </span>
              ) : (
                <span className="text-red-500 text-[10px] font-mono font-bold flex items-center">
                  ▼ {avgCryptoChange.toFixed(2)} % (Piyasa)
                </span>
              )}
            </div>
          </div>

          {/* Interactive Crypto Trading Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Seçili Kripto:</span>
              {selectedCrypto && (
                <span className="text-slate-800 font-bold flex items-center gap-1">
                  <span style={{ color: selectedCrypto.color }}>■</span> {selectedCrypto.name} ({selectedCrypto.symbol})
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTradeAction("buy")}
                className={`flex-1 py-1.5 text-xs rounded font-sans font-bold transition cursor-pointer ${
                  tradeAction === "buy"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50/55"
                }`}
              >
                Satın Al
              </button>
              <button
                onClick={() => setTradeAction("sell")}
                className={`flex-1 py-1.5 text-xs rounded font-sans font-bold transition cursor-pointer ${
                  tradeAction === "sell"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50/55"
                }`}
              >
                Varlık Satışı
              </button>
            </div>

            <div className="flex gap-2 mt-1">
              <input
                type="number"
                value={tradeInput}
                onChange={(e) => setTradeInput(e.target.value)}
                placeholder={
                  tradeAction === "buy"
                    ? "Yatırmak istediğiniz USD ($)"
                    : `Satılacak Kripto Miktarı (${selectedCrypto?.symbol})`
                }
                className="flex-1 bg-white text-slate-800 text-xs border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-600 font-mono"
              />
              <button
                onClick={handleCryptoTrade}
                className="bg-white hover:bg-blue-50 border border-slate-250 hover:text-blue-600 text-slate-700 font-semibold text-xs px-5 rounded transition-all cursor-pointer"
              >
                Emir Gönder
              </button>
            </div>

            {tradeStatus && (
              <p className="text-[11px] font-medium text-center text-amber-800 bg-amber-50 py-1.5 rounded border border-amber-200">
                {tradeStatus}
              </p>
            )}
          </div>

          {/* Crypto Asset List */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-left">
              Kripto Varlıklar Listesi
            </label>

            <div className="flex flex-col gap-2">
              {cryptoAssets.map((crypto) => {
                const isSelected = selectedCrypto?.id === crypto.id;
                const valueOfOwned = crypto.amountOwned * crypto.currentPrice;
                return (
                  <div
                    key={crypto.id}
                    onClick={() => { setSelectedCrypto(crypto); setTradeInput("100"); }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-300 shadow-xs"
                        : "bg-white border border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded flex items-center justify-center border border-slate-200" style={{ backgroundColor: crypto.color + "12" }}>
                        <span className="font-mono font-bold text-xs" style={{ color: crypto.color }}>
                          {crypto.symbol}
                        </span>
                      </div>
                      <div className="text-left">
                        <h4 className="font-display font-bold text-xs text-slate-800 flex items-center gap-1.5 justify-start">
                          {crypto.name}
                          {crypto.amountOwned > 0 && (
                            <span className="bg-emerald-50 text-emerald-700 text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-100">
                              Portföy: {crypto.amountOwned.toFixed(4)} {crypto.symbol}
                            </span>
                          )}
                        </h4>
                        <p className="text-[9px] text-slate-500 font-mono leading-tight mt-0.5">
                          Fiyat: {formatCurrency(crypto.currentPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      {renderSparkline(crypto.priceHistory, crypto.color)}
                      <div>
                        <span className="text-xs font-mono font-bold block text-slate-900">
                          {crypto.amountOwned > 0 ? formatCurrency(valueOfOwned) : "$0.00"}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          crypto.changePct >= 0 ? "text-emerald-600" : "text-red-500"
                        }`}>
                          {crypto.changePct >= 0 ? "+" : ""}{crypto.changePct.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
