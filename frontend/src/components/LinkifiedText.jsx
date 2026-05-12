import React from 'react';

// Detects URLs in plain text and wraps them in <a> tags.
// Everything else is rendered as plain text.
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export default function LinkifiedText({ text }) {
  if (!text) return null;
  const parts = text.split(URL_REGEX);
  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0066cc', textDecoration: 'underline', wordBreak: 'break-all' }}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
