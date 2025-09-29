import BottomNav from "./BottomNav";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export default function Messages() {
  const navigate = useNavigate();
  const { accountType } = useUserContext();

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect with artists and clients</p>
        </div>

        {/* Conversations */}
        <div className="space-y-3">
          {[
            {
              name: "Sarah Chen",
              avatar: "https://i.pravatar.cc/80?img=68",
              lastMessage: "Thanks for the feedback! I'll make those changes.",
              time: "2m ago",
              unread: true,
              online: true,
            },
            {
              name: "Marcus Rivera",
              avatar: "https://i.pravatar.cc/80?img=15",
              lastMessage:
                "The logo looks great. When can we discuss the next phase?",
              time: "1h ago",
              unread: false,
              online: false,
            },
            {
              name: "Luna Park",
              avatar: "https://i.pravatar.cc/80?img=47",
              lastMessage:
                "I've sent the final files. Let me know if you need anything else.",
              time: "3h ago",
              unread: false,
              online: true,
            },
            {
              name: "Alex Thompson",
              avatar: "https://i.pravatar.cc/80?img=32",
              lastMessage:
                "Can we schedule a call to discuss the project requirements?",
              time: "1d ago",
              unread: true,
              online: false,
            },
            {
              name: "Emma Wilson",
              avatar: "https://i.pravatar.cc/80?img=45",
              lastMessage:
                "The design is perfect! Thank you for your amazing work.",
              time: "2d ago",
              unread: false,
              online: false,
            },
          ].map((conversation, index) => (
            <button
              key={index}
              onClick={() => {
                const slug = conversation.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");
                navigate(`/messages/${slug}`, {
                  state: {
                    artist: {
                      name: conversation.name,
                      avatar: conversation.avatar,
                      slug,
                    },
                  },
                });
              }}
              className="w-full text-left border border-gray-200 rounded-2xl p-4 bg-white hover:bg-gray-50 transition shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-3">
                {/* Avatar + Online indicator */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 block w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 truncate pr-2">
                      {conversation.name}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {conversation.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate pr-2">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread && (
                      <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="shrink-0">
        <BottomNav
          active="messages"
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
