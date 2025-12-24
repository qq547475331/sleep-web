import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { sleepApi } from './api/sleepApi';
import SleepControls from './components/SleepControls';
import SleepRecords from './components/SleepRecords';
import SleepStats from './components/SleepStats';

function App() {
  const [records, setRecords] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await sleepApi.getRecords();
      setRecords(data);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSleep = async () => {
    const startTime = new Date().toISOString();
    try {
      const record = await sleepApi.startSleep(startTime);
      setCurrentRecord(record);
      setRecords([record, ...records]);
    } catch (error) {
      console.error('Failed to start sleep:', error);
    }
  };

  const handleEndSleep = async () => {
    if (!currentRecord) return;
    const endTime = new Date().toISOString();
    const start = dayjs(currentRecord.startTime);
    const end = dayjs(endTime);
    const duration = end.diff(start, 'millisecond');
    try {
      const updated = await sleepApi.endSleep(currentRecord.id, endTime, duration);
      setCurrentRecord(null);
      setRecords(records.map(r => r.id === updated.id ? updated : r));
    } catch (error) {
      console.error('Failed to end sleep:', error);
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await sleepApi.deleteRecord(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">💤</div>
          <p className="text-xl font-semibold">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-5xl animate-float">🌙</span>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                睡眠记录
              </h1>
              <span className="text-5xl animate-float" style={{ animationDelay: '0.5s' }}>⭐</span>
            </div>
            <p className="text-gray-500 text-sm">记录您的睡眠时间，了解您的睡眠习惯</p>
          </div>

          <SleepControls
            currentRecord={currentRecord}
            onStart={handleStartSleep}
            onEnd={handleEndSleep}
          />
          
          <SleepStats records={records} />
          
          <SleepRecords
            records={records}
            onDelete={handleDeleteRecord}
          />

          <div className="mt-8 text-center text-gray-400 text-xs">
            <p>💡 保持良好的睡眠习惯，健康生活每一天</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
