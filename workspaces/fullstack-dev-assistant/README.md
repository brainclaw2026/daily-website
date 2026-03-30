# Embodied AI Daily

具身智能前沿信息追踪站点。

线上地址：<https://embodied-ai-daily.vercel.app>

## 当前状态

- 当前唯一有效的站点目录：`workspaces/fullstack-dev-assistant`
- Vercel 已对齐到该目录
- 当前自动更新策略：**由 OpenClaw 在本机每天北京时间 08:00、12:00 定时检查并补跑 ingest**
- GitHub Actions 保留 `workflow_dispatch` 手动触发能力，但**不再承担定时调度**
- 线上部署仍然保持：**本机 ingest / commit / push → Vercel 自动部署**

## 项目目标

聚合具身智能相关的最新内容，并将其整理为一个可浏览、可筛选、可持续自动更新的网站。

当前覆盖的内容类型包括：

- 论文（paper）
- 项目（project）
- 代码（code）
- 数据集（dataset）
- 会议（conference）
- 实验室动态（lab）

## 已实现功能

- Next.js 首页与详情页
- 本地 JSON 数据存储：`data/content-items.json`
- 采集脚本：`npm run ingest`
- API 触发入口：`POST /api/ingest`
- OpenClaw 定时检查 / 补跑
- GitHub Actions 手动触发 ingest
- Vercel 自动部署
- 首页筛选：关键词 / 分类 / 标签

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- fast-xml-parser

## 目录结构

```text
src/
  app/                 # 页面与 API
  components/          # UI 组件
  lib/                 # 业务逻辑、采集、存储、工具函数
  types/               # 类型定义

data/
  content-items.json   # 采集后的核心数据文件

scripts/
  run-ingest.ts        # 执行采集
  prune-content.ts     # 内容清理
  setup-local-cron.sh  # 本地定时任务安装
  remove-local-cron.sh # 本地定时任务移除
```

## 本地运行

```bash
npm install
npm run ingest
npm run dev
```

打开：

- <http://localhost:3000>

## 常用命令

```bash
npm run dev
npm run ingest
npm run build
npm run lint
npm run typecheck
npm run prune
```

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

可选配置：

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/auto
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
```

## 手动触发采集 API

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer your-local-secret"
```

如果没有设置 `CRON_SECRET`，本地 API 也可以直接调用。

## 自动更新完整流程

当前线上自动更新采用下面这条链路：

### 第 1 步：OpenClaw 在本机定时检查
当前由 OpenClaw 在每天北京时间 **08:00、12:00** 执行检查任务。

检查目标：

- 仓库：`brainclaw2026/daily-website`
- 站点：<https://embodied-ai-daily.vercel.app>
- 本地实际工作目录：`/Users/brain/.openclaw/daily-website-clean/workspaces/fullstack-dev-assistant`

### 第 2 步：拉取最新主分支并检查工作区
每次检查前，先确保：

- 本地仓库处于干净状态
- `main` 已同步到远端最新提交

避免在脏工作区或落后分支上直接跑 ingest。

### 第 3 步：在真实站点目录执行 ingest
实际执行目录是：

- `workspaces/fullstack-dev-assistant`

核心命令：

```bash
npm run ingest
```

### 第 4 步：如果内容有变化，则提交并推送
采集成功后，如果 `data/content-items.json` 有变化，则执行：

```bash
git add workspaces/fullstack-dev-assistant/data/content-items.json
git commit -m "chore: update ingested content"
git push origin main
```

如果没有变化，则记录“已检查，无新增内容”，不产生空提交。

### 第 5 步：Vercel 自动部署
Vercel 当前应配置为：

- Repository：当前 GitHub 仓库
- Production Branch：`main`
- Root Directory：`workspaces/fullstack-dev-assistant`

只要 `main` 上出现新的内容提交，Vercel 就会自动部署。

### 第 6 步：网站线上更新
Vercel 部署完成后，线上网站：

- <https://embodied-ai-daily.vercel.app>

就会显示新的数据数量和最新条目。

## GitHub Actions 当前角色

仓库根目录仍保留工作流文件：

- `.github/workflows/ingest.yml`

但当前只保留：

- `workflow_dispatch`

也就是说：

- **可以手动点 Run workflow 触发 ingest**
- **不再依赖 GitHub Actions schedule 做定时更新**

## 本地手动跑完整流程

如果你想手动验证全链路，推荐这样做：

### 1. 进入项目目录
```bash
cd workspaces/fullstack-dev-assistant
```

### 2. 执行采集
```bash
npm run ingest
```

### 3. 查看数量是否变化
检查：

- `data/content-items.json`

### 4. 提交并推送
```bash
git add workspaces/fullstack-dev-assistant/data/content-items.json
git commit -m "chore: update ingested content"
git push origin main
```

### 5. 等待 Vercel 自动部署
部署完成后，线上网站会更新。

## 如果网站没更新，排查顺序

按这个顺序查最快：

1. OpenClaw 的 08:00 / 12:00 检查任务是否执行
2. 本地 ingest 是否成功跑完
3. 是否生成了新的 `chore: update ingested content` 提交
4. Vercel 是否部署了对应 commit
5. 网站首页总条目数是否变化

## 维护约定

- 所有站点相关改动都在当前目录进行
- 根目录不是站点源码目录
- 不要再创建第二套重复站点目录
- 当前定时检查以 OpenClaw 本机任务为准，不再依赖 GitHub Actions schedule
- 如果网站未更新，优先检查 OpenClaw 任务执行状态与 Vercel 部署状态

## 当前结论

截至当前，这个项目已经完成以下修复：

- 清理了错误/重复目录问题
- 清理了仓库里与网站无关的内容
- 修正了 GitHub Actions 的执行目录与提交路径
- 确认 GitHub Actions 手动触发链路可用
- 将定时更新职责从 GitHub Actions schedule 切换到 OpenClaw 本机定时任务
- 已验证“重新采集 → push → Vercel → 线上数量变化”完整可用
