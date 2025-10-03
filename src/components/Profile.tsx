import BottomNav from "./BottomNav";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditProfile from "./EditProfile";
import CreatePackage from "./CreatePackage";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate as useRouterNavigate } from "react-router-dom";
// Subscription flow now uses a dedicated page at /subscription

interface ProfileProps {
  onNavigate: (view: "explore" | "dashboard" | "messages" | "profile") => void;
}

export default function Profile({ onNavigate: _ }: ProfileProps) {
  const navigate = useNavigate();
  const routerNavigate = useRouterNavigate();
  const { accountType, setAccountType, subscription } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 1234567890",
    location: "Mumbai",
    title: "Painter",
    experience: "5+ years",
    bio: "I create stunning visual designs that help brands stand out. With over 5 years of experience, I specialize in logo design, branding, and digital art.",
    rating: 4.8,
    reviews: 127,
    instagram: "https://www.instagram.com/johndoe/",
  });

  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Bronze",
      price: 25,
      description: "One character sketch, grayscale.",
      deliverables: ["1 image", "Commercial use", "2 revisions"],
    },
    {
      id: 2,
      name: "Silver",
      price: 75,
      description: "Full color character on simple background.",
      deliverables: ["1 PNG", "Source file", "3 revisions"],
    },
    {
      id: 3,
      name: "Gold",
      price: 150,
      description: "Detailed illustration suitable for covers and posters.",
      deliverables: ["High-res PNG", "PSD", "4 revisions"],
    },
  ]);

  const handleEditPackage = (pkg: any) => {
    setEditingPackage(pkg);
  };

  const handleSavePackage = (updatedPackage: any) => {
    if (editingPackage) {
      // Update existing package
      setPackages(
        packages.map((pkg) =>
          pkg.id === editingPackage.id
            ? { ...updatedPackage, id: editingPackage.id }
            : pkg
        )
      );
    } else {
      // Add new package
      const newPackage = { ...updatedPackage, id: Date.now() };
      setPackages([...packages, newPackage]);
    }
    setEditingPackage(null);
  };

  const handleAddPackage = () => {
    setShowTemplateSelection(true);
  };

  const handleCreateFromTemplate = (discipline: string) => {
    setShowTemplateSelection(false);
    setEditingPackage({
      name: "",
      price: "",
      description: "",
      deliverables: [""],
      _useTemplate: true,
      _discipline: discipline,
    });
  };

  const handleCreateFromScratch = () => {
    setShowTemplateSelection(false);
    setEditingPackage({
      name: "",
      price: "",
      description: "",
      deliverables: [""],
    });
  };

  const handleDeletePackage = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  const handleSaveProfile = (data: any) => {
    setProfileData({ ...profileData, ...data });
    setIsEditing(false);
  };

  const handleAccountTypeChange = (newType: "patron" | "artist") => {
    setAccountType(newType);
    // Clear packages when switching to patron
    if (newType === "patron") {
      setPackages([]);
    }
  };

  if (isEditing) {
    return <EditProfile accountType={accountType} onSave={handleSaveProfile} />;
  }

  if (showTemplateSelection) {
    return (
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setShowTemplateSelection(false)}
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm mb-2"
            >
              ← Back
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Create New Package
              </h2>
              <p className="text-gray-600">
                Choose how you'd like to create your package
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleCreateFromTemplate("visual-arts")}
              className="w-full text-left border-2 border-dashed border-gray-300 hover:border-[#EF473B] bg-gray-50 p-6 rounded-lg transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-[#EF473B1a] rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">📋</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Use Template</div>
                  <div className="text-sm text-gray-600">
                    Choose from predefined templates with pricing
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={handleCreateFromScratch}
              className="w-full text-left border-2 border-dashed border-gray-300 hover:border-[#EF473B] bg-gray-50 p-6 rounded-lg transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-[#2ecc711a] rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">✏️</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Create from Scratch
                  </div>
                  <div className="text-sm text-gray-600">
                    Start with a blank form and customize everything
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editingPackage) {
    return (
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <CreatePackage
            initialPackage={editingPackage}
            onSave={handleSavePackage}
            onCancel={() => setEditingPackage(null)}
            onComplete={() => {}}
            onSkip={() => {}}
            isEditing={true}
            discipline={editingPackage?._discipline || "visual-arts"}
          />
        </div>
      </div>
    );
  }

  const handleTabChange = (
    tab: "explore" | "dashboard" | "messages" | "profile"
  ) => {
    const routeMap = {
      explore: "/explore",
      dashboard: "/dashboard",
      messages: "/messages",
      profile: "/profile",
    };
    navigate(routeMap[tab]);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-r from-[#EF473B] to-[#FF7E5F]"></div>
          <div className="px-6 -mt-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl">
                {accountType === "artist" ? "🎨" : "💼"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">
                    {profileData.name}
                  </h1>
                  {subscription?.active && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#6A1B9A] text-[#6A1B9A] text-xs font-medium">
                      <span>👑</span>
                      <span>Pro</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
                  <span>{profileData.title}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-[#ffc107]">⭐</span>
                    {profileData.rating} ({profileData.reviews})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="text-sm font-medium text-gray-900 truncate">
                {profileData.email}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-gray-500 mb-1">Phone</div>
              <div className="text-sm font-medium text-gray-900">
                {profileData.phone}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-gray-500 mb-1">Location</div>
              <div className="text-sm font-medium text-gray-900">
                {profileData.location}
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-gray-500 mb-1">Experience</div>
              <div className="text-sm font-medium text-gray-900">
                {profileData.experience}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#EF473B] text-white py-2 text-sm font-medium shadow-sm hover:bg-[#d63d32]"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={() =>
                navigator.share?.({
                  title: profileData.name,
                  text: profileData.title,
                })
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white py-2 text-sm font-medium shadow-sm hover:bg-black"
            >
              ↗ Share
            </button>
          </div>
          <div className="mt-3">
            {subscription?.active ? (
              <button
                onClick={() =>
                  navigate("/subscription", {
                    state: {
                      artist: {
                        name: profileData.name,
                        avatar: "https://via.placeholder.com/80",
                        slug: profileData.name
                          .toLowerCase()
                          .replace(/\s+/g, "-"),
                      },
                    },
                  })
                }
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 text-gray-900 py-2 text-sm font-medium hover:bg-gray-50"
              >
                📄 View your subscription
              </button>
            ) : (
              <button
                onClick={() =>
                  navigate("/subscription", {
                    state: {
                      artist: {
                        name: profileData.name,
                        avatar: "https://via.placeholder.com/80",
                        slug: profileData.name
                          .toLowerCase()
                          .replace(/\s+/g, "-"),
                      },
                    },
                  })
                }
                className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-[#6A1B9A] text-white py-3 text-sm font-semibold shadow-md hover:brightness-110 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 animate-pulse" />
                <span className="relative z-10">✨ Buy Subscription</span>
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pt-6 space-y-6">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {profileData.bio}
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Social Media
            </h3>
            {(() => {
              const links: { label: string; href: string; icon: string }[] = [];
              const ig = (profileData as any).instagram as string | undefined;
              const tw = (profileData as any).twitter as string | undefined;
              const li = (profileData as any).linkedin as string | undefined;
              const be = (profileData as any).behance as string | undefined;

              if (ig) {
                const href = ig.startsWith("http")
                  ? ig
                  : "https://instagram.com/" + ig.replace(/^@/, "");
                links.push({ label: "Instagram", href, icon: "📸" });
              }
              if (tw) {
                const href = tw.startsWith("http")
                  ? tw
                  : "https://x.com/" + tw.replace(/^@/, "");
                links.push({ label: "Twitter", href, icon: "🐦" });
              }
              if (li) {
                const href = li.startsWith("http")
                  ? li
                  : "https://www.linkedin.com/in/" + li;
                links.push({ label: "LinkedIn", href, icon: "💼" });
              }
              if (be) {
                const href = be.startsWith("http")
                  ? be
                  : "https://www.behance.net/" + be;
                links.push({ label: "Behance", href, icon: "🎨" });
              }

              if (links.length === 0) {
                return (
                  <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                    No social profiles added yet.
                  </div>
                );
              }
              return (
                <div className="grid grid-cols-2 gap-2">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-sm hover:bg-gray-100"
                    >
                      <span>{l.icon}</span>
                      <span className="flex-1">{l.label}</span>
                      <span className="text-gray-400">↗</span>
                    </a>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Packages (Artist only) */}
          {accountType === "artist" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Packages
                </h3>
                <button
                  onClick={handleAddPackage}
                  className="px-3 py-1 bg-[#EF473B] text-white rounded-lg text-xs font-medium hover:bg-[#d63d32]"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-xl p-4 bg-gray-50 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {pkg.name}
                        </div>
                        <div className="text-lg font-bold text-[#EF473B] mt-1">
                          ${pkg.price}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="px-2 py-1 text-xs bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {pkg.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      {pkg.deliverables.join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Settings
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-sm text-gray-700">Notifications</span>
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-sm text-gray-700">Artist account</span>
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={accountType === "artist"}
                  onChange={(e) =>
                    handleAccountTypeChange(
                      e.target.checked ? "artist" : "patron"
                    )
                  }
                />
              </label>
              <a
                href="mailto:support@artberry.app?subject=Help%20%26%20Support&body=Hi%20team%2C%0D%0A%0D%0A"
                className="block w-full text-center px-4 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm font-medium"
              >
                Help & Support
              </a>
              <button
                onClick={() => navigate("/")}
                className="w-full px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="shrink-0">
        <BottomNav
          active="profile"
          onChange={handleTabChange}
          showPrimary={accountType === "patron"}
          onPrimaryClick={() =>
            routerNavigate("/dashboard", { state: { create: true } })
          }
        />
      </div>
    </div>
  );
}
