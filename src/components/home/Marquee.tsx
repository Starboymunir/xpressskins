"use client";

const ROW1 = ["Custom itasha", "痛車", "Drawn for one car", "文化", "Houston → anywhere", "痛車", "Avery Dennison cast vinyl", "文化"];
const ROW2 = ["No templates", "痛車", "Printed in-house", "文化", "Installed or shipped", "痛車", "Since 2020", "文化"];

function Row({ items, reverse = false, outline = false }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  return (
    <div className="flex overflow-hidden whitespace-nowrap" aria-hidden>
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 items-center gap-12 pr-12" style={{ animation: `marquee ${reverse ? 48 : 40}s linear infinite ${reverse ? "reverse" : ""}` }}>
          {items.map((t, i) => (
            <span key={i} className={`${/[぀-ヿ一-龯]/.test(t) ? "t-jp text-[0.55em] text-[var(--mag)]" : outline ? "outline-text" : "text-white"} t-display text-[clamp(2.6rem,7vw,7rem)] leading-none`}>
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative z-10 -mt-16 space-y-3 border-y hairline bg-[#050507] py-6">
      <Row items={ROW1} outline />
      <Row items={ROW2} reverse />
    </div>
  );
}
