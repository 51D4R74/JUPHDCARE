import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import CheckInPage from "@/pages/checkin";
import ProtecaoPage from "@/pages/protecao";
import RHDashboardPage from "@/pages/rh-dashboard";

function ProtectedRoute({ component: Component, requireRole }: { component: () => JSX.Element; requireRole?: string }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/" />;
  if (requireRole && user?.role !== requireRole) return <Redirect to="/dashboard" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={DashboardPage} />}
      </Route>
      <Route path="/checkin">
        {() => <ProtectedRoute component={CheckInPage} />}
      </Route>
      <Route path="/protecao">
        {() => <ProtectedRoute component={ProtecaoPage} />}
      </Route>
      <Route path="/rh">
        {() => <ProtectedRoute component={RHDashboardPage} requireRole="rh" />}
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
