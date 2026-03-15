import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import SubscriptionRequired from "@/pages/SubscriptionRequired";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import { BetaGuard } from "./components/BetaGuard";
import Home from "./pages/Home";
import AlphaRating from "./pages/AlphaRating";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutUs from "./pages/AboutUs";
import Audits from "./pages/Audits";
import Guides from "./pages/Guides";
import GuidePage from "./pages/GuidePage";

function Router() {
  return (
    <Switch>
      {/* Public routes — no beta guard */}
      <Route path={"/"} component={Home} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/terms-of-service"} component={TermsOfService} />
      <Route path={"/about-us"} component={AboutUs} />
      <Route path={"/guides"} component={Guides} />
      <Route path={"/guides/:slug"} component={GuidePage} />
      <Route path={"/subscription-required"} component={SubscriptionRequired} />
      <Route path={"/404"} component={NotFound} />

      {/* Protected routes — 14-day beta guard */}
      <Route path={"/alpha-rating"}>
        <BetaGuard><AlphaRating /></BetaGuard>
      </Route>
      <Route path={"/audits"}>
        <BetaGuard><Audits /></BetaGuard>
      </Route>

      {/* Final fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Navbar />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
