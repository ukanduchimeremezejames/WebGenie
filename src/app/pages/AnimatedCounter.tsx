import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterCardProps {
  title: string;
  value: number;
  duration?: number;
  className?: string;
}

const AnimatedCounterCard = ({
  title,
  value,
  duration = 2000,
  className = "",
}: AnimatedCounterCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = 0;
    const end = Number(value);
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return (
    <div
      className={`p-6 rounded-2xl border shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-start justify-center w-full max-w-[320px]
        bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-700 ${className}`}
      style={{
  backgroundImage: `linear-gradient(
    135deg, 
    var(--bg-gradient-start) 0%, 
    var(--bg-gradient-mid) 40%, 
    var(--bg-gradient-end) 100%
  )`,
}}
    >
      <h3 className="text-[18px] font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      <span className="text-[2.6rem] font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
        {displayValue.toLocaleString()}
      </span>

      <div className="w-full h-[4px] mt-3 rounded-full bg-gradient-to-r from-purple-600 to-green-500 dark:from-purple-400 dark:to-green-400"></div>
    </div>
  );
};

export default AnimatedCounterCard;
