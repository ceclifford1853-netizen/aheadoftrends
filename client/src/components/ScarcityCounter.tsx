import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface ScarcityCounterProps {
  totalSlots?: number;
  filledSlots?: number;
}

export function ScarcityCounter({ 
  totalSlots = 20, 
  filledSlots = 3 
}: ScarcityCounterProps) {
  const [remainingSlots, setRemainingSlots] = useState(totalSlots - filledSlots);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate slot reduction every 30-60 seconds for urgency
    const interval = setInterval(() => {
      setRemainingSlots((prev) => {
        if (prev > 1) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 500);
          return prev - 1;
        }
        return prev;
      });
    }, Math.random() * 30000 + 30000);

    return () => clearInterval(interval);
  }, []);

  const percentageRemaining = (remainingSlots / totalSlots) * 100;
  const isUrgent = remainingSlots <= 5;

  return (
    <div className="inline-block">
      <div className={`bg-gradient-to-r ${isUrgent ? 'from-pink-500/20 to-red-500/20 border-pink-500/50' : 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50'} border rounded-lg p-4 backdrop-blur-sm transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${isUrgent ? 'text-pink-500 animate-pulse' : 'text-cyan-400'}`} />
            <div>
              <p className={`text-sm font-semibold ${isUrgent ? 'text-pink-500' : 'text-cyan-400'}`}>
                FOUNDING MEMBER BETA
              </p>
              <p className="text-xs text-slate-400">
                {remainingSlots} OF {totalSlots} SLOTS REMAINING
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              isUrgent 
                ? 'bg-gradient-to-r from-pink-500 to-red-500' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>

        {isUrgent && (
          <p className="text-xs text-pink-500 mt-2 font-semibold animate-pulse">
            ⚡ Only {remainingSlots} slots left — secure yours now!
          </p>
        )}
      </div>
    </div>
  );
}

export default ScarcityCounter;
