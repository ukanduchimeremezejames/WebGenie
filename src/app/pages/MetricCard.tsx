import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  sparklineData?: number[];
  icon?: React.ReactNode;
  color?: string;
}

export function MetricCard({ label, value, trend, trendLabel, sparklineData, icon, color = 'var(--color-primary)' }: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };
  
  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };
  
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        )}
      </div>
      
      {(trend !== undefined || sparklineData) && (
        <div className="flex items-center justify-between">
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(trend)}%</span>
              {trendLabel && <span className="text-gray-500 ml-1">{trendLabel}</span>}
            </div>
          )}
          
          {sparklineData && (
            <svg width="80" height="24" className="ml-auto">
              <polyline
                points={sparklineData.map((val, i) => 
                  `${(i / (sparklineData.length - 1)) * 80},${24 - (val / Math.max(...sparklineData)) * 20}`
                ).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
