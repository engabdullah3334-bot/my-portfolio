import { useEffect, useState } from 'react';
import { reduceMotion } from '../lib/utils';

export function useTyped(words = [], typeSpeed = 65, deleteSpeed = 35, pauseMs = 2200) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;
    if (reduceMotion()) {
      setDisplayed(words[0]);
      return;
    }

    const current = words[roleIdx];
    let timeout;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, typeSpeed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      }, deleteSpeed);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setRoleIdx(r => (r + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx, words, typeSpeed, deleteSpeed, pauseMs]);

  return displayed;
}
