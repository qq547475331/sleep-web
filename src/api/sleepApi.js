const API_BASE = 'https://sleep-tracker-api.547475331.workers.dev';

export const sleepApi = {
  async startSleep(startTime) {
    const response = await fetch(`${API_BASE}/api/sleep/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime })
    });
    return response.json();
  },

  async endSleep(id, endTime, duration) {
    const response = await fetch(`${API_BASE}/api/sleep/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, endTime, duration })
    });
    return response.json();
  },

  async getRecords() {
    const response = await fetch(`${API_BASE}/api/sleep/records`);
    return response.json();
  },

  async deleteRecord(id) {
    const response = await fetch(`${API_BASE}/api/sleep/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return response.json();
  }
};
