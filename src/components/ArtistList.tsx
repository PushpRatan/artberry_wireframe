import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function ArtistList() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { category?: string } | null;
  const category = state?.category;

  const baseArtists = [
    {
      name: "Sarah Chen",
      title: "Painter",
      rating: 4.9,
      reviews: 234,
      price: 25,
      avatar: "https://i.pravatar.cc/80?img=68",
    },
    {
      name: "Marcus Rivera",
      title: "Musician",
      rating: 4.8,
      reviews: 166,
      price: 35,
      avatar: "https://i.pravatar.cc/80?img=15",
    },
    {
      name: "Luna Park",
      title: "Photography",
      rating: 4.7,
      reviews: 98,
      price: 40,
      avatar: "https://i.pravatar.cc/80?img=47",
    },
  ];

  const artists = Array.from({ length: 12 }).map((_, i) => baseArtists[i % 3]);

  const handleTabChange = (
    tab: "explore" | "dashboard" | "messages" | "profile"
  ) => {
    const routeMap = {
      explore: "/explore",
      dashboard: "/dashboard",
      messages: "/messages",
      profile: "/profile",
    } as const;
    navigate(routeMap[tab]);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <button
          onClick={() => navigate("/explore")}
          className="flex items-center text-[#2B2B2B] hover:text-[#6A1B9A] text-sm"
        >
          ← Back
        </button>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#2B2B2B]">
            {category ? `${category} Artists` : "All Artists"}
          </h3>
        </div>

        <div className="space-y-3">
          {artists.map((a, idx) => (
            <button
              key={`${a.name}-${idx}`}
              onClick={() =>
                navigate(
                  `/artist/${a.name.toLowerCase().replace(/\s+/g, "-")}`,
                  {
                    state: a,
                  }
                )
              }
              className="text-left border border-gray-200 rounded-2xl p-4 bg-[#FFF6F6] w-full!"
            >
              <div className="flex items-start gap-3">
                <img
                  src={a.avatar}
                  alt={a.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="text-[#2B2B2B] font-semibold text-base">
                      {a.name}
                    </div>
                    <button className="text-[#6A1B9A]">♡</button>
                  </div>
                  <div className="text-sm text-[#2B2B2B] mb-2">{a.title}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-[#2B2B2B]">
                      <span className="text-[#ffc107]">⭐</span>
                      <span>{a.rating}</span>
                      <span className="text-[#2B2B2B] opacity-70">
                        ({a.reviews})
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                        idx % 2 === 0
                          ? "bg-[#6A1B9A1a] text-[#6A1B9A] border-[#6A1B9A1a]"
                          : "bg-[#2ECC711a] text-[#2ECC71] border-[#2ECC711a]"
                      }`}
                    >
                      From ${a.price}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <BottomNav active="explore" onChange={handleTabChange} />
      </div>
    </div>
  );
}
