# skills

skill 集合。每个子目录是一个自包含的 skill，入口为 `SKILL.md`。

| skill | 用途 | 机械校验 |
|---|---|---|
| `team-dev-standards/` | 组内统一开发规范与 Agent 开发标准 | `node team-dev-standards/scripts/check.mjs` |

CI：`.github/workflows/check.yml` 在 push 到 `main`、PR、手动触发时跑上表命令；新增 skill 时追加一行。

## 约定

- 一个 skill 一个目录，入口 `SKILL.md` 必须带 YAML frontmatter：`name`、`description`。
- 子目录自带 `README.md`、`CHANGELOG.md`、`references/`、`assets/`，不跨目录共享文件。
- 合并前必须通过该 skill 的机械校验脚本；语义评审另行进行。
- 许可：MIT（见 `LICENSE`），版权行随仓库 owner。
