import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
    setInput("");
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (val: string) => {
    setInput(val.toUpperCase());
    onVerify(val.toUpperCase() === code);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex-1 glass h-12 flex items-center justify-center rounded-xl select-none">
          <span className="text-xl font-mono tracking-[0.5em] italic font-bold text-white dark:text-white/80 light:text-slate-700 line-through decoration-white/20 dark:decoration-white/20 light:decoration-slate-300">
            {code}
          </span>
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-3 glass rounded-xl hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 transition-colors group"
        >
          <RefreshCw className="w-5 h-5 text-white/40 dark:text-white/40 light:text-slate-400 group-hover:text-purple-500 transition-colors" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Enter captcha code"
        className="w-full glass-input rounded-xl px-4 py-3 text-white outline-none"
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </div>
  );
}
