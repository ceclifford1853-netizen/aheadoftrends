import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AEODiagnostic from "./pages/AEODiagnostic";
import Pricing from "./pages/Pricing";
import AlphaRating from "./pages/AlphaRating";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/aeo-diagnostic"} component={AEODiagnostic} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/alpha-rating"} component={AlphaRating} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
