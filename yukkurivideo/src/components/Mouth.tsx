import React from 'react';

interface MouthProps {
  amplitude: number;
}

export const Mouth = ({
  amplitude,
}: MouthProps) => {
  const height =
    Math.max(
      8,
      amplitude * 4
    );

  return (
    <div
      style={{
        width: 70,
        height,
        borderRadius: 999,
        background: '#111827',
        transition:
          'height .03s linear',
      }}
    />
  );
};