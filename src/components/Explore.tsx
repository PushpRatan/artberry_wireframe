import { useState } from "react";
import BottomNav from "./BottomNav";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

interface ExploreProps {
  onNavigate: (view: "explore" | "dashboard" | "messages" | "profile") => void;
}

export default function Explore({ onNavigate: _ }: ExploreProps) {
  const navigate = useNavigate();
  const { accountType } = useUserContext();

  const handleNavigation = (
    view: "explore" | "dashboard" | "messages" | "profile"
  ) => {
    const routeMap = {
      explore: "/explore",
      dashboard: "/dashboard",
      messages: "/messages",
      profile: "/profile",
    };
    navigate(routeMap[view]);
  };
  const [activeTab, setActiveTab] = useState<
    "explore" | "dashboard" | "messages" | "profile"
  >("explore");

  const handleTabChange = (
    tab: "explore" | "dashboard" | "messages" | "profile"
  ) => {
    setActiveTab(tab);
    handleNavigation(tab);
  };

  const ExploreContent = () => (
    <div className="space-y-6">
      {/* Header with greeting and avatar */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, Team! <span className="align-middle">👋</span>
          </h1>
          <p className="text-gray-600">Find amazing artists</p>
        </div>
      </div>

      {/* Browse Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {accountType === "artist"
              ? "Browse Job Categories"
              : "Browse Categories"}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Painter", count: "2.3k services", icon: "🎨" },
            { label: "Photography", count: "1.8k services", icon: "📷" },
            { label: "Sketch Artist", count: "3.1k services", icon: "✏️" },
            { label: "Musician", count: "987 services", icon: "🎵" },
          ].map((c) => (
            <button
              key={c.label}
              onClick={() =>
                accountType === "artist"
                  ? navigate("/jobs", { state: { category: c.label } })
                  : navigate("/artists", { state: { category: c.label } })
              }
              className="text-left border border-gray-200 rounded-2xl p-4 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#EF473B1a] text-[#EF473B] flex items-center justify-center text-lg">
                  {c.icon}
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900">
                    {c.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {accountType === "artist"
                      ? c.count.replace("services", "jobs")
                      : c.count}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Artists / Jobs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {accountType === "artist" ? "Featured Jobs" : "Featured Artists"}
          </h3>
          <button
            onClick={() =>
              accountType === "artist"
                ? navigate("/jobs")
                : navigate("/artists")
            }
            className="px-4 py-2 rounded-xl bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32]"
          >
            View all
          </button>
        </div>

        {accountType === "artist"
          ? [
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
            ].map((j, idx) => (
              <button
                key={`${j.title}-${idx}`}
                onClick={() =>
                  navigate(
                    `/job/${j.title.toLowerCase().replace(/\s+/g, "-")}`,
                    {
                      state: {
                        ...j,
                        description:
                          "We need a talented professional for this assignment. Include samples in your bid.",
                        location: "San Francisco, CA",
                      },
                    }
                  )
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
                      <span className="text-xs text-gray-500">
                        {j.category}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{j.client}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <span className="text-gray-600">💬</span>
                        <span>{j.proposals} proposals</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium">
                        ${j.budget}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/job/${j.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`,
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
            ))
          : [
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
            ].map((a) => (
              <button
                key={a.name}
                onClick={() =>
                  navigate(
                    `/artist/${a.name.toLowerCase().replace(/\s+/g, "-")}`,
                    {
                      state: a,
                    }
                  )
                }
                className="text-left border border-gray-200 rounded-2xl p-4 bg-white w-full!"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={a.avatar}
                    alt={a.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="text-gray-900 font-semibold text-base">
                        {a.name}
                      </div>
                      <button className="text-gray-400">♡</button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{a.title}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <span className="text-[#ffc107]">⭐</span>
                        <span>{a.rating}</span>
                        <span className="text-gray-400">({a.reviews})</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium">
                        From ${a.price}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your projects and activities</p>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="font-medium text-gray-900 mb-2">Active Projects</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">No active projects</div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="font-medium text-gray-900 mb-2">Recent Activity</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">No recent activity</div>
          </div>
        </div>
      </div>
    </div>
  );

  const MessagesContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Connect with artists and clients</p>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  Conversation {index + 1}
                </div>
                <div className="text-sm text-gray-600">
                  Last message preview...
                </div>
              </div>
              <div className="text-xs text-gray-500">2m ago</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">👤</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="font-medium text-gray-900 mb-3">Account Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm text-gray-900">user@example.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Phone</span>
              <span className="text-sm text-gray-900">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="font-medium text-gray-900 mb-3">Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Notifications</span>
              <div className="w-10 h-6 bg-[#EF473B] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dark Mode</span>
              <div className="w-10 h-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "explore":
        return <ExploreContent />;
      case "dashboard":
        return <DashboardContent />;
      case "messages":
        return <MessagesContent />;
      case "profile":
        return <ProfileContent />;
      default:
        return <ExploreContent />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Main Content scrolls */}
      <div className="flex-1 overflow-y-auto p-6 pb-2">{renderContent()}</div>

      {/* Bottom Navigation fixed at bottom inside card */}
      <div className="shrink-0">
        <BottomNav
          active={activeTab}
          onChange={handleTabChange}
          showPrimary={accountType === "patron"}
          onPrimaryClick={() =>
            navigate("/dashboard", { state: { create: true } })
          }
        />
      </div>
    </div>
  );
}
