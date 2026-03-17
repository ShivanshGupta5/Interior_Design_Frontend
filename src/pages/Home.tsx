import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Layout, Zap } from "lucide-react";
import GlassCard from "../components/GlassCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-24 relative overflow-hidden">
      <div className="max-w-4xl w-full relative z-10 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Interior Design</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="text-white dark:text-white light:text-slate-900">Transform Your Space</span> <br />
            <span className="text-white/60 dark:text-white/40 light:text-slate-500">With Intelligence</span>
          </h1>
          
          <p className="text-white/50 dark:text-white/40 light:text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Upload an empty room and watch as our AI creates a fully furnished masterpiece in seconds. 
            Choose your style, define your mood.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl flex items-center gap-2 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass text-white dark:text-white light:text-slate-900 font-bold rounded-2xl transition-all"
              >
                View Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Instant Result", desc: "Get high-quality renders in under 60 seconds." },
            { icon: <Layout className="w-6 h-6 text-purple-400" />, title: "Auto Mode", desc: "Let our AI decide the best layout for your room." },
            { icon: <Sparkles className="w-6 h-6 text-cyan-400" />, title: "Custom Styles", desc: "Choose from 20+ interior design styles." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <GlassCard className="h-full border-white/5 hover:border-white/20 transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">{feature.title}</h3>
                  <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/20 dark:text-white/10 light:text-slate-300 text-[10px] tracking-[0.3em] uppercase font-bold"
      >
        <span className="w-12 h-[1px] bg-white/10" />
        Glassmorphism • 3D Animations • AI Driven
        <span className="w-12 h-[1px] bg-white/10" />
      </motion.div>
    </div>
  );
}
