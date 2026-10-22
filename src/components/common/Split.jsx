import React from 'react';

/**
 * Text split animation: words slide smoothly upward on reveal.
 */
export default function Split({ as: Tag = 'h2', className = '', children }) {
  const text = String(children || '');
  const words = text.split(' ');

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0">
          <span
            className="inline-block animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
