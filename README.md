# Embodied AI Daily

具身智能前沿信息追踪站点。

线上地址：<https://embodied-ai-daily.vercel.app>

## 一句话说明

这个仓库当前只服务于一个网站：**Embodied AI Daily**。
网站用于聚合具身智能相关的最新论文、代码、模型、数据集、会议和实验室动态，并支持按关键词、分类和标签筛选。

## 当前唯一有效目录

当前仓库中，真正的站点源码目录只有一个：

- `workspaces/fullstack-dev-assistant`

GitHub Actions、Vercel、站点代码、数据文件，都已经统一到这个目录。

> 不要再把仓库根目录当作站点源码目录。

## 网站功能

- 聚合具身智能相关内容
- 展示论文、代码、模型、数据集、会议、实验室动态
- 首页展示最新条目与精选条目
- 支持关键词、分类、标签筛选
- 支持详情页查看单条内容
- 支持定时自动采集与自动部署

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- fast-xml-parser
- 本地 JSON 数据存储
- GitHub Actions 定时采集
- Vercel 自动部署

## 整体工作流（最重要）

整个网站的自动更新流程如下：

1. GitHub Actions 在每天北京时间 **08:00** 自动触发
2. 工作流使用仓库根目录的：
   - `.github/workflows/ingest.yml`
3. 但实际执行目录会切到：
   - `workspaces/fullstack-dev-assistant`
4. 工作流在该目录内执行：
   - `npm ci`
   - `npm run ingest`
5. 采集脚本更新：
   - `workspaces/fullstack-dev-assistant/data/content-items.json`
6. 如果数据文件发生变化，工作流会自动：
   - `git add data/content-items.json`
   - `git commit -m "chore: update ingested content"`
   - `git push`
7. Vercel 监听 `main` 分支新提交
8. Vercel 自动部署
9. 网站线上内容更新

## 定时时间

GitHub Actions 当前 cron 配置为：

```yaml
0 0 * * *
```

这是 **UTC 时间**，换算到北京时间（Asia/Shanghai）就是：

- **每天早上 08:00 自动更新**

## 关键目录

```text
.github/workflows/ingest.yml                 # 真实生效的 GitHub Actions 工作流
workspaces/fullstack-dev-assistant/          # 唯一有效站点目录
workspaces/fullstack-dev-assistant/src/      # 前端与 API 代码
workspaces/fullstack-dev-assistant/data/     # 采集后的内容数据
workspaces/fullstack-dev-assistant/scripts/  # 采集与维护脚本
```

## 本地开发

```bash
cd workspaces/fullstack-dev-assistant
npm install
npm run ingest
npm run dev
```

默认访问：

- <http://localhost:3000>

## 本地重新采集

```bash
cd workspaces/fullstack-dev-assistant
npm run ingest
```

采集成功后会更新：

- `data/content-items.json`

## 本地检查构建

```bash
cd workspaces/fullstack-dev-assistant
npm run build
npm run lint
npm run typecheck
```

## 环境变量

站点本地环境变量文件位于：

- `workspaces/fullstack-dev-assistant/.env.local`

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

## 线上自动更新依赖的 GitHub Secrets

GitHub Actions 建议至少配置这些 Secrets：

```env
NEXT_PUBLIC_SITE_URL=https://embodied-ai-daily.vercel.app
CRON_SECRET=<your-secret>
INGEST_LOOKBACK_DAYS=7
INGEST_MAX_ITEMS_PER_SOURCE=20
OPENROUTER_API_KEY=<optional>
OPENROUTER_MODEL=openrouter/auto
SUPABASE_URL=<optional>
SUPABASE_SERVICE_ROLE_KEY=<optional>
SUPABASE_ANON_KEY=<optional>
```

## Vercel 配置要求

Vercel 需要满足以下条件：

- Repository 连接当前 GitHub 仓库
- Production Branch 为 `main`
- Root Directory 为：
  - `workspaces/fullstack-dev-assistant`
- 监听 `main` 分支提交自动部署

## 手动补跑流程

如果某天你怀疑网站没有更新，建议按下面顺序排查：

1. 打开 GitHub 仓库的 **Actions**
2. 查看当天 **08:00 左右** 是否有新的 `ingest` 记录
3. 如果没有，手动点击 **Run workflow** 触发一次
4. 查看工作流是否成功生成新的 `chore: update ingested content` 提交
5. 打开 Vercel 查看是否触发了新的 production deployment
6. 最后检查网站首页总条目数是否变化

## 常见问题

### 1. 网站没更新，但 GitHub Actions 成功了
优先检查：
- 是否产生了新的数据提交
- Vercel 是否已部署对应 commit
- Vercel Root Directory 是否仍然是 `workspaces/fullstack-dev-assistant`

### 2. 网站显示数量没变化
优先确认：
- `data/content-items.json` 是否真的被更新
- 线上是否已经部署到最新 commit

### 3. 为什么以前会更新错目录
因为仓库历史上曾经存在根目录和子目录两套站点副本，后来已经清理，并统一只保留子目录为真源。

## 维护约定

- 站点相关代码统一修改 `workspaces/fullstack-dev-assistant`
- 不要把 Vercel Root Directory 改回仓库根目录
- 不要在仓库根目录重建第二套站点副本
- 如果要排查更新问题，优先检查：
  - GitHub Actions
  - `data/content-items.json`
  - Vercel deployment

## 项目当前状态

截至当前：

- 自动采集已恢复正常
- 自动部署已恢复正常
- 每天 **08:00** 自动更新
- 手动重新采集后，网站数量可以正常变化并同步到线上
