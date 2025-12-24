import dayjs from 'dayjs';

function SleepControls({ currentRecord, onStart, onEnd }) {
  return (
    <div className="sleep-controls mb-8">
      {currentRecord ? (
        <div className="sleeping bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center shadow-lg border border-indigo-100">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl animate-pulse">😴</span>
            <p className="text-xl font-bold text-indigo-600">正在睡觉...</p>
          </div>
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-gray-800">开始时间:</span>{' '}
              <span className="text-indigo-600">{dayjs(currentRecord.startTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">已睡:</span>{' '}
              <span className="text-2xl font-bold text-accent-600">
                {dayjs().diff(dayjs(currentRecord.startTime), 'hour', true).toFixed(1)}
              </span>
              <span className="text-lg text-gray-500 ml-1">小时</span>
            </p>
          </div>
          <button 
            className="btn-gradient-accent w-full text-lg py-4"
            onClick={onEnd}
          >
            结束睡眠
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <span className="text-6xl animate-float inline-block">🌙</span>
          </div>
          <button 
            className="btn-gradient w-full text-lg py-4 shadow-xl hover:shadow-2xl"
            onClick={onStart}
          >
            开始记录睡眠
          </button>
          <p className="text-gray-500 mt-4 text-sm">点击按钮开始记录您的睡眠时间</p>
        </div>
      )}
    </div>
  );
}

export default SleepControls;
