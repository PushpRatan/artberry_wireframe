import { useMemo, useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const defaultPlans: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    price: 299,
    description: "For power users and creators",
    features: ["Unlimited projects", "Priority support", "Advanced tools"],
  },
  {
    id: "elite",
    name: "Elite",
    price: 799,
    description: "Teams and professionals",
    features: ["Team workspaces", "Dedicated support", "Early features"],
  },
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const plans = useMemo(() => defaultPlans, []);
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Optional incoming artist context
  const navState = (location.state as any) || {};
  const artist = navState?.artist || {
    name: navState?.artistName || "John Doe",
    avatar: navState?.artistAvatar || "https://via.placeholder.com/80",
    slug: (navState?.artistSlug || "john-doe") as string,
  };

  useEffect(() => {
    // Focus the card for accessibility as index changes
    cardRef.current?.focus();
  }, [index]);

  const currentPlan = plans[index];

  const handleCheckout = () => {
    navigate("/payment", {
      state: {
        artist,
        package: {
          name: currentPlan.name,
          price: currentPlan.price,
          description: currentPlan.description,
          deliverables: currentPlan.features,
        },
        source: "subscription",
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-[#EF473B] to-[#FF7E5F] px-5 pt-5 pb-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="text-sm/none text-white/80 hover:text-white"
        >
          ← Back
        </button>
        <h1 className="mt-2 text-2xl font-bold">Choose a Subscription</h1>
        <p className="text-sm text-white/80">
          Pick the plan that suits you best
        </p>
      </div>

      {/* Centered card area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Card */}
            <div
              ref={cardRef}
              tabIndex={-1}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 mx-auto h-[22rem] sm:h-[24rem] flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-500">Plan</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentPlan.name}
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#EF473B]">
                  ₹{currentPlan.price}
                  <span className="ml-1 text-sm font-medium text-gray-500">
                    /mo
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {currentPlan.description}
              </div>
              <ul className="mt-4 space-y-2 overflow-y-auto pr-1">
                {currentPlan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-[#2ecc71] mt-0.5">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-[#EF473B] text-white font-medium hover:bg-[#d63d32]"
                >
                  Checkout {currentPlan.name}
                </button>
              </div>
            </div>

            {/* Floating prev/next */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <button
                onClick={() => setIndex((v) => Math.max(0, v - 1))}
                className="h-9 w-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 disabled:opacity-40"
                disabled={index === 0}
                aria-label="Previous plan"
              >
                ‹
              </button>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <button
                onClick={() =>
                  setIndex((v) => Math.min(plans.length - 1, v + 1))
                }
                className="h-9 w-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 disabled:opacity-40"
                disabled={index === plans.length - 1}
                aria-label="Next plan"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {plans.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full ${
                i === index ? "bg-[#EF473B]" : "bg-gray-300"
              }`}
              aria-label={`Go to plan ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
