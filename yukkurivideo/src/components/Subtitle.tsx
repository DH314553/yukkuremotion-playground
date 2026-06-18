import React from 'react';

interface SubtitleProps {
  text: string;
}

export const Subtitle = ({
  text,
}: SubtitleProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1600,
        textAlign: 'center',
        fontSize: 48,
        lineHeight: 1.5,
        color: '#ffffff',
        fontWeight: 700,
        textShadow:
          '0 0 10px rgba(0,0,0,.8)',
        whiteSpace: 'pre-wrap',
      }}
    >
      {text}
    </div>
  );
};