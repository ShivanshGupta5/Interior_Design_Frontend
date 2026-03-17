export default function NeonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-neon">
      <div className="p-6">{children}</div>
    </div>
  );
}