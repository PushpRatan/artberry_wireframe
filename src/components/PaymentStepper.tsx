import { useUserContext } from "../contexts/UserContext";

interface PaymentStepperProps {
  currentStep: number;
  isCollapsed?: boolean;
  className?: string;
  onAdvance?: () => void;
}

const steps = [
  { id: 1, name: "Payment", description: "Payment received" },
  { id: 2, name: "Confirmed", description: "Order confirmed" },
  { id: 3, name: "In Progress", description: "Work in progress" },
  { id: 4, name: "Delivered", description: "Project completed" },
];

export default function PaymentStepper({
  currentStep,
  isCollapsed = false,
  className = "",
  onAdvance,
}: PaymentStepperProps) {
  const { accountType } = useUserContext();
  if (isCollapsed) {
    // Show only current step in collapsed view
    const currentStepData = steps.find((step) => step.id === currentStep);
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full ${
                step.id <= currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-600">
          {currentStepData?.name || "Unknown"}
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        step.id < currentStep ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="text-center flex-1">
            <div
              className={`text-xs font-medium ${
                step.id <= currentStep ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {step.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">{step.description}</div>
          </div>
        ))}
      </div>

      {/* Advance button below stepper */}
      {accountType === "artist" && onAdvance && (
        <div className="pt-1">
          <button
            onClick={onAdvance}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Advance to next step"
          >
            Advance
          </button>
        </div>
      )}
    </div>
  );
}
