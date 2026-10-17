#!/usr/bin/env node
/**
 * 本 skill 工程的机械校验。
 * 对应 SKILL.md §维护规则 与 references/04-docs-system.md §3.7 中"可机械检查"的部分。
 * 只做确定性检查，不做语义判断；语义问题留给评审。
 *
 * 用法：
 *   node scripts/check.mjs            # 校验脚本所在 skill 工程
 *   node scripts/check.mjs <root>     # 校验指定目录
 *
 * 退出码：0 = 通过（可能有 warn）；1 = 有 error。
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = process.argv[2] ? resolve(process.argv[2]) : resolve(here, '..');

const REQUIRED_KEYS = ['status', 'last_verified', 'owner', 'scope', 'token_budget', 'tldr'];
const MAX_SKILL_LINES = 100;
const STALE_DAYS = 90;

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

function walk(dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

const countLines = (txt) => txt.replace(/\r?\n$/, '').split(/\r?\n/).length;

if (!existsSync(join(root, 'SKILL.md'))) {
  console.error(`找不到 SKILL.md：${root}`);
  process.exit(1);
}

const files = walk(root);
const byName = new Map(files.map((f) => [f.split(sep).pop(), f]));
const rel = (f) => relative(root, f).split(sep).join('/');

// 1. 元信息头 + 预算 + 时效
const headings = new Map();
for (const f of files) {
  const txt = readFileSync(f, 'utf8');
  const nums = new Set();
  for (const line of txt.split(/\r?\n/)) {
    const m = /^#{2,3}\s+(\d+(?:\.\d+)?)[\s.．]/.exec(line);
    if (m) nums.add(m[1]);
  }
  headings.set(f, nums);

  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(txt);
  const cm = /<!--([\s\S]*?)-->/.exec(txt);
  // SKILL.md 的元信息放在 HTML 注释里，避免给 skill 加载器的 frontmatter 增加未知键；两者都接受。
  const parts = [];
  if (fm) parts.push(fm[1]);
  if (cm) parts.push(cm[1]);
  if (!parts.length) {
    err(`${rel(f)}: 缺少元信息头`);
    continue;
  }
  const meta = parts.join('\n');
  for (const k of REQUIRED_KEYS) {
    if (!new RegExp(`^${k}:`, 'm').test(meta)) err(`${rel(f)}: 元信息缺 ${k}`);
  }
  const budget = /^token_budget:\s*(\d+)/m.exec(meta);
  if (budget) {
    const est = Math.ceil(txt.length / 1.6);
    if (Number(budget[1]) < est) err(`${rel(f)}: token_budget ${budget[1]} < 实测≈${est}`);
  }
  const verified = /^last_verified:\s*(\d{4}-\d{2}-\d{2})/m.exec(meta);
  if (verified) {
    const age = Math.floor((Date.now() - Date.parse(verified[1])) / 86400000);
    if (Number.isFinite(age) && age > STALE_DAYS) warn(`${rel(f)}: last_verified 已 ${age} 天未校验`);
  }
}

// 2. 入口行数上限
const skillPath = join(root, 'SKILL.md');
const skillTxt = readFileSync(skillPath, 'utf8');
const skillLines = countLines(skillTxt);
if (skillLines > MAX_SKILL_LINES) err(`SKILL.md: ${skillLines} 行 > 上限 ${MAX_SKILL_LINES}`);

// 3. § 交叉引用可解析
for (const f of files) {
  const txt = readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/(?:(0\d-[a-z0-9-]+\.md)\s*)?§(\d+(?:\.\d+)?)/g)) {
    const targetName = m[1] || f.split(sep).pop();
    const target = byName.get(targetName);
    if (!target) {
      err(`${rel(f)}: 引用不存在的文件 ${targetName} §${m[2]}`);
      continue;
    }
    if (!headings.get(target).has(m[2])) err(`${rel(f)}: ${targetName} 无 §${m[2]}`);
  }
}

// 4. references / assets 必须注册进 SKILL.md 索引
for (const f of files) {
  const r = rel(f);
  if (r === 'SKILL.md') continue;
  if (!(r.startsWith('references/') || r.startsWith('assets/'))) continue;
  if (!skillTxt.includes(r.split('/').pop())) err(`${r}: 未在 SKILL.md 索引中注册`);
}

// 5. assets/ 路径引用必须存在
for (const f of files) {
  const txt = readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/assets\/([a-z0-9-]+\.md)/g)) {
    if (!existsSync(join(root, 'assets', m[1]))) err(`${rel(f)}: 指向不存在的模板 assets/${m[1]}`);
  }
}

// 输出
const scope = `${files.length} 个 markdown 文件 / SKILL.md ${skillLines} 行`;
for (const w of warns) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
if (errors.length) {
  console.error(`\n失败：${errors.length} 个错误，${warns.length} 个警告（${scope}）`);
  process.exit(1);
}
console.log(`通过：0 个错误，${warns.length} 个警告（${scope}）`);
