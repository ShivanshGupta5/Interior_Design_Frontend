import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Layers, ChevronRight } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { isLoggedIn } from "../authStore";
import { useEffect } from "react";

export default function Dashboard() {
  const nav = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      nav("/auth");
    }
  }, [nav]);

  return (
    <div className="min-h-screen p-6 pt-24 md:p-12 md:pt-32 flex flex-col items-center justify-center relative">
      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900">
              Design Dashboard
            </h2>
            <p className="text-white/40 dark:text-white/40 light:text-slate-500 font-medium">Select your preferred transformation pipeline</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="group h-full flex flex-col justify-between border-white/5 hover:border-purple-500/30 transition-all duration-500">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Rocket className="w-8 h-8 text-purple-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">Pipeline 1: Auto-Furnish</h3>
                  <p className="text-white/40 dark:text-white/40 light:text-slate-500 leading-relaxed">
                    The fastest way to visualize your room. Upload a single image of your empty space, 
                    and our AI will automatically suggest and place furniture based on the room's architecture.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/pipeline1">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white !text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
                  >
                    Start Auto Pipeline
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="group h-full flex flex-col justify-between border-white/5 hover:border-cyan-500/30 transition-all duration-500">
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Layers className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">Pipeline 2: Custom Assets</h3>
                  <p className="text-white/40 dark:text-white/40 light:text-slate-500 leading-relaxed">
                    Full creative control. Upload your room along with up to 7 specific furniture items 
                    you already own or love, and see how they fit perfectly in your new space.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/pipeline2">
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white !text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
                  >
                    Start Custom Pipeline
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
