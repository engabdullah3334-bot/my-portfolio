import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds = []) {
  const [active, setActive] = useState(sectionIds[0] || '');

  useEffect(() => {
    if (!sectionIds.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px' }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
