import { useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import AuthFlow from "./components/AuthFlow";
import Explore from "./components/Explore";
import ArtistProfile from "./components/ArtistProfile";
import ArtistList from "./components/ArtistList";
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import Dashboard from "./components/Dashboard";
import Messages from "./components/Messages";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import PaymentConfirmation from "./components/PaymentConfirmation";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const setCurrentView = useCallback(
    (
      view:
        | "welcome"
        | "login"
        | "signup"
        | "onboarding"
        | "artist-discipline"
        | "artist-setup"
        | "explore"
        | "dashboard"
    ) => {
      const routeMap: Record<string, string> = {
        welcome: "/",
        login: "/login",
        signup: "/signup",
        onboarding: "/onboarding",
        "artist-discipline": "/artist-discipline",
        "artist-setup": "/artist-setup",
        explore: "/explore",
        dashboard: "/dashboard",
      };
      navigate(routeMap[view]);
    },
    [navigate]
  );

  // Treat auth/onboarding pages as centered modal, others use fixed-height frame
  const isAuthView =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/onboarding" ||
    location.pathname === "/artist-discipline" ||
    location.pathname === "/artist-setup";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div
        className={
          isAuthView
            ? `w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8`
            : `w-full max-w-md bg-white rounded-2xl shadow-sm h-[calc(100vh-2rem)] overflow-hidden`
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <AuthFlow currentView="welcome" setCurrentView={setCurrentView} />
            }
          />
          <Route
            path="/login"
            element={
              <AuthFlow currentView="login" setCurrentView={setCurrentView} />
            }
          />
          <Route
            path="/signup"
            element={
              <AuthFlow currentView="signup" setCurrentView={setCurrentView} />
            }
          />
          <Route
            path="/onboarding"
            element={
              <AuthFlow
                currentView="onboarding"
                setCurrentView={setCurrentView}
              />
            }
          />
          <Route
            path="/artist-discipline"
            element={
              <AuthFlow
                currentView="artist-discipline"
                setCurrentView={setCurrentView}
              />
            }
          />
          <Route
            path="/artist-setup"
            element={
              <AuthFlow
                currentView="artist-setup"
                setCurrentView={setCurrentView}
              />
            }
          />
          <Route path="/explore" element={<Explore onNavigate={() => {}} />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/job/:slug" element={<JobDetails />} />
          <Route
            path="/payment"
            element={
              <PaymentConfirmation
                artist={{ name: "", avatar: "", slug: "" }}
                package={{
                  name: "",
                  price: 0,
                  description: "",
                  deliverables: [],
                }}
                onBack={() => navigate(-1)}
                onPaymentComplete={(artist, pkg) =>
                  navigate(
                    `/messages/${
                      artist.slug ||
                      artist.name.toLowerCase().replace(/\s+/g, "-")
                    }` as string,
                    {
                      state: {
                        artist: {
                          name: artist.name,
                          avatar: artist.avatar,
                          slug:
                            artist.slug ||
                            artist.name.toLowerCase().replace(/\s+/g, "-"),
                        },
                        initialMessage: `Assigned: ${pkg.name} ($${pkg.price}). ${pkg.description}`,
                      },
                    }
                  )
                }
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard onNavigate={() => {}} />}
          />
          <Route
            path="/messages"
            element={<Messages onNavigate={() => {}} />}
          />
          <Route path="/messages/:slug" element={<Chat />} />
          <Route path="/profile" element={<Profile onNavigate={() => {}} />} />
          <Route
            path="/edit-profile"
            element={<EditProfile accountType="artist" onSave={() => {}} />}
          />
          <Route path="/artist/:slug" element={<ArtistProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
