import React from 'react';

export const PatternDivider = () => {
  return (
    <div 
      className="h-[25px] sticky z-[49] relative overflow-hidden"
      style={{
        backgroundColor: 'hsl(var(--color-azul-marino))',
        backgroundImage: 'url(/images/pattern-rombos.png)',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
        top: '4rem'
      }}
    >
      {/* Efecto shimmer/brillo */}
      <div 
        className="absolute inset-0 bg-gradient-shimmer opacity-30"
      />
    </div>
  );
};
