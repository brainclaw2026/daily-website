# MEMORY.md - Long-Term Memory

这是长期记忆文件，用来沉淀稳定、长期有效的信息。

## 用户偏好
- 用户偏好直接、真实的状态汇报，不喜欢安抚式空话。
- 如果承诺“继续执行/已经调整/已经修复”，必须先实际落实，再汇报。
- 安装新 skill 前，先用 skill-vetter 审查。
- 遇到重复/重叠 skills，优先保留 ClawHub 搜索分数更高的版本。
- 不要一次安装太多 skill，够用即可。

## 报告生成偏好
- 学术/论文报告优先使用近 7 天内容，必要时可纳入近 30 天重大工作。
- 不能只基于摘要敷衍总结；应尽量基于论文实际内容、方法与实验细节。
- 当前确认的正式输出偏好：PDF、思源宋体、精简正式版、只保留最终版本。

## 系统约定
- 主模型目前使用 openrouter/openai/gpt-5.4。
- memory_search 已恢复，当前 embeddings 通过 OpenRouter OpenAI-compatible endpoint 工作。
- agents.defaults.timeoutSeconds 已设为 120。

## 待持续维护
- 只保留长期有效、跨会话值得记住的内容。
- 临时任务、一次性上下文，优先写入 daily memory，而不是这里。
