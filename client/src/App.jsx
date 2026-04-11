import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Analytics from "./pages/Analytics";
import Dataset from "./pages/Dataset";
import Prediction from "./pages/Prediction";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/map"} component={MapPage} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/dataset"} component={Dataset} />
      <Route path={"/prediction"} component={Prediction} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
