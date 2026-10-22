export const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
