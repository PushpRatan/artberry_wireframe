import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PaymentConfirmation from "./PaymentConfirmation";

type Artist = {
  name: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  about: string;
  portfolio: string[];
  packages: Array<{
    name: string;
    price: number;
    description: string;
    deliverables: string[];
  }>;
};

const MOCKS: Record<string, Artist> = {
  "sarah-chen": {
    name: "Sarah Chen",
    title: "Painter",
    rating: 4.9,
    reviews: 234,
    price: 25,
    avatar: "https://i.pravatar.cc/160?img=68",
    about:
      "I create whimsical, character-driven painting. I love bright palettes and clean line work.",
    portfolio: [
      "https://picsum.photos/seed/m1/600/400",
      "https://picsum.photos/seed/m1/600/400",
      "https://picsum.photos/seed/m1/600/400",
      "https://picsum.photos/seed/m1/600/400",
    ],
    packages: [
      {
        name: "Bronze",
        price: 25,
        description: "One character sketch, grayscale.",
        deliverables: ["1 image", "Commercial use", "2 revisions"],
      },
      {
        name: "Silver",
        price: 75,
        description: "Full color character on simple background.",
        deliverables: ["1 PNG", "Source file", "3 revisions"],
      },
      {
        name: "Gold",
        price: 150,
        description: "Detailed illustration suitable for covers and posters.",
        deliverables: ["High-res PNG", "PSD", "4 revisions"],
      },
    ],
  },
  "marcus-rivera": {
    name: "Marcus Rivera",
    title: "Pottery Design",
    rating: 4.8,
    reviews: 166,
    price: 35,
    avatar: "https://i.pravatar.cc/160?img=15",
    about:
      "Brand identity designer focused on simple, memorable logos with strong grid systems.",
    portfolio: [
      "https://picsum.photos/seed/m1/600/400",
      "https://picsum.photos/seed/m1/600/400",
      "https://picsum.photos/seed/m1/600/400",
    ],
    packages: [
      {
        name: "Pro",
        price: 35,
        description: "Simple oil paints.",
        deliverables: ["2 frames", "1 concept", "2 revisions"],
      },
      {
        name: "Elite",
        price: 120,
        description: "Primary Image + alt + mark.",
        deliverables: ["Whole set", "Brand sheet", "4 revisions"],
      },
    ],
  },
};

export default function ArtistProfile() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: Partial<Artist> & {
      fromJobDetails?: boolean;
      bid?: number;
      jobTitle?: string;
      jobDescription?: string;
    };
  };
  const { slug } = useParams();
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);

  const artist = useMemo<Artist | undefined>(() => {
    if (state && state.name) {
      const fallbackSlug = (state.name || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      return {
        ...MOCKS[slug || fallbackSlug],
        ...state,
      } as Artist;
    }
    if (slug && MOCKS[slug]) return MOCKS[slug];
    return undefined;
  }, [slug, state]);

  if (!artist) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-gray-600"
        >
          ← Back
        </button>
        <div className="text-gray-900 font-medium">Artist not found</div>
      </div>
    );
  }

  const slugForRoute = (slug ||
    (artist.name || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")) as string;

  const handlePaymentComplete = (artist: any, pkg: any) => {
    // Auto-generate message to artist
    const autoMessage = `New order received! ${pkg.name} package ($${
      pkg.price
    }) - ${pkg.description}. Deliverables: ${pkg.deliverables.join(", ")}.`;

    // Navigate to messages with auto-generated message
    navigate(`/messages/${slugForRoute}`, {
      state: {
        artist: {
          name: artist.name,
          avatar: artist.avatar,
          slug: slugForRoute,
        },
        initialMessage: autoMessage,
        isNewOrder: true,
      },
    });
  };

  // Show payment confirmation if package is selected
  if (showPayment && selectedPackage) {
    return (
      <PaymentConfirmation
        artist={{
          name: artist.name,
          avatar: artist.avatar,
          slug: slugForRoute,
        }}
        package={selectedPackage}
        onBack={() => {
          setShowPayment(false);
          setSelectedPackage(null);
        }}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto p-6 pb-4 space-y-6">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="text-sm text-gray-600">
          ← Back
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-900">
              {artist.name}
            </div>
            <div className="text-sm text-gray-600">{artist.title}</div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
              <span className="text-yellow-500">⭐</span>
              <span>{artist.rating}</span>
              <span className="text-gray-400">({artist.reviews})</span>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                From ${artist.price}
              </span>
            </div>
          </div>
          <button className="text-gray-400">♡</button>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">
            {artist.about ||
              "This artist specializes in high-quality creative work and delivers on time."}
          </p>
        </div>

        {/* Portfolio */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
            <button className="text-sm text-blue-600 font-medium">
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(artist.portfolio && artist.portfolio.length > 0
              ? artist.portfolio
              : [
                  "https://picsum.photos/seed/m1/600/400",
                  "https://picsum.photos/seed/m1/600/400",
                  "https://picsum.photos/seed/m1/600/400",
                  "https://picsum.photos/seed/m1/600/400",
                ]
            )
              .slice(0, 4)
              .map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Work ${i + 1}`}
                  className="w-full h-28 object-cover rounded-xl"
                />
              ))}
          </div>
        </div>

        {/* Packages or Assign CTA depending on flow */}
        {state?.fromJobDetails ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Assign this artist
            </h3>
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {state.jobTitle || "Custom assignment"}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {state.jobDescription ||
                      "Proceed to assign this job to the artist."}
                  </div>
                  <div className="text-sm text-gray-700">
                    Bid: ${state.bid || artist.price}
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() =>
                      navigate(`/payment`, {
                        state: {
                          artist: {
                            name: artist.name,
                            avatar: artist.avatar,
                            slug: slugForRoute,
                          },
                          package: {
                            name: state.jobTitle || "Assignment",
                            price: state.bid || artist.price,
                            description: state.jobDescription || "",
                            deliverables: ["Service assignment"],
                          },
                        },
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Packages</h3>
            {(artist.packages && artist.packages.length > 0
              ? artist.packages
              : [
                  {
                    name: "Basic",
                    price: artist.price,
                    description: "Great for small tasks and quick turnarounds.",
                    deliverables: ["1 deliverable", "Commercial use"],
                  },
                  {
                    name: "Standard",
                    price: artist.price + 40,
                    description: "Balanced package with extra revisions.",
                    deliverables: ["Source file", "3 revisions"],
                  },
                ]
            ).map((pkg, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl p-4 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div>
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
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ${pkg.price}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowPayment(true);
                      }}
                      className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
