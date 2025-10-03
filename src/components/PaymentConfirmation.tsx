import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface PaymentConfirmationProps {
  artist: {
    name: string;
    avatar: string;
    slug: string;
  };
  package: {
    name: string;
    price: number;
    description: string;
    deliverables: string[];
  };
  onBack: () => void;
  onPaymentComplete: (artist: any, pkg: any) => void;
}

export default function PaymentConfirmation({
  artist,
  package: pkg,
  onBack,
  onPaymentComplete,
}: PaymentConfirmationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === "pending") {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && paymentStatus === "pending") {
      setPaymentStatus("processing");
    }
  }, [timeLeft, paymentStatus]);

  const handlePayment = () => {
    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("completed");
      // Auto-generate message to artist
      onPaymentComplete(effectiveArtist, effectivePkg);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (paymentStatus === "completed") {
    return (
      <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-[#2ecc711a] rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Your payment has been processed and the artist has been
                notified.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                Order Details
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Artist:</span>
                  <span className="text-gray-900">{artist.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="text-gray-900">{pkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="text-gray-900 font-semibold">
                    ${pkg.price}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/messages")}
                className="w-full bg-[#EF473B] text-white py-3 rounded-lg font-medium hover:bg-[#d63d32] transition"
              >
                View Messages
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navState = (location.state as any) || {};
  const effectiveArtist = navState.artist || artist;
  const effectivePkg = navState.package || pkg;

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm mb-2"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Payment
            </h2>
            <p className="text-gray-600">
              Scan the QR code to pay for your selected package
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={effectiveArtist.avatar}
                  alt={effectiveArtist.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {effectiveArtist.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {effectivePkg.name}
                  </div>
                </div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Package:</span>
                  <span className="text-gray-900">{effectivePkg.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Description:</span>
                  <span className="text-gray-900">
                    {effectivePkg.description}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deliverables:</span>
                  <span className="text-gray-900">
                    {effectivePkg.deliverables.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-[#EF473B]">${effectivePkg.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 inline-block">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-sm text-gray-600">QR Code</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Scan with your payment app
                  </div>
                </div>
              </div>
            </div>

            {paymentStatus === "pending" && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">
                  Payment expires in:{" "}
                  <span className="font-mono text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  onClick={handlePayment}
                  className="px-6 py-2 bg-[#2ecc71] text-white rounded-lg font-medium hover:bg-[#27ae60] transition"
                >
                  Simulate Payment
                </button>
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2 text-[#EF473B]">
                  <div className="w-4 h-4 border-2 border-[#EF473B] border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing payment...</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Instructions */}
          <div className="bg-[#EF473B1a] rounded-lg p-4">
            <h4 className="font-semibold text-[#EF473B] mb-2">
              Payment Instructions
            </h4>
            <ul className="text-sm text-[#2b2b2b] space-y-1">
              <li>• Scan the QR code with your mobile payment app</li>
              <li>• Confirm the amount and artist details</li>
              <li>• Complete the payment</li>
              <li>
                • You'll receive a confirmation and the artist will be notified
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
