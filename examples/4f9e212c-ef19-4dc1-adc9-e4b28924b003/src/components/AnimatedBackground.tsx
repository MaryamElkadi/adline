import React from 'react';

interface AnimatedBackgroundProps {
  darkMode: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ darkMode }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-0 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50'
      }`} />
      
      {/* Animated shapes */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full 
          ${darkMode ? 'bg-blue-500/10' : 'bg-blue-200/20'} 
          blur-3xl animate-blob`} />
        <div className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full 
          ${darkMode ? 'bg-purple-500/10' : 'bg-purple-200/20'} 
          blur-3xl animate-blob animation-delay-2000`} />
        <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full 
          ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-200/20'} 
          blur-3xl animate-blob animation-delay-4000`} />
      </div>

      {/* Grain effect */}
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          transform: 'translate3d(0, 0, 0)'
        }} 
      />
    </div>
  );
};