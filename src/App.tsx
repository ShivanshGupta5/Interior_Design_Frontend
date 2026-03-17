import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pipeline1 from "./pages/Pipeline1";
import Pipeline2 from "./pages/Pipeline2";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./ThemeContext";
import Header from "./components/Header";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="animated-bg" />
        {/* Floating background shapes for 3D-like feel */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="floating-shape w-[30rem] h-[30rem] top-[-10rem] left-[-10rem]" />
          <div className="floating-shape w-[25rem] h-[25rem] bottom-[-5rem] right-[-5rem] delay-1000" />
          <div className="floating-shape w-[20rem] h-[20rem] top-[40%] right-[10%] opacity-20" />
        </div>
        
        <Header />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pipeline1" element={<Pipeline1 />} />
          <Route path="/pipeline2" element={<Pipeline2 />} />
          <Route path="/result" element={<Result />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}