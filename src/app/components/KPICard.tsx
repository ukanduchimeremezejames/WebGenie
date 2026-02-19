import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  description: string;
  gradient?: string;
}

export function KPICard({ icon: Icon, title, value, description, gradient = 'from-purple-50 to-purple-100' }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm text-muted-foreground">{title}</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl text-black mb-1">{displayValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
