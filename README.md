# IntlPull Localization Skill

> **The "Remotion" of Localization**: A programmable, logic-safe i18n skill for AI Agents.

This skill equips Claude with **Standardized Localization Engineering Knowledge**. Unlike generic translation prompts that often break code, this skill enforces a **Logic-Safe Protocol** to ensure your application is internationalized without introducing regressions.

## 🛡️ Why "Logic-Safe"?

Localization is not just replacing text; it's about **context**. This skill is trained to distinguish between:
*   ✅ **User-facing UI text** (Safe to extract)
*   ❌ **Code logic, IDs, & Keys** (Critical to preserve)

It performs real-time **Threat Modeling** before suggesting any refactor, ensuring that your `useEffect` dependencies, `data-testid` attributes, and internal logic remain untouched.

## 🚀 Features

-   **Surgical Extraction**: Identifies safe text candidates with high precision.
-   **Framework Native**: Specialized patterns for **Next.js**, **React**, **React Native**, **iOS**, **Android**, and more.
-   **CLI Automation**: Seamlessly orchestrates `@intlpullhq/cli` to check status, upload/download strings, and fix missing keys.
-   **Context-Aware Naming**: Generates semantic keys (e.g., `Settings.Profile.title`) rather than generic ones (e.g., `text_1`).

## 📦 Installation

### Option 1: Via skills.sh (Recommended — works with all AI agents)

```bash
npx skills add intlpull/skills
```

This installs the skill into your active AI agent (Claude Code, Cursor, Windsurf, Gemini CLI, and more). Tracked on the [skills.sh leaderboard](https://skills.sh/intlpull/skills/intlpull-localization).

### Option 2: Via `@intlpullhq/skills` npm package

```bash
npx @intlpullhq/skills
```

Interactive installer — detects installed agents and symlinks the skill automatically.

### Option 3: Manual Installation

Copy `SKILL.md` directly into your agent's skills directory:

```bash
# Claude Code
mkdir -p ~/.claude/skills/intlpull-localization
curl -o ~/.claude/skills/intlpull-localization/SKILL.md \
  https://raw.githubusercontent.com/intlpull/skills/main/SKILL.md

# Or copy from this repo
mkdir -p .claude/skills/intlpull-localization
cp SKILL.md .claude/skills/intlpull-localization/SKILL.md
```

### Supported Agents

| Agent | Config Dir | Auto-detected |
|-------|-----------|---------------|
| Claude Code | `~/.claude/skills/` | ✅ |
| Antigravity | `~/.gemini/antigravity/skills/` | ✅ |
| Cursor | `~/.cursor/skills/` | ✅ |
| Windsurf | `~/.codeium/windsurf/skills/` | ✅ |
| Gemini CLI | `~/.gemini/skills/` | ✅ |
| Amp | `~/.amp/skills/` | ✅ |
| Kiro | `~/.kiro/skills/` | ✅ |

## 💡 Usage Examples

Once installed, Claude becomes your **Localization Engineer**.

### 1. The "Refactor" Prompt
> "Localize this entire component, but be careful with the logic."

**Claude's Action**:
1.  Scans the file for string literals.
2.  Filters out CSS classes, IDs, and logic values.
3.  Proposes a `useTranslation` refactor.
4.  Generates the corresponding JSON key-value pairs.

### 2. The "fix" Prompt
> "I have some missing keys in the Spanish translation file."

**Claude's Action**:
Runs the CLI to identify and autofill missing keys:
```bash
# Preview what would be fixed
npx @intlpullhq/cli fix --dry-run

# Auto-fix missing translations (defaults to source: en)
npx @intlpullhq/cli fix

# Fix for a specific target language
npx @intlpullhq/cli fix --source en --target es
```

### 3. The "Audit" Prompt
> "Check if I missed any hardcoded strings in the settings page."

**Claude's Action**:
Manually reviews the code against the "Safe Extraction" rules and flags anything that should be internationalized.

## 🛡️ Best Practices Enforced

1.  **Atomic Changes**: Suggests small, verifiable steps rather than massive, risky refactors.
2.  **Semantic Keys**: `Auth.Login.submitButton` instead of `submit`.
3.  **No Logic Breaking**: Strictly avoids touching `const` values used in logic, `useEffect` arrays, or `switch` cases.

## Troubleshooting

-   **Agent refactoring CSS?**: The skill has strict negative constraints. If you see this, please report it!
-   **CLI not working?**: Ensure `@intlpullhq/cli` is installed in your project: `npm i -D @intlpullhq/cli`.
-   **Skill not loading?**: Verify the `SKILL.md` is at `~/.agents/skills/intlpull-localization/SKILL.md` or in your agent's specific skills dir.

## Links

- 🌐 [IntlPull Website](https://intlpull.com)
- 📦 [npm Package](https://www.npmjs.com/package/@intlpullhq/skills)
- 🏆 [skills.sh Listing](https://skills.sh/intlpull/skills/intlpull-localization)
- 🐙 [GitHub Repository](https://github.com/intlpull/skills)
- 📖 [CLI Docs](https://intlpull.com/docs/cli)

## License
MIT
