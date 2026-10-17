---
status: active
last_verified: 2026-10-17
owner: @team
scope: 文档同步、文档驱动开发、文档体系与 Token 优化
token_budget: 2600
tldr: 文档即规格；入口极小，按需展开；契约与状态分离；决策唯一权威是 adr/；有预算有索引；重复只链接不复制；过期先标记再询问。
---

# 04 文档体系

## 1. 文档与状态同步

- 严禁文档过时、状态错误、互相矛盾。
- 代码变更影响接口、配置、流程、架构、部署时，同步更新对应文档。
- 文档标注适用范围、更新时间、状态：草案 / 有效 / 废弃。
- Agent 不得依据过时文档决策；发现过时先标记并询问。

文档元信息头（简称"元信息头"，全文按此格式）：

```markdown
---
status: draft | active | deprecated
last_verified: 2026-09-11
owner: @xxx
scope: 支付模块接口契约
token_budget: 1200
tldr: 一句话摘要，不超过 10 行
---
```

更新频率按风险裁剪：

- S 档：更新 `docs/STATE.md` 或变更记录。
- M 档：更新模块文档、接口文档、测试说明、`docs/STATE.md`。
- L 档：更新架构文档、ADR、迁移指南、运行手册、契约文档。

## 2. 文档驱动开发

文档即规格：代码实现文档描述的内容。

- S 档：可跳过设计文档，直接实现。
- M 档：轻量设计说明，写清接口、数据、测试点。
- L 档：设计文档必须人工审批 → 提交文档 → 实现 → 验证。

控制点：

- 接口、数据模型、状态机、权限逻辑变更，**必须先改文档**。
- 破坏性契约变更按 `02-safety-and-review.md §1` 走，文档与迁移指南同时更新。
- 禁止文档和代码长期 divergence；发现即修或标记 deprecated。
- 审批通过后才提交文档，然后开始编码；审批不是需求冻结（`07-limited-info.md §6.3`）。

## 3. 文档体系与 Token 优化

核心：用最小 token 让 Agent 做出正确决策。入口极小，按需展开，契约与状态分离，历史归档，有预算，有索引，重复内容只链接不复制。

### 3.1 分层

- L0 索引：`AGENTS.md`，会话必读，只放目标、阅读顺序、硬红线。
- L1 状态：`docs/STATE.md`，会话必读，只放当前迭代、下一步、阻塞。
- L2 契约：`docs/contracts/**`、`ARCHITECTURE.md`，按任务读取。
- L3 历史：`docs/adr/**`、`LESSONS.md`、`archive/**`，按需读取。
- L4 证据：repo、代码、测试、live 环境，最终事实，优先于任何摘要。

### 3.2 推荐目录

```text
AGENTS.md                 # <100 行，唯一入口，索引 + 红线 + 路由（模板：assets/agents-md-template.md）
docs/
  STATE.md                # <50 行，当前状态，每会话刷新
  MILESTONES.md           # 里程碑 checkbox，按版本/季度拆分
  ARCHITECTURE.md         # <500 行，架构骨架
  RUNBOOK.md              # <200 行，跑/测/部署/回滚
  LESSONS.md              # <200 行，踩坑压缩，可提升为规则
  contracts/
    README.md             # <50 行，契约索引
    payment.md            # 单模块契约，<300 行
    user.md
  adr/
    0001-xxx.md           # 单条 ADR <100 行（模板：assets/adr-template.md）
  archive/
    state-2026-Q1.md
    decisions-2025.md
```

**决策记录只有一个权威位置：`docs/adr/`。** 若项目已使用单文件 `docs/DECISIONS.md`，二选一并在 `AGENTS.md` 登记，禁止两套并存。

### 3.3 预算

| 文档 | 硬上限 | 软预警 | 超限动作 |
|---|---:|---:|---|
| AGENTS.md | 100 行 | 80 行 | 只留索引和红线，细节下沉 |
| docs/STATE.md | 50 行 | 40 行 | 已完成移入 MILESTONES，历史移 archive |
| MILESTONES.md | 150 行 | 120 行 | 按版本/季度拆分 |
| 单个契约文件 | 300 行 | 240 行 | 按模块拆到 contracts/ |
| ARCHITECTURE.md | 500 行 | 400 行 | 拆模块图/数据流/权限 |
| 单条 ADR | 100 行 | 80 行 | 只写背景、决策、理由、被否决方案 |
| LESSONS.md | 200 行 | 150 行 | 合并重复，提升为 AGENTS 规则 |
| RUNBOOK.md | 200 行 | 160 行 | 按场景拆分 |

行数只是近似。元信息头 `token_budget` 的估算法：≈ 字符数 ÷ 1.6（中文为主）；预算取当前实测值上浮约 10%，超预算即拆分或归档。

### 3.4 阅读路由表

`AGENTS.md` 必须包含路由表，Agent 只读"必读"，按需再读"按需"。

| 任务 | 必读 | 按需 |
|---|---|---|
| 启动会话 | AGENTS.md, docs/STATE.md | - |
| 改接口 | AGENTS.md, docs/STATE.md, contracts/<模块>.md | ARCHITECTURE.md, adr/ |
| 修 bug | AGENTS.md, docs/STATE.md, 相关源码/测试 | contracts/ |
| 重构 | AGENTS.md, docs/STATE.md, ARCHITECTURE.md | adr/, contracts/ |
| 部署/回滚 | AGENTS.md, RUNBOOK.md | ARCHITECTURE.md |
| 查历史决策 | docs/adr/ | archive/ |
| 信息有限出方案 | 本 skill `07-limited-info.md` | contracts/, adr/ |

禁止默认全量读取 `adr/`、`LESSONS.md`、`archive/`；优先 `rg/grep` 定位。

### 3.5 摘要头与分片

- `tldr` 不超过 10 行。
- 大文档按"一个权威主题一个文件"拆分。
- 新内容优先追加到最具体的小文件。
- 重复契约只保留一个权威源，其他文档链接过去。
- 新文档必须注册到上层索引，否则视为不存在。

### 3.6 归档与压缩

- `STATE.md` 只写当前。完成项压缩进 `MILESTONES.md`，过程日志进 `archive/`。
- `docs/adr/` 超过 20 条时，已取代/已废弃的条目归档到 `archive/`。
- `LESSONS.md` 超过 30 条时，合并重复，提升为 `AGENTS.md` 硬规则。
- 每迭代或每季度由 owner 扫一遍，超限文档必须拆分或归档。
- 归档文件保留但默认不读，需要时按指针回查。

### 3.7 防止过期

1. Agent 改动前先校验文档状态；`last_verified` 过旧或 `deprecated`，先标记、询问，不得直接采用。
2. CI 可配置：改了 `src/api/**` 必须同时改对应 `contracts/*.md`。
3. `docs/STATE.md` 每会话刷新：任务开始写目标，结束写结果。
4. Hook/CI 检查：超硬上限失败，超软预警；新文档未注册索引失败（`05-state-and-harness.md §2.3`）。
5. 每周或每迭代由 owner 标记 deprecated 或删除。
6. 本仓库自带 `scripts/check.mjs` 落地 1/3/4/5 的机械部分；CI 或 pre-commit 直接调用即可。

"过旧"由 owner 在 `AGENTS.md` 定阈值，默认 90 天未校验视为可疑。

### 3.8 设计原则

- 少即是多：200 行 `AGENTS.md` 通常比 2000 行好。
- 写"约束"比写"说明"更有价值。
- 记录"被否决的方案"，防止 Agent 反复提出。
- 示例要可执行。
- 代码永远是最终事实；文档让 Agent 不读全代码就能定位。
- 文档是资产，但不读的文档等于不存在：必须索引、路由、按需加载。

### 3.9 文档反模式

日记式 `STATE.md`、同一契约出现在三个文件、只增不删的 `LESSONS.md`、没有 owner 的文档、把 PR 讨论整理成"设计文档"、为通过检查而写空字段、把过时文档留着不标记。
