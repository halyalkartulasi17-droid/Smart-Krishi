import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid, Cell
} from 'recharts';

// Custom shape for Excel-style cylinder rounded-top column
const CylinderBarShape = (props) => {
  const { fill, x, y, width, height } = props;
  if (!height || height <= 0) return null;
  const radius = Math.min(width / 2, 8);

  return (
    <g>
      {/* Main bar body */}
      <rect
        x={x}
        y={y + radius}
        width={width}
        height={Math.max(0, height - radius)}
        fill={fill}
        opacity={0.9}
        rx={2}
      />
      {/* Cylinder 3D rounded cap */}
      <path
        d={`M ${x} ${y + radius} Q ${x + width / 2} ${y - radius} ${x + width} ${y + radius} Z`}
        fill={fill}
        opacity={1}
      />
      {/* Subtle 3D highlight edge */}
      <line
        x1={x + 2}
        y1={y + radius}
        x2={x + 2}
        y2={y + height}
        stroke="#ffffff"
        strokeWidth={1}
        opacity={0.3}
      />
    </g>
  );
};

export default function CylinderBarChart({
  data = [],
  xKey = 'date',
  bars = [{ dataKey: 'price', name: 'Price (₹/Quintal)', color: '#16a34a' }],
  height = 340,
  unit = '₹',
  title = ''
}) {
  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-extrabold text-stone-800 text-base sm:text-lg">{title}</h4>
          <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-semibold">
            Unit: {unit}
          </span>
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(v) => `${unit}${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: 'none',
                color: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
              }}
              formatter={(value, name) => [`${unit} ${value?.toLocaleString()}`, name]}
            />
            <Legend wrapperStyle={{ paddingTop: '15px' }} />

            {bars.map((bar, idx) => (
              <Bar
                key={idx}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color || '#16a34a'}
                shape={<CylinderBarShape />}
              >
                {data.map((entry, index) => {
                  let cellColor = bar.color || '#16a34a';
                  if (entry.bar_color) cellColor = entry.bar_color;
                  return <Cell key={`cell-${index}`} fill={cellColor} />;
                })}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-center space-x-6 text-xs text-stone-500">
        <span className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
          <span>Normal / Verified Historical</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
          <span>AI Predicted / Projection</span>
        </span>
      </div>
    </div>
  );
}

