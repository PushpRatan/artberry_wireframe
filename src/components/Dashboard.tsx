import BottomNav from "./BottomNav";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import PaymentStepper from "./PaymentStepper";
import { useUserContext } from "../contexts/UserContext";

interface DashboardProps {
  onNavigate: (view: "explore" | "dashboard" | "messages" | "profile") => void;
}

export default function Dashboard({ onNavigate: _ }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountType } = useUserContext();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [unassigned, setUnassigned] = useState<Array<any>>([
    { title: "Birthday Photoshoot", date: "2024-12-28", budget: "12000" },
    { title: "Corporate Event Emcee", date: "2025-01-05", budget: "18000" },
    { title: "Bridal Mehendi", date: "2024-12-22", budget: "20000" },
  ]);
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Wedding Photography – Full Day",
      client: "Rahul Verma",
      clientSlug: "rahul-verma",
      status: "In Progress",
      price: "₹60,000",
      dueDate: "Dec 15",
      paymentStep: 2,
      description:
        "Full-day wedding coverage including pre-wedding rituals, ceremony, and reception.",
      deliverables: [
        "8–10 hours coverage",
        "300 edited photos",
        "Premium photo album",
        "Online gallery access",
      ],
      startDate: "Dec 1, 2024",
      deliveryDate: "Dec 22, 2024",
      progress: 65,
      notes: "Venue confirmed. Golden hour couple shoot scheduled for 4:45 PM.",
    },
    {
      id: 2,
      title: "Bridal Makeup – Single Event",
      client: "Ananya Sharma",
      clientSlug: "ananya-sharma",
      status: "Confirmed",
      price: "₹25,000",
      dueDate: "Dec 20",
      paymentStep: 1,
      description: "Bridal makeup for wedding ceremony with on-site touch-ups.",
      deliverables: [
        "1 bridal makeup session",
        "Hair styling",
        "On-site touch-ups",
        "Pre-visit skin consultation",
      ],
      startDate: "Dec 18, 2024",
      deliveryDate: "Dec 20, 2024",
      progress: 15,
      notes: "Trial look approved. Arrival at venue by 8:00 AM.",
    },
    {
      id: 3,
      title: "Mehendi Ceremony – Family Pack",
      client: "Kavya Patel",
      clientSlug: "kavya-patel",
      status: "Completed",
      price: "₹20,000",
      dueDate: "Dec 10",
      paymentStep: 4,
      description: "Bridal mehendi plus designs for immediate family members.",
      deliverables: [
        "Bridal hands & feet",
        "4 family members (hands)",
        "Aftercare kit",
        "Free touch-up next day",
      ],
      startDate: "Dec 9, 2024",
      deliveryDate: "Dec 11, 2024",
      progress: 100,
      notes:
        "Event completed successfully. Client requested photos for portfolio.",
    },
  ] as Array<any>);

  // Patron-side mock projects (bookings) showing artist info
  const patronProjects: Array<any> = [
    {
      id: 11,
      title: "Wedding Photography – Full Day",
      artistName: "Arjun Mehta",
      artistSlug: "arjun-mehta",
      artistAvatar: "https://i.pravatar.cc/120?img=12",
      status: "Confirmed",
      price: "₹60,000",
      dueDate: "Dec 15",
      paymentStep: 2,
      description:
        "Full-day wedding coverage including pre-wedding rituals, ceremony, and reception.",
      deliverables: [
        "8–10 hours coverage",
        "300 edited photos",
        "Premium photo album",
        "Online gallery access",
      ],
      startDate: "Dec 1, 2024",
      deliveryDate: "Dec 22, 2024",
      progress: 65,
      notes: "Booking confirmed. Team arrival at 9:00 AM.",
    },
    {
      id: 12,
      title: "Bridal Makeup – Single Event",
      artistName: "Priya Kapoor",
      artistSlug: "priya-kapoor",
      artistAvatar: "https://i.pravatar.cc/120?img=35",
      status: "In Progress",
      price: "₹25,000",
      dueDate: "Dec 20",
      paymentStep: 1,
      description: "Bridal makeup for wedding ceremony with on-site touch-ups.",
      deliverables: [
        "1 bridal makeup session",
        "Hair styling",
        "On-site touch-ups",
        "Pre-visit skin consultation",
      ],
      startDate: "Dec 18, 2024",
      deliveryDate: "Dec 20, 2024",
      progress: 10,
      notes: "Trial scheduled on Dec 16, 6:00 PM.",
    },
    {
      id: 13,
      title: "Sangeet Night – Dance Choreography",
      artistName: "Neha Rao",
      artistSlug: "neha-rao",
      artistAvatar: "https://i.pravatar.cc/120?img=20",
      status: "Completed",
      price: "₹35,000",
      dueDate: "Dec 10",
      paymentStep: 4,
      description: "Family choreography for 4 songs and stage coordination.",
      deliverables: [
        "4 choreographed acts",
        "Final rehearsal",
        "Event coordination",
      ],
      startDate: "Dec 5, 2024",
      deliveryDate: "Dec 10, 2024",
      progress: 100,
      notes: "Great event. Client loved the finale routine.",
    },
  ];

  const patronUpcoming = patronProjects.filter((p) => p.status !== "Completed");
  const patronCompleted = patronProjects.filter(
    (p) => p.status === "Completed"
  );

  // Open create sheet if navigated with state { create: true }
  if (
    accountType === "patron" &&
    (location.state as any)?.create &&
    !createOpen
  ) {
    setCreateOpen(true);
    // clear one-time state to avoid reopening on re-render
    navigate(location.pathname, { replace: true, state: {} });
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your projects and activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-2xl p-4 bg-white">
            <div className="text-2xl font-bold text-[#EF473B]">
              {accountType === "artist"
                ? projects.length
                : patronUpcoming.length}
            </div>
            <div className="text-sm text-gray-600">
              {accountType === "artist"
                ? "Active Projects"
                : "Upcoming Bookings"}
            </div>
          </div>
          {accountType === "artist" ? (
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="text-2xl font-bold text-[#2ecc71]">₹20,450</div>
              <div className="text-sm text-gray-600">Earnings</div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="text-2xl font-bold text-[#6a1b9a]">
                {unassigned.length}
              </div>
              <div className="text-sm text-gray-600">Unassigned Bookings</div>
            </div>
          )}
        </div>

        {/* Upcoming Bookings / Recent Projects */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {accountType === "artist" ? "Recent Projects" : "Upcoming Bookings"}
          </h3>
          <div className="space-y-3">
            {(accountType === "artist" ? projects : patronUpcoming).map(
              (project) => {
                const isExpanded = expandedProject === project.id;

                return (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200"
                  >
                    {/* Collapsed View */}
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        setExpandedProject(isExpanded ? null : project.id)
                      }
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {accountType === "artist"
                              ? project.client
                              : project.artistName}
                          </div>
                          <div className="flex items-center gap-2">
                            <PaymentStepper
                              currentStep={project.paymentStep}
                              isCollapsed={true}
                            />
                            <button
                              title="Message client"
                              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                const slug =
                                  accountType === "artist"
                                    ? project.clientSlug
                                    : project.artistSlug;
                                const name =
                                  accountType === "artist"
                                    ? project.client
                                    : project.artistName;
                                const avatar =
                                  accountType === "artist"
                                    ? `https://i.pravatar.cc/160?u=${project.clientSlug}`
                                    : project.artistAvatar;
                                navigate(`/messages/${slug}`, {
                                  state: {
                                    artist: {
                                      name,
                                      avatar,
                                      slug,
                                    },
                                  },
                                });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7.5 8.25h9m-9 3h6.75m3.375 7.125-3.51-1.17a8.96 8.96 0 0 1-2.79.45c-4.28 0-7.75-2.91-7.75-6.5s3.47-6.5 7.75-6.5 7.75 2.91 7.75 6.5c0 1.61-.64 3.09-1.72 4.28v3.94z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-[#EF473B]">
                            {project.price}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            Due: {project.dueDate}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.status === "Completed"
                                ? "bg-[#2ecc7133] text-[#2ecc71]"
                                : project.status === "In Progress"
                                ? "bg-[#EF473B33] text-[#EF473B]"
                                : "bg-[#ff990033] text-[#ff9900]"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Click to view details
                        </div>
                        <div
                          className={`transform transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded View */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 p-4 space-y-4">
                        {/* Project Description */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600">
                            {project.description}
                          </p>
                          {accountType === "patron" && (
                            <div className="flex items-center gap-2 mt-3">
                              <img
                                src={project.artistAvatar}
                                alt={project.artistName}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              />
                              <div className="text-sm text-gray-700">
                                By{" "}
                                <span className="font-medium text-gray-900">
                                  {project.artistName}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Payment Stepper */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Project Progress
                          </h4>
                          <PaymentStepper
                            currentStep={project.paymentStep}
                            onAdvance={
                              accountType === "artist"
                                ? () => {
                                    setProjects((prev) =>
                                      prev.map((p) =>
                                        p.id === project.id
                                          ? {
                                              ...p,
                                              paymentStep: Math.min(
                                                4,
                                                (p.paymentStep || 1) + 1
                                              ),
                                            }
                                          : p
                                      )
                                    );
                                  }
                                : undefined
                            }
                          />
                        </div>

                        {/* Project Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm mb-1">
                              Start Date
                            </h5>
                            <p className="text-sm text-gray-600">
                              {project.startDate}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm mb-1">
                              Delivery Date
                            </h5>
                            <p className="text-sm text-gray-600">
                              {project.deliveryDate || "TBD"}
                            </p>
                          </div>
                        </div>

                        {/* Deliverables */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Deliverables
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {project.deliverables.map(
                              (deliverable: string, idx: number) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-1.5 h-1.5 bg-[#EF473B] rounded-full mr-2"></span>
                                  {deliverable}
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Notes */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Notes
                          </h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {project.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {accountType === "patron" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Unassigned Bookings ({unassigned.length})
            </h3>
            {unassigned.length === 0 ? (
              <div className="text-sm text-gray-500">
                No unassigned bookings.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {unassigned.slice(0, 4).map((req, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const slug = (req.title || "Untitled Project")
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      const budgetNum = Number.parseFloat(req.budget || "0");
                      navigate(`/job/${slug}`, {
                        state: {
                          title: req.title || "Untitled Project",
                          category: req.category || "General",
                          budget: Number.isFinite(budgetNum) ? budgetNum : 0,
                          proposals: 3,
                          client: "You",
                          avatar: "https://i.pravatar.cc/80?img=12",
                          description:
                            req.description ||
                            "Review candidate proposals and assign the best fit.",
                          location: req.location || "Unknown",
                          fromUnassigned: true,
                        },
                      });
                    }}
                    className="text-left border border-gray-200 rounded-2xl p-4 bg-white hover:bg-gray-50"
                  >
                    <div className="font-semibold text-gray-900 truncate">
                      {req.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Delivery: {req.date || "TBD"}
                    </div>
                    <div className="text-sm font-semibold text-[#EF473B] mt-2">
                      ₹{req.budget || "0"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {accountType === "patron" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Completed Bookings
            </h3>
            {patronCompleted.length === 0 ? (
              <div className="text-sm text-gray-500">
                No completed bookings.
              </div>
            ) : (
              <div className="space-y-3">
                {patronCompleted.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-2xl p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {project.artistName}
                        </div>
                        <PaymentStepper
                          currentStep={project.paymentStep}
                          isCollapsed={true}
                        />
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-[#EF473B]">
                          {project.price}
                        </div>
                        <div className="text-xs text-gray-500">
                          Delivered: {project.deliveryDate || "TBD"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="shrink-0">
        <BottomNav
          active="dashboard"
          onChange={handleTabChange}
          showPrimary={accountType === "patron"}
          onPrimaryClick={() => setCreateOpen(true)}
        />
      </div>

      {/* Create Project Bottom Sheet */}
      {accountType === "patron" && createOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30">
          <div className="w-full max-w-md bg-white rounded-t-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-base font-semibold text-gray-900">
                Create New Project
              </div>
              <button
                onClick={() => setCreateOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Engagement Photoshoot"
                  className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="e.g., 15000"
                    className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL (optional)
                </label>
                <input
                  value={newLogo}
                  onChange={(e) => setNewLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                  >
                    <option>General</option>
                    <option>Photography</option>
                    <option>Musician</option>
                    <option>Painter</option>
                    <option>Sketch Artist</option>
                    <option>Makeup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe what you need, scope, and expectations"
                  className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none min-h-[90px]"
                />
              </div>
              <button
                onClick={() => {
                  const item = {
                    title: newTitle || "Untitled Project",
                    date: newDate,
                    budget: newBudget,
                    category: newCategory,
                    location: newLocation,
                    description: newDescription,
                    logo: newLogo,
                  };
                  setUnassigned((prev) => [item, ...prev]);
                  setNewTitle("");
                  setNewDate("");
                  setNewBudget("");
                  setNewCategory("General");
                  setNewLocation("");
                  setNewDescription("");
                  setNewLogo("");
                  setCreateOpen(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
