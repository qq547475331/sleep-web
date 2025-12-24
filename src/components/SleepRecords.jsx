import { useState } from 'react';
import dayjs from 'dayjs';

function SleepRecords({ records, onDelete }) {
  const [expandedMonths, setExpandedMonths] = useState({});

  const groupedRecords = records.reduce((groups, record) => {
    const month = dayjs(record.startTime).format('YYYY-MM');
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(record);
    return groups;
  }, {});

  const sortedMonths = Object.keys(groupedRecords).sort((a, b) => b.localeCompare(a));

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  return (
    <div className="sleep-records bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">📊</span>
        睡眠记录
      </h2>
      {sortedMonths.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">💤</span>
          <p className="text-gray-500 text-lg">暂无记录，开始记录您的第一次睡眠吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMonths.map(month => (
            <div key={month} className="month-group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div 
                className="month-header bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold p-4 cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex justify-between items-center"
                onClick={() => toggleMonth(month)}
              >
                <span className="text-lg flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  {month}
                </span>
                <span className="toggle-icon text-sm transition-transform duration-300">
                  {expandedMonths[month] ? '▼' : '▶'}
                </span>
              </div>
              {expandedMonths[month] && (
                <div className="month-records">
                  {groupedRecords[month].map((record, index) => (
                    <div 
                      key={record.id} 
                      className="record-item p-4 border-b border-gray-100 last:border-b-0 hover:bg-indigo-50 transition-colors duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="record-info flex-1">
                          <p className="record-date font-bold text-gray-800 text-lg mb-1 flex items-center gap-2">
                            <span className="text-xl">🌙</span>
                            {dayjs(record.startTime).format('MM-DD')}
                          </p>
                          <p className="record-time text-gray-600 text-sm mb-1">
                            <span className="font-medium">时间:</span>{' '}
                            {dayjs(record.startTime).format('HH:mm')} - {record.endTime ? dayjs(record.endTime).format('HH:mm') : '进行中'}
                          </p>
                          {record.duration && (
                            <p className="record-duration text-indigo-600 font-semibold text-sm bg-indigo-50 inline-block px-3 py-1 rounded-full">
                              睡了 {formatDuration(record.duration)}
                            </p>
                          )}
                        </div>
                        <button 
                          className="delete-button px-4 py-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-md"
                          onClick={() => onDelete(record.id)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SleepRecords;
