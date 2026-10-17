---
status: active
last_verified: 2026-10-17
owner: @team
scope: skill 变更日志
token_budget: 2100
tldr: 记录合并、拍板与每版改动；只写结论与理由，不写过程。
---

# CHANGELOG

## 2026-10-17 — v2.1 机械校验与发布准备

- 新增 `scripts/check.mjs`：把"可机械检查的红线"落成可执行门禁——元信息完整性、`SKILL.md` ≤100 行、`token_budget` ≥ 实测、§ 引用可解析、references/assets 已注册索引、`assets/` 路径存在、`last_verified` 超 90 天告警。零依赖，Node ≥18。
- 新增仓库根 `LICENSE`（MIT）：`SKILL.md` 早已声明 MIT，但没有许可文件，声明不可执行。
- 新增仓库根 `README.md` 与 `.gitignore`：`skills` 仓库作为集合的入口、目录约定与忽略规则。
- 接入：`SKILL.md` 维护规则、`04-docs-system.md §3.7` 第 6 条、本 skill `README.md` 的结构与维护小节。
- 拍板：仓库采用"一 skill 一目录"布局（`team-dev-standards/`），而不是把 skill 摊在仓库根——为后续新增 skill 留位置，避免以后搬家。

## 2026-10-17 — v2 补全与优化

### 新增

- `references/09-execution-protocols.md`：四条执行协议——信息表达（一处权威 / 结论先行 / 可执行 / 删除检验 / 新 Agent 测试）、容错（探索性错误允许，可预防错误禁止，零容忍静默·掩盖·重复）、一次成型（问题 = 闭环；三问闭合；域内做全、域外只登记）、前瞻（pre-mortem、四个留口、弃用四步、失效信号）。
- `assets/agents-md-template.md`：项目 `AGENTS.md` 落地模板。此前 04 只给了推荐目录，没给入口文件本体。
- `assets/adr-template.md`：04 规定了 ADR 预算却无模板，补齐。
- `assets/review-checklist.md`：评审从"提要求"变成"逐条勾"。
- `assets/draft-template.md` 增加边界与失败路径、失效信号、决策点与默认项。
- `assets/handoff-template.md` 增加"已验证证据三项（命令/输出/退出码）""本次未做（显式登记）""失效信号"。

### 补全

- `02-safety-and-review.md`：新增依赖与供应链（license/CVE/锁版本）、密钥与生产数据（脱敏/外部传输）、数据迁移（幂等 + down + 双写切读）、回滚预案要素、审批包格式；回滚要求从"给命令"细化为"可验证 + 纸面演练"。
- `05-state-and-harness.md`：新增 Harness 三层职责（软层判语义 / 硬层拦机械红线 / 证据层可核验）与 Hook 清单（拦截条件、失败动作、可否绕过）。
- `06-collaboration-and-workflow.md`：新增多 Agent 并行（文件所有权、串行边界、冲突裁决顺序、交接）；评审挂接 `review-checklist.md`；DoD 的 STATE 相关重复项合并为一条。
- `08-verification-and-retro.md`：从 26 行扩写为完整验证体系——按档验证矩阵、"命令+输出+退出码"证据要求、交付物清单、验证反模式、上线观测窗口、复盘产出物与防过拟合（同类 3 次才升级为硬规则）。
- `01-principles.md`：新增"命名与注释"一节；语言规范一节明确"不复制上游风格细则，避免过期"。
- `03-risk-and-autonomy.md`：新增判定顺序（先影响面 → 再可逆性 → 最后规模）、"拿不准取更高档"、浪费公式四因子的用法（先问在压哪个因子）。
- `04-docs-system.md`：新增文档反模式、`last_verified` 过旧阈值（默认 90 天）、契约变更联动 `02-safety-and-review.md`、目录表接入三个模板。
- `07-limited-info.md`：新增决策卡、状态表刷新时机、提问"一次 3–5 个问完就出 draft"。

### 裁决（冲突处理）

- **决策记录唯一权威为 `docs/adr/`**。此前 `04` 用 `docs/adr/`、`05` 用 `docs/DECISIONS.md`，两套并存违反自身"一处权威"规则；`DECISIONS.md` 降级为"项目可二选一并在 `AGENTS.md` 登记"。
- **"一次成型" vs "外科手术式修改"**：以问题域裁决——会改变该问题输入输出、契约、失败行为或验证方式的，一次做全；相邻代码与顺手发现的坏味道只登记。写入 `09-execution-protocols.md §3.2`，并在 `01-principles.md §1.3` 反向链接，避免两条原则互相拆台。
- **红线准入标准**：每条硬红线必须对应可机械检查点或明确人工门禁，否则不进清单。写入 `SKILL.md §使用方式`。
- **红线唯一权威为 `SKILL.md`**：删除 `06-collaboration-and-workflow.md` 中与红线重复的 16 条禁止事项，只保留协作层特有禁止项。

### 结构优化

- 全部 references 统一编号：文件内 `## N.` + `### N.M`，交叉引用格式 `文件名 §N.M`。修正 `02`/`03`/`06` 各自从 `# 01` 起导致与文件名编号冲突的问题。
- 修正 `07` 中的失效章节引用（原为旧编号写法）与标题漏字。
- 重写 `README.md`：修复损坏的代码围栏，补齐定位、用法、设计约束、文件清单与维护规则。
- 修正 `token_budget` 与实际体量差一个数量级的问题（`SKILL.md` 原为 `90`，`08` 原为 `600` 但仅 26 行）。
- `SKILL.md` 保持 ≤100 行硬上限，新增内容以压缩既有条目换取。

## 2026-10-12 — v1 合并

- 将 `team-dev-standards`（通用开发规范）与 `limited-info-autonomous-dev-decision`（有限信息自主决策）合并为单一 skill 工程。
- 按第一份 skill 的第 9 节拆分为入口 + references + assets，替代单文件形态。
- 裁决冲突：S/M/L 与"可逆性 × 影响"并存于 `03-risk-and-autonomy.md`，映射见 `03-risk-and-autonomy.md §2.1`，两套取更严者。
- 拍板"安全模式"触发条件与行为边界，见 `03-risk-and-autonomy.md §2.2`。
- 去重：验证、反模式、人工审核、风险分档各保留一处权威源。
