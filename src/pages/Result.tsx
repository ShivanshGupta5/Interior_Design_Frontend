// import { useSearchParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Download, ArrowLeft, Share2, Sparkles, ImageIcon } from "lucide-react";
// import GlassCard from "../components/GlassCard";
// import { API_BASE } from "../api";

// export default function Result() {
//   const [sp] = useSearchParams();
//   const nav = useNavigate();

//   const url = sp.get("url");

//   const full = url
//     ? /^https?:\/\//i.test(url)
//       ? url
//       : `${API_BASE}${url}`
//     : null;

//   const handleDownload = async () => {
//     if (!full) return;
//     try {
//       const response = await fetch(full);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = `furnished-room-${Date.now()}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error("Download failed", error);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 pt-24 md:p-12 md:pt-32 flex flex-col items-center relative overflow-hidden">
//       <div className="max-w-5xl w-full relative z-10 space-y-8">
//         <div className="flex items-center justify-between">
//           <motion.button
//             whileHover={{ x: -5 }}
//             onClick={() => nav("/dashboard")}
//             className="flex items-center gap-2 text-white/40 dark:text-white/40 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 transition-colors font-bold"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Back to Dashboard
//           </motion.button>

//           <div className="flex gap-3">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="p-3 glass rounded-xl text-white/60 dark:text-white/60 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 transition-colors"
//             >
//               <Share2 className="w-5 h-5" />
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleDownload}
//               className="px-6 py-3 bg-purple-600 text-white !text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-purple-900/20"
//             >
//               <Download className="w-5 h-5" />
//               Download Render
//             </motion.button>
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="space-y-2"
//         >
//           <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 transition-colors flex items-center gap-3">
//             Design Generated
//             <Sparkles className="w-8 h-8 text-cyan-400 dark:text-cyan-400 light:text-indigo-600" />
//           </h2>
//           <p className="text-white/40 dark:text-white/40 light:text-slate-500 font-medium transition-colors">
//             Your space has been successfully transformed by AI
//           </p>
//         </motion.div>

//         <GlassCard className="p-2 border-white/5 overflow-hidden">
//           <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 dark:bg-white/5 light:bg-black/5">
//             {full ? (
//               <motion.img
//                 initial={{ scale: 1.1, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 1, ease: "easeOut" }}
//                 src={full}
//                 className="w-full h-full object-cover"
//                 alt="Generated Result"
//               />
//             ) : (
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 dark:text-white/20 light:text-slate-300 gap-4">
//                 <ImageIcon className="w-16 h-16" />
//                 <p className="text-lg font-medium">No result found</p>
//               </div>
//             )}

//             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
//           </div>
//         </GlassCard>

//         <div className="grid sm:grid-cols-2 gap-6">
//           <GlassCard className="border-white/5">
//             <h4 className="text-white dark:text-white light:text-slate-900 font-bold mb-2 transition-colors">
//               Design Summary
//             </h4>
//             <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm leading-relaxed transition-colors">
//               Our AI analyzed your room&apos;s spatial constraints and lighting to deliver this composition.
//               The style matches your requested parameters while maintaining optimal flow.
//             </p>
//           </GlassCard>
//           <GlassCard className="border-white/5">
//             <h4 className="text-white dark:text-white light:text-slate-900 font-bold mb-2 transition-colors">
//               Next Steps
//             </h4>
//             <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm leading-relaxed transition-colors">
//               You can now download this high-resolution render or try another style by going back to the dashboard.
//             </p>
//           </GlassCard>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowLeft, Share2, Sparkles, ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import GlassCard from "../components/GlassCard";
import { API_BASE } from "../api";

export default function Result() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const url = sp.get("url");

  const full = useMemo(() => {
    if (!url) return null;
    return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url}`;
  }, [url]);

  const handleDownload = async () => {
    if (!full) return;

    try {
      setDownloading(true);

      const response = await fetch(full, {
        method: "GET",
        cache: "no-store",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `furnished-room-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!full) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Interior Design Result",
          text: "Check out this AI-generated interior design render!",
          url: full,
        });
      } else {
        await navigator.clipboard.writeText(full);
        alert("Image link copied to clipboard.");
      }
    } catch (error) {
      console.error("Share failed", error);
    }
  };

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

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-3 glass rounded-xl text-white/60 dark:text-white/60 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: downloading ? 1 : 1.05 }}
              whileTap={{ scale: downloading ? 1 : 0.95 }}
              onClick={handleDownload}
              disabled={downloading || !full}
              className="px-6 py-3 bg-purple-600 text-white !text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-purple-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {downloading ? "Downloading..." : "Download Render"}
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 transition-colors flex items-center gap-3">
            Design Generated
            <Sparkles className="w-8 h-8 text-cyan-400 dark:text-cyan-400 light:text-indigo-600" />
          </h2>
          <p className="text-white/40 dark:text-white/40 light:text-slate-500 font-medium transition-colors">
            Your space has been successfully transformed by AI
          </p>
        </motion.div>

        <GlassCard className="p-2 border-white/5 overflow-hidden">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 dark:bg-white/5 light:bg-black/5">
            {full ? (
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                src={full}
                className="w-full h-full object-cover"
                alt="Generated Result"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 dark:text-white/20 light:text-slate-300 gap-4">
                <ImageIcon className="w-16 h-16" />
                <p className="text-lg font-medium">No result found</p>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
        </GlassCard>

        <div className="grid sm:grid-cols-2 gap-6">
          <GlassCard className="border-white/5">
            <h4 className="text-white dark:text-white light:text-slate-900 font-bold mb-2 transition-colors">
              Design Summary
            </h4>
            <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm leading-relaxed transition-colors">
              Our AI analyzed your room&apos;s spatial constraints and lighting to deliver this composition.
              The style matches your requested parameters while maintaining optimal flow.
            </p>
          </GlassCard>
          <GlassCard className="border-white/5">
            <h4 className="text-white dark:text-white light:text-slate-900 font-bold mb-2 transition-colors">
              Next Steps
            </h4>
            <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm leading-relaxed transition-colors">
              You can now download this high-resolution render or try another style by going back to the dashboard.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}