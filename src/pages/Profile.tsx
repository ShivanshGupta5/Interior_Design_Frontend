import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Calendar, ShieldCheck, ArrowLeft, LogOut } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { getMe } from "../api";
import { clearToken, isLoggedIn } from "../authStore";

export default function Profile() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      nav("/auth");
      return;
    }

    async function fetchProfile() {
      try {
        const data = await getMe();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [nav]);

  const handleLogout = () => {
    clearToken();
    nav("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-24 md:p-12 md:pt-32 flex flex-col items-center justify-center relative">
      <div className="max-w-2xl w-full relative z-10 space-y-8">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => nav("/dashboard")}
          className="flex items-center gap-2 text-white/40 dark:text-white/40 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        <GlassCard>
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl">
                <User className="text-white w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white dark:text-white light:text-slate-900">User Profile</h2>
                <p className="text-white/40 dark:text-white/40 light:text-slate-500">{profile?.email}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 glass rounded-2xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <span className="text-white dark:text-white light:text-slate-700 font-medium">Free Generations Left</span>
                </div>
                <span className="text-2xl font-black text-cyan-400">{profile?.credits}</span>
              </div>

              <div className="flex items-center justify-between p-4 glass rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-white dark:text-white light:text-slate-700 font-medium">Account Type</span>
                </div>
                <span className="text-sm font-bold text-white dark:text-white light:text-slate-900 px-3 py-1 bg-white/10 rounded-full uppercase tracking-widest">
                  Standard
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-4 glass text-red-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </motion.button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
