import React from 'react';

const RouletteWheel = () => {

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Format Badge */}
      <div className="text-sm font-bold uppercase tracking-wide text-gray-600 opacity-50">
        THE FORMAT BEHIND VELOX 1
      </div>

      {/* Roulette Wheel Container */}
      <div className="relative w-96 h-96">
        {/* Wheel Image */}
        <div className="w-full h-full">
          <img 
            src="./images/race_roulette_wheel_spinning.svg" 
            alt="Race Roulette Wheel" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Center Indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-5 h-5 bg-teal-400 border-2 border-gray-800 rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Info Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          The wheel is continuously spinning with the teal and dark green segments rotating around the center.
        </p>
      </div>


    </div>
  );
};

export default RouletteWheel; 