import React from 'react';

interface BackgroundProps {
  image?: string;
}

export const Background = ({
  image,
}: BackgroundProps) => {
  if (image) {
    return (
      <img
        src={image}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg,#0f172a,#111827)',
      }}
    />
  );
};