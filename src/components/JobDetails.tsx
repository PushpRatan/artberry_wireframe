import { useLocation, useNavigate, useParams } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useState } from "react";
import { useUserContext } from "../contexts/UserContext";

interface Job {
  title: string;
  category: string;
  budget: number;
  proposals: number;
  client: string;
  avatar: string;
  description?: string;
  location?: string;
}

export default function JobDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const { accountType } = useUserContext();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [bidAmount, setApplyAmount] = useState<string>("");
  const [bidNotes, setApplyNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const job = (location.state as Job) || {
    title: (slug || "").replace(/-/g, " "),
    category: "General",
    budget: 0,
    proposals: 0,
    client: "Client",
    avatar: "https://i.pravatar.cc/80?img=12",
    description:
      "No description provided. This is a placeholder for the job details.",
    location: "Unknown",
  };

  const bidders = [
    {
      name: "Sarah Chen",
      title: "Painter",
      rating: 4.9,
      avatar: "https://i.pravatar.cc/80?img=68",
      bid: 820,
    },
    {
      name: "Marcus Rivera",
      title: "Musician",
      rating: 4.8,
      avatar: "https://i.pravatar.cc/80?img=15",
      bid: 1500,
    },
    {
      name: "Luna Park",
      title: "Photographer",
      rating: 4.7,
      avatar: "https://i.pravatar.cc/80?img=47",
      bid: 1100,
    },
  ];

  const isPatronView =
    accountType === "patron" || (location.state as any)?.fromUnassigned;
  const handleOpenApply = () => setIsApplyOpen(true);
  const handleCloseApply = () => {
    setIsApplyOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmitApply = async () => {
    if (!bidAmount) return;
    setIsSubmitting(true);
    // Simulate submit
    setTimeout(() => {
      setIsSubmitting(false);
      setIsApplyOpen(false);
      // Reset fields (optional)
      setApplyAmount("");
      setApplyNotes("");
    }, 600);
  };

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
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Back
        </button>

        <div className="flex items-start gap-3">
          <img
            src={job.avatar}
            alt={job.client}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                <div className="text-sm text-gray-600">{job.client}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">{job.category}</div>
                <div className="mt-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium">
                  Budget ${job.budget}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-2">
          <div className="text-gray-900 font-semibold">Job Description</div>
          <p className="text-sm text-gray-700">
            {job.description ||
              "Looking for a skilled professional to complete this job. Please review details and submit your bid."}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-700 pt-1">
            <span>📍 {job.location || "Remote / On-site"}</span>
            <span>•</span>
            <span>💬 {job.proposals} proposals</span>
          </div>
          {!isPatronView && (
            <div className="pt-2">
              <button
                onClick={handleOpenApply}
                className="w-full bg-[#EF473B] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
          </div>
          {bidders.map((a) => (
            <div
              key={a.name}
              onClick={() =>
                navigate(
                  `/artist/${a.name.toLowerCase().replace(/\s+/g, "-")}`,
                  {
                    state: {
                      fromJobDetails: true,
                      bid: a.bid,
                      jobTitle: job.title,
                      jobDescription: job.description,
                    },
                  }
                )
              }
              className="border border-gray-200 rounded-2xl p-4 bg-white"
            >
              <div className="flex items-start gap-3">
                <img
                  src={a.avatar}
                  alt={a.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <button className="text-left text-gray-900 font-semibold text-base">
                        {a.name}
                      </button>
                      <div className="text-sm text-gray-600">{a.title}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <span className="text-yellow-500">⭐</span>
                        <span>{a.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-700">Charge</div>
                      <div className="text-base font-semibold text-[#EF473B]">
                        ${a.bid}
                      </div>
                      {isPatronView && (
                        <button
                          onClick={() =>
                            navigate(`/payment`, {
                              state: {
                                artist: {
                                  name: a.name,
                                  avatar: a.avatar,
                                  slug: a.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "-"),
                                },
                                package: {
                                  name: job.title,
                                  price: a.bid,
                                  description: job.description || "",
                                  deliverables: ["Service assignment"],
                                },
                              },
                            })
                          }
                          className="mt-2 px-3 py-1 rounded-lg bg-[#EF473B] text-white text-sm font-medium hover:bg-blue-700"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <BottomNav active="explore" onChange={handleTabChange} />
      </div>

      {isApplyOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="text-base font-semibold text-gray-900">
                State your charge
              </div>
              <button
                onClick={handleCloseApply}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your charges ($)
                </label>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={bidAmount}
                  onChange={(e) => setApplyAmount(e.target.value)}
                  placeholder="e.g., 1200"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={bidNotes}
                  onChange={(e) => setApplyNotes(e.target.value)}
                  placeholder="Briefly describe your approach, timeline, or inclusions"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 space-y-3">
              <button
                disabled={!bidAmount || isSubmitting}
                onClick={handleSubmitApply}
                className="w-full bg-[#EF473B] text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? "Applyinging..." : "Apply"}
              </button>
              <button
                onClick={handleCloseApply}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
