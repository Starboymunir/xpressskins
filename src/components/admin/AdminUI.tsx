/** Shared admin UI primitives */

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-black text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) {
  const colors: Record<string, string> = {
    default: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    accent: "bg-[#ff1a6c]/10 text-[#ff1a6c] border-[#ff1a6c]/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[variant] ?? colors.default}`}>
      {children}
    </span>
  );
}

export function Input({
  label, ...props
}: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </label>}
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff1a6c]/50 focus:ring-1 focus:ring-[#ff1a6c]/30"
      />
    </div>
  );
}

export function Textarea({
  label, rows = 3, ...props
}: { label?: string; rows?: number } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      {label && <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </label>}
      <textarea
        rows={rows}
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#ff1a6c]/50 focus:ring-1 focus:ring-[#ff1a6c]/30"
      />
    </div>
  );
}

export function Select({
  label, options, ...props
}: { label?: string; options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </label>}
      <select
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#ff1a6c]/50 focus:ring-1 focus:ring-[#ff1a6c]/30"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0a0a0f] text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Button({
  children, variant = "primary", loading, ...props
}: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger"; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-[#ff1a6c] text-white hover:bg-[#ff1a6c]/90",
    secondary: "border border-white/10 bg-white/[0.05] text-white hover:bg-white/10",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
  };
  return (
    <button {...props} disabled={loading || props.disabled} className={`${base} ${variants[variant]}`}>
      {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
      {children}
    </button>
  );
}

export function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={40} className="mb-4 text-gray-600" />
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-400">{description}</p>
    </div>
  );
}

/** Status color helpers */
export const quoteStatusColor = (s: string) => {
  const map: Record<string, string> = { new: "green", contacted: "blue", quoted: "amber", approved: "green", in_progress: "purple", completed: "default", cancelled: "red" };
  return map[s] ?? "default";
};

export const projectStatusColor = (s: string) => {
  const map: Record<string, string> = { design: "blue", revision: "amber", approved: "green", printing: "purple", shipping: "cyan", installing: "accent", completed: "default" };
  return map[s] ?? "default";
};
