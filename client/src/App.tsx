import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { Suspense, lazy } from "react";

const Exercises = lazy(() => import("./pages/Exercises"));
const CreateWorkout = lazy(() => import("./pages/CreateWorkout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const WorkoutExecution = lazy(() => import("./pages/WorkoutExecution"));
const Programs = lazy(() => import("./pages/Programs"));
const WorkoutHistory = lazy(() => import("./pages/WorkoutHistory"));
const MusclePicker = lazy(() => import("./pages/MusclePicker"));
const ExercisePicker = lazy(() => import("./pages/ExercisePicker"));

const Loading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
  </div>
);

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/muscle-picker"} component={() => <Suspense fallback={<Loading />}><MusclePicker /></Suspense>} />
      <Route path={"/exercise-picker"} component={() => <Suspense fallback={<Loading />}><ExercisePicker /></Suspense>} />
      <Route path={"/exercises"} component={() => <Suspense fallback={<Loading />}><Exercises /></Suspense>} />
      <Route path={"/workouts/create"} component={() => <Suspense fallback={<Loading />}><CreateWorkout /></Suspense>} />
      <Route path={"/dashboard"} component={() => <Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
      <Route path={"/profile"} component={() => <Suspense fallback={<Loading />}><Profile /></Suspense>} />
      <Route path={"/workouts/execute"} component={() => <Suspense fallback={<Loading />}><WorkoutExecution /></Suspense>} />
      <Route path={"/programs"} component={() => <Suspense fallback={<Loading />}><Programs /></Suspense>} />
      <Route path={"/history"} component={() => <Suspense fallback={<Loading />}><WorkoutHistory /></Suspense>} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
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
