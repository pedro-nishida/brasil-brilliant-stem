
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Profile from "./pages/Profile";
import Practice from "./pages/Practice";
import Community from "./pages/Community";
import Enem from "./pages/Enem";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/course/:courseId" element={<Course />} />
            <Route path="/lesson/:lessonId" element={<Lesson />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/community" element={<Community />} />
            <Route path="/enem" element={<Enem />} />
            <Route path="/subjects" element={<Subjects />} />
            {/* Legacy routes for backward compatibility */}
            <Route path="/mathematics" element={<Subjects />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
