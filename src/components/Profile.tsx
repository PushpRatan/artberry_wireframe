import BottomNav from "./BottomNav";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditProfile from "./EditProfile";
import CreatePackage from "./CreatePackage";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate as useRouterNavigate } from "react-router-dom";

interface ProfileProps {
  onNavigate: (view: "explore" | "dashboard" | "messages" | "profile") => void;
}

export default function Profile({ onNavigate: _ }: ProfileProps) {
  const navigate = useNavigate();
  const routerNavigate = useRouterNavigate();
  const { accountType, setAccountType } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Graphic Designer",
    experience: "5+ years",
    bio: "I create stunning visual designs that help brands stand out. With over 5 years of experience, I specialize in logo design, branding, and digital art.",
    rating: 4.8,
    reviews: 127,
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

            <div className="space-y-4">
              <button
                onClick={() => handleCreateFromTemplate("visual-arts")}
                className="w-full text-left border-2 border-dashed border-gray-300 hover:border-blue-300 bg-gray-50 p-6 rounded-lg transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Use Template
                    </div>
                    <div className="text-sm text-gray-600">
                      Choose from predefined templates with pricing
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleCreateFromScratch}
                className="w-full text-left border-2 border-dashed border-gray-300 hover:border-blue-300 bg-gray-50 p-6 rounded-lg transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
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
      <div className="flex-1 overflow-y-auto p-6 pb-4 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">
              {accountType === "artist" ? "🎨" : "💼"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Profile
          </h1>
          <p className="text-gray-600">
            {accountType === "artist"
              ? "Manage your artist profile"
              : "Manage your patron profile"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Account Type */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Account Type</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAccountTypeChange("artist")}
                className={`px-4 py-2 rounded-lg transition ${
                  accountType === "artist"
                    ? "bg-purple-100 text-purple-800 border-2 border-purple-300"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                🎨 Artist
              </button>
              <button
                onClick={() => handleAccountTypeChange("patron")}
                className={`px-4 py-2 rounded-lg transition ${
                  accountType === "patron"
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                    : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                }`}
              >
                💼 Patron
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {accountType === "artist"
                ? "You offer creative services"
                : "You hire creative talent"}
            </span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Name</span>
              <span className="text-sm text-gray-900">{profileData.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm text-gray-900">{profileData.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Phone</span>
              <span className="text-sm text-gray-900">{profileData.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Location</span>
              <span className="text-sm text-gray-900">
                {profileData.location}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Professional</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Title</span>
              <span className="text-sm text-gray-900">{profileData.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Experience</span>
              <span className="text-sm text-gray-900">
                {profileData.experience}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rating</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-900">
                  {profileData.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({profileData.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {profileData.bio}
          </p>
        </div>

        {/* Packages (Artist only) */}
        {accountType === "artist" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Packages
              </h3>
              <button
                onClick={handleAddPackage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                + Add Package
              </button>
            </div>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border border-gray-200 rounded-2xl p-4 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {pkg.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {pkg.description}
                      </div>
                      <div className="text-sm text-gray-700">
                        {pkg.deliverables.join(" · ")}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-blue-600">
                        ${pkg.price}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
