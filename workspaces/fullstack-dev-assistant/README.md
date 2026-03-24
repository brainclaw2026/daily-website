# Embodied AI Daily

具身智能前沿信息追踪站点。

线上地址：<https://embodied-ai-daily.vercel.app>

## 当前状态

- 当前唯一有效的站点目录：`workspaces/fullstack-dev-assistant`
- GitHub Actions 与 Vercel 已对齐到该目录
- 自动采集与自动部署已恢复正常
- 当前定时更新：**每天北京时间 08:00**

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
- GitHub Actions 定时采集
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

### 第 1 步：GitHub Actions 定时触发
仓库根目录的工作流文件：

- `.github/workflows/ingest.yml`

会在每天北京时间 **08:00** 自动执行。

对应 cron：

```yaml
0 0 * * *
```

这是 UTC 00:00，对应 Asia/Shanghai 的 08:00。

### 第 2 步：工作流切到真实站点目录执行
虽然 workflow 文件放在仓库根目录，但真正执行目录是：

- `workspaces/fullstack-dev-assistant`

也就是说，下面这些命令实际都在当前目录下执行：

```bash
npm ci
npm run ingest
```

### 第 3 步：采集脚本更新数据文件
采集成功后，会更新：

- `data/content-items.json`

这份文件就是当前网站首页和详情页实际读取的数据源。

### 第 4 步：如果有变化，自动提交到 main
如果 `data/content-items.json` 有变化，workflow 会自动执行：

```bash
git add data/content-items.json
git commit -m "chore: update ingested content"
git push
```

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

1. GitHub Actions 是否在 08:00 左右成功执行
2. 是否生成了新的 `chore: update ingested content` 提交
3. Vercel 是否部署了对应 commit
4. 网站首页总条目数是否变化

## 维护约定

- 所有站点相关改动都在当前目录进行
- 根目录不是站点源码目录
- 不要再创建第二套重复站点目录
- 如果网站未更新，优先检查 GitHub Actions 与 Vercel 部署状态

## 当前结论

截至当前，这个项目已经完成以下修复：

- 清理了错误/重复目录问题
- 清理了仓库里与网站无关的内容
- 修正了 GitHub Actions 的执行目录与提交路径
- 修正了自动采集与自动部署链路
- 已验证“重新采集 → push → Vercel → 线上数量变化”完整可用
