# Embodied AI Daily

具身智能前沿信息追踪站点。

线上地址：<https://embodied-ai-daily.vercel.app>

## 仓库说明

当前仓库的唯一有效站点目录是：

- `workspaces/fullstack-dev-assistant`

GitHub Actions 与 Vercel 都已经对齐到这个目录。

## 功能

- 聚合具身智能相关最新内容
- 展示论文、代码、模型、数据集、会议、实验室动态
- 支持关键词、分类、标签筛选
- 每天自动采集并自动部署

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- 本地 JSON 数据存储
- GitHub Actions 定时采集
- Vercel 自动部署

## 自动更新流程

1. GitHub Actions 每天北京时间 **08:00** 执行采集
2. 采集脚本运行于 `workspaces/fullstack-dev-assistant`
3. 若 `data/content-items.json` 有变化，则自动提交到 `main`
4. Vercel 监听 `main` 并自动部署

## 本地开发

```bash
cd workspaces/fullstack-dev-assistant
npm install
npm run ingest
npm run dev
```

默认打开：

- <http://localhost:3000>

## 关键目录

```text
.github/workflows/ingest.yml                # 定时采集工作流
workspaces/fullstack-dev-assistant/         # 唯一有效站点目录
workspaces/fullstack-dev-assistant/src/     # 前端与服务端代码
workspaces/fullstack-dev-assistant/data/    # 采集后的内容数据
workspaces/fullstack-dev-assistant/scripts/ # 采集与维护脚本
```

## 环境变量

在 `workspaces/fullstack-dev-assistant/.env.local` 中配置：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=your-local-secret
INGEST_LOOKBACK_DAYS=7
INGEST_MAX_ITEMS_PER_SOURCE=20
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/auto
```

## 维护约定

- 不再使用仓库根目录作为站点源码目录
- 不要把 Vercel Root Directory 改回仓库根目录
- 所有站点相关修改统一在 `workspaces/fullstack-dev-assistant` 中进行
