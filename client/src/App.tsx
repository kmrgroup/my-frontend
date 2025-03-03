import React from 'react';
import { Switch, Route, useLocation, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import IntroVideo from "@/components/intro/IntroVideo";
import Welcome from "@/pages/welcome";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard";
import PostLogin from "@/pages/post-login";
import NotFound from "@/pages/not-found";

// Lazy load mining-dependent components
const Mining = React.lazy(() => import("@/pages/mining"));
const Mainnet = React.lazy(() => import("@/pages/mainnet"));
const Node = React.lazy(() => import("@/pages/node"));

// Lazy load non-mining components
const Profile = React.lazy(() => import("@/pages/profile"));
const Utilities = React.lazy(() => import("@/pages/utilities"));
const Roles = React.lazy(() => import("@/pages/roles"));
const AIChat = React.lazy(() => import("@/pages/ai-chat"));
const Social = React.lazy(() => import("@/pages/social"));
const FAQ = React.lazy(() => import("@/pages/faq"));
const Whitepaper = React.lazy(() => import("@/pages/whitepaper"));
const CoreTeam = React.lazy(() => import("@/pages/core-team"));
const Notifications = React.lazy(() => import("@/pages/notifications"));
const Security = React.lazy(() => import("@/pages/security"));
const History = React.lazy(() => import("@/pages/history"));
const Achievements = React.lazy(() => import("@/pages/achievements"));
const Referrals = React.lazy(() => import("@/pages/referrals"));

// Add Wallet import
const Wallet = React.lazy(() => import("@/pages/wallet"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const userId = sessionStorage.getItem("userId");

        if (!userId || userId === "null" || userId === "undefined") {
          console.log("No user ID found in session");
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        console.log("Checking auth for user ID:", userId);
        try {
          const response = await fetch(`/api/users/${userId}`);

          if (!response.ok) {
            console.log("Auth check failed with status:", response.status);
            setIsValid(false);
            sessionStorage.removeItem("userId");
            setIsLoading(false);
            return;
          }

          const userData = await response.json();
          console.log("User authenticated:", userData.username);
          setIsValid(true);

          const isNewUser = sessionStorage.getItem("isNewUser") === "true";
          const hasCompletedOnboarding = sessionStorage.getItem("hasCompletedOnboarding");
          if (isNewUser && !hasCompletedOnboarding) {
            setShowOnboarding(true);
          }
        } catch (fetchError) {
          console.error("Fetch error during auth check:", fetchError);
          setIsValid(false);
          sessionStorage.removeItem("userId");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsValid(false);
        sessionStorage.removeItem("userId");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isValid) {
    console.log("User not authenticated, redirecting to welcome page");
    return <Redirect to="/welcome" />;
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
}

// Update the MiningFeatureWrapper component
function MiningFeatureWrapper({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/intro" component={IntroVideo} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/post-login" component={PostLogin} />
      <Route>
        <ProtectedRoute>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />

              {/* Mining routes with GPU check */}
              <Route path="/mining">
                <MiningFeatureWrapper>
                  <Mining />
                </MiningFeatureWrapper>
              </Route>
              <Route path="/mainnet">
                <MiningFeatureWrapper>
                  <Mainnet />
                </MiningFeatureWrapper>
              </Route>
              <Route path="/node">
                <MiningFeatureWrapper>
                  <Node />
                </MiningFeatureWrapper>
              </Route>

              {/* Add Wallet Route */}
              <Route path="/wallet" component={Wallet} />

              {/* Non-mining routes */}
              <Route path="/profile" component={Profile} />
              <Route path="/notifications" component={Notifications} />
              <Route path="/security" component={Security} />
              <Route path="/history" component={History} />
              <Route path="/achievements" component={Achievements} />
              <Route path="/referrals" component={Referrals} />
              <Route path="/utilities" component={Utilities} />
              <Route path="/roles" component={Roles} />
              <Route path="/ai-chat" component={AIChat} />
              <Route path="/social" component={Social} />
              <Route path="/faq" component={FAQ} />
              <Route path="/whitepaper" component={Whitepaper} />
              <Route path="/core-team" component={CoreTeam} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  const [, setLocation] = useLocation();
  const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");

  useEffect(() => {
    if (!hasSeenIntro) {
      setLocation("/intro");
    }
  }, [hasSeenIntro, setLocation]);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;