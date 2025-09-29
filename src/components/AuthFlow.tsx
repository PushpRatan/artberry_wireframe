import { useState } from "react";
import ArtistOnboarding from "./CreatePackage";
import Explore from "./Explore";
import { useUserContext } from "../contexts/UserContext";

interface AuthFlowProps {
  currentView:
    | "welcome"
    | "login"
    | "signup"
    | "onboarding"
    | "artist-discipline"
    | "artist-setup"
    | "explore"
    | "dashboard";
  setCurrentView: (
    view:
      | "welcome"
      | "login"
      | "signup"
      | "onboarding"
      | "artist-discipline"
      | "artist-setup"
      | "explore"
      | "dashboard"
  ) => void;
}

export default function AuthFlow({
  currentView,
  setCurrentView,
}: AuthFlowProps) {
  const { accountType, setAccountType, setArtistDiscipline } = useUserContext();
  const [userType, setUserType] = useState<"artist" | "patron" | null>(
    accountType
  );

  const handleSignUp = () => {
    setCurrentView("onboarding");
  };

  const handleUserTypeSelect = (type: "artist" | "patron") => {
    setUserType(type);
    setAccountType(type);

    if (type === "artist") {
      setCurrentView("artist-discipline");
    } else {
      setTimeout(() => {
        setCurrentView("explore");
      }, 500);
    }
  };

  // Artist onboarding completion is provided as packages; advance to dashboard

  const handleArtistSetupSkip = () => {
    setCurrentView("explore");
  };

  const WelcomeScreen = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Find Amazing Artists
      </h1>
      <p className="text-gray-600 mb-8">
        Hire talented creators for your projects
      </p>

      <div className="space-y-4">
        <button
          onClick={() => setCurrentView("signup")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </button>

        <button
          onClick={() => setCurrentView("login")}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          I already have an account
        </button>
      </div>
    </div>
  );

  const AuthOptions = ({ isLogin = false }: { isLogin?: boolean }) => (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {isLogin ? "Welcome back" : "Join us today"}
      </h2>

      {/* Google Sign In */}
      <button
        onClick={isLogin ? () => setCurrentView("explore") : handleSignUp}
        className="w-full border border-gray-300 rounded-lg py-3 px-4 mb-4 flex items-center justify-center hover:bg-gray-50 transition"
      >
        <div className="w-5 h-5 bg-red-500 rounded-full mr-3"></div>
        Continue with Google
      </button>

      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Email Form */}
      <div className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={isLogin ? () => setCurrentView("explore") : handleSignUp}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {isLogin ? "Sign in" : "Create account"}
        </button>
      </div>

      <p className="text-center mt-6 text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setCurrentView(isLogin ? "signup" : "login")}
          className="text-blue-600 font-medium"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );

  const Onboarding = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🎉</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Welcome aboard!
        </h2>
        <p className="text-gray-600">How would you like to use the platform?</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleUserTypeSelect("artist")}
          className="w-full text-left border-2 border-gray-200 hover:border-blue-300 bg-white p-4 rounded-lg transition-all hover:shadow-sm"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">🎨</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">I'm an Artist</div>
              <div className="text-sm text-gray-600">
                I want to offer my creative services
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleUserTypeSelect("patron")}
          className="w-full text-left border-2 border-gray-200 hover:border-blue-300 bg-white p-4 rounded-lg transition-all hover:shadow-sm"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg">💼</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">I'm a Patron</div>
              <div className="text-sm text-gray-600">
                I want to hire talented artists
              </div>
            </div>
          </div>
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-6">
        You can change this later in your profile settings
      </p>
    </div>
  );

  const ArtistDiscipline = () => {
    const disciplines = [
      { key: "painter", label: "Painter", icon: "🖌️" },
      { key: "sculptor", label: "Sculptor", icon: "🗿" },
      { key: "musician", label: "Musician", icon: "🎸" },
      { key: "photographer", label: "Photographer", icon: "📷" },
      { key: "ceramicist", label: "Ceramic Artist", icon: "🏺" },
      { key: "woodworker", label: "Woodworker", icon: "🪵" },
      { key: "metalworker", label: "Metalworker", icon: "⚒️" },
      { key: "tattoo", label: "Tattoo Artist", icon: "🖋️" },
      { key: "makeup", label: "Makeup Artist", icon: "💄" },
      { key: "florist", label: "Florist", icon: "💐" },
      { key: "fashion_tailor", label: "Tailor / Fashion Maker", icon: "🧵" },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Select your discipline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {disciplines.map((d) => (
            <button
              key={d.key}
              onClick={() => {
                setArtistDiscipline(d.label);
                setCurrentView("artist-setup");
              }}
              className="w-full text-left border-2 border-gray-200 hover:border-blue-300 bg-white p-4 rounded-lg transition-all hover:shadow-sm"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">{d.icon}</span>
                </div>
                <div className="font-medium text-gray-900">{d.label}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center">&nbsp;</p>
      </div>
    );
  };

  const ArtistSetup = () => {
    const { artistDiscipline } = useUserContext();

    // Map the discipline label to our template key
    const getDisciplineKey = (label: string): string => {
      const disciplineMap: Record<string, string> = {
        Painter: "visual-arts",
        Sculptor: "visual-arts",
        Musician: "music-sound",
        Photographer: "photography-videography",
        "Ceramic Artist": "visual-arts",
        Woodworker: "visual-arts",
        Metalworker: "visual-arts",
        "Tattoo Artist": "visual-arts",
        "Makeup Artist": "fashion-styling",
        Florist: "visual-arts",
        "Tailor / Fashion Maker": "fashion-styling",
      };
      return disciplineMap[label] || "visual-arts"; // fallback
    };

    return (
      <div>
        <ArtistOnboarding
          onComplete={(_packages) => {
            setCurrentView("explore");
          }}
          onSkip={handleArtistSetupSkip}
          onBack={() => setCurrentView("artist-discipline")}
          discipline={getDisciplineKey(artistDiscipline || "")}
        />
      </div>
    );
  };

  const ExploreView = () => (
    <Explore
      onNavigate={(view) => {
        // Handle navigation between tabs within Explore component
        console.log("Navigate to:", view);
      }}
    />
  );

  const Dashboard = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">
            {userType === "artist" ? "🎨" : "💼"}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Welcome
          {userType ? `, ${userType === "artist" ? "Artist" : "Patron"}!` : "!"}
        </h2>
        <p className="text-gray-600">
          {userType === "artist"
            ? "Start showcasing your talent and find clients"
            : "Discover amazing artists for your projects"}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">
          {userType === "artist"
            ? "Your artist profile is ready! Start by adding your portfolio."
            : "Next: Browse artist profiles and post projects"}
        </p>
      </div>

      <button
        onClick={() => setCurrentView("welcome")}
        className="text-blue-600 font-medium"
      >
        Sign out
      </button>
    </div>
  );

  const views = {
    welcome: <WelcomeScreen />,
    login: <AuthOptions isLogin={true} />,
    signup: <AuthOptions isLogin={false} />,
    onboarding: <Onboarding />,
    "artist-discipline": <ArtistDiscipline />,
    "artist-setup": <ArtistSetup />,
    explore: <ExploreView />,
    dashboard: <Dashboard />,
  };

  return (
    <div className="w-full">
      {/* Show back button except on welcome, dashboard, artist-setup, and explore */}
      {!["welcome", "dashboard", "artist-setup", "explore"].includes(
        currentView
      ) && (
        <button
          onClick={() => {
            if (currentView === "onboarding") setCurrentView("signup");
            else if (currentView === "artist-discipline")
              setCurrentView("onboarding");
            else if (currentView === "login" || currentView === "signup")
              setCurrentView("welcome");
          }}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Back
        </button>
      )}

      {views[currentView]}
    </div>
  );
}
