import React from 'react';

interface BalloonProps {
  text: string;

  speaker: 'reimu' | 'marisa';

  width?: number;
}

export const Balloon = ({
  text,
  speaker,
  width = 1000,
}: BalloonProps) => {
  const borderColor =
    speaker === 'reimu'
      ? '#ef4444'
      : '#3b82f6';

  return (
    <div
      style={{
        width,
        minHeight: 260,
        background: '#ffffff',
        borderRadius: 30,
        padding: '36px 42px',
        border: `8px solid ${borderColor}`,
        boxShadow:
          '0 20px 60px rgba(0,0,0,.25)',
      }}
    >
      <div
        style={{
          fontSize: 54,
          lineHeight: 1.6,
          color: '#111827',
          whiteSpace: 'pre-wrap',
          fontWeight: 700,
        }}
      >
        {text}
      </div>
    </div>
  );
};