---
status: active
last_verified: 2026-10-17
owner: @team
scope: 项目 AGENTS.md 模板
token_budget: 800
tldr: 新项目落地本 skill 时复制到项目根，替换 <...>，保持 100 行以内；细节下沉 docs/。
---

# AGENTS.md 模板

> 用法：把下面代码块复制到项目根 `AGENTS.md`，替换所有 `<...>`，删掉用不到的段。硬上限 100 行，超了把细节下沉到 `docs/`，本文件只留索引、红线、路由。

```markdown
# AGENTS.md — <项目名>

## 项目目标
<一句话：产品是什么、给谁用、当前阶段>

## 阅读顺序
1. 本文件：规则、硬红线、路由
2. `docs/STATE.md`：当前状态、下一步、阻塞
3. 按 §路由 只取最小必要文件

## 会话启动协议
只读本文件 → 只读 `docs/STATE.md` → 按路由取文件 → 需要历史先 `rg` 定位再读命中片段。
不默认读 `docs/adr/`、`docs/LESSONS.md`、`docs/archive/`。

## 硬红线
- 不静默假设；关键假设未确认不进入实现。
- 无快照、无回滚方案不做不可逆修改。
- 不让文档过期、状态错误、互相矛盾。
- 不泄露密钥、生产数据、用户隐私。
- 不绕过 Hook/CI 与人工确认。

## 路由
| 任务 | 必读 | 按需 |
|---|---|---|
| 启动 | AGENTS.md, docs/STATE.md | - |
| 改接口 | + docs/contracts/<模块>.md | docs/ARCHITECTURE.md, docs/adr/ |
| 修 bug | + 相关源码与测试 | docs/contracts/ |
| 部署/回滚 | + docs/RUNBOOK.md | docs/ARCHITECTURE.md |
| 信息有限出方案 | + <skill>/references/07-limited-info.md | docs/contracts/, docs/adr/ |

## 命令
- 安装：`<...>`
- 测试单文件：`<...>`
- 全量校验：`<...>`
- 本地运行：`<...>`

## 完成标准
- 交付四件套：改了什么、为什么、怎么验证、怎么回滚。
- 自动化检查未通过不得提交。
- 会话结束写 Handoff：`<skill>/assets/handoff-template.md`。

## 与母规范的差异
| 覆盖的规则 | 新做法 | 理由 | 回滚方式 | 负责人 |
|---|---|---|---|---|
| <skill> §<N> | <...> | <...> | <...> | <@who> |
```
