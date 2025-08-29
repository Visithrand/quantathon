import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Target, Activity, Star } from 'lucide-react';

/**
 * ProgressChart Component
 * Displays various types of progress charts using Recharts
 * 
 * @param {string} type - Chart type: 'line', 'area', 'bar', 'pie'
 * @param {Array} data - Chart data array
 * @param {string} title - Chart title
 * @param {Object} config - Chart configuration options
 * @param {string} height - Chart height (default: 300px)
 */
function ProgressChart({ type = 'line', data = [], title, config = {}, height = '300px' }) {
  // Default chart colors
  const colors = {
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-slate-800 mb-2">
            {new Date(label).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-slate-600">
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></span>
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom axis tick formatter
  const formatXAxis = (tickItem) => {
    if (config.xAxisFormat === 'date') {
      return new Date(tickItem).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    if (config.xAxisFormat === 'time') {
      return new Date(tickItem).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return tickItem;
  };

  // Render different chart types
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={config.xAxisKey || 'date'}
              tickFormatter={formatXAxis}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis
              domain={config.yAxisDomain || [0, 100]}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {config.lines?.map((line, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color || colors.primary}
                strokeWidth={line.strokeWidth || 2}
                dot={{ fill: line.color || colors.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: line.color || colors.primary, strokeWidth: 2 }}
              />
            )) || (
              <Line
                type="monotone"
                dataKey="overallScore"
                stroke={colors.primary}
                strokeWidth={2}
                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
              />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={config.xAxisKey || 'date'}
              tickFormatter={formatXAxis}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis
              domain={config.yAxisDomain || [0, 100]}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {config.areas?.map((area, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={area.dataKey}
                stackId={area.stackId}
                stroke={area.color || colors.primary}
                fill={area.color || colors.primary}
                fillOpacity={area.fillOpacity || 0.6}
              />
            )) || (
              <Area
                type="monotone"
                dataKey="overallScore"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
              />
            )}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey={config.xAxisKey || 'date'}
              tickFormatter={formatXAxis}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis
              domain={config.yAxisDomain || [0, 100]}
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {config.bars?.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.dataKey}
                fill={bar.color || colors.primary}
                radius={[4, 4, 0, 0]}
              />
            )) || (
              <Bar
                dataKey="overallScore"
                fill={colors.primary}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={config.dataKey || 'value'}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors?.[index] || colors.primary} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Chart type '{type}' not supported</p>
          </div>
        );
    }
  };

  // Get chart icon based on type
  const getChartIcon = () => {
    switch (type) {
      case 'line':
        return <TrendingUp className="h-5 w-5 text-purple-600" />;
      case 'area':
        return <Activity className="h-5 w-5 text-teal-600" />;
      case 'bar':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'pie':
        return <Star className="h-5 w-5 text-yellow-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Chart Header */}
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {getChartIcon()}
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
      )}

      {/* Chart Container */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      {config.footer && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">{config.footer}</p>
        </div>
      )}
    </div>
  );
}

export default ProgressChart;
