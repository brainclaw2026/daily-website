# Embodied AI Daily

具身智能前沿信息追踪站点。

线上地址：<https://embodied-ai-daily.vercel.app>

## 当前状态

- 当前唯一有效的站点目录：`workspaces/fullstack-dev-assistant`
- GitHub Actions 与 Vercel 已对齐到该目录
- 自动采集与自动部署已恢复正常

## 已实现

- Next.js 首页与详情页
- 本地 JSON 数据存储：`data/content-items.json`
- 采集脚本：`npm run ingest`
- API 触发入口：`POST /api/ingest`
- GitHub Actions 定时采集
- Vercel 自动部署

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- fast-xml-parser

## 本地运行

```bash
npm install
npm run ingest
npm run dev
```

打开：

- <http://localhost:3000>

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

可选：

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/auto
```

## 手动触发采集 API

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer your-local-secret"
```

如果没有设置 `CRON_SECRET`，本地 API 也可以直接调用。

## 自动更新流程

1. GitHub Actions 每天北京时间 **08:00** 自动执行采集
2. 工作流在 `workspaces/fullstack-dev-assistant` 下运行
3. 若 `data/content-items.json` 有变化，则自动 commit 并 push 到 `main`
4. Vercel 监听 `main` 并自动部署最新提交
5. 网站自动更新

## 常用命令

```bash
npm run dev
npm run ingest
npm run build
npm run lint
npm run typecheck
```

## 目录结构

```text
src/
  app/
  components/
  lib/
  types/
data/
  content-items.json
scripts/
  run-ingest.ts
  prune-content.ts
```

## 维护约定

- 所有站点相关改动都在当前目录进行
- 根目录不是站点源码目录
- 若网站未更新，优先检查 GitHub Actions 与 Vercel 部署状态
