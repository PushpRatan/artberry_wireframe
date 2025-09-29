interface BottomNavProps {
  active: "explore" | "dashboard" | "messages" | "profile";
  onChange: (tab: "explore" | "dashboard" | "messages" | "profile") => void;
  showPrimary?: boolean;
  onPrimaryClick?: () => void;
}

export default function BottomNav({
  active,
  onChange,
  showPrimary,
  onPrimaryClick,
}: BottomNavProps) {
  const item = (
    key: "explore" | "dashboard" | "messages" | "profile",
    label: string,
    icon: string
  ) => (
    <button
      onClick={() => onChange(key)}
      className={`flex-1 flex flex-col items-center py-3 px-2 text-sm ${
        active === key ? "text-black" : "text-gray-500"
      }`}
    >
      <span className="text-base mb-1">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="relative border-t border-black/10 bg-white rounded-b-2xl">
      <div className="flex">
        {[
          item("explore", "Explore", "🔍"),
          item("dashboard", "Dashboard", "📊"),
          item("messages", "Messages", "💬"),
          item("profile", "Profile", "👤"),
        ]}
      </div>
      {showPrimary && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <button
            onClick={onPrimaryClick}
            className="w-12 h-12 rounded-full bg-blue-600 text-white text-2xl leading-none shadow-lg flex items-center justify-center border-4 border-white hover:bg-blue-700"
            aria-label="Create"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
