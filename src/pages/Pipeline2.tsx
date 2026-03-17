import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, ArrowLeft, Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { postForm } from "../api";

type Item = { name: string; file: File | null; preview?: string };

export default function Pipeline2() {
  const nav = useNavigate();
  const [room, setRoom] = useState<File | null>(null);
  const [roomPreview, setRoomPreview] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([{ name: "", file: null }]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRoom(file);
      const reader = new FileReader();
      reader.onloadend = () => setRoomPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  function addItem() {
    if (items.length >= 7) return;
    setItems([...items, { name: "", file: null }]);
  }

  function removeItem(idx: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, patch: Partial<Item>) {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], ...patch };
    
    if (patch.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newItems[idx].preview = reader.result as string;
        setItems([...newItems]);
      };
      reader.readAsDataURL(patch.file);
    } else {
      setItems(newItems);
    }
  }

  async function run() {
    if (!room) return;
    const valid = items.filter((x) => x.name.trim() && x.file);
    if (!valid.length) {
      setErr("Please add at least 1 furniture image and its name.");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("room_image", room);
      fd.append("furniture_names", valid.map((v) => v.name.trim()).join(","));
      valid.forEach((v) => fd.append("furniture_images", v.file as File));

      const data = await postForm("/run/pipeline2", fd);
      nav(`/result?url=${encodeURIComponent(data.result_url)}`);
    } catch (e: any) {
      setErr(e.message ?? "Pipeline execution failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen p-6 pt-24 md:p-12 md:pt-32 flex flex-col items-center relative overflow-hidden">
      <div className="max-w-5xl w-full relative z-10 space-y-8">
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
          className="space-y-2"
        >
          <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 transition-colors">
            Custom Assets Pipeline
          </h2>
          <p className="text-white/40 dark:text-white/40 light:text-slate-500 transition-colors">Upload your room and the specific furniture you want to place</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="border-white/5 sticky top-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 transition-colors flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400 dark:text-purple-400 light:text-indigo-600" />
                  Base Room
                </h3>
                
                <div 
                  className={`relative aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                    ${roomPreview ? 'border-purple-500/50' : 'border-white/10 dark:border-white/10 light:border-slate-300 hover:border-white/20 dark:hover:border-white/20 light:hover:border-indigo-400'}`}
                  onClick={() => document.getElementById('room-upload')?.click()}
                >
                  {roomPreview ? (
                    <img src={roomPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-white/30 dark:text-white/30 light:text-slate-400 text-center p-4">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm font-medium">Click to upload base room image</span>
                    </div>
                  )}
                  <input 
                    id="room-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleRoomChange} 
                  />
                </div>

                {err && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {err}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={run}
                  disabled={!room || busy}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white !text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {busy ? "Processing..." : "Generate Result"}
                </motion.button>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-indigo-600" />
                Furniture Items ({items.length}/7)
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addItem}
                disabled={items.length >= 7}
                className="px-4 py-2 glass rounded-xl text-cyan-400 dark:text-cyan-400 light:text-indigo-600 text-sm font-bold flex items-center gap-2 disabled:opacity-30"
              >
                <Plus className="w-4 h-4" /> Add Item
              </motion.button>
            </div>

            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {items.map((it, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="p-4 border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div 
                          className={`w-24 h-24 rounded-xl border-2 border-dashed flex-shrink-0 cursor-pointer overflow-hidden flex items-center justify-center
                            ${it.preview ? 'border-cyan-500/50' : 'border-white/10 dark:border-white/10 light:border-slate-300 hover:border-white/20 dark:hover:border-white/20 light:hover:border-indigo-400'}`}
                          onClick={() => document.getElementById(`file-${idx}`)?.click()}
                        >
                          {it.preview ? (
                            <img src={it.preview} className="w-full h-full object-cover" alt="Item" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-white/20 dark:text-white/20 light:text-slate-600 transition-colors" />
                          )}
                          <input 
                            id={`file-${idx}`}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => updateItem(idx, { file: e.target.files?.[0] ?? null })} 
                          />
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <input
                              className="flex-1 glass-input rounded-xl px-4 py-3 text-white dark:text-white light:text-slate-900 outline-none text-sm"
                              value={it.name}
                              onChange={(e) => updateItem(idx, { name: e.target.value })}
                              placeholder="Furniture name (e.g. Modern Sofa)"
                            />
                            <button
                              onClick={() => removeItem(idx)}
                              className="p-3 text-white/20 dark:text-white/20 light:text-slate-400 hover:text-red-400 dark:hover:text-red-400 light:hover:text-red-500 transition-colors"
                              disabled={items.length <= 1}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
