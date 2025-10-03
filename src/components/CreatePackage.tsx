import { useMemo, useState } from "react";

interface Package {
  name: string;
  price: string;
  description: string;
  deliverables: string[];
  _useTemplate?: boolean;
  _discipline?: string;
}

interface ArtistOnboardingProps {
  onComplete: (packages: Package[]) => void;
  onSkip: () => void;
  onBack?: () => void;
  initialPackage?: Package;
  onSave?: (pkg: Package) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  discipline?: string; // The selected discipline from previous step
}

type TemplateVariant = {
  name: string;
  price: string;
  description: string;
  deliverables: string[];
};

type TemplateRole = Record<"Basic" | "Standard" | "Premium", TemplateVariant>;

type TemplateCategory = Record<string, TemplateRole>;

const TEMPLATE_LIBRARY: Record<string, TemplateCategory> = {
  "Performing Arts": {
    "Film / OTT Actor": {
      Basic: {
        name: "Film/OTT Actor - Basic",
        price: "₹5,000–₹15,000 (per day)",
        description: "Supporting role / 1–2 scenes, per day shoot",
        deliverables: ["1–2 scenes", "On-set availability per day"],
      },
      Standard: {
        name: "Film/OTT Actor - Standard",
        price: "₹1.5 lakh–₹3 lakh (bulk)",
        description: "Parallel lead, 10–15 day shoot (bulk package)",
        deliverables: ["10–15 shoot days", "Character prep"],
      },
      Premium: {
        name: "Film/OTT Actor - Premium",
        price: "₹2 lakh–₹6 lakh (project)",
        description: "Lead in indie film/OTT (30+ days)",
        deliverables: ["30+ shoot days", "Workshops/rehearsals"],
      },
    },
    "Theatre Actor": {
      Basic: {
        name: "Theatre Actor - Basic",
        price: "₹2,000–₹5,000 (per show)",
        description: "Small role in stage play",
        deliverables: ["Show performance", "Basic rehearsals"],
      },
      Standard: {
        name: "Theatre Actor - Standard",
        price: "₹10,000–₹20,000 (per show)",
        description: "Lead/support role in professional production",
        deliverables: ["Show performance", "Professional rehearsals"],
      },
      Premium: {
        name: "Theatre Actor - Premium",
        price: "₹50,000–₹1.5 lakh (season)",
        description: "Season contract (5–10 shows + rehearsals)",
        deliverables: ["5–10 shows", "Rehearsal schedule"],
      },
    },
    "TV / Web Series Actor": {
      Basic: {
        name: "TV/Web Actor - Basic",
        price: "₹8,000–₹15,000 (per episode)",
        description: "Small episodic role",
        deliverables: ["Single episode appearance"],
      },
      Standard: {
        name: "TV/Web Actor - Standard",
        price: "₹15,000–₹30,000 (per episode)",
        description: "Recurring role (10+ episodes)",
        deliverables: ["10+ episodes", "Continuity support"],
      },
      Premium: {
        name: "TV/Web Actor - Premium",
        price: "₹1 lakh–₹10 lakh (per month)",
        description: "Lead role in daily soap (monthly)",
        deliverables: ["Monthly contract", "Daily shoots"],
      },
    },
    "Ad Film / Commercial Actor": {
      Basic: {
        name: "Ad Actor - Basic",
        price: "₹15,000–₹30,000 (1-day)",
        description: "Minor/background role, 1-day shoot",
        deliverables: ["1-day shoot"],
      },
      Standard: {
        name: "Ad Actor - Standard",
        price: "₹50,000–₹1.5 lakh",
        description: "Featured role with screen time",
        deliverables: ["Principal screen time", "1–2 day shoot"],
      },
      Premium: {
        name: "Ad Actor - Premium",
        price: "₹3 lakh–₹10 lakh",
        description: "Lead in national ad campaign (6–12 month usage rights)",
        deliverables: ["Lead role", "Usage rights 6–12 months"],
      },
    },
    "Stand-up Comedian": {
      Basic: {
        name: "Stand-up - Basic",
        price: "₹5,000–₹8,000",
        description: "10-min set at café/open mic",
        deliverables: ["10-min set"],
      },
      Standard: {
        name: "Stand-up - Standard",
        price: "₹15,000–₹25,000",
        description: "30-min corporate/college gig",
        deliverables: ["30-min set"],
      },
      Premium: {
        name: "Stand-up - Premium",
        price: "₹40,000–₹80,000",
        description: "1-hr show (weddings, festivals, branded)",
        deliverables: ["60-min show"],
      },
    },
    Dancers: {
      Basic: {
        name: "Dancer - Basic",
        price: "₹4,000–₹7,000",
        description: "Solo/duo 10-min performance",
        deliverables: ["10-min set"],
      },
      Standard: {
        name: "Dancer - Standard",
        price: "₹12,000–₹20,000",
        description: "30-min event performance (group choreography)",
        deliverables: ["30-min set", "Group choreography"],
      },
      Premium: {
        name: "Dancer - Premium",
        price: "₹30,000–₹60,000",
        description: "Full event choreography + 1-hr performance",
        deliverables: ["1-hr performance", "Event choreography"],
      },
    },
    "Hosts / Meme Artists / Magicians": {
      Basic: {
        name: "Host/Magician - Basic",
        price: "₹5,000–₹8,000",
        description: "15–20 min act / casual hosting",
        deliverables: ["15–20 min act"],
      },
      Standard: {
        name: "Host/Magician - Standard",
        price: "₹15,000–₹25,000",
        description: "45-min stage show / anchoring",
        deliverables: ["45-min show"],
      },
      Premium: {
        name: "Host/Magician - Premium",
        price: "₹30,000–₹60,000",
        description: "Full-day hosting / personalized magic show",
        deliverables: ["Full-day engagement"],
      },
    },
  },
  "Music & Sound": {
    DJ: {
      Basic: {
        name: "DJ - Basic",
        price: "₹10,000–₹15,000",
        description: "2-hr lounge/house party set",
        deliverables: ["2-hr set"],
      },
      Standard: {
        name: "DJ - Standard",
        price: "₹20,000–₹40,000",
        description: "4-hr club/wedding set",
        deliverables: ["4-hr set"],
      },
      Premium: {
        name: "DJ - Premium",
        price: "₹60,000–₹1,20,000",
        description: "Full-night performance with equipment",
        deliverables: ["Full-night set", "Equipment"],
      },
    },
    Singers: {
      Basic: {
        name: "Singer - Basic",
        price: "₹4,000–₹7,000",
        description: "30-min acoustic set",
        deliverables: ["30-min set"],
      },
      Standard: {
        name: "Singer - Standard",
        price: "₹12,000–₹20,000",
        description: "1.5-hr event set with band/karaoke",
        deliverables: ["1.5-hr set", "Band/Karaoke"],
      },
      Premium: {
        name: "Singer - Premium",
        price: "₹35,000–₹75,000",
        description: "Wedding/corporate headline act (3 hrs)",
        deliverables: ["3-hr headline set"],
      },
    },
    Instrumentalists: {
      Basic: {
        name: "Instrumentalist - Basic",
        price: "₹3,000–₹5,000",
        description: "30-min solo",
        deliverables: ["30-min solo"],
      },
      Standard: {
        name: "Instrumentalist - Standard",
        price: "₹8,000–₹15,000",
        description: "1.5-hr event set",
        deliverables: ["1.5-hr set"],
      },
      Premium: {
        name: "Instrumentalist - Premium",
        price: "₹20,000–₹40,000",
        description: "Full event + collaboration with band",
        deliverables: ["Full event", "Band collab"],
      },
    },
    "Voice-over Artist": {
      Basic: {
        name: "Voice-over - Basic",
        price: "₹1,500–₹3,000",
        description: "100-word script recording",
        deliverables: ["Edited WAV/MP3"],
      },
      Standard: {
        name: "Voice-over - Standard",
        price: "₹6,000–₹12,000",
        description: "500-word professional VO (ad/explainer)",
        deliverables: ["Studio quality", "1–2 revisions"],
      },
      Premium: {
        name: "Voice-over - Premium",
        price: "₹15,000–₹30,000 (per hr)",
        description: "Audiobook/e-learning (per hr)",
        deliverables: ["Hourly recording", "Multiple chapters"],
      },
    },
  },
  "Visual Arts": {
    "Painter / Sketch Artist": {
      Basic: {
        name: "Artist - Basic",
        price: "₹2,000–₹4,000",
        description: "A4 portrait sketch",
        deliverables: ["A4 sheet", "Graphite/ink"],
      },
      Standard: {
        name: "Artist - Standard",
        price: "₹8,000–₹15,000",
        description: "Medium canvas painting",
        deliverables: ["Medium canvas"],
      },
      Premium: {
        name: "Artist - Premium",
        price: "₹25,000–₹60,000",
        description: "Large commissioned art (wall size)",
        deliverables: ["Large canvas/wall"],
      },
    },
    "Tattoo Artist": {
      Basic: {
        name: "Tattoo - Basic",
        price: "₹2,500–₹5,000",
        description: "Small tattoo (2–3 inch)",
        deliverables: ["Sanitized setup", "Aftercare guide"],
      },
      Standard: {
        name: "Tattoo - Standard",
        price: "₹10,000–₹20,000",
        description: "Medium tattoo (half sleeve/back piece)",
        deliverables: ["Design consultation"],
      },
      Premium: {
        name: "Tattoo - Premium",
        price: "₹30,000–₹70,000",
        description: "Full sleeve/chest/custom design",
        deliverables: ["Custom concept", "Multiple sittings"],
      },
    },
  },
  "Writers & Content": {
    "Poet / Lyricist": {
      Basic: {
        name: "Lyrics/Poetry - Basic",
        price: "₹2,000–₹4,000",
        description: "Short poem / 16-bar lyrics",
        deliverables: ["Short piece", "1 revision"],
      },
      Standard: {
        name: "Lyrics/Poetry - Standard",
        price: "₹8,000–₹12,000",
        description: "Full song lyrics",
        deliverables: ["Full lyrics", "2 revisions"],
      },
      Premium: {
        name: "Lyrics/Poetry - Premium",
        price: "₹20,000–₹40,000",
        description: "Custom song + collaboration",
        deliverables: ["Custom song", "Collaboration"],
      },
    },
    "Script / Copywriter": {
      Basic: {
        name: "Copy/Script - Basic",
        price: "₹2,000–₹5,000",
        description: "1-min ad script",
        deliverables: ["Script draft"],
      },
      Standard: {
        name: "Copy/Script - Standard",
        price: "₹12,000–₹25,000",
        description: "Short film script (10–15 mins)",
        deliverables: ["Screenplay", "2 revisions"],
      },
      Premium: {
        name: "Copy/Script - Premium",
        price: "₹50,000–₹1,50,000",
        description: "Feature-length script",
        deliverables: ["Feature screenplay", "Outlines"],
      },
    },
  },
  "Photography & Videography": {
    Photographer: {
      Basic: {
        name: "Photographer - Basic",
        price: "₹5,000–₹8,000",
        description: "2-hr shoot + 15 edited photos",
        deliverables: ["2-hr shoot", "15 edits"],
      },
      Standard: {
        name: "Photographer - Standard",
        price: "₹15,000–₹25,000",
        description: "Half-day shoot + 50 edits",
        deliverables: ["Half-day", "50 edits"],
      },
      Premium: {
        name: "Photographer - Premium",
        price: "₹60,000–₹1,20,000",
        description: "Full-day wedding package + album",
        deliverables: ["Full-day", "Album"],
      },
    },
    Videographer: {
      Basic: {
        name: "Videographer - Basic",
        price: "₹6,000–₹10,000",
        description: "2-min highlight video",
        deliverables: ["Shoot + 2-min edit"],
      },
      Standard: {
        name: "Videographer - Standard",
        price: "₹20,000–₹35,000",
        description: "Event coverage + 5-min edit",
        deliverables: ["Event coverage", "5-min edit"],
      },
      Premium: {
        name: "Videographer - Premium",
        price: "₹70,000–₹1,50,000",
        description: "Wedding film / commercial ad",
        deliverables: ["Cinematic film"],
      },
    },
    "Drone Operator": {
      Basic: {
        name: "Drone - Basic",
        price: "₹5,000–₹8,000",
        description: "30-min aerial shoot",
        deliverables: ["30-min flight"],
      },
      Standard: {
        name: "Drone - Standard",
        price: "₹12,000–₹20,000",
        description: "2-hr aerial event coverage",
        deliverables: ["2-hr coverage"],
      },
      Premium: {
        name: "Drone - Premium",
        price: "₹35,000–₹70,000",
        description: "Wedding + property cinematic coverage",
        deliverables: ["Cinematic package"],
      },
    },
  },
  "Design & Digital Arts": {
    "Graphic Designer": {
      Basic: {
        name: "Graphic Design - Basic",
        price: "₹2,000–₹5,000",
        description: "Logo / 1 social post",
        deliverables: ["Logo or 1 creative"],
      },
      Standard: {
        name: "Graphic Design - Standard",
        price: "₹8,000–₹15,000",
        description: "Brand kit (logo + 5 creatives)",
        deliverables: ["Logo", "5 creatives"],
      },
      Premium: {
        name: "Graphic Design - Premium",
        price: "₹25,000–₹50,000",
        description: "Full branding pack",
        deliverables: ["Complete brand pack"],
      },
    },
    "Motion Graphics / Animator": {
      Basic: {
        name: "Motion Graphics - Basic",
        price: "₹3,000–₹6,000",
        description: "10-sec animated logo",
        deliverables: ["10-sec logo animation"],
      },
      Standard: {
        name: "Motion Graphics - Standard",
        price: "₹10,000–₹20,000",
        description: "30-sec explainer video",
        deliverables: ["30-sec explainer"],
      },
      Premium: {
        name: "Motion Graphics - Premium",
        price: "₹40,000–₹80,000",
        description: "2-min animated film",
        deliverables: ["2-min film"],
      },
    },
  },
  "Fashion & Styling": {
    "Makeup Artist": {
      Basic: {
        name: "Makeup - Basic",
        price: "₹3,000–₹5,000",
        description: "Party makeup",
        deliverables: ["Party look"],
      },
      Standard: {
        name: "Makeup - Standard",
        price: "₹12,000–₹25,000",
        description: "Bridal makeup (single event)",
        deliverables: ["Bridal look"],
      },
      Premium: {
        name: "Makeup - Premium",
        price: "₹30,000–₹60,000",
        description: "Bridal + 2 events package",
        deliverables: ["Multiple event looks"],
      },
    },
    Stylist: {
      Basic: {
        name: "Stylist - Basic",
        price: "₹4,000–₹6,000",
        description: "One look styling",
        deliverables: ["Single look"],
      },
      Standard: {
        name: "Stylist - Standard",
        price: "₹12,000–₹20,000",
        description: "Half-day shoot styling",
        deliverables: ["Half-day styling"],
      },
      Premium: {
        name: "Stylist - Premium",
        price: "₹25,000–₹50,000",
        description: "Wedding/event full styling",
        deliverables: ["Full-event styling"],
      },
    },
    "Mehendi Artist": {
      Basic: {
        name: "Mehendi - Basic",
        price: "₹2,500–₹4,000",
        description: "Simple design (both hands, front only)",
        deliverables: ["Front hands design"],
      },
      Standard: {
        name: "Mehendi - Standard",
        price: "₹8,000–₹15,000",
        description: "Bridal mehendi (hands + feet)",
        deliverables: ["Bridal hands & feet"],
      },
      Premium: {
        name: "Mehendi - Premium",
        price: "₹20,000–₹35,000",
        description: "Bridal + family pack",
        deliverables: ["Bride + family"],
      },
    },
  },
  "Influencers & Creators": {
    "Instagram Creator / YouTuber": {
      Basic: {
        name: "Influencer - Basic",
        price: "₹3,000–₹8,000",
        description: "1 reel / 1 IG story shoutout",
        deliverables: ["1 reel or 1 story"],
      },
      Standard: {
        name: "Influencer - Standard",
        price: "₹15,000–₹30,000",
        description: "3 reels + 1 story campaign",
        deliverables: ["3 reels", "1 story"],
      },
      Premium: {
        name: "Influencer - Premium",
        price: "₹50,000–₹1,50,000",
        description: "Monthly collab pack",
        deliverables: ["Monthly deliverables"],
      },
    },
    "Podcaster / Streamer": {
      Basic: {
        name: "Podcast/Stream - Basic",
        price: "₹3,000–₹7,000",
        description: "15-min brand mention",
        deliverables: ["15-min mention"],
      },
      Standard: {
        name: "Podcast/Stream - Standard",
        price: "₹12,000–₹25,000",
        description: "Full 1-hr episode integration",
        deliverables: ["1-hr integration"],
      },
      Premium: {
        name: "Podcast/Stream - Premium",
        price: "₹40,000–₹1,00,000",
        description: "Branded series / monthly collab",
        deliverables: ["Series/monthly plan"],
      },
    },
  },
};

export default function ArtistOnboarding({
  onComplete,
  onSkip: _,
  onBack,
  initialPackage,
  onSave,
  onCancel,
  isEditing = false,
  discipline,
}: ArtistOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<
    "choose-role" | "creating-package"
  >(
    isEditing && initialPackage?.name && !initialPackage?._useTemplate
      ? "creating-package"
      : "choose-role"
  );
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPackage, setCurrentPackage] = useState<Package>(
    initialPackage || {
      name: "",
      price: "",
      description: "",
      deliverables: [""],
    }
  );

  // Map discipline to template category
  const getCategoryFromDiscipline = (discipline?: string): string | null => {
    if (!discipline) return null;

    const disciplineMap: Record<string, string> = {
      "performing-arts": "Performing Arts",
      "music-sound": "Music & Sound",
      "visual-arts": "Visual Arts",
      "writers-content": "Writers & Content",
      "photography-videography": "Photography & Videography",
      "design-digital": "Design & Digital Arts",
      "fashion-styling": "Fashion & Styling",
      "influencers-creators": "Influencers & Creators",
    };

    return disciplineMap[discipline] || null;
  };

  const selectedCategory = getCategoryFromDiscipline(discipline);
  const roles = useMemo(() => {
    if (!selectedCategory) return [] as string[];
    return Object.keys(TEMPLATE_LIBRARY[selectedCategory]);
  }, [selectedCategory]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleAddDeliverable = () => {
    setCurrentPackage((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, ""],
    }));
  };

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...currentPackage.deliverables];
    newDeliverables[index] = value;
    setCurrentPackage((prev) => ({
      ...prev,
      deliverables: newDeliverables,
    }));
  };

  const handleRemoveDeliverable = (index: number) => {
    if (currentPackage.deliverables.length > 1) {
      const newDeliverables = currentPackage.deliverables.filter(
        (_, i) => i !== index
      );
      setCurrentPackage((prev) => ({
        ...prev,
        deliverables: newDeliverables,
      }));
    }
  };

  const handleSavePackage = () => {
    if (currentPackage.name && currentPackage.price) {
      if (onSave) {
        // Editing mode - save single package
        onSave(currentPackage);
      } else {
        // Onboarding mode - add to packages list
        const newPackages = [...packages, currentPackage];
        setPackages(newPackages);
        setCurrentPackage({
          name: "",
          price: "",
          description: "",
          deliverables: [""],
        });
        setCurrentStep("choose-role");
      }
    }
  };

  const handleBack = () => {
    if (currentStep === "creating-package") {
      if (onCancel) {
        onCancel();
      } else {
        setCurrentStep("choose-role");
      }
    } else if (currentStep === "choose-role" && onBack) {
      onBack();
    }
  };

  // If editing mode, always show the package form
  if (isEditing) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-[#2B2B2B] hover:text-[#6A1B9A] text-sm mb-2"
        >
          ← Back
        </button>

        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-[#2B2B2B]">
            {initialPackage?.name ? "Edit Package" : "Create Package"}
          </h2>
          <p className="text-[#2B2B2B]">Update your service package details</p>
        </div>

        {/* Package Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">
              Package Name
            </label>
            <input
              type="text"
              placeholder="e.g., Pro"
              value={currentPackage.name}
              onChange={(e) =>
                setCurrentPackage((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#EF473B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">
              Price ($)
            </label>
            <input
              type="text"
              placeholder="e.g., 99"
              value={currentPackage.price}
              onChange={(e) =>
                setCurrentPackage((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#EF473B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description of what clients get..."
              value={currentPackage.description}
              onChange={(e) =>
                setCurrentPackage((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#EF473B] resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-2">
              What's included
            </label>
            <div className="space-y-2">
              {currentPackage.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Deliverable ${index + 1}`}
                    value={deliverable}
                    onChange={(e) =>
                      handleDeliverableChange(index, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#EF473B]"
                  />
                  {currentPackage.deliverables.length > 1 && (
                    <button
                      onClick={() => handleRemoveDeliverable(index)}
                      className="text-[#EF473B] hover:text-[#d63d32] p-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={handleAddDeliverable}
                className="text-[#6A1B9A] text-sm font-medium flex items-center gap-1"
              >
                + Add another deliverable
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleSavePackage}
            disabled={!currentPackage.name || !currentPackage.price}
            className="w-full bg-[#EF473B] text-white py-3 rounded-lg font-medium hover:bg-[#d63d32] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {initialPackage?.name ? "Update Package" : "Save Package"}
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === "creating-package") {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-[#2B2B2B] hover:text-[#6A1B9A] text-sm mb-2"
        >
          ← Back
        </button>

        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-[#2B2B2B]">Edit Package</h2>
          <p className="text-[#2B2B2B]">
            Review and adjust your package details
          </p>
        </div>

        {/* Package Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Name
            </label>
            <input
              type="text"
              placeholder="e.g., Pro"
              value={currentPackage.name}
              onChange={(e) =>
                setCurrentPackage((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#EF473B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="text"
              placeholder="e.g., 99"
              value={currentPackage.price}
              onChange={(e) =>
                setCurrentPackage((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#EF473B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description of what clients get..."
              value={currentPackage.description}
              onChange={(e) =>
                setCurrentPackage((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#EF473B] resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's included
            </label>
            <div className="space-y-2">
              {currentPackage.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Deliverable ${index + 1}`}
                    value={deliverable}
                    onChange={(e) =>
                      handleDeliverableChange(index, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#EF473B]"
                  />
                  {currentPackage.deliverables.length > 1 && (
                    <button
                      onClick={() => handleRemoveDeliverable(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={handleAddDeliverable}
                className="text-[#EF473B] text-sm font-medium flex items-center gap-1"
              >
                + Add another deliverable
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {isEditing ? (
            // Edit mode - show Save button
            <button
              onClick={handleSavePackage}
              disabled={!currentPackage.name || !currentPackage.price}
              className="w-full bg-[#EF473B] text-white py-3 rounded-lg font-medium hover:bg-[#d63d32] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Save Package
            </button>
          ) : (
            // Onboarding mode - show Continue and Add Another options
            <>
              <button
                onClick={() => {
                  // Save current package and continue
                  if (currentPackage.name && currentPackage.price) {
                    const newPackages = [...packages, currentPackage];
                    setPackages(newPackages);
                    onComplete(newPackages);
                  }
                }}
                disabled={!currentPackage.name || !currentPackage.price}
                className="w-full bg-[#2ECC71] text-white py-3 rounded-lg font-medium hover:bg-[#26b863] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Continue with {packages.length + 1} package
                {packages.length > 0 ? "s" : ""}
              </button>

              {/* Add another package option */}
              <button
                onClick={() => {
                  // Save current package and add another
                  if (currentPackage.name && currentPackage.price) {
                    const newPackages = [...packages, currentPackage];
                    setPackages(newPackages);
                    setCurrentPackage({
                      name: "",
                      price: "",
                      description: "",
                      deliverables: [""],
                    });
                    setSelectedRole(null);
                    setCurrentStep("choose-role");
                  }
                }}
                disabled={!currentPackage.name || !currentPackage.price}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
              >
                + Add Another Package
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === "choose-role") {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-[#2B2B2B] hover:text-[#6A1B9A] text-sm mb-2"
        >
          ← Back
        </button>

        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-[#2B2B2B]">Choose Your Role</h2>
          <p className="text-[#2B2B2B]">
            Select your specific role within {selectedCategory}
          </p>
        </div>

        {/* Roles */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#2B2B2B]">
            Role
          </label>
          {roles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`border rounded-lg px-4 py-3 text-left transition ${
                    selectedRole === role
                      ? "border-[#6A1B9A] bg-[#6A1B9A1a]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ color: "#2B2B2B" }}
                >
                  <div className="font-medium">{role}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: "#2B2B2B" }}>
              <p>No roles found for discipline: {discipline}</p>
              <p className="text-sm">Category: {selectedCategory || "None"}</p>
            </div>
          )}
        </div>

        {/* Variants */}
        {selectedRole && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2B2B2B]">
              Choose Package Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["Basic", "Standard", "Premium"] as const).map((tier) => {
                const variant =
                  TEMPLATE_LIBRARY[selectedCategory!][selectedRole!][tier];
                return (
                  <div
                    key={tier}
                    className="border border-gray-200 rounded-lg p-4 bg-[#FFF6F6]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-[#2B2B2B]">{tier}</div>
                        <div className="font-medium text-[#2B2B2B]">
                          {variant.name}
                        </div>
                        <div
                          className={`font-semibold ${
                            tier === "Basic"
                              ? "text-[#6A1B9A]"
                              : tier === "Standard"
                              ? "text-[#EF473B]"
                              : "text-[#2ECC71]"
                          }`}
                        >
                          {variant.price}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#2B2B2B] mt-2">
                      {variant.description}
                    </p>
                    <div className="text-xs text-[#2B2B2B] mt-1">
                      Includes: {variant.deliverables.join(", ")}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPackage({
                          name: variant.name,
                          price: variant.price,
                          description: variant.description,
                          deliverables: [...variant.deliverables],
                        });
                        setCurrentStep("creating-package");
                      }}
                      className="mt-3 w-full bg-[#6A1B9A] text-white py-2 rounded-lg font-medium hover:bg-[#59167f] transition"
                    >
                      Use template
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // This should never be reached since we start with choose-role
  return null;
}
