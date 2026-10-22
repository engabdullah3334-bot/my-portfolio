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
        bg-cyber-card/80 border border-cyber-border text-slate-300
        hover:border-cyber-cyan/60 hover:text-white hover:bg-cyber-card hover:scale-105
        transition-all duration-200 cursor-default select-none shadow-sm
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
          style={{ background: `${icon.color || '#00d4ff'}25` }}
        >
          {icon.emoji}
        </span>
      )}
      <span>{name}</span>
    </span>
  );
}
