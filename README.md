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

This skill follows the [Agent Skills Standard](https://github.com/anthropics/agent-skills).

### Option 1: Via `@intlpullhq/skill` CLI (Recommended)
This package includes a CLI to install the skill to various AI agents (Claude Code, Cursor, Windsurf, etc.).

```bash
# Run the installer
npx @intlpullhq/skill
```

### Option 2: Manual Installation
Copy the `SKILL.md` file to your skills directory (e.g., `.claude/skills/`).
```bash
mkdir -p .claude/skills/intlpull-localization
cp packages/skill/SKILL.md .claude/skills/intlpull-localization/SKILL.md
```

## 💡 Usage Examples

Once installed, Claude becomes your **Localization Engineer**.

### 1. The "Refactor" Prompt
> "Localize this entire component, but be careful with the logic."

**Claude's Action**:
1.  Scans the file for string literals.
2.  Filters out CSS classes, IDs, and logic values.
3.  Proposes a `useTranslation` refactor.
4.   Generates the corresponding JSON key-value pairs.

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
Updates the CLI to scan specifically for that path (if supported) or manually reviews the code against its "Safe Extraction" rules.

## 🛡️ Best Practices Enforced

1.  **Atomic Changes**: Suggests small, verifiable steps rather than massive, risky refactors.
2.  **Semantic Keys**: `Auth.Login.submitButton` instead of `submit`.
3.  **No Logic Breaking**: Strictly avoids touching `const` values used in logic, `useEffect` arrays, or `switch` cases.

## Troubleshooting

-   **Agent refactoring CSS?**: The skill has strict negative constraints. If you see this, please report it!
-   **CLI not working?**: Ensure `@intlpullhq/cli` is installed in your project: `npm i -D @intlpullhq/cli`.

## License
MIT
