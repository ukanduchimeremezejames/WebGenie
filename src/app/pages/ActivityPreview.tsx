interface ActivityPreviewProps {
  data: number[];
  width?: number;   // optional, defaults to 100%
  height?: number;  // optional, defaults to 32
  strokeColor?: string;
}

export function ActivityPreview({
  data,
  width = 100,
  height = 32,
  strokeColor = 'var(--color-primary)',
}: ActivityPreviewProps) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);

  // Convert data to SVG points
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - minVal) / (maxVal - minVal)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} className="block">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
