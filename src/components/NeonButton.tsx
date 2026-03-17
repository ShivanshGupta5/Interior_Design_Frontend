export default function NeonButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
) {
  const v = props.variant ?? "primary";
  const base =
    "rounded-xl px-4 py-2 font-medium transition active:scale-[0.99] disabled:opacity-50";
  const primary =
    "bg-gradient-to-r from-cyan-400/25 to-fuchsia-500/25 border border-white/15 hover:border-white/25";
  const ghost = "border border-white/10 hover:border-white/25 bg-white/5";
  return (
    <button {...props} className={`${base} ${v === "primary" ? primary : ghost} ${props.className ?? ""}`}>
      {props.children}
    </button>
  );
}