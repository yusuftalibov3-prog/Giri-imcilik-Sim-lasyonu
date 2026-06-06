import React, { useState, useEffect } from "react";
import { TrendingUp, Building, Coins, Grid, User, Zap, Sparkles, Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GameState, Business, CryptoAsset, LuxuryAsset, StockAsset, RealEstateAsset, NewsEvent, DailyGoal } from "./types";
import { INITIAL_BUSINESSES, INITIAL_CRYPTOS, INITIAL_LUXURY_ASSETS, INITIAL_STOCKS, INITIAL_REAL_ESTATE, INITIAL_DAILY_GOALS } from "./data";
import { YatirimMasasi } from "./components/YatirimMasasi";
import { IsletmeYonetimi } from "./components/IsletmeYonetimi";
import { YatirimPortfoyu } from "./components/YatirimPortfoyu";
import { VarlikGalerisi } from "./components/VarlikGalerisi";
import { CeoProfili } from "./components/CeoProfili";
import { AdBar } from "./components/AdBar";

const LOCAL_STORAGE_KEY = "ceo_karar_masasi_v2";

export default function App() {
  const [activeTab, setActiveTab] = useState<"yatirim" | "isletme" | "kazanclar" | "esyalar" | "profil">("kazanclar"); // Default to the clicker area "Kazançlar" so they can earn right away!
  const [balance, setBalance] = useState<number>(0); // initial balance is now 0
  const [clickLevel, setClickLevel] = useState<number>(1);
  const [clickIncome, setClickIncome] = useState<number>(16.22); // initial clicking rewards
  const [clickUpgradeCost, setClickUpgradeCost] = useState<number>(250);
  
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTOS);
  const [stocks, setStocks] = useState<StockAsset[]>(INITIAL_STOCKS);
  const [realEstates, setRealEstates] = useState<RealEstateAsset[]>(INITIAL_REAL_ESTATE);
  const [luxuryAssets, setLuxuryAssets] = useState<LuxuryAsset[]>(INITIAL_LUXURY_ASSETS);
  
  const [adBoostTimeLeft, setAdBoostTimeLeft] = useState<number>(0);
  const [adBoostCooldownTimeLeft, setAdBoostCooldownTimeLeft] = useState<number>(0);
  const [adsDisabled, setAdsDisabled] = useState<boolean>(false);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(INITIAL_DAILY_GOALS);
  const [currentNews, setCurrentNews] = useState<NewsEvent | null>(null);

  // Load state from local storage on component mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.balance !== undefined) setBalance(parsed.balance);
        if (parsed.clickLevel !== undefined) setClickLevel(parsed.clickLevel);
        if (parsed.clickIncome !== undefined) {
          setClickIncome(parsed.clickIncome === 6.72 ? 16.22 : parsed.clickIncome);
        }
        if (parsed.clickUpgradeCost !== undefined) setClickUpgradeCost(parsed.clickUpgradeCost);
        if (parsed.businesses !== undefined) setBusinesses(parsed.businesses);
        if (parsed.cryptoAssets !== undefined) setCryptoAssets(parsed.cryptoAssets);
        if (parsed.stocks !== undefined) setStocks(parsed.stocks);
        if (parsed.realEstates !== undefined) setRealEstates(parsed.realEstates);
        if (parsed.luxuryAssets !== undefined) setLuxuryAssets(parsed.luxuryAssets);
        if (parsed.adBoostTimeLeft !== undefined) setAdBoostTimeLeft(parsed.adBoostTimeLeft);
        if (parsed.adBoostCooldownTimeLeft !== undefined) setAdBoostCooldownTimeLeft(parsed.adBoostCooldownTimeLeft);
        if (parsed.adsDisabled !== undefined) setAdsDisabled(parsed.adsDisabled);
        if (parsed.totalClicks !== undefined) setTotalClicks(parsed.totalClicks);
        if (parsed.dailyGoals !== undefined) setDailyGoals(parsed.dailyGoals);
        if (parsed.currentNews !== undefined) setCurrentNews(parsed.currentNews);
      } catch (e) {
        console.error("Local storage restoration failed:", e);
      }
    }
  }, []);

  // Sync state to local storage on changes
  useEffect(() => {
    const stateObj = {
      balance,
      clickLevel,
      clickIncome,
      clickUpgradeCost,
      businesses,
      cryptoAssets,
      stocks,
      realEstates,
      luxuryAssets,
      adBoostTimeLeft,
      adBoostCooldownTimeLeft,
      adsDisabled,
      totalClicks,
      dailyGoals,
      currentNews,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateObj));
  }, [balance, clickLevel, clickIncome, clickUpgradeCost, businesses, cryptoAssets, stocks, realEstates, luxuryAssets, adBoostTimeLeft, adBoostCooldownTimeLeft, adsDisabled, totalClicks, dailyGoals, currentNews]);

  // Calculate overall prestige multiplier from luxury items owned
  const getPrestigeMultiplier = () => {
    const baseMult = 1.0;
    const boostSum = luxuryAssets
      .filter((a) => a.purchased)
      .reduce((acc, a) => acc + a.boostMultiplier, 0);
    return baseMult + boostSum;
  };

  // Passive Income Calculation combining business lines + real estate rent yields
  const getPassiveHourlyIncome = () => {
    const rawHourly = businesses
      .filter((b) => b.level > 0)
      .reduce((acc, b) => acc + (b.level * b.hourlyIncomePerLevel), 0);
      
    const rentHourly = realEstates
      .reduce((acc, r) => acc + (r.amountOwned * r.rentIncomePerHour), 0);

    return (rawHourly + rentHourly) * getPrestigeMultiplier();
  };

  // Idle loop tick running once every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      const hourly = getPassiveHourlyIncome();
      if (hourly > 0) {
        const perSecond = hourly / 3600;
        setBalance((prev) => prev + perSecond);
      }
      setAdBoostTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setAdBoostCooldownTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [businesses, realEstates, luxuryAssets]);

  // Fluctuations loop every 15 seconds
  useEffect(() => {
    const marketInterval = setInterval(() => {
      // 1. Cryptocurrencies
      setCryptoAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const pctChange = (Math.random() * 7 - 3.5);
          const factor = 1 + pctChange / 100;
          const nextPrice = Math.max(0.01, asset.currentPrice * factor);
          const nextHistory = [...asset.priceHistory.slice(-7), nextPrice];
          return {
            ...asset,
            currentPrice: nextPrice,
            priceHistory: nextHistory,
            changePct: pctChange,
          };
        })
      );

      // 2. Stocks
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const pctChange = (Math.random() * 5 - 2.5);
          const factor = 1 + pctChange / 100;
          const nextPrice = Math.max(1, stock.currentPrice * factor);
          const nextHistory = [...stock.priceHistory.slice(-7), nextPrice];
          return {
            ...stock,
            currentPrice: nextPrice,
            priceHistory: nextHistory,
            changePct: pctChange,
          };
        })
      );

      // 3. Real Estates (property values rise slowly!)
      setRealEstates((prevEstates) =>
        prevEstates.map((estate) => {
          const pctChange = (Math.random() * 1.2 - 0.3);
          const factor = 1 + pctChange / 100;
          const nextPrice = Math.max(10000, estate.currentPrice * factor);
          const nextHistory = [...estate.priceHistory.slice(-7), nextPrice];
          return {
            ...estate,
            currentPrice: nextPrice,
            priceHistory: nextHistory,
            changePct: pctChange,
          };
        })
      );
    }, 15000);

    return () => clearInterval(marketInterval);
  }, []);

  // Combined wealth helper
  const getCombinedWealth = () => {
    const cryptoValuation = cryptoAssets.reduce((acc, c) => acc + c.amountOwned * c.currentPrice, 0);
    const stockValuation = stocks.reduce((acc, s) => acc + s.amountOwned * s.currentPrice, 0);
    const realEstateValuation = realEstates.reduce((acc, r) => acc + r.amountOwned * r.currentPrice, 0);
    
    const businessValuation = businesses
      .filter((b) => b.level > 0)
      .reduce((acc, b) => acc + b.currentCost, 0);

    const ownedHangarVal = luxuryAssets.filter((a) => a.category === "hangar" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
    const ownedGarajVal = luxuryAssets.filter((a) => a.category === "garaj" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
    const ownedLimanVal = luxuryAssets.filter((a) => a.category === "liman" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
    const ownedTabloVal = luxuryAssets.filter((a) => a.category === "tablo" && a.purchased).reduce((acc, a) => acc + a.cost, 0);
    const ownedKonakVal = luxuryAssets.filter((a) => a.category === "konak" && a.purchased).reduce((acc, a) => acc + a.cost, 0);

    return balance + cryptoValuation + stockValuation + realEstateValuation + businessValuation +
      ownedHangarVal + ownedGarajVal + ownedLimanVal + ownedTabloVal + ownedKonakVal;
  };

  // Check daily goals completion status dynamically on state changes
  useEffect(() => {
    setDailyGoals((prevGoals) => {
      let changed = false;
      const nextGoals = prevGoals.map((goal) => {
        if (goal.completed) return goal;

        let isCompleted = false;
        if (goal.targetType === "clicks") {
          isCompleted = totalClicks >= goal.targetValue;
        } else if (goal.targetType === "businesses") {
          const ownedBusinessesCount = businesses.filter((b) => b.level > 0).length;
          isCompleted = ownedBusinessesCount >= goal.targetValue;
        } else if (goal.targetType === "crypto") {
          const cryptoValue = cryptoAssets.reduce((acc, c) => acc + c.amountOwned * c.currentPrice, 0);
          isCompleted = cryptoValue >= goal.targetValue;
        } else if (goal.targetType === "estate") {
          const estateCount = realEstates.reduce((acc, r) => acc + r.amountOwned, 0);
          isCompleted = estateCount >= goal.targetValue;
        }

        if (isCompleted) {
          changed = true;
          return { ...goal, completed: true };
        }
        return goal;
      });

      return changed ? nextGoals : prevGoals;
    });
  }, [totalClicks, businesses, cryptoAssets, realEstates]);

  const NEWS_TEMPLATES = [
    {
      symbol: "TRB",
      type: "crypto" as const,
      positiveTemplates: [
        "Tellor (TRB) akıllı sözleşme güvenliğinde devrim yaptı! Kurumsal benimseme oranı hızlı yükseliyor.",
        "Önde gelen küresel DeFi platformu TRB havuzlarını genişlettiğini açıkladı; alıcılar devrede!"
      ],
      negativeTemplates: [
        "Tellor balinalarında yüklü TRB satışı! Borsalara büyük transfer panik yarattı.",
        "Geliştirici ekibin paylaştığı yol haritası yetersiz bulundu, TRB'de düzeltme satışı gerçekleşti."
      ]
    },
    {
      symbol: "BTC",
      type: "crypto" as const,
      positiveTemplates: [
        "Dev yatırım bankaları Bitcoin borsa fonlarına (ETF) rekor sermaye aktardı, BTC uçuşta!",
        "Küresel piyasalarda likidite genişlemesi beklentisi Bitcoin arz krizini tetikledi!"
      ],
      negativeTemplates: [
        "Dünyanın en büyük fon yöneticisi beklenmedik şekilde milyar dolarlık BTC likidite etti!",
        "Önemli bir regülatör kurum, kripto madencilere ağır çevre vergileri getireceğini bildirdi."
      ]
    },
    {
      symbol: "ETH",
      type: "crypto" as const,
      positiveTemplates: [
        "Ethereum Sharding testleri başarıyla sonuçlandı! Scalability limitleri 10 katına katlanıyor.",
        "Yapay zeka akıllı kontratları ekosistemde dev Ethereum kilitlenmesine yol açtı!"
      ],
      negativeTemplates: [
        "Büyük bir katman-2 köprüsünde kod açığı saptandı; ETH varlıkları geçici olarak sarsıldı.",
        "Ethereum kurucu ortağının vakıf cüzdanından satış yapması piyasayı kilitledi."
      ]
    },
    {
      symbol: "CEOT",
      type: "crypto" as const,
      positiveTemplates: [
        "CEO Token (CEOT) yeni lüks otomobil showroomlarında ödeme aracı olarak entegre edildi!",
        "Global Holding liderleri CEOT entegreli hisse teşvik planları duyurdu!"
      ],
      negativeTemplates: [
        "CEO Token likidite sağlayıcısında geçici akıllı kontrat pürüzü çıktı, işlem hacmi düştü.",
        "Sosyal medyada yayılan asılsız spekülasyonlar CEOT yatırımcısında kar realizasyonunu tetikledi."
      ]
    },
    {
      symbol: "AAPL",
      type: "stock" as const,
      positiveTemplates: [
        "Apple, tamamen yapay zeka tabanlı otonom ev asistanı projesini duyurdu, AAPL hisseleri coştu!",
        "Yeni nesil işlemcilerin mobil performans şampiyonu olması Apple hisselerini uçurdu!"
      ],
      negativeTemplates: [
        "Global tedarik zincirindeki çip krizi son çeyrek iPhone sevkiyatlarını erteledi.",
        "Yazılım tekelciliği suçlamasıyla Apple aleyhine yeni AB soruşturması açıldı."
      ]
    },
    {
      symbol: "TSLA",
      type: "stock" as const,
      positiveTemplates: [
        "Tesla, gigafactory üretim verimliliğinde yeni dünya rekorunu tescilledi, TSLA ralli yapıyor!",
        "Elon Musk, insansı robot Optimus'un ticari satışlarına bu yıl başlanacağını doğruladı!"
      ],
      negativeTemplates: [
        "Avrupa otoyollarında bir Tesla modelinin otopilot hatası yaptığı haberi hisseleri sarsı.",
        "Batarya maliyetlerindeki ani artış Tesla marj tahminlerini olumsuz yönde etkiledi."
      ]
    },
    {
      symbol: "NVDA",
      type: "stock" as const,
      positiveTemplates: [
        "NVIDIA Blackwell mimarili yapay zeka süper bilgisayar siparişlerinin dolduğunu açıkladı!",
        "Teknoloji devlerinden NVIDIA'ya milyarlarca dolarlık yeni nesil işlemci siparişi!"
      ],
      negativeTemplates: [
        "Yarı iletken sektörü ham madde ihracatına getirilen kota endişeleri hisseleri geriletti.",
        "NVIDIA rakiplerinin daha ucuz alternatif yapay zeka çipleri duyurması satışı getirdi."
      ]
    },
    {
      symbol: "THYAO",
      type: "stock" as const,
      positiveTemplates: [
        "Türk Hava Yolları, 120 adet son teknoloji uçak siparişi ile global pazar payını genişletiyor!",
        "Turizm sezonunun erken açılması THYAO doluluk oranlarını rekor dereceye ulaştırdı!"
      ],
      negativeTemplates: [
        "Küresel havacılık yakıtı maliyetlerindeki ani sıçrama, bilet fiyatı marjlarını daralttı.",
        "Avrupa çapındaki hava kontrolörleri grevi THYAO uçuşlarının bir kısmını iptal ettirdi."
      ]
    },
    {
      symbol: "GOLD",
      type: "stock" as const,
      positiveTemplates: [
        "Jeopolitik risklerin artması üzerine yatırımcılar panikle güvenli liman Altın Fonu'na koştu!",
        "Küresel enflasyonist baskılar Altın Fonu (GOLD) birim pay değerini tırmandırdı!"
      ],
      negativeTemplates: [
        "Gelişmiş ülkelerde faiz artışlarının süreceği sinyalleri GOLD fonunda kâr realizasyonu getirdi.",
        "Finansal nakit sıkışıklığı yaşayan dev bankalar altın rezervlerini piyasaya sundu."
      ]
    }
  ];

  const handleTriggerNewsEvent = () => {
    // Pick a random template set
    const category = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
    const isPositive = Math.random() > 0.45; // slightly higher chance of positive for fun gameplay
    const templateList = isPositive ? category.positiveTemplates : category.negativeTemplates;
    const headlineText = templateList[Math.floor(Math.random() * templateList.length)];
    
    // Random deviation between 5% and 20%
    const changePct = parseFloat((Math.random() * 15 + 5).toFixed(2));
    const factor = isPositive ? (1 + changePct / 100) : (1 - changePct / 100);

    if (category.type === "crypto") {
      setCryptoAssets((prevList) =>
        prevList.map((asset) => {
          if (asset.symbol === category.symbol) {
            const nextPrice = Math.max(0.01, asset.currentPrice * factor);
            const nextHistory = [...asset.priceHistory.slice(-7), nextPrice];
            return {
              ...asset,
              currentPrice: nextPrice,
              priceHistory: nextHistory,
              changePct: isPositive ? changePct : -changePct,
            };
          }
          return asset;
        })
      );
    } else {
      setStocks((prevList) =>
        prevList.map((stock) => {
          if (stock.symbol === category.symbol) {
            const nextPrice = Math.max(1, stock.currentPrice * factor);
            const nextHistory = [...stock.priceHistory.slice(-7), nextPrice];
            return {
              ...stock,
              currentPrice: nextPrice,
              priceHistory: nextHistory,
              changePct: isPositive ? changePct : -changePct,
            };
          }
          return stock;
        })
      );
    }

    const newEvent: NewsEvent = {
      id: "news_" + Date.now(),
      headline: headlineText,
      targetSymbol: category.symbol,
      assetType: category.type,
      changePct: changePct,
      isPositive: isPositive,
      timeLabel: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setCurrentNews(newEvent);
  };

  const handleClaimGoalReward = (goalId: string) => {
    setDailyGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId && goal.completed && !goal.claimed) {
          setBalance((prev) => prev + goal.reward);
          return { ...goal, claimed: true };
        }
        return goal;
      })
    );
  };

  // Action callbacks: clicking on the Desk area
  const handleTapClick = () => {
    setTotalClicks((prev) => prev + 1);
    const activeMultiplier = adBoostTimeLeft > 0 ? 2 : 1;
    setBalance((prev) => prev + (clickIncome * activeMultiplier));
  };

  // Level Up clicking yields
  const handleUpgradeClick = () => {
    if (balance >= clickUpgradeCost) {
      setBalance((prev) => prev - clickUpgradeCost);
      const nextLevel = clickLevel + 1;
      setClickLevel(nextLevel);
      setClickIncome((prev) => prev + 1.25 + (clickLevel * 0.45));
      setClickUpgradeCost((prev) => Math.floor(prev * 1.65));
    }
  };

  // Build / Establish passive business
  const handleEstablishBusiness = (businessId: string) => {
    setBusinesses((prevBizs) =>
      prevBizs.map((biz) => {
        if (biz.id === businessId) {
          if (biz.level === 0) {
            if (balance >= biz.baseCost) {
              setBalance((prev) => prev - biz.baseCost);
              return {
                ...biz,
                level: 1,
                currentCost: Math.floor(biz.baseCost * 1.5),
              };
            }
          } else {
            if (balance >= biz.currentCost) {
              setBalance((prev) => prev - biz.currentCost);
              return {
                ...biz,
                level: biz.level + 1,
                currentCost: Math.floor(biz.currentCost * 1.5),
              };
            }
          }
        }
        return biz;
      })
    );
  };

  // Premium corporate merger logic & efficiency level up
  const handleMergeBusinesses = (businessId: string) => {
    setBusinesses((prevBizs) =>
      prevBizs.map((biz) => {
        if (biz.id === businessId && biz.level > 0) {
          const mergerSynergyCost = biz.currentCost * 0.6;
          setBalance((prev) => prev - mergerSynergyCost);
          return {
            ...biz,
            level: biz.level + 2,
            hourlyIncomePerLevel: Math.floor(biz.hourlyIncomePerLevel * 1.25),
            currentCost: Math.floor(biz.currentCost * 2),
          };
        }
        return biz;
      })
    );
  };

  // Buying crypto assets
  const handleBuyCrypto = (cryptoId: string, usdAmount: number) => {
    if (balance >= usdAmount) {
      setBalance((prev) => prev - usdAmount);
      setCryptoAssets((prevAssets) =>
        prevAssets.map((asset) => {
          if (asset.id === cryptoId) {
            const coinFraction = usdAmount / asset.currentPrice;
            return {
              ...asset,
              amountOwned: asset.amountOwned + coinFraction,
            };
          }
          return asset;
        })
      );
    }
  };

  // Selling crypto assets
  const handleSellCrypto = (cryptoId: string, cryptoFraction: number) => {
    setCryptoAssets((prevAssets) =>
      prevAssets.map((asset) => {
        if (asset.id === cryptoId) {
          const sellFrac = Math.min(asset.amountOwned, cryptoFraction);
          const outputCash = sellFrac * asset.currentPrice;
          setBalance((prev) => prev + outputCash);
          return {
            ...asset,
            amountOwned: asset.amountOwned - sellFrac,
          };
        }
        return asset;
      })
    );
  };

  // Buying stock shares
  const handleBuyStock = (stockId: string, usdAmount: number) => {
    if (balance >= usdAmount) {
      setBalance((prev) => prev - usdAmount);
      setStocks((prevStocks) =>
        prevStocks.map((s) => {
          if (s.id === stockId) {
            const numShares = usdAmount / s.currentPrice;
            return {
              ...s,
              amountOwned: s.amountOwned + numShares,
            };
          }
          return s;
        })
      );
    }
  };

  // Selling stock shares
  const handleSellStock = (stockId: string, shareFraction: number) => {
    setStocks((prevStocks) =>
      prevStocks.map((s) => {
        if (s.id === stockId) {
          const sellFrac = Math.min(s.amountOwned, shareFraction);
          const refund = sellFrac * s.currentPrice;
          setBalance((prev) => prev + refund);
          return {
            ...s,
            amountOwned: s.amountOwned - sellFrac,
          };
        }
        return s;
      })
    );
  };

  // Buying commercial real estates
  const handleBuyRealEstate = (estateId: string) => {
    const estate = realEstates.find((r) => r.id === estateId);
    if (estate && balance >= estate.currentPrice) {
      setBalance((prev) => prev - estate.currentPrice);
      setRealEstates((prev) =>
        prev.map((r) => (r.id === estateId ? { ...r, amountOwned: r.amountOwned + 1 } : r))
      );
    }
  };

  // Selling commercial real estates (10% fee)
  const handleSellRealEstate = (estateId: string) => {
    const estate = realEstates.find((r) => r.id === estateId);
    if (estate && estate.amountOwned > 0) {
      const refund = estate.currentPrice * 0.9;
      setBalance((prev) => prev + refund);
      setRealEstates((prev) =>
        prev.map((r) => (r.id === estateId ? { ...r, amountOwned: r.amountOwned - 1 } : r))
      );
    }
  };

  // Buying luxury collectible assets
  const handlePurchaseAsset = (assetId: string) => {
    const asset = luxuryAssets.find((a) => a.id === assetId);
    if (asset && balance >= asset.cost && !asset.purchased) {
      setBalance((prev) => prev - asset.cost);
      setLuxuryAssets((prevAssets) =>
        prevAssets.map((a) => (a.id === assetId ? { ...a, purchased: true } : a))
      );
    }
  };

  // Trigger Markets Oscillate manually
  const handleTriggerMarketsTick = () => {
    setCryptoAssets((prev) =>
      prev.map((c) => {
        const change = Math.random() * 8 - 4;
        const nextPrice = Math.max(0.1, c.currentPrice * (1 + change / 100));
        return {
          ...c,
          currentPrice: nextPrice,
          changePct: change,
          priceHistory: [...c.priceHistory.slice(-7), nextPrice],
        };
      })
    );
    setStocks((prev) =>
      prev.map((s) => {
        const change = Math.random() * 6 - 3;
        const nextPrice = Math.max(1, s.currentPrice * (1 + change / 100));
        return {
          ...s,
          currentPrice: nextPrice,
          changePct: change,
          priceHistory: [...s.priceHistory.slice(-7), nextPrice],
        };
      })
    );
    setRealEstates((prev) =>
      prev.map((r) => {
        const change = Math.random() * 2 - 0.4;
        const nextPrice = Math.max(10000, r.currentPrice * (1 + change / 100));
        return {
          ...r,
          currentPrice: nextPrice,
          changePct: change,
          priceHistory: [...r.priceHistory.slice(-7), nextPrice],
        };
      })
    );
    // Trigger high impact news shock!
    handleTriggerNewsEvent();
  };

  // Reset Game state safely
  const handleResetGame = () => {
    if (confirm("Tüm holding servetinizi ve ilerlemenizi sıfırlayarak baştan başlamak istediğinize emin misiniz?")) {
      setBalance(0);
      setClickLevel(1);
      setClickIncome(16.22);
      setClickUpgradeCost(250);
      setBusinesses(INITIAL_BUSINESSES);
      setCryptoAssets(INITIAL_CRYPTOS);
      setStocks(INITIAL_STOCKS);
      setRealEstates(INITIAL_REAL_ESTATE);
      setLuxuryAssets(INITIAL_LUXURY_ASSETS);
      setAdBoostTimeLeft(0);
      setAdBoostCooldownTimeLeft(0);
      setAdsDisabled(false);
      setTotalClicks(0);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleAwardCash = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  const handleActivateBoost = (seconds: number) => {
    setAdBoostTimeLeft((prev) => prev + seconds);
  };

  const handleDisableAds = () => {
    if (balance >= 50000) {
      setBalance((prev) => prev - 50000);
      setAdsDisabled(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 font-sans relative antialiased selection:bg-blue-105 select-none pb-28">
      {/* Top Header Status Board */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-all duration-300 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-display font-extrabold text-sm tracking-tight shadow-xs">
              GS
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-900 tracking-tight leading-none text-sm">
                Girişimcilik Simülasyonu
              </h1>
              <span className="text-[9px] text-blue-600 font-mono tracking-widest font-semibold block mt-1">
                FİNANS & SÖKTÖR OYUNU
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator of passive flow */}
            <div className="text-right">
              <span className="text-[8px] text-slate-500 font-mono tracking-widest block uppercase">
                SAATLİK AKTİF GELİR
              </span>
              <span className="text-[11.5px] font-mono font-bold text-emerald-600">
                +{getPassiveHourlyIncome().toLocaleString("tr-TR", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}/sa
              </span>
            </div>

            {/* Quick Reset Hook button */}
            <button
              onClick={handleResetGame}
              className="p-1.5 rounded bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 transition-colors"
              title="Şirketi Sıfırla"
            >
              <RotateCcw size={11} />
            </button>
          </div>
        </div>
      </header>

      {/* Main interactive Tab Content container with fade slide animations */}
      <main className="flex-grow max-w-xl w-full mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "yatirim" && (
            <motion.div
              key="yatirim"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <YatirimPortfoyu
                balance={balance}
                cryptoAssets={cryptoAssets}
                stocks={stocks}
                realEstates={realEstates}
                onBuyCrypto={handleBuyCrypto}
                onSellCrypto={handleSellCrypto}
                onBuyStock={handleBuyStock}
                onSellStock={handleSellStock}
                onBuyRealEstate={handleBuyRealEstate}
                onSellRealEstate={handleSellRealEstate}
                onTickMarkets={handleTriggerMarketsTick}
                currentNews={currentNews}
                onTriggerNews={handleTriggerNewsEvent}
              />
            </motion.div>
          )}

          {activeTab === "isletme" && (
            <motion.div
              key="isletme"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <IsletmeYonetimi
                balance={balance}
                businesses={businesses}
                onEstablishBusiness={handleEstablishBusiness}
                onMergeBusinesses={handleMergeBusinesses}
                onWatchAdForPassiveGift={() => handleAwardCash(1000)}
              />
            </motion.div>
          )}

          {activeTab === "kazanclar" && (
            <motion.div
              key="kazanclar"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <YatirimMasasi
                balance={balance}
                clickLevel={clickLevel}
                clickIncome={clickIncome}
                clickUpgradeCost={clickUpgradeCost}
                onTapClick={handleTapClick}
                onUpgradeClick={handleUpgradeClick}
                onWatchBoostAd={() => {
                  setAdBoostTimeLeft(30);
                  setAdBoostCooldownTimeLeft(3600);
                }}
                adBoostTimeLeft={adBoostTimeLeft}
                adBoostCooldownTimeLeft={adBoostCooldownTimeLeft}
              />
            </motion.div>
          )}

          {activeTab === "esyalar" && (
            <motion.div
              key="esyalar"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <VarlikGalerisi
                balance={balance}
                luxuryAssets={luxuryAssets}
                onPurchaseAsset={handlePurchaseAsset}
              />
            </motion.div>
          )}

          {activeTab === "profil" && (
            <motion.div
              key="profil"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <CeoProfili
                balance={balance}
                businesses={businesses}
                cryptoAssets={cryptoAssets}
                stocks={stocks}
                realEstates={realEstates}
                luxuryAssets={luxuryAssets}
                adsDisabled={adsDisabled}
                onDisableAds={handleDisableAds}
                totalClicks={totalClicks}
                dailyGoals={dailyGoals}
                onClaimGoalReward={handleClaimGoalReward}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Bottom Sticky Advert Overlay and Navigation Slots */}
      <div className="fixed bottom-0 inset-x-0 z-50 flex flex-col bg-white">
        {/* Dynamic Ad slot */}
        <AdBar
          onAwardCash={handleAwardCash}
          onActivateBoost={handleActivateBoost}
          adsDisabled={adsDisabled}
          onDisableAds={handleDisableAds}
          balance={balance}
        />

        {/* Section 4A Bottom Tabbed Navigation with clean highlights */}
        <nav className="w-full bg-white border-t border-slate-200 pb-safe shadow-lg select-none">
          <div className="max-w-xl mx-auto px-1 py-1 flex items-center justify-around h-16 text-center">
            {/* Tab 1: Yatırım */}
            <button
              onClick={() => setActiveTab("yatirim")}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all text-center cursor-pointer ${
                activeTab === "yatirim"
                  ? "text-blue-600 font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div className="relative">
                <TrendingUp size={18} className={activeTab === "yatirim" ? "scale-110" : ""} />
                {adBoostTimeLeft > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-blue-500 w-2 h-2 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">Yatırım</span>
            </button>

            {/* Tab 2: İşletme */}
            <button
              onClick={() => setActiveTab("isletme")}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all text-center cursor-pointer ${
                activeTab === "isletme"
                  ? "text-blue-600 font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Building size={18} className={activeTab === "isletme" ? "scale-110" : ""} />
              <span className="text-[10px] mt-1 tracking-tight">İşletme</span>
            </button>

            {/* Tab 3: Kazançlar (Yatırım Masası) */}
            <button
              onClick={() => setActiveTab("kazanclar")}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all text-center cursor-pointer ${
                activeTab === "kazanclar"
                  ? "text-blue-600 font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div className="relative">
                <Coins size={18} className={activeTab === "kazanclar" ? "scale-110" : ""} />
                <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white font-bold font-sans text-[8px] px-1 rounded-full scale-90">1</span>
              </div>
              <span className="text-[10px] mt-1 tracking-tight">Kazançlar</span>
            </button>

            {/* Tab 4: Eşyalar (Varlık Galerisi) */}
            <button
              onClick={() => setActiveTab("esyalar")}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all text-center cursor-pointer ${
                activeTab === "esyalar"
                  ? "text-blue-600 font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid size={18} className={activeTab === "esyalar" ? "scale-110" : ""} />
              <span className="text-[10px] mt-1 tracking-tight">Eşyalar</span>
            </button>

            {/* Tab 5: Profil */}
            <button
              onClick={() => setActiveTab("profil")}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all text-center cursor-pointer ${
                activeTab === "profil"
                  ? "text-blue-600 font-bold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <User size={18} className={activeTab === "profil" ? "scale-110" : ""} />
              <span className="text-[10px] mt-1 tracking-tight">Profil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
