import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EditProfileProps {
  accountType: "patron" | "artist";
  onSave: (data: any) => void;
}

export default function EditProfile({ accountType, onSave }: EditProfileProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: accountType === "artist" ? "Graphic Designer" : "Creative Director",
    experience: "5+ years",
    bio:
      accountType === "artist"
        ? "I create stunning visual designs that help brands stand out. With over 5 years of experience, I specialize in logo design, branding, and digital art."
        : "I'm passionate about discovering and working with talented artists to bring creative visions to life.",
  });

  const handleSave = () => {
    onSave(formData);
    navigate("/profile");
  };

  const handleBack = () => {
    navigate("/profile");
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button onClick={() => handleBack()} className="text-sm text-gray-600">
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Edit Profile</h1>
        <button
          onClick={handleSave}
          className="text-sm text-blue-600 font-medium"
        >
          Save
        </button>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Personal Information */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Professional</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {accountType === "artist" ? "Professional Title" : "Job Title"}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
