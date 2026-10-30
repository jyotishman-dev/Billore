import React from 'react';

export default function BilloreLogo({
  size = 'md',
  showText = true,
  className = '',
  textClassName = '',
  textColor
}) {
  const dim = size === 'sm' ? 24 : size === 'lg' ? 38 : 32;

  return (
    <div
      className={`billore-brand-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '10px',
        userSelect: 'none',
        lineHeight: 1
      }}
    >
      <div
        className="billore-mark-container"
        style={{
          display: 'grid',
          placeItems: 'center',
          width: dim,
          height: dim,
          borderRadius: size === 'sm' ? '7px' : '10px',
          background: 'linear-gradient(135deg, #c6f36a 0%, #8bd76b 100%)',
          boxShadow: '0 0 20px rgba(198, 243, 106, 0.28)',
          flexShrink: 0
        }}
      >
        <svg
          width={Math.round(dim * 0.62)}
          height={Math.round(dim * 0.62)}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crisp, modern geometric B mark with accent dot */}
          <path
            d="M4 2.5V17.5H10.5C13.2 17.5 15.2 15.6 15.2 13.2C15.2 11.5 13.9 10 12.1 9.4C13.5 8.9 14.5 7.6 14.5 6C14.5 3.8 12.6 2.5 10.2 2.5H4ZM7.5 5.5H10C11 5.5 11.8 6 11.8 7C11.8 8 11 8.5 10 8.5H7.5V5.5ZM7.5 11.2H10.5C11.6 11.2 12.4 11.8 12.4 12.9C12.4 14 11.6 14.6 10.5 14.6H7.5V11.2Z"
            fill="#12170d"
          />
          <circle cx="16.5" cy="16.5" r="1.8" fill="#12170d" />
        </svg>
      </div>

      {showText && (
        <span
          className={`billore-brand-text ${textClassName}`}
          style={{
            fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 800,
            letterSpacing: '-0.055em',
            fontSize: size === 'sm' ? '16px' : size === 'lg' ? '24px' : '20px',
            lineHeight: 1,
            color: textColor || 'var(--text, #111827)',
            display: 'inline-flex',
            alignItems: 'baseline'
          }}
        >
          billore<span style={{ color: '#c6f36a' }}>.</span>
        </span>
      )}
    </div>
  );
}
