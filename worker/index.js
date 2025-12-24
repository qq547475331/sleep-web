export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/sleep/start' && request.method === 'POST') {
      const data = await request.json();
      const record = {
        id: crypto.randomUUID(),
        startTime: data.startTime,
        endTime: null,
        duration: null
      };
      await env.SLEEP_KV.put(record.id, JSON.stringify(record));
      return new Response(JSON.stringify(record), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/sleep/end' && request.method === 'POST') {
      const data = await request.json();
      const existing = await env.SLEEP_KV.get(data.id);
      if (!existing) {
        return new Response('Record not found', { status: 404, headers: corsHeaders });
      }
      const record = JSON.parse(existing);
      record.endTime = data.endTime;
      record.duration = data.duration;
      await env.SLEEP_KV.put(data.id, JSON.stringify(record));
      return new Response(JSON.stringify(record), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/sleep/records' && request.method === 'GET') {
      const records = [];
      const list = await env.SLEEP_KV.list();
      for (const key of list.keys) {
        const value = await env.SLEEP_KV.get(key.name);
        if (value) {
          records.push(JSON.parse(value));
        }
      }
      const sortedRecords = records.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      return new Response(JSON.stringify(sortedRecords), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/sleep/delete' && request.method === 'DELETE') {
      const data = await request.json();
      await env.SLEEP_KV.delete(data.id);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  }
};
