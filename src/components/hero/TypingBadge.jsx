import { useTyped } from '../../hooks/useTyped';

const DEFAULT_ROLES = [
  'Mechatronics Eng. Student',
  'AI & ML Engineer',
  'Backend Developer',
  'Embedded Systems Dev',
  'Full-Stack Builder',
];

export default function TypingBadge({ roles = DEFAULT_ROLES }) {
  const displayed = useTyped(roles && roles.length ? roles : DEFAULT_ROLES);

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sky-400 font-semibold">
      <span>{displayed}</span>
      <span className="inline-block w-0.5 h-5 bg-sky-400 animate-blink" aria-hidden="true" />
    </span>
  );
}
