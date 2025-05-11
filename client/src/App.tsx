import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "./pages/auth-page";
import HomePage from "./pages/home-page";
import BookingPage from "./pages/booking-page";
import HistoryPage from "./pages/history-page";
import ChatPage from "./pages/chat-page";
import ChatSupportPage from "./pages/chat-support";
import Navbar from "./components/navbar";
import "./i18n"; // Import i18n configuration

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/book" component={BookingPage} />
      <ProtectedRoute path="/history" component={HistoryPage} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/chat-support" component={ChatSupportPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Router />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;