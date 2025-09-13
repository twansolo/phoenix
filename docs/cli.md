---
layout: default
title: "Phoenix CLI Reference"
description: "Complete command-line interface documentation for Phoenix"
---

# 📚 Phoenix CLI Reference

Complete documentation for Phoenix's command-line interface and all available commands.

---

## 🚀 Installation

```bash
# Install globally via npm
npm install -g phoenix

# Verify installation
phoenix --version
```

---

## 🎯 Quick Start

```bash
# Revive a single project
phoenix revive owner/repo --modernize --community-kit

# Import projects from Kraven
phoenix import-kraven results.json --queue --auto-start

# Check revival status
phoenix status
phoenix queue
```

---

## 📋 Commands Overview

<div class="commands-grid">
    <div class="command-card">
        <h4>🔥 revive</h4>
        <p>Revive a specific repository with automated modernization</p>
        <code>phoenix revive &lt;repository&gt; [options]</code>
    </div>
    
    <div class="command-card">
        <h4>🔍 analyze</h4>
        <p>Analyze a repository's revival potential and requirements</p>
        <code>phoenix analyze &lt;repository&gt; [options]</code>
    </div>
    
    <div class="command-card">
        <h4>🛠️ modernize</h4>
        <p>Update dependencies and add modern tooling</p>
        <code>phoenix modernize &lt;repository&gt; [options]</code>
    </div>
    
    <div class="command-card">
        <h4>🌟 community-kit</h4>
        <p>Generate community infrastructure and documentation</p>
        <code>phoenix community-kit &lt;repository&gt; [options]</code>
    </div>
    
    <div class="command-card">
        <h4>📥 import-kraven</h4>
        <p>Import discovered projects from Kraven JSON export</p>
        <code>phoenix import-kraven &lt;file&gt; [options]</code>
    </div>
    
    <div class="command-card">
        <h4>📊 status</h4>
        <p>Show current revival status and statistics</p>
        <code>phoenix status [options]</code>
    </div>
    
    <div class="command-card">
        <h4>📋 queue</h4>
        <p>Manage the revival queue and priorities</p>
        <code>phoenix queue [command] [options]</code>
    </div>
    
    <div class="command-card">
        <h4>🏥 health-check</h4>
        <p>Check Phoenix system health and configuration</p>
        <code>phoenix health-check</code>
    </div>
</div>

---

## 🔥 revive

Revive a specific repository with comprehensive modernization and community building.

### Usage
```bash
phoenix revive <repository> [options]
```

### Arguments
- `<repository>` - Repository in format `owner/repo` or full GitHub URL

### Options
```bash
--modernize, -m          Update dependencies and add modern tooling
--community-kit, -c      Generate community infrastructure
--security-fix, -s       Fix security vulnerabilities
--ci-cd                  Set up CI/CD pipelines
--priority <level>       Set priority: low, normal, high, urgent
--output <format>        Output format: table, json, markdown
--dry-run               Show what would be done without executing
--force                 Force revival even if repository seems active
```

### Examples
```bash
# Full revival with all features
phoenix revive microsoft/typescript --modernize --community-kit --ci-cd

# Security-focused revival
phoenix revive vulnerable/project --security-fix --priority high

# Dry run to see what would happen
phoenix revive test/repo --modernize --dry-run
```

---

## 🔍 analyze

Analyze a repository's revival potential, technical debt, and modernization requirements.

### Usage
```bash
phoenix analyze <repository> [options]
```

### Options
```bash
--depth <level>          Analysis depth: shallow, normal, deep
--output <format>        Output format: table, json, markdown
--save <file>           Save analysis results to file
--include-deps          Include dependency analysis
--include-security      Include security vulnerability scan
```

### Examples
```bash
# Basic analysis
phoenix analyze facebook/react

# Deep analysis with security scan
phoenix analyze old/project --depth deep --include-security

# Save analysis to file
phoenix analyze project/repo --output json --save analysis.json
```

---

## 🛠️ modernize

Update dependencies, fix vulnerabilities, and add modern development tooling.

### Usage
```bash
phoenix modernize <repository> [options]
```

### Options
```bash
--dependencies          Update all dependencies to latest stable
--dev-tools             Add modern development tools (ESLint, Prettier, etc.)
--typescript            Convert JavaScript to TypeScript
--testing               Add testing framework and examples
--security-only         Only fix security vulnerabilities
--interactive           Prompt for each change
```

### Examples
```bash
# Full modernization
phoenix modernize old/project --dependencies --dev-tools --testing

# Security-only update
phoenix modernize vulnerable/app --security-only

# Interactive modernization
phoenix modernize project/repo --interactive
```

---

## 🌟 community-kit

Generate comprehensive community infrastructure including documentation, templates, and guidelines.

### Usage
```bash
phoenix community-kit <repository> [options]
```

### Options
```bash
--readme                Generate comprehensive README
--contributing          Add CONTRIBUTING.md guidelines
--code-of-conduct       Add CODE_OF_CONDUCT.md
--issue-templates       Create GitHub issue templates
--pr-template           Add pull request template
--security-policy       Add SECURITY.md policy
--license <type>        Add license (mit, apache, gpl, etc.)
--all                   Generate all community files
```

### Examples
```bash
# Generate all community files
phoenix community-kit project/repo --all

# Specific community files
phoenix community-kit repo/name --readme --contributing --issue-templates

# Add license
phoenix community-kit project/repo --license mit
```

---

## 📥 import-kraven

Import discovered projects from Kraven JSON export for batch processing.

### Usage
```bash
phoenix import-kraven <file> [options]
```

### Options
```bash
--queue                 Add imported projects to revival queue
--auto-start            Automatically start revival for imported projects
--priority <level>      Set priority for all imported projects
--filter-potential <n>  Only import projects with revival potential > n%
--filter-abandonment <n> Only import projects with abandonment score > n%
--output <format>       Output import results format
```

### Examples
```bash
# Import and queue all projects
phoenix import-kraven discoveries.json --queue --auto-start

# Import only high-potential projects
phoenix import-kraven results.json --filter-potential 70 --queue

# Import with high priority
phoenix import-kraven urgent.json --queue --priority high
```

---

## 📊 status

Show current revival status, statistics, and system information.

### Usage
```bash
phoenix status [options]
```

### Options
```bash
--detailed              Show detailed status information
--json                  Output status as JSON
--refresh <seconds>     Auto-refresh every n seconds
--projects              Show individual project status
```

### Examples
```bash
# Basic status
phoenix status

# Detailed status with project list
phoenix status --detailed --projects

# Auto-refreshing status
phoenix status --refresh 5
```

---

## 📋 queue

Manage the revival queue, priorities, and processing.

### Usage
```bash
phoenix queue [command] [options]
```

### Commands
```bash
list                    List all queued projects
add <repository>        Add project to queue
remove <repository>     Remove project from queue
priority <repo> <level> Change project priority
pause                   Pause queue processing
resume                  Resume queue processing
clear                   Clear completed projects
export <file>           Export queue to file
```

### Examples
```bash
# List queue
phoenix queue list

# Add project with high priority
phoenix queue add urgent/project --priority high

# Pause processing
phoenix queue pause

# Export queue
phoenix queue export queue-backup.json
```

---

## 🏥 health-check

Check Phoenix system health, configuration, and dependencies.

### Usage
```bash
phoenix health-check [options]
```

### Options
```bash
--fix                   Attempt to fix detected issues
--verbose               Show detailed health information
--json                  Output health status as JSON
```

### Examples
```bash
# Basic health check
phoenix health-check

# Detailed health check with auto-fix
phoenix health-check --verbose --fix
```

---

## ⚙️ Global Options

These options are available for all commands:

```bash
--help, -h              Show help information
--version, -V           Show version number
--config <file>         Use custom configuration file
--verbose, -v           Enable verbose output
--quiet, -q             Suppress non-essential output
--no-color              Disable colored output
```

---

## 📁 Configuration

Phoenix can be configured via a `.phoenixrc` file in your home directory or project root:

```json
{
  "github": {
    "token": "your-github-token",
    "apiUrl": "https://api.github.com"
  },
  "revival": {
    "defaultPriority": "normal",
    "autoModernize": true,
    "autoCommunityKit": true,
    "autoSecurityFix": true
  },
  "queue": {
    "maxConcurrent": 3,
    "retryAttempts": 3,
    "retryDelay": 5000
  },
  "output": {
    "defaultFormat": "table",
    "colorOutput": true,
    "verboseLogging": false
  }
}
```

---

## 🌍 Environment Variables

```bash
PHOENIX_GITHUB_TOKEN    GitHub personal access token
PHOENIX_CONFIG_PATH     Custom configuration file path
PHOENIX_LOG_LEVEL       Logging level (error, warn, info, debug)
PHOENIX_QUEUE_DIR       Custom queue storage directory
PHOENIX_CACHE_DIR       Custom cache directory
```

---

## 🚨 Exit Codes

Phoenix uses standard exit codes:

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Configuration error
- `4` - Network/API error
- `5` - File system error

---

## 💡 Tips & Best Practices

<div class="tips-grid">
    <div class="tip-card">
        <h4>🎯 Batch Processing</h4>
        <p>Use Kraven to discover projects, then import them into Phoenix for efficient batch revival.</p>
        <code>kraven hunt --language typescript --output json | phoenix import-kraven --queue</code>
    </div>
    
    <div class="tip-card">
        <h4>🔄 Automation</h4>
        <p>Set up automated workflows using GitHub Actions or cron jobs for continuous project monitoring.</p>
    </div>
    
    <div class="tip-card">
        <h4>🛡️ Security First</h4>
        <p>Always run security scans before full revival to identify critical vulnerabilities.</p>
        <code>phoenix analyze repo/name --include-security</code>
    </div>
    
    <div class="tip-card">
        <h4>📊 Monitor Progress</h4>
        <p>Use the status and queue commands to monitor revival progress and system health.</p>
        <code>phoenix status --refresh 10</code>
    </div>
</div>

<style>
.commands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 3rem 0;
}

.command-card {
    background: var(--phoenix-surface);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--phoenix-border);
    transition: all 0.3s ease;
}

.command-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 69, 0, 0.1);
    border-color: var(--phoenix-primary);
}

.command-card h4 {
    margin: 0 0 0.75rem 0;
    color: var(--phoenix-accent);
}

.command-card p {
    margin-bottom: 1rem;
    color: var(--phoenix-text-muted);
    font-size: 0.95rem;
}

.command-card code {
    font-size: 0.85rem;
    display: block;
    padding: 0.5rem;
    background: var(--phoenix-surface-light);
    border-radius: 6px;
    color: var(--phoenix-text-muted);
}

.tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.tip-card {
    background: var(--phoenix-surface);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
    border-left: 4px solid var(--phoenix-primary);
}

.tip-card h4 {
    margin: 0 0 1rem 0;
    color: var(--phoenix-accent);
}

.tip-card p {
    margin-bottom: 1rem;
    color: var(--phoenix-text-muted);
}

.tip-card code {
    font-size: 0.85rem;
    display: block;
    padding: 0.75rem;
    background: var(--phoenix-surface-light);
    border-radius: 8px;
    color: var(--phoenix-accent);
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .commands-grid {
        grid-template-columns: 1fr;
    }
    
    .tips-grid {
        grid-template-columns: 1fr;
    }
}
</style>
