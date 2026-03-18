// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Mail, Lock, UserPlus, LogIn, AlertCircle, CheckCircle2, Sparkles, KeyRound } from "lucide-react";
// import GlassCard from "../components/GlassCard";
// import Captcha from "../components/Captcha";
// import { signin, signup, requestSignup } from "../api";
// import { setToken } from "../authStore";

// export default function Auth() {
//   const nav = useNavigate();
//   const [sp] = useSearchParams();
//   const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [msg, setMsg] = useState<string | null>(null);
//   const [busy, setBusy] = useState(false);
//   const [captchaVerified, setCaptchaVerified] = useState(false);

//   useEffect(() => {
//     const token = sp.get("token");
//     if (token) {
//       setToken(token);
//       nav("/dashboard");
//     }
//   }, [sp, nav]);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!captchaVerified && mode !== "verify") {
//       setMsg("Please complete the captcha correctly.");
//       return;
//     }

//     setMsg(null);
//     setBusy(true);
//     try {
//       if (mode === "signin") {
//         const t = await signin(email, password);
//         setToken(t.access_token);
//         nav("/dashboard");
//       } else if (mode === "signup") {
//         await requestSignup(email, password);
//         setMode("verify");
//         setMsg("Verification code sent to your email!");
//       } else if (mode === "verify") {
//         await signup(email, password, otp);
//         const t = await signin(email, password);
//         setToken(t.access_token);
//         nav("/dashboard");
//       }
//     } catch (e: any) {
//       setMsg(e.message ?? "Authentication failed.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   const loginGoogle = () => {
//     window.location.href = "http://localhost:8001/auth/login/google";
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
//       <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700" />

//       <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
//         <div className="max-w-md w-full mx-auto order-2 md:order-1">
//           <GlassCard>
//             <form onSubmit={submit} className="space-y-6">
//               <div className="text-center space-y-2">
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/20"
//                 >
//                   {mode === "signin" ? <LogIn className="text-white w-8 h-8" /> : <UserPlus className="text-white w-8 h-8" />}
//                 </motion.div>
//                 <h2 className="text-3xl font-bold text-white dark:text-white light:text-slate-900 transition-colors">
//                   {mode === "signin" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Verify Email"}
//                 </h2>
//                 <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm transition-colors">
//                   {mode === "signin" ? "Enter your credentials to continue" : mode === "signup" ? "Join us to start your journey" : "Enter the code sent to " + email}
//                 </p>
//               </div>

//               <div className="space-y-4">
//                 {mode !== "verify" && (
//                   <>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">Email Address</label>
//                       <div className="relative group">
//                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 dark:text-white/30 light:text-slate-500 group-focus-within:text-purple-400 transition-colors" />
//                         <input
//                           type="email"
//                           required
//                           className="w-full glass-input rounded-2xl pl-12 pr-4 py-3.5 outline-none"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           placeholder="name@company.com"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">Password</label>
//                       <div className="relative group">
//                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 dark:text-white/30 light:text-slate-500 group-focus-within:text-purple-400 transition-colors" />
//                         <input
//                           type="password"
//                           required
//                           className="w-full glass-input rounded-2xl pl-12 pr-4 py-3.5 outline-none"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           placeholder="••••••••"
//                         />
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {mode === "verify" && (
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">Verification Code</label>
//                     <div className="relative group">
//                       <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 dark:text-white/30 light:text-slate-500 group-focus-within:text-purple-400 transition-colors" />
//                       <input
//                         type="text"
//                         required
//                         className="w-full glass-input rounded-2xl pl-12 pr-4 py-3.5 outline-none text-center text-2xl tracking-[0.5em] font-bold"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value.toUpperCase())}
//                         placeholder="000000"
//                         maxLength={6}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {mode !== "verify" && (
//                   <div className="space-y-2 pt-2">
//                     <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">Verification</label>
//                     <Captcha onVerify={setCaptchaVerified} />
//                   </div>
//                 )}
//               </div>

//               <AnimatePresence mode="wait">
//                 {msg && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className={`flex items-center gap-3 p-4 rounded-2xl text-sm ${
//                       msg.includes("sent") || msg.includes("successfully") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
//                     }`}
//                   >
//                     <AlertCircle className="w-5 h-5 shrink-0" />
//                     <span>{msg}</span>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               <div className="space-y-4">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   disabled={busy || (!captchaVerified && mode !== "verify")}
//                   className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white !text-white font-semibold py-4 rounded-2xl shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
//                 >
//                   {busy ? (
//                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   ) : (
//                     <>
//                       {mode === "signin" ? "Sign In" : mode === "signup" ? "Get Code" : "Complete Registration"}
//                       <CheckCircle2 className="w-5 h-5" />
//                     </>
//                   )}
//                 </motion.button>

//                 {mode === "signin" && (
//                   <button
//                     type="button"
//                     onClick={loginGoogle}
//                     className="w-full py-4 glass rounded-2xl flex items-center justify-center gap-3 text-white dark:text-white light:text-slate-700 font-bold hover:bg-white/10 transition-all border-white/10"
//                   >
//                     <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
//                     Sign in with Google
//                   </button>
//                 )}
//               </div>

//               <div className="pt-4 flex flex-col gap-4 text-center">
//                 <button
//                   type="button"
//                   onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
//                   className="text-white/40 dark:text-white/40 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 text-sm transition-colors"
//                 >
//                   {mode === "signin" ? "Don't have an account? Create one" : "Already have an account? Sign in"}
//                 </button>
//               </div>
//             </form>
//           </GlassCard>
//         </div>

//         <div className="hidden md:flex flex-col items-start space-y-6 order-1 md:order-2">
//           <div className="flex items-center gap-4">
//             <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
//               <span className="text-white font-black text-4xl">I</span>
//             </div>
//             <div className="space-y-1">
//               <h1 className="text-5xl font-black tracking-tighter text-white dark:text-white light:text-slate-900 transition-colors">
//                 INTERIOR<br />DESIGN AI
//               </h1>
//               <div className="flex items-center gap-2 text-cyan-400 dark:text-cyan-400 light:text-indigo-600 font-bold tracking-[0.2em] text-xs uppercase transition-colors">
//                 <Sparkles className="w-4 h-4" />
//                 The Future of Spaces
//               </div>
//             </div>
//           </div>
//           <motion.p className="text-white/40 dark:text-white/40 light:text-slate-500 text-lg leading-relaxed max-w-sm transition-colors">
//             Revolutionize your home with AI-driven interior transformations. 
//             Upload your room and witness the magic of intelligent design.
//           </motion.p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  KeyRound,
} from "lucide-react";
import GlassCard from "../components/GlassCard";
import Captcha from "../components/Captcha";
import { signin, signup, requestSignup, API_BASE } from "../api";
import { setToken } from "../authStore";

export default function Auth() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    const token = sp.get("token");
    if (token) {
      setToken(token);
      nav("/dashboard");
    }
  }, [sp, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaVerified && mode !== "verify") {
      setMsg("Please complete the captcha correctly.");
      return;
    }

    setMsg(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const t = await signin(email, password);
        setToken(t.access_token);
        nav("/dashboard");
      } else if (mode === "signup") {
        await requestSignup(email, password);
        setMode("verify");
        setMsg("Verification code sent to your email!");
      } else if (mode === "verify") {
        await signup(email, password, otp);
        const t = await signin(email, password);
        setToken(t.access_token);
        nav("/dashboard");
      }
    } catch (e: any) {
      setMsg(e.message ?? "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  const loginGoogle = () => {
    window.location.href = `${API_BASE}/auth/login/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="max-w-md w-full mx-auto order-2 md:order-1">
          <GlassCard>
            <form onSubmit={submit} className="space-y-6">
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/20"
                >
                  {mode === "signin" ? (
                    <LogIn className="text-white w-8 h-8" />
                  ) : (
                    <UserPlus className="text-white w-8 h-8" />
                  )}
                </motion.div>
                <h2 className="text-3xl font-bold text-white dark:text-white light:text-slate-900 transition-colors">
                  {mode === "signin"
                    ? "Welcome Back"
                    : mode === "signup"
                    ? "Create Account"
                    : "Verify Email"}
                </h2>
                <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm transition-colors">
                  {mode === "signin"
                    ? "Enter your credentials to continue"
                    : mode === "signup"
                    ? "Join us to start your journey"
                    : "Enter the code sent to " + email}
                </p>
              </div>

              <div className="space-y-4">
                {mode !== "verify" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 dark:text-white/30 light:text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="email"
                          required
                          className="w-full glass-input rounded-2xl pl-12 pr-4 py-3.5 outline-none"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 dark:text-white/30 light:text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                          type="password"
                          required
                          className="w-full glass-input rounded-2xl pl-12 pr-4 py-3.5 outline-none"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </>
                )}

                {mode === "verify" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">
                      Verification Code
                    </label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 dark:text-white/30 light:text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type="text"
                        required
                        className="w-full glass-input rounded-2xl pl-12 pr-4 py-3.5 outline-none text-center text-2xl tracking-[0.5em] font-bold"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.toUpperCase())}
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}

                {mode !== "verify" && (
                  <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-white/60 dark:text-white/60 light:text-slate-700 ml-1 transition-colors">
                      Verification
                    </label>
                    <Captcha onVerify={setCaptchaVerified} />
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {msg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl text-sm ${
                      msg.includes("sent") || msg.includes("successfully")
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{msg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={busy || (!captchaVerified && mode !== "verify")}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white !text-white font-semibold py-4 rounded-2xl shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === "signin"
                        ? "Sign In"
                        : mode === "signup"
                        ? "Get Code"
                        : "Complete Registration"}
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={loginGoogle}
                    className="w-full py-4 glass rounded-2xl flex items-center justify-center gap-3 text-white dark:text-white light:text-slate-700 font-bold hover:bg-white/10 transition-all border-white/10"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      className="w-5 h-5"
                      alt="Google"
                    />
                    Sign in with Google
                  </button>
                )}
              </div>

              <div className="pt-4 flex flex-col gap-4 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "signin" ? "signup" : "signin")
                  }
                  className="text-white/40 dark:text-white/40 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 text-sm transition-colors"
                >
                  {mode === "signin"
                    ? "Don't have an account? Create one"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>

        <div className="hidden md:flex flex-col items-start space-y-6 order-1 md:order-2">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <span className="text-white font-black text-4xl">I</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tighter text-white dark:text-white light:text-slate-900 transition-colors">
                INTERIOR
                <br />
                DESIGN AI
              </h1>
              <div className="flex items-center gap-2 text-cyan-400 dark:text-cyan-400 light:text-indigo-600 font-bold tracking-[0.2em] text-xs uppercase transition-colors">
                <Sparkles className="w-4 h-4" />
                The Future of Spaces
              </div>
            </div>
          </div>
          <motion.p className="text-white/40 dark:text-white/40 light:text-slate-500 text-lg leading-relaxed max-w-sm transition-colors">
            Revolutionize your home with AI-driven interior transformations.
            Upload your room and witness the magic of intelligent design.
          </motion.p>
        </div>
      </div>
    </div>
  );
}