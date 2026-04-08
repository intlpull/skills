#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const SKILL_NAME = 'intlpull-localization';
const SKILL_SOURCE_FILE = path.resolve(__dirname, '../SKILL.md');
const HOME_DIR = os.homedir();
const AGENTS_DIR = path.join(HOME_DIR, '.agents');
const AGENTS_SKILLS_DIR = path.join(AGENTS_DIR, 'skills');
const INSTALLED_SKILL_DIR = path.join(AGENTS_SKILLS_DIR, SKILL_NAME);

// Define supported agents and their likely config paths
// Note: These paths are assumptions based on common patterns and the screenshot.
// Real-world implementation might need adjustment.
interface Agent {
    name: string;
    configDir: string;
    skillsDir: string;
}

const SUPPORTED_AGENTS: Agent[] = [
    { name: 'Amp', configDir: path.join(HOME_DIR, '.amp'), skillsDir: path.join(HOME_DIR, '.amp/skills') },
    { name: 'Antigravity', configDir: path.join(HOME_DIR, '.gemini/antigravity'), skillsDir: path.join(HOME_DIR, '.gemini/antigravity/skills') },
    { name: 'Claude Code', configDir: path.join(HOME_DIR, '.claude'), skillsDir: path.join(HOME_DIR, '.claude/skills') },
    { name: 'Cursor', configDir: path.join(HOME_DIR, '.cursor'), skillsDir: path.join(HOME_DIR, '.cursor/skills') }, // Hypothetical global skills
    { name: 'Gemini CLI', configDir: path.join(HOME_DIR, '.gemini'), skillsDir: path.join(HOME_DIR, '.gemini/skills') },
    { name: 'Kiro CLI', configDir: path.join(HOME_DIR, '.kiro'), skillsDir: path.join(HOME_DIR, '.kiro/skills') },
    { name: 'OpenCode', configDir: path.join(HOME_DIR, '.opencode'), skillsDir: path.join(HOME_DIR, '.opencode/skills') },
    { name: 'Trae', configDir: path.join(HOME_DIR, '.trae'), skillsDir: path.join(HOME_DIR, '.trae/skills') },
    { name: 'Windsurf', configDir: path.join(HOME_DIR, '.codeium/windsurf'), skillsDir: path.join(HOME_DIR, '.codeium/windsurf/skills') },
];

async function main() {
    console.log(chalk.bgBlue.bold(' skills '));
    console.log('');

    // 1. Verify source
    if (!fs.existsSync(SKILL_SOURCE_FILE)) {
        console.error(chalk.red(`Error: Source file not found at ${SKILL_SOURCE_FILE}`));
        process.exit(1);
    }

    console.log(`${chalk.green('◇')} Source: Local Package (@intlpullhq/skill)`);
    console.log(`${chalk.green('◇')} Found 1 skill`);
    console.log('');
    console.log(`${chalk.cyan('●')} Skill: ${chalk.bold(SKILL_NAME)}`);
    console.log(chalk.gray('  Expert localization workflows for IntlPull. Safe string extraction, CLI integration.'));
    console.log('');

    // 2. Detect agents
    const detectedAgents = SUPPORTED_AGENTS.filter(agent => fs.existsSync(agent.configDir));

    console.log(`${chalk.green('◇')} Detected ${detectedAgents.length} agents`);

    if (detectedAgents.length === 0) {
        console.log(chalk.yellow('  No supported agents found in home directory.'));
        // Allow installing to ~/.agents/skills anyway?
    }

    // 3. Select agents
    // If we found agents, ask user. If not, maybe just install to central repo.
    let selectedAgents: Agent[] = [];

    if (detectedAgents.length > 0) {
        const response = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'agents',
                message: 'Select agents to install skills to',
                choices: detectedAgents.map(a => ({ name: a.name, value: a, checked: true })),
                pageSize: 10
            }
        ]);
        selectedAgents = response.agents;
    }

    console.log('');
    console.log(`${chalk.green('◇')} Installation scope`);
    console.log(`  Global`);
    console.log('');
    console.log(`${chalk.green('◇')} Installation method`);
    console.log(`  Symlink (Recommended)`);
    console.log('');

    // 4. Confirmation
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Proceed with installation?',
            default: true
        }
    ]);

    if (!confirm) {
        console.log('Aborted.');
        return;
    }

    console.log('');
    console.log(`${chalk.green('◇')} Installation Summary ─────────────────────────┐`);
    console.log(`  ${chalk.gray(AGENTS_SKILLS_DIR.replace(HOME_DIR, '~') + '/' + SKILL_NAME)}`);
    if (selectedAgents.length > 0) {
        const agentNames = selectedAgents.map(a => a.name).join(', ');
        const displayNames = selectedAgents.length > 4
            ? `${selectedAgents.slice(0, 4).map(a => a.name).join(', ')} +${selectedAgents.length - 4} more`
            : agentNames;
        console.log(`    symlink → ${displayNames}`);
    } else {
        console.log(`    (Central installation only)`);
    }
    console.log(`───────────────────────────────────────────────────────┘`);
    console.log('');

    // 5. Perform Installation
    const spinner = ora('Installing skill...').start();

    try {
        // A. Ensure central repo exists
        await fs.ensureDir(INSTALLED_SKILL_DIR);

        // B. Symlink or Copy SKILL.md to central repo
        // We'll copy the file to ensure it exists standalone, or symlink if we want updates to reflect.
        // Screenshot says "Source: https://..." which implies it cloned a repo. 
        // Here we are in a package. Let's Symlink the PACKAGE version to ~/.agents
        // effectively `ln -s /path/to/repo/packages/skill/SKILL.md ~/.agents/skills/intlpull-localization/SKILL.md`
        const destFile = path.join(INSTALLED_SKILL_DIR, 'SKILL.md');

        // Remove existing if any
        if (fs.existsSync(destFile)) {
            await fs.remove(destFile);
        }

        // Create symlink
        await fs.ensureSymlink(SKILL_SOURCE_FILE, destFile);

        // C. Symlink to agents
        for (const agent of selectedAgents) {
            await fs.ensureDir(agent.skillsDir);
            const agentSkillDir = path.join(agent.skillsDir, SKILL_NAME);
            const agentSkillFile = path.join(agentSkillDir, 'SKILL.md');

            // Strategy: Symlink the *folder* from ~/.agents to appropriate place in agent?
            // Or symlink the file? 
            // Most simply: Symlink the folder `~/.agents/skills/intlpull-localization` to `~/.cursor/skills/intlpull-localization`.

            // Ensure specific agent skill dir does not exist (to symlink folder) OR ensure parent exists (to symlink file).
            // If we symlink the FOLDER:
            if (fs.existsSync(agentSkillDir)) {
                // If it's a symlink or folder, remove it to update
                await fs.remove(agentSkillDir);
            }

            // Create symlink: AgentDir -> CentralDir
            await fs.ensureSymlink(INSTALLED_SKILL_DIR, agentSkillDir);
        }

        spinner.succeed('Installation complete');
        console.log('');
        console.log(`${chalk.green('◇')} Installed 1 skill to ${selectedAgents.length} agents ──────────────────┐`);
        console.log(`  ${chalk.green('✓')} ${chalk.gray(AGENTS_SKILLS_DIR.replace(HOME_DIR, '~') + '/' + SKILL_NAME)}`);
        if (selectedAgents.length > 0) {
            const displayNames = selectedAgents.length > 4
                ? `${selectedAgents.slice(0, 4).map(a => a.name).join(', ')} +${selectedAgents.length - 4} more`
                : selectedAgents.map(a => a.name).join(', ');
            console.log(`    symlink → ${displayNames}`);
        }
        console.log(`───────────────────────────────────────────────────────┘`);

    } catch (err) {
        spinner.fail('Installation failed');
        console.error(err);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
