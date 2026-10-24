import { getTechIcon } from '../../data/techIcons';

/**
 * Reusable tech badge with authentic Devicon SVG or colored emoji fallback.
 */
export default function TechBadge({ name, size = 'sm', className = '' }) {
  const icon = getTechIcon(name);
  const hasImg = Boolean(icon.src);

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs font-medium gap-2',
    lg: 'px-4 py-2 text-sm font-semibold gap-2.5',
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  const imgSize = size === 'lg' ? 18 : 14;

  return (
    <span
      title={name}
      className={`
        inline-flex items-center rounded-lg font-medium
        bg-white/[0.03] border border-white/[0.08] text-slate-300
        hover:border-white/25 hover:text-white hover:bg-white/[0.06] hover:-translate-y-0.5
        transition-all duration-200 cursor-default select-none
        ${sizeClasses}
        ${className}
      `}
    >
      {hasImg ? (
        <img
          src={icon.src}
          alt={name}
          width={imgSize}
          height={imgSize}
          className={`shrink-0 ${icon.invert ? 'brightness-0 invert' : ''}`}
          loading="lazy"
        />
      ) : (
        <span
          className="w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0"
          style={{ background: `${icon.color || '#38bdf8'}20` }}
        >
          {icon.emoji}
        </span>
      )}
      <span>{name}</span>
    </span>
  );
}
