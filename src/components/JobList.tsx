import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function JobList() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { category?: string } | null;
  const category = state?.category;

  const baseJobs = [
    {
      title: "Mural for Cafe Wall",
      category: "Painter",
      budget: 800,
      proposals: 12,
      client: "Green Bean Cafe",
      avatar: "https://i.pravatar.cc/80?img=30",
    },
    {
      title: "Live Band for Wedding",
      category: "Musician",
      budget: 1500,
      proposals: 7,
      client: "Ava & Liam",
      avatar: "https://i.pravatar.cc/80?img=5",
    },
    {
      title: "Event Photography (Full Day)",
      category: "Photography",
      budget: 1200,
      proposals: 9,
      client: "TechConf 2025",
      avatar: "https://i.pravatar.cc/80?img=22",
    },
  ];

  const jobs = Array.from({ length: 12 }).map((_, i) => baseJobs[i % 3]);

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
          className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Back
        </button>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {category ? `${category} Jobs` : "All Jobs"}
          </h3>
        </div>

        <div className="space-y-3">
          {jobs.map((j, idx) => (
            <button
              key={`${j.title}-${idx}`}
              onClick={() =>
                navigate(`/job/${j.title.toLowerCase().replace(/\s+/g, "-")}`, {
                  state: {
                    ...j,
                    description:
                      "We need a talented professional for this assignment. Include samples in your bid.",
                    location: "San Francisco, CA",
                  },
                })
              }
              className="text-left border border-gray-200 rounded-2xl p-4 bg-white w-full!"
            >
              <div className="flex items-start gap-3">
                <img
                  src={j.avatar}
                  alt={j.client}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="text-gray-900 font-semibold text-base">
                      {j.title}
                    </div>
                    <span className="text-xs text-gray-500">{j.category}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{j.client}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <span className="text-gray-600">💬</span>
                      <span>{j.proposals} proposals</span>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium">
                      Budget ${j.budget}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/job/${j.title.toLowerCase().replace(/\s+/g, "-")}`,
                          {
                            state: { ...j },
                          }
                        );
                      }}
                      className="ml-auto px-3 py-1 rounded-lg bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32]"
                    >
                      Apply
                    </button>
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
