import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { clearToken } from "../authStore";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();
  const location = useLocation();

  // Hide header on login page
  if (location.pathname === "/auth") return null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    clearToken();
    nav("/");
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Top Left: Empty for balance (or could put something else) */}
      <div className="w-32" />

      {/* Top Center: Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
          className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20"
        >
          <span className="text-white font-black text-xl">I</span>
        </motion.div>
        <span className="text-xl font-bold tracking-tight text-white dark:text-white light:text-black transition-colors">
          Interior Design AI
        </span>
      </Link>

      {/* Top Right: Actions */}
      <div className="flex items-center gap-4 w-32 justify-end">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-3 glass rounded-2xl text-white/70 hover:text-white transition-colors"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </motion.button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-2 glass rounded-2xl hover:bg-white/10 transition-colors border-white/10"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center">
              <User className="w-4 h-4 text-white/80" />
            </div>
            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 glass rounded-2xl overflow-hidden shadow-2xl border-white/10 backdrop-blur-2xl"
              >
                <div className="p-4 border-b border-white/5">
                  <p className="text-sm font-bold text-white">Guest User</p>
                  <p className="text-xs text-white/40">demo@example.com</p>
                </div>
                
                <div className="p-2">
                  <button 
                    onClick={() => { nav("/profile"); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 dark:text-white/70 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-indigo-600 hover:bg-white/5 transition-colors text-left"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <div className="h-[1px] bg-white/5 my-2" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
