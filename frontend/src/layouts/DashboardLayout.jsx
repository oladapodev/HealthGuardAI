import React, { useState, useEffect } from "react";
import Sidebar from "../components/Dashboard/SideBar";
import TopBar from "../components/Dashboard/TopBar";
import Onboarding from "../components/Dashboard/Onboarding";
import { Outlet } from "react-router-dom";
import api from "../api/axios";

const DashboardLayout = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 🔒 CHECK IF ONBOARDING WAS ALREADY DONE IN LOCALSTORAGE (PERSISTENT)
        const onboardingDone = localStorage.getItem("onboarding_complete");
        if (onboardingDone === "true") {
          setShowOnboarding(false);
          return;
        }

        if (token?.startsWith("mock-session-token")) {
          // For demo users, use session check instead of persistent
          const sessionShown = sessionStorage.getItem("onboarding_shown");
          if (!sessionShown) {
            setShowOnboarding(true);
            sessionStorage.setItem("onboarding_shown", "true");
          }
          return;
        }

        const response = await api.get("/users/profile");
        // If gender or age is missing, show onboarding
        if (!response.data?.profile?.gender || !response.data?.profile?.age) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        // If API fails (e.g. no DB), fallback to session check
        if (!sessionStorage.getItem("onboarding_shown")) {
          setShowOnboarding(true);
          sessionStorage.setItem("onboarding_shown", "true");
        }
      }
    };
    checkProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
