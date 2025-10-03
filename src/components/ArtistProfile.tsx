import { useMemo, useState } from "react";
import type { ReactNode } from "react";
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
  email?: string;
  phone?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  behance?: string;
  location?: string;
  experience?: string;
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
    email: "sarah@example.com",
    phone: "+91 9876543210",
    instagram: "https://www.instagram.com/johndoe/",
    twitter: "https://x.com/sarahchen",
    location: "Mumbai",
    experience: "5+ years",
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
    email: "marcus@example.com",
    phone: "+91 9123456780",
    linkedin: "https://www.linkedin.com/in/marcusrivera/",
    behance: "https://www.behance.net/marcusrivera",
    location: "Pune",
    experience: "3+ years",
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

  const handleMessage = () => {
    if (!artist) return;
    // Navigate to messages for this artist; receiving page should open existing or create new chat
    navigate(`/messages/${slugForRoute}`, {
      state: {
        artist: {
          name: artist.name,
          avatar: artist.avatar,
          slug: slugForRoute,
        },
        initialMessage: "",
        isNewChat: true,
      },
    });
  };

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
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Back */}
        <div className="px-6 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600"
          >
            ← Back
          </button>
        </div>
        {/* Header */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-r from-[#EF473B] to-[#FF7E5F]"></div>
          <div className="px-6 -mt-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {artist.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>{artist.title}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-[#ffc107]">⭐</span>
                    {artist.rating} ({artist.reviews})
                  </span>
                </div>
                <div className="mt-2 inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs">
                  From ${artist.price}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {(artist.email || state?.email) && (
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-xs text-gray-500 mb-1">Email</div>
                <a
                  href={`mailto:${(state?.email || artist.email) as string}`}
                  className="text-sm font-medium text-gray-900 truncate"
                >
                  {state?.email || artist.email}
                </a>
              </div>
            )}
            {(artist.phone || state?.phone) && (
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-xs text-gray-500 mb-1">Phone</div>
                <a
                  href={`tel:${(state?.phone || artist.phone || "").replace(
                    /\s+/g,
                    ""
                  )}`}
                  className="text-sm font-medium text-gray-900"
                >
                  {state?.phone || artist.phone}
                </a>
              </div>
            )}
            {(artist.location || state?.location) && (
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-xs text-gray-500 mb-1">Location</div>
                <div className="text-sm font-medium text-gray-900">
                  {state?.location || artist.location}
                </div>
              </div>
            )}
            {(artist.experience || state?.experience) && (
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="text-xs text-gray-500 mb-1">Experience</div>
                <div className="text-sm font-medium text-gray-900">
                  {state?.experience || artist.experience}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleMessage}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#EF473B] text-white py-2 text-sm font-medium shadow-sm hover:bg-[#d63d32]"
            >
              💬 Message
            </button>
            <button
              onClick={() => {
                const shareData = {
                  title: artist.name,
                  text: artist.title,
                  url: window.location.href,
                };
                if (navigator.share) {
                  navigator.share(shareData as any).catch(() => {});
                } else {
                  void navigator.clipboard?.writeText(window.location.href);
                  alert("Profile link copied to clipboard.");
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white py-2 text-sm font-medium shadow-sm hover:bg-black"
            >
              ↗ Share
            </button>
          </div>
        </div>

        <div className="px-6 pt-6 space-y-6">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {artist.about ||
                "This artist specializes in high-quality creative work and delivers on time."}
            </p>
          </div>

          {/* Social Media */}
          {(() => {
            const links: { label: string; href: string; icon: ReactNode }[] =
              [];
            const ig = (state?.instagram || artist.instagram) as
              | string
              | undefined;
            const tw = (state?.twitter || artist.twitter) as string | undefined;
            const li = (state?.linkedin || artist.linkedin) as
              | string
              | undefined;
            const be = (state?.behance || artist.behance) as string | undefined;

            const Icon = {
              Instagram: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              ),
              Twitter: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4l16 16M20 4L4 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              ),
              LinkedIn: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <rect x="6" y="10" width="3" height="8" fill="currentColor" />
                  <rect x="6" y="6" width="3" height="3" fill="currentColor" />
                  <path
                    d="M12 10h2.5a3.5 3.5 0 013.5 3.5V18H15v-4a1.5 1.5 0 00-1.5-1.5H12V10z"
                    fill="currentColor"
                  />
                </svg>
              ),
              Behance: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7h6a2.5 2.5 0 010 5H4V7zm0 5h6a3 3 0 110 6H4v-6z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M20 12a4 4 0 00-7.8 1H20a4 4 0 01-7.8 1.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="15"
                    y="6"
                    width="5"
                    height="1.6"
                    fill="currentColor"
                  />
                </svg>
              ),
            } as const;

            if (ig) {
              const href = ig.startsWith("http")
                ? ig
                : "https://instagram.com/" + ig.replace(/^@/, "");
              links.push({ label: "Instagram", href, icon: Icon.Instagram });
            }
            if (tw) {
              const href = tw.startsWith("http")
                ? tw
                : "https://x.com/" + tw.replace(/^@/, "");
              links.push({ label: "Twitter", href, icon: Icon.Twitter });
            }
            if (li) {
              const href = li.startsWith("http")
                ? li
                : "https://www.linkedin.com/in/" + li;
              links.push({ label: "LinkedIn", href, icon: Icon.LinkedIn });
            }
            if (be) {
              const href = be.startsWith("http")
                ? be
                : "https://www.behance.net/" + be;
              links.push({ label: "Behance", href, icon: Icon.Behance });
            }

            if (links.length === 0) return null;
            return (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Social Media
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 text-sm hover:bg-gray-100"
                    >
                      <span className="text-gray-700">{l.icon}</span>
                      <span className="flex-1">{l.label}</span>
                      <span className="text-gray-400">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Portfolio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Portfolio</h3>
              {(() => {
                const ig = (state?.instagram || artist.instagram) as
                  | string
                  | undefined;
                if (!ig) return null;
                const href = ig.startsWith("http")
                  ? ig
                  : "https://instagram.com/" + ig.replace(/^@/, "");
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#EF473B] font-medium"
                  >
                    View all
                  </a>
                );
              })()}
            </div>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory">
              {(artist.portfolio && artist.portfolio.length > 0
                ? artist.portfolio
                : [
                    "https://picsum.photos/seed/m1/600/400",
                    "https://picsum.photos/seed/m1/600/400",
                    "https://picsum.photos/seed/m1/600/400",
                    "https://picsum.photos/seed/m1/600/400",
                  ]
              )
                .slice(0, 10)
                .map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Work ${i + 1}`}
                    className="w-48 h-32 object-cover rounded-xl flex-shrink-0 snap-start"
                  />
                ))}
            </div>
          </div>

          {/* Packages or Assign CTA depending on flow */}
          {state?.fromJobDetails ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">
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
                      Charge: ${state.bid || artist.price}
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
                      className="px-4 py-2 rounded-xl bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32] transition"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Packages</h3>
              {(artist.packages && artist.packages.length > 0
                ? artist.packages
                : [
                    {
                      name: "Basic",
                      price: artist.price,
                      description:
                        "Great for small tasks and quick turnarounds.",
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
                      <div className="text-lg font-bold text-[#EF473B]">
                        ${pkg.price}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowPayment(true);
                        }}
                        className="mt-2 px-4 py-2 rounded-xl bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32] transition"
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
    </div>
  );
}
