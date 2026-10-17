---
name: team-dev-standards
description: "组内统一开发规范与 Agent 开发标准。覆盖编码原则、语言规范、破坏性改动与回滚、依赖与供应链、密钥与生产数据、文档体系、跨会话状态与 Harness、风险分档与自主权限、有限信息下的需求状态与 draft 审批、参考对比评估、PR 评审与多 Agent 并行、验证与复盘；并含执行协议：信息表达、容错、一次成型、前瞻。"
license: MIT
---

<!--
status: active
last_verified: 2026-10-17
version: 2.2
owner: @team
scope: 组内通用开发规范 + 有限信息自主决策 + 执行协议
token_budget: 2100
tldr: 入口。只放路由、红线、判档、协议摘要。细节全部在 references/。
-->

# 组内统一开发规范与 Agent 开发标准

适用范围：组内所有项目、所有语言、所有 Agent 与人类开发者。
总取舍：偏向谨慎而非速度；流程按风险分档裁剪；安全、回滚、验证、状态同步不可跳过。

## 使用方式
- 本 skill 是母规范，不是项目文档：项目内使用须按 `04-docs-system.md §3` 拆出自己的 `AGENTS.md` 与 `docs/`（模板：`assets/agents-md-template.md`）。
- 会话开始只读本文件；按 §阅读路由 按需加载，禁止默认全量读取 references。
- 冲突优先级：用户当前指令 > 项目 `AGENTS.md` > 语言/生态规范 > 本 skill；安全、法律、隐私、生产数据红线不得被项目约定覆盖。项目 `AGENTS.md` 的覆盖须记录范围、理由、回滚方式、负责人。
- 红线准入标准：每条红线必须能对应一个可机械检查点或一个明确人工门禁；做不到就不进本清单。

## 阅读路由
下表文件均在 `references/` 下，模板在 `assets/` 下。

| 任务 | 必读 | 按需 |
|---|---|---|
| 启动会话 | SKILL.md | 05 |
| 写代码 / 改代码 | 01 | 06, 09 |
| 破坏性改动 / 回滚 | 02 | 03 |
| 判风险档 / 自主权限 | 03 | 02 |
| 文档 / 状态 / Handoff | 04 | 05, assets/handoff-template.md |
| PR / 评审 / 协作 | 06 | 02, assets/review-checklist.md |
| 信息有限 / 出方案 | 07 | 03, assets/draft-template.md |
| 表达 / 出错 / 返工 | 09 | 04, 08 |
| 验证 / 复盘 | 08 | 09 |

## 硬红线（不可跳过）
**假设与范围**
- 不静默假设；关键假设未确认前不进入实现。
- 不做无关重构；每行改动可追溯到请求；主干不留无主 TODO。
- 不所有决策都自主，也不所有决策都等人；两套分级取更严者。

**安全与数据**
- 无快照不做不可逆修改；无回滚方案不执行破坏性改动。
- 不让高风险变更绕过 Hook/CI 与人工确认；审批通过 ≠ 需求冻结。
- 不泄露密钥、生产数据、用户隐私；不把项目数据发给外部服务。

**正确与证据**
- 不无验证、监控、回滚就自主推进；不把"未运行"说成"通过"。
- 不静默失败、不掩盖失败（改测试使其通过、删断言）、不重复同根因失败。
- 不搜到什么就抄什么；不忽略许可证与平台条款。

**文档与信息**
- 不让文档过期、状态错误、互相矛盾；不依据过时文档决策。
- 不把 STATE 当日记；不在多文档复制同一契约；不加无预算无索引的文档。
- 不无限提问等信息完美；信息有限时出 draft 让用户审批方向。

## 快速判档
| 档 | 触发 | 必做 |
|---|---|---|
| S | 单文件、无外部契约、无数据/权限/安全影响、可轻易 revert | 自测 + lint/type + 更新 STATE |
| M | 单模块多文件、新增函数/组件、非破坏性接口变更 | 测试 + 1 人 review + 同步文档/STATE |
| L | 外部接口、数据迁移、权限/安全、跨模块、不可逆 | 设计审批 + 回滚方案 + 双人 review + 集成测试 + Hook/人工确认 |

单决策自主权限（可逆性 × 影响）见 `03-risk-and-autonomy.md §2`；两套分级**取更严者**。

## 执行协议摘要（细节在 `09-execution-protocols.md`）
- **表达**：一处权威、结论先行、可执行。删掉不改变决策的话；不省前提、例外、风险、回滚。
- **容错**：允许探索性错误（可逆/便宜/可发现），禁止可预防错误；零容忍静默、掩盖、重复。
- **一次成型**：问题域内一次做全（实现+边界+失败+测试+文档+回滚），域外只登记不动手。
- **前瞻**：先做 pre-mortem，留接口/数据/行为/观测四个口，给关键假设写失效信号。

## references 索引
1. `01-principles.md` — 先思考、简单优先、外科手术式修改、目标驱动、设计原则、语言规范、命名注释。
2. `02-safety-and-review.md` — 破坏性改动与回滚、人工审核门禁、依赖供应链、密钥与生产数据。
3. `03-risk-and-autonomy.md` — S/M/L、决策自主级别、安全模式、资源浪费控制。
4. `04-docs-system.md` — 文档同步、文档驱动开发、分层、预算、路由、归档、防过期、反模式。
5. `05-state-and-harness.md` — 跨会话状态、Handoff、Harness 三层、Hook 清单。
6. `06-collaboration-and-workflow.md` — PR、评审、Agent 协作、多 Agent 并行、分支提交、工作流、DoD。
7. `07-limited-info.md` — 需求状态表、"足够"标准、信息收集、draft 与审批、决策卡、searchtool、对比评估。
8. `08-verification-and-retro.md` — 验证矩阵、证据要求、交付物、上线观测、复盘机制。
9. `09-execution-protocols.md` — 信息表达、容错、一次成型、前瞻四协议。

## assets 索引
- 落地入口：`agents-md-template.md`
- 决策与评审：`adr-template.md`、`review-checklist.md`
- 交接与草稿：`handoff-template.md`、`draft-template.md`
- 参考对比：`reference-card-template.md`、`comparison-matrix-template.md`

## 维护规则
- 改动后：更新本文 `last_verified`/`version` 与 `CHANGELOG.md`；新文件先注册到本文索引。
- 提交前跑 `node scripts/check.mjs`：校验元信息、行数、预算、§ 引用与索引注册，0 error 才算过。
- 本文硬上限 100 行；references 单文件建议 ≤3000 token（当前最长 `07`、`04`，再加内容先拆）；契约变更先改文档（`04-docs-system.md §2`）。
