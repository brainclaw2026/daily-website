# Embodied AI Daily

本地可运行的具身智能信息追踪站点 MVP。

## 已实现
- Next.js 前端首页与详情页
- 本地 JSON 数据存储：`data/content-items.json`
- 采集脚本：`npm run ingest`
- API 触发入口：`POST /api/ingest`
- 本机定时采集脚本（macOS launchd）

## 环境变量
复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

最小可用配置：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=your-local-secret
INGEST_LOOKBACK_DAYS=7
INGEST_MAX_ITEMS_PER_SOURCE=20
```

## 本地运行
```bash
npm install
npm run ingest
npm run dev
```

打开 `http://localhost:3000`

## 手动触发采集 API
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer your-local-secret"
```

如果你没有设置 `CRON_SECRET`，本地 API 也可以直接调用。

## 本机定时任务（macOS）
安装每小时执行一次的本机定时任务：

```bash
bash scripts/setup-local-cron.sh
```

移除：

```bash
bash scripts/remove-local-cron.sh
```

日志位置：
- `logs/ingest.log`
- `logs/launchd.out.log`
- `logs/launchd.err.log`

## 当前限制
- 当前采集源仍是本地 sample source，用于先打通链路
- 下一步应替换为真实 RSS / arXiv / GitHub / Hugging Face 数据源
- 当前存储为本地 JSON，适合单机 MVP，不适合正式多用户生产
