# 睡眠记录应用

一个基于 React 和 Cloudflare Workers KV 的睡眠记录网页应用。

## 功能特性

- 点击按钮开始/结束睡眠记录
- 自动计算睡眠时长
- 按月份分组显示睡眠记录，支持展开/折叠
- 按周、月、年统计平均睡眠时间
- 使用柱状图可视化展示统计数据
- 数据存储在 Cloudflare Workers KV 中

## 本地开发

### 前端开发

```bash
npm install
npm run dev
```

访问 http://localhost:5173 查看应用

### 后端部署

1. 安装 Wrangler CLI:
```bash
npm install -g wrangler
```

2. 登录 Cloudflare:
```bash
wrangler login
```

3. 创建 KV 命名空间:
```bash
wrangler kv:namespace create "SLEEP_KV"
wrangler kv:namespace create "SLEEP_KV" --preview
```

4. 将生成的 ID 填入 `wrangler.toml` 文件中的 `id` 和 `preview_id` 字段

5. 部署 Worker:
```bash
wrangler deploy
```

6. 部署后，将 `src/api/sleepApi.js` 中的 `API_BASE` 更新为你的 Worker URL

## 项目结构

```
├── worker/                 # Cloudflare Worker 后端
│   └── index.js           # Worker 入口文件
├── src/
│   ├── api/               # API 调用
│   │   └── sleepApi.js    # 睡眠记录 API
│   ├── components/        # React 组件
│   │   ├── SleepControls.jsx   # 开始/结束控制组件
│   │   ├── SleepRecords.jsx    # 记录列表组件
│   │   └── SleepStats.jsx      # 统计图表组件
│   ├── App.jsx            # 主应用组件
│   ├── App.css            # 应用样式
│   └── main.jsx           # 应用入口
├── wrangler.toml          # Cloudflare Workers 配置
└── package.json
```

## API 端点

- `POST /api/sleep/start` - 开始睡眠记录
- `POST /api/sleep/end` - 结束睡眠记录
- `GET /api/sleep/records` - 获取所有睡眠记录
- `DELETE /api/sleep/delete` - 删除睡眠记录
