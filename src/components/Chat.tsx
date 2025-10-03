import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type ChatLocationState = {
  artist?: { name: string; avatar: string; slug?: string };
  initialMessage?: string;
};

type Artist = {
  name: string;
  avatar: string;
};

const ARTIST_MOCKS: Record<string, Artist> = {
  "sarah-chen": {
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/160?img=68",
  },
  "marcus-rivera": {
    name: "Marcus Rivera",
    avatar: "https://i.pravatar.cc/160?img=15",
  },
};

export default function Chat() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { state } = useLocation() as { state?: ChatLocationState };

  const artist = useMemo<Artist | undefined>(() => {
    if (state?.artist?.name && state?.artist?.avatar) {
      return { name: state.artist.name, avatar: state.artist.avatar };
    }
    if (slug && ARTIST_MOCKS[slug]) return ARTIST_MOCKS[slug];
    if (slug) {
      const name = slug
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
      const seed =
        Math.abs(
          Array.from(slug).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
        ) % 70;
      return {
        name,
        avatar: `https://i.pravatar.cc/160?img=${seed || 12}`,
      };
    }
    return undefined;
  }, [slug, state]);

  const [messages, setMessages] = useState<
    Array<{ from: "me" | "them"; text: string; time: string }>
  >([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Order modal state
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderStep, setOrderStep] = useState<"form" | "pay">("form");
  const [offerName, setOfferName] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [requirements, setRequirements] = useState("");
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    // Seed the thread with the auto-generated message if provided
    if (state?.initialMessage) {
      setMessages([{ from: "me", text: state.initialMessage, time: "now" }]);
    }
  }, [state]);

  useEffect(() => {
    if (artist && messages.length === 0 && !state?.initialMessage) {
      setMessages([
        {
          from: "them",
          text: `Hi, this is ${artist.name}. How can I help you?`,
          time: "now",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist]);

  useEffect(() => {
    // Auto scroll to bottom on new messages
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (!artist) return null;

  const sendMessage = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      { from: "me", text: content, time: "now" },
    ]);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            ←
          </button>
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-sm">
            <div className="font-semibold text-gray-900">{artist.name}</div>
            <div className="text-gray-500">Online</div>
          </div>
        </div>
        <button
          onClick={() => {
            setOrderOpen(true);
            setOrderStep("form");
          }}
          className="px-3 py-1.5 rounded-lg bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32]"
        >
          Request Order
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            Say hello to start your conversation.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                m.from === "me"
                  ? "bg-[#EF473B] text-white"
                  : "bg-white text-gray-900"
              } max-w-[75%] px-3 py-2 rounded-xl shadow border border-gray-200`}
            >
              <div className="text-sm leading-relaxed">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Message ${artist.name}...`}
            className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={() => sendMessage()}
            className="px-4 py-2 rounded-xl bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32]"
          >
            Send
          </button>
        </div>
      </div>

      {/* Request Order Modal */}
      {orderOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="text-base font-semibold text-gray-900">
                {orderStep === "form" ? "Request Order" : "Scan to Pay"}
              </div>
              <button
                onClick={() => setOrderOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {orderStep === "form" ? (
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of the offer
                  </label>
                  <input
                    value={offerName}
                    onChange={(e) => setOfferName(e.target.value)}
                    placeholder="e.g., Elite Package"
                    className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={offerDescription}
                    onChange={(e) => setOfferDescription(e.target.value)}
                    placeholder="Briefly describe the offer"
                    className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 120"
                      className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements (optional)
                  </label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Share any references, sizes, or notes"
                    className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none min-h-[70px]"
                  />
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => setOrderStep("pay")}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#EF473B] text-white text-sm font-medium hover:bg-[#d63d32]"
                  >
                    Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="text-sm text-gray-700">
                  Please scan to pay and confirm your order.
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `pay:${artist.name}:${price || "0"}`
                    )}`}
                    alt="Payment QR"
                    className="w-44 h-44 rounded-lg border border-gray-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-gray-500">Offer</div>
                    <div className="font-medium text-gray-900 truncate">
                      {offerName || "Custom Offer"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-gray-500">Price</div>
                    <div className="font-medium text-gray-900">
                      ${price || "0"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOrderOpen(false);
                    setOrderStep("form");
                    // Optionally drop a message in the chat
                    const summary = `Requested order: ${
                      offerName || "Custom Offer"
                    } — $${price || "0"} on ${bookingDate || "TBD"}.`;
                    sendMessage(summary);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#2ecc71] text-white text-sm font-medium hover:bg-[#27ae60]"
                >
                  Paid
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
