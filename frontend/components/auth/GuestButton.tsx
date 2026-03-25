'use client';

interface Props {
  onClick: () => void;
}

export default function GuestButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-white/10 hover:border-white/30 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
    >
      <span className="material-symbols-outlined text-[1rem]">person</span>
      <span className="text-xs font-bold uppercase tracking-widest">Guest</span>
    </button>
  );
}
