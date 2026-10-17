---
status: active
last_verified: 2026-10-17
owner: @team
scope: skill 工程说明与使用入口
token_budget: 2100
tldr: 定位、用法、设计约束、文件清单与维护规则；机械校验由 scripts/check.mjs 落地；变更历史见 CHANGELOG.md。
---

# team-dev-standards

组内统一开发规范，同时是 Agent 的开发标准。形态是一个 skill 工程：**一个入口 + 9 个 references + 7 个 assets + 1 个校验脚本**。

- 版本：2.1 ｜ 更新：2026-10-17（历史见 `CHANGELOG.md`）
- 适用：组内所有项目、所有语言、所有 Agent 与人类开发者
- 许可：MIT（见仓库根 `LICENSE`）

## 解决什么问题

Agent 与人类开发者常见的四类失效：

1. **做错方向**：静默假设、需求没定就开写、信息不足还硬推。
2. **做错范围**：顺手重构、混合目的的 PR、临时补丁永久化。
3. **做错方式**：无验证就说完成、改测试让它变绿、文档与代码长期分叉。
4. **做错之后**：掩盖失败、重复同根因失败、复盘没有产出。

本工程对每类都给出可执行的判定与动作，而不是只给原则。

## 怎么用

1. **会话开始**：只读 `SKILL.md`，按"阅读路由"取最小必要文件，禁止全量加载。
2. **落到项目**：复制 `assets/agents-md-template.md` 到项目根做 `AGENTS.md`，按 `references/04-docs-system.md §3` 建 `docs/`。
3. **做事时**：按 `03` 判档 → 按 `09` 执行 → 按 `08` 验证 → 按 `05` 交接。
4. **信息不足时**：按 `07` 出 draft + 决策卡，一次问全，不无限提问。

## 设计约束（本工程对自己也生效）

- **入口 ≤100 行**：`SKILL.md` 只放路由、红线、判档、摘要；细节全部下沉。
- **一处权威**：同一规则只写一处，其余用 `文件 §章节` 指过去。红线的唯一权威是 `SKILL.md`。
- **原则必须可判定**：每条红线要能对应一个可机械检查点或一个明确人工门禁，否则不进清单。
- **可机械检查的就脚本化**：`scripts/check.mjs` 校验元信息、行数、预算、§ 引用、索引注册。
- **会过期的不抄**：语言风格细则、CI 脚本、工具链配置留给项目和上游规范。
- **决策唯一权威是 `docs/adr/`**：不再维护并行的 `DECISIONS.md`。

## 结构

```text
team-dev-standards/
├── SKILL.md                     # 入口：路由 + 红线 + 判档 + 协议摘要（≤100 行）
├── references/
│   ├── 01-principles.md         # 核心原则、设计原则、语言规范、命名注释
│   ├── 02-safety-and-review.md  # 破坏性改动与回滚、审核门禁、依赖供应链、密钥数据
│   ├── 03-risk-and-autonomy.md  # S/M/L、决策自主级别、安全模式、浪费控制
│   ├── 04-docs-system.md        # 文档体系、预算、路由、归档、防过期
│   ├── 05-state-and-harness.md  # 跨会话状态、Handoff、Harness 三层、Hook
│   ├── 06-collaboration-and-workflow.md  # PR/评审、多 Agent 并行、工作流、DoD
│   ├── 07-limited-info.md       # 有限信息决策、draft 与审批、参考对比
│   ├── 08-verification-and-retro.md      # 验证矩阵、证据、上线观测、复盘
│   └── 09-execution-protocols.md         # 信息表达、容错、一次成型、前瞻
├── assets/
│   ├── agents-md-template.md    # 项目 AGENTS.md 模板
│   ├── draft-template.md        # draft 骨架
│   ├── reference-card-template.md
│   ├── comparison-matrix-template.md
│   ├── adr-template.md          # 决策记录
│   ├── review-checklist.md      # 评审清单
│   └── handoff-template.md      # 交接模板
├── scripts/
│   └── check.mjs                # 机械校验（提交前必跑）
├── README.md
└── CHANGELOG.md
```

## 文件清单

| 文件 | 何时读 | 回答的问题 |
|---|---|---|
| `SKILL.md` | 每次会话 | 从哪开始、红线是什么、这算哪档 |
| `01-principles.md` | 写代码前 | 怎么写、不写什么 |
| `02-safety-and-review.md` | 改动不可逆时 | 怎么保住回滚、谁必须签字 |
| `03-risk-and-autonomy.md` | 判断能不能自己做 | 这档要不要审批、浪费从哪来 |
| `04-docs-system.md` | 写/读文档时 | 文档放哪、多长、怎么不过期 |
| `05-state-and-harness.md` | 开工与收工 | 状态写哪、Hook 拦什么 |
| `06-collaboration-and-workflow.md` | 提 PR / 多人协作 | 怎么评审、怎么不打架 |
| `07-limited-info.md` | 信息不足时 | 什么时候算够、怎么出 draft |
| `08-verification-and-retro.md` | 宣布完成前 | 怎么验证、出事怎么复盘 |
| `09-execution-protocols.md` | 任何时候 | 怎么表达、怎么容错、怎么不返工 |

## 维护

- 改任何文件：同步 `last_verified` 与 `CHANGELOG.md`。
- 新增文件：先注册到 `SKILL.md` 索引，否则视为不存在。
- 红线变更：须说明新增/删除的检查点，避免清单膨胀成口号。
- 提交前必跑：`node scripts/check.mjs`（0 error 才算通过）。
- CI：`.github/workflows/check.yml` 与本地跑同一个脚本，PR 必须为绿。
- 本工程自身在 git 里，可 diff、可 review、可回滚。

变更历史见 `CHANGELOG.md`。
