---
status: active
last_verified: 2026-10-17
owner: @team
scope: 跨会话状态管理、Harness、Hook
token_budget: 2000
tldr: 项目状态活在项目文件里，不在会话上下文里。四层：会话内、项目记忆、结构化交接、工作流习惯。Harness 三层：软层判语义、硬层拦机械红线、证据层可核验。
---

# 05 状态与 Harness

核心：让项目状态活在项目文件里，而不是会话上下文里。会话无状态，项目长期。

## 1. 跨会话状态

### 1.1 四层

| 层 | 载体 | 生命周期 | 局限 |
|---|---|---|---|
| 会话内 | 工具原生 resume / continue（如 `codex resume <id>`） | 同工具同机器 | 换工具即失效 |
| 项目记忆 | `docs/STATE.md`、`MILESTONES.md`、`LESSONS.md`、`adr/` | 跨天跨工具 | 靠纪律维护 |
| 交接协议 | Handoff 卡片（`assets/handoff-template.md`） | 跨会话跨 Agent | 依赖写的人诚实 |
| 工作流习惯 | 启动读状态、结束写交接 | 常驻 | 无强制则退化 |

### 1.2 项目记忆层

```text
docs/STATE.md        # 已完成 / 进行中 / 下一步 / 阻塞（<50 行）
docs/MILESTONES.md   # 里程碑 checkbox
docs/LESSONS.md      # 踩过的坑，可提升为规则
docs/adr/            # 关键决策 + 被否决方案（决策唯一权威，模板见 assets/adr-template.md）
```

`STATE.md` 必须回答三问：什么已完成、什么下一步、什么被阻塞。

### 1.3 结构化交接面

```text
交接面
├─ Handoff Card          当前交接面
├─ Current Requirements  当前有效需求
├─ Protected Invariants  绝不能破坏的边界
├─ Work Node             可独立推进/验收/关闭的工作单元
├─ Resume Point          半路暂停时的物理执行边界
├─ Closure Memory        已关闭阶段的压缩记忆
└─ Source Pointers       回到 repo/artifact/原始证据的指针
```

验收标准：一个完全没参与前文的强 Agent，仅凭 `AGENTS.md` + `docs/STATE.md` + 相关契约，能否安全开始下一步？

### 1.4 默认可信顺序

1. 当前用户明确意图
2. 可复现证据：repo / 文件 / live 环境
3. 已批准契约与文档
4. 状态文件
5. Worker Claim / Agent 声明
6. 摘要 / 推断 / 历史记忆

含义：Agent 说"完成"不等于"通过"，摘要不等于事实（`09-execution-protocols.md §2.3`）。

### 1.5 会话启动协议（写进项目 `AGENTS.md`）

```markdown
## 会话启动协议
1. 只读 AGENTS.md — 规则、红线、阅读路由
2. 只读 docs/STATE.md — 当前状态、下一步、阻塞
3. 按路由表取最小必要文件
4. 不默认读 adr / LESSONS / archive
5. 需要历史先 rg 定位，再读命中片段
```

### 1.6 关键原则

1. `STATE.md` 极短：3 分钟内说清"现在在哪"。
2. 当前状态与历史记忆分离：完成的工作压缩成 Closure Memory。
3. 不重放完整历史，优先读当前状态与交接卡。
4. 状态文件是项目资产：进 git，可 diff、可 review、可回滚。
5. 定期把临时事实提升为永久规则（`08-verification-and-retro.md §6`）。

## 2. Harness 与 Hook

目标：为 Agent 搭可控运行环境——标准化工具集、强约束规则、校验闭环、自我修正反馈。

### 2.1 三层职责（拍板）

| 层 | 手段 | 只负责 | 禁止 |
|---|---|---|---|
| 软层 | Skill / Rules / `AGENTS.md` | 语义判断、上下文、例外裁定 | 依赖"自觉"执行机械规则 |
| 硬层 | Hook / CI / 权限系统 | 客观、可机械判断的红线 | 做语义判断、让人读长文再放行 |
| 证据层 | 测试、日志、指标、diff | 事后可核验 | 被当成门禁的替代品 |

判据：一条规则如果能用正则、退出码、行数、文件路径判断，就该下沉到硬层，否则留在软层。

### 2.2 最小集（项目根必须）

- `AGENTS.md`：<100 行，唯一行为总纲，含产品目标、阅读顺序、完成标准、硬红线、路由。模板见 `assets/agents-md-template.md`。
- `docs/STATE.md`：当前状态。
- 约束文档进 git：禁止在会话中做临时口头约定。
- 高风险写入必须经 Hook + 人工确认（`02-safety-and-review.md §2`）。

### 2.3 推荐 Hook 清单

| Hook | 拦截条件 | 失败动作 | 可绕过 |
|---|---|---|---|
| pre-commit | 格式化失败、lint 错误、密钥正则命中、超大文件、调试残留（`console.log` / `breakpoint` / `debugger`） | 阻断提交，给出修复命令 | 否 |
| commit-msg | 不符合 Conventional Commits | 阻断（项目可配置例外） | 否 |
| pre-push | 直推 main、改了核心逻辑却无测试变更 | 阻断 | 仅 owner 记录例外 |
| PR gate | 测试/类型/构建失败、覆盖率跌破阈值、license 不兼容、改 `src/api/**` 未同步 `contracts/*.md` | 阻断合入 | 否 |
| 部署 gate | 无回滚方案、无审批记录、迁移脚本缺 down | 阻断发布 | 人工双签 |
| 巡检 | 文档超行数上限、新文档未注册索引、依赖 CVE | 告警 + 自动建 issue | 告警可静音，不可删除 |

规则：Hook 只拦"确定错"的，不拦"可能不好"的。例外必须写成记录（谁批、为什么、期限），不能改配置绕过。

### 2.4 反模式

- 把所有规范都塞进 Hook → 误报频繁，最后人人加 `--no-verify`。
- 软层写死机械规则（如"函数不超过 50 行"），硬层却不检查。
- Hook 报错只说"失败了"，不说怎么修。
- 认为"有 Hook 就不用 review"：机械检查不覆盖语义与设计。
