import React from 'react';

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  children,
  ...props
}) => {
  return (
    <Component
      className={`relative inline-block py-2 px-4 overflow-hidden rounded-full ${className}`}
      style={{
        '--star-color': color,
        '--animation-speed': speed,
      }}
      {...props}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement"
        style={{
          background: `radial-gradient(circle, var(--star-color), transparent 10%)`,
          animation: `star-movement var(--animation-speed) linear infinite`,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement"
        style={{
          background: `radial-gradient(circle, var(--star-color), transparent 10%)`,
          animation: `star-movement var(--animation-speed) linear infinite`,
          animationDelay: 'calc(var(--animation-speed) / -2)',
        }}
      />
      <div
        className="absolute inset-[1px] rounded-full z-[1]"
        style={{
          background: 'linear-gradient(to bottom, #1a1a2e, #0d0d14)',
        }}
      />
      <span className="relative z-[2] text-white font-medium">{children}</span>
      <style>{`
        @keyframes star-movement {
          0% {
            transform: translateX(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(100%) rotate(180deg);
            opacity: 0;
          }
        }
      `}</style>
    </Component>
  );
};

export default StarBorder;
