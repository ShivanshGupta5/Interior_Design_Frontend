import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { postForm } from "../api";

export default function Pipeline1() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"auto" | "custom">("auto");
  const [room, setRoom] = useState<File | null>(null);
  const [roomPreview, setRoomPreview] = useState<string | null>(null);
  const [roomType, setRoomType] = useState("bedroom");
  const [dimensions, setDimensions] = useState("12x10");
  const [style, setStyle] = useState("minimal");
  const [budget, setBudget] = useState("medium");
  const [furnitures, setFurnitures] = useState<string[]>([""]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRoom(file);
      const reader = new FileReader();
      reader.onloadend = () => setRoomPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addFurniture = () => {
    if (furnitures.length < 7) {
      setFurnitures([...furnitures, ""]);
    }
  };

  const removeFurniture = (index: number) => {
    if (furnitures.length > 1) {
      setFurnitures(furnitures.filter((_, i) => i !== index));
    }
  };

  const updateFurniture = (index: number, val: string) => {
    const newF = [...furnitures];
    newF[index] = val;
    setFurnitures(newF);
  };

  async function run() {
    if (!room) return;
    
    if (mode === "custom") {
      const valid = furnitures.filter(f => f.trim());
      if (valid.length === 0) {
        setErr("Please add at least one furniture name.");
        return;
      }
    }

    setErr(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("room_image", room);
      fd.append("room_type", roomType);
      fd.append("dimensions", dimensions);
      fd.append("style", style);
      fd.append("budget", budget);

      let endpoint = "/run/pipeline1";
      if (mode === "custom") {
        endpoint = "/run/pipeline1-custom";
        fd.append("furniture_names", furnitures.filter(f => f.trim()).join(","));
      }

      const data = await postForm(endpoint, fd);
      nav(`/result?url=${encodeURIComponent(data.result_url)}`);
    } catch (e: any) {
      setErr(e.message ?? "Pipeline execution failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen p-6 pt-24 md:p-12 md:pt-32 flex flex-col items-center relative overflow-hidden">
      <div className="max-w-4xl w-full relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => nav("/dashboard")}
            className="flex items-center gap-2 text-white/40 dark:text-white/40 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 transition-colors font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 transition-colors">
                {mode === "auto" ? "Auto-Furnish Pipeline" : "Custom Furniture Pipeline"}
              </h2>
              <p className="text-white/40 dark:text-white/40 light:text-slate-500 transition-colors">
                {mode === "auto" 
                  ? "Upload your room image and let AI suggest furniture" 
                  : "Specify exactly which furniture pieces you want to see"}
              </p>
            </div>
            
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
              <button
                onClick={() => setMode("auto")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "auto" ? "bg-purple-600 text-white shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                Auto-Furnish
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "custom" ? "bg-cyan-600 text-white shadow-lg" : "text-white/40 hover:text-white"}`}
              >
                Custom Furniture
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <GlassCard className="border-white/5">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 transition-colors flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400 dark:text-purple-400 light:text-indigo-600" />
                  Room Image
                </h3>
                
                <div 
                  className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                    ${roomPreview ? 'border-purple-500/50' : 'border-white/10 dark:border-white/10 light:border-slate-300 hover:border-white/20 dark:hover:border-white/20 light:hover:border-indigo-400'}`}
                  onClick={() => document.getElementById('room-upload')?.click()}
                >
                  {roomPreview ? (
                    <img src={roomPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-white/30 dark:text-white/30 light:text-slate-600 transition-colors">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm font-medium">Click to upload room image</span>
                    </div>
                  )}
                  <input 
                    id="room-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>
            </GlassCard>

            <AnimatePresence mode="wait">
              {mode === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <GlassCard className="border-white/5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 transition-colors flex items-center gap-2">
                          <Plus className="w-5 h-5 text-cyan-400" />
                          Furniture Names
                        </h3>
                        <span className="text-xs text-white/40 font-bold">{furnitures.length}/7</span>
                      </div>
                      
                      <div className="space-y-3">
                        {furnitures.map((f, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-2"
                          >
                            <input
                              className="flex-1 glass-input rounded-xl px-4 py-2 text-white outline-none text-sm"
                              value={f}
                              onChange={(e) => updateFurniture(i, e.target.value)}
                              placeholder={`Furniture ${i + 1} (e.g. Sofa)`}
                            />
                            {furnitures.length > 1 && (
                              <button 
                                onClick={() => removeFurniture(i)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {furnitures.length < 7 && (
                        <button
                          onClick={addFurniture}
                          className="w-full py-2 border-2 border-dashed border-white/10 hover:border-white/20 text-white/40 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add Another
                        </button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <GlassCard className="border-white/5">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 transition-colors flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-indigo-600" />
                  Configuration
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Room Type", val: roomType, set: setRoomType, ph: "e.g. Living Room" },
                    { label: "Dimensions", val: dimensions, set: setDimensions, ph: "e.g. 12x10" },
                    { label: "Design Style", val: style, set: setStyle, ph: "e.g. Modern Minimalist" },
                    { label: "Estimated Budget", val: budget, set: setBudget, ph: "e.g. $5000" },
                  ].map((field, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/40 dark:text-white/40 light:text-slate-600 ml-1 transition-colors">
                        {field.label}
                      </label>
                      <input
                        className="w-full glass-input rounded-xl px-4 py-3 text-white dark:text-white light:text-slate-900 outline-none text-sm"
                        value={field.val}
                        onChange={(e) => field.set(e.target.value)}
                        placeholder={field.ph}
                      />
                    </div>
                  ))}
                </div>

                {err && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    {err}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={run}
                  disabled={!room || busy}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white !text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Room...
                    </>
                  ) : (
                    <>
                      {mode === "auto" ? "Generate Furnishing" : "Generate Custom Design"}
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
