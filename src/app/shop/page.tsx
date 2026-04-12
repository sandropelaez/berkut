"use client";

import { useStore } from "@/lib/store";
import { GemIcon } from "@/components/Icons";
import BottomTabs from "@/components/BottomTabs";

const SHOP_ITEMS = [
  {
    id: "streak_freeze",
    name: "Streak Freeze",
    desc: "Protect your streak for one day",
    cost: 200,
    icon: "🧊",
  },
  {
    id: "heart_refill",
    name: "Heart Refill",
    desc: "Refill all hearts instantly",
    cost: 100,
    icon: "❤️",
  },
  {
    id: "bonus_xp",
    name: "Double XP (1 lesson)",
    desc: "Earn double XP on your next lesson",
    cost: 150,
    icon: "⚡",
  },
];

export default function ShopPage() {
  const store = useStore();

  const handlePurchase = (item: (typeof SHOP_ITEMS)[0]) => {
    if (!store.spendGems(item.cost)) return;
    if (item.id === "streak_freeze") {
      // Add streak freeze — store already deducted gems
    }
  };

  return (
    <div className="pb-24 min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold text-berkut-sky font-display">Shop</h1>
        <span className="flex items-center gap-1 font-semibold text-berkut-sky">
          <GemIcon size={18} /> {store.gems}
        </span>
      </header>

      <div className="px-5 py-6 space-y-3">
        {SHOP_ITEMS.map((item) => {
          const canAfford = store.gems >= item.cost;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
            >
              <div className="text-4xl">{item.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-400 text-[13px]">{item.desc}</p>
              </div>
              <button
                onClick={() => handlePurchase(item)}
                disabled={!canAfford}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${
                  canAfford
                    ? "bg-berkut-sky hover:bg-berkut-sky-dark active:scale-95"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <GemIcon size={14} /> {item.cost}
              </button>
            </div>
          );
        })}
      </div>

      <BottomTabs />
    </div>
  );
}
