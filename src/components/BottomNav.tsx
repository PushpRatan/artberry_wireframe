import { useUserContext } from "../contexts/UserContext";

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
  const { accountType } = useUserContext();

  const item = (
    key: "explore" | "dashboard" | "messages" | "profile",
    label: string,
    icon: string
  ) => (
    <button
      onClick={() => onChange(key)}
      className={`flex-1 flex flex-col items-center py-3 px-2 text-sm ${
        active === key ? "text-black" : "text-[#2B2B2B]"
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
          item(
            "explore",
            accountType === "patron" ? "Artists" : "Jobs",
            accountType === "patron" ? "🎨" : "💼"
          ),
          item("dashboard", "Orders", "💳"),
          item("messages", "Messages", "💬"),
          item("profile", "Profile", "👤"),
        ]}
      </div>
      {showPrimary && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <button
            onClick={onPrimaryClick}
            className="w-12 h-12 rounded-full bg-[#EF473B] text-white text-2xl leading-none shadow-lg flex items-center justify-center border-4 border-white hover:bg-[#d63d32]"
            aria-label="Create"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
