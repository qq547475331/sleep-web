import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import dayjs from 'dayjs';

function SleepStats({ records }) {
  const [period, setPeriod] = useState('week');

  const completedRecords = records.filter(r => r.duration !== null);

  const getWeeklyData = () => {
    const data = [];
    const now = dayjs();
    for (let i = 6; i >= 0; i--) {
      const date = now.subtract(i, 'day');
      const dateStr = date.format('MM-DD');
      const dayRecords = completedRecords.filter(r => 
        dayjs(r.startTime).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
      );
      const totalDuration = dayRecords.reduce((sum, r) => sum + r.duration, 0);
      const avgDuration = dayRecords.length > 0 ? totalDuration / dayRecords.length : 0;
      data.push({
        name: dateStr,
        hours: parseFloat((avgDuration / (1000 * 60 * 60)).toFixed(2))
      });
    }
    return data;
  };

  const getMonthlyData = () => {
    const data = [];
    const now = dayjs();
    for (let i = 11; i >= 0; i--) {
      const date = now.subtract(i, 'month');
      const monthStr = date.format('YYYY-MM');
      const monthRecords = completedRecords.filter(r => 
        dayjs(r.startTime).format('YYYY-MM') === monthStr
      );
      const totalDuration = monthRecords.reduce((sum, r) => sum + r.duration, 0);
      const avgDuration = monthRecords.length > 0 ? totalDuration / monthRecords.length : 0;
      data.push({
        name: monthStr,
        hours: parseFloat((avgDuration / (1000 * 60 * 60)).toFixed(2))
      });
    }
    return data;
  };

  const getYearlyData = () => {
    const years = [...new Set(completedRecords.map(r => dayjs(r.startTime).format('YYYY')))];
    const data = years.map(year => {
      const yearRecords = completedRecords.filter(r => 
        dayjs(r.startTime).format('YYYY') === year
      );
      const totalDuration = yearRecords.reduce((sum, r) => sum + r.duration, 0);
      const avgDuration = yearRecords.length > 0 ? totalDuration / yearRecords.length : 0;
      return {
        name: year,
        hours: parseFloat((avgDuration / (1000 * 60 * 60)).toFixed(2))
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    return data;
  };

  const getChartData = () => {
    switch (period) {
      case 'week':
        return getWeeklyData();
      case 'month':
        return getMonthlyData();
      case 'year':
        return getYearlyData();
      default:
        return [];
    }
  };

  const getAverageSleep = () => {
    const data = getChartData();
    if (data.length === 0) return 0;
    const total = data.reduce((sum, d) => sum + d.hours, 0);
    return (total / data.length).toFixed(2);
  };

  const chartData = getChartData();
  const avgSleep = getAverageSleep();

  const getBarColor = (value) => {
    if (value >= 8) return '#10b981';
    if (value >= 6) return '#3b82f6';
    if (value >= 4) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="sleep-stats bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-indigo-100 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">📈</span>
        睡眠统计
      </h2>
      
      <div className="period-selector flex gap-3 mb-6">
        <button 
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            period === 'week' 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-400'
          }`}
          onClick={() => setPeriod('week')}
        >
          周
        </button>
        <button 
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            period === 'month' 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-400'
          }`}
          onClick={() => setPeriod('month')}
        >
          月
        </button>
        <button 
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            period === 'year' 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-400'
          }`}
          onClick={() => setPeriod('year')}
        >
          年
        </button>
      </div>

      <div className="average-display bg-white rounded-xl p-6 mb-6 shadow-md">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">平均睡眠时间</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {avgSleep} 小时
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <span className="text-xs text-gray-500">😴 4h以下</span>
            <span className="text-xs text-gray-500">😊 6-8h</span>
            <span className="text-xs text-gray-500">🌟 8h以上</span>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="chart-container bg-white rounded-xl p-6 shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: '小时', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value} 小时`, '平均睡眠']}
              />
              <Bar 
                dataKey="hours" 
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.hours)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📊</span>
          <p className="text-gray-500 text-lg">暂无数据，完成一些睡眠记录后查看统计吧！</p>
        </div>
      )}
    </div>
  );
}

export default SleepStats;
