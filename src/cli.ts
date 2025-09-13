#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { PhoenixCore } from './phoenix';
import { KravenIntegration } from './integrations/kraven';
import { ProjectAnalyzer } from './analyzers/project-analyzer';
import { DependencyModernizer } from './modernizers/dependency-modernizer';
import { CommunityBuilder } from './community/community-builder';

// Load environment variables
function loadEnvironmentVariables() {
  // Try current directory first
  if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
  } else {
    // Try Phoenix installation directory
    const phoenixEnvPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(phoenixEnvPath)) {
      dotenv.config({ path: phoenixEnvPath });
    }
  }
}

loadEnvironmentVariables();

const program = new Command();
const phoenix = new PhoenixCore();

program
  .name('phoenix')
  .description('🔥 Phoenix - Automated revival of dead projects (From ashes to 2099)')
  .version('1.0.0');

// ASCII Art Banner
const banner = `
${chalk.red('🔥')} ${chalk.bold.red('PHOENIX')} ${chalk.red('🔥')}
${chalk.gray('From ashes to 2099')}
${chalk.gray('Automated project resurrection')}
`;

program.addHelpText('beforeAll', banner);

// Revive Command
program
  .command('revive')
  .description('Revive an abandoned project')
  .argument('<repository>', 'Repository in format "owner/repo"')
  .option('-p, --preset <preset>', 'Modernization preset (minimal|standard|2099)', 'standard')
  .option('--auto-fix', 'Automatically fix issues where possible', false)
  .option('--dry-run', 'Show what would be done without making changes', false)
  .option('--output <format>', 'Output format (table|json|markdown)', 'table')
  .action(async (repository, options) => {
    console.log(banner);
    console.log(chalk.yellow(`🔍 Starting revival of ${chalk.bold(repository)}...`));
    
    try {
      const result = await phoenix.reviveProject(repository, {
        preset: options.preset,
        autoFix: options.autoFix,
        dryRun: options.dryRun,
        outputFormat: options.output
      });
      
      console.log(chalk.green(`✅ Revival process completed!`));
      console.log(chalk.gray(`Project ID: ${result.id}`));
    } catch (error) {
      console.error(chalk.red(`❌ Revival failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Analyze Command
program
  .command('analyze')
  .description('Analyze a project for revival potential')
  .argument('<repository>', 'Repository in format "owner/repo"')
  .option('--output <format>', 'Output format (table|json|markdown)', 'table')
  .action(async (repository, options) => {
    console.log(banner);
    console.log(chalk.yellow(`🔍 Analyzing ${chalk.bold(repository)}...`));
    
    try {
      const analyzer = new ProjectAnalyzer();
      const result = await analyzer.analyze(repository);
      
      if (options.output === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.green(`✅ Analysis completed!`));
        console.log(chalk.cyan(`Overall Health: ${result.health.overall}%`));
        console.log(chalk.cyan(`Revival Potential: ${result.health.maintainability}%`));
        console.log(chalk.cyan(`Issues Found: ${result.issues.length}`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Modernize Command
program
  .command('modernize')
  .description('Modernize project dependencies and tooling')
  .argument('<repository>', 'Repository in format "owner/repo"')
  .option('-p, --preset <preset>', 'Modernization preset (minimal|standard|2099)', 'standard')
  .option('--dependencies-only', 'Only update dependencies', false)
  .option('--dry-run', 'Show what would be updated without making changes', false)
  .action(async (repository, options) => {
    console.log(banner);
    console.log(chalk.yellow(`⚡ Modernizing ${chalk.bold(repository)}...`));
    
    try {
      const modernizer = new DependencyModernizer();
      const result = await modernizer.modernize(repository, {
        preset: options.preset,
        dependenciesOnly: options.dependenciesOnly,
        dryRun: options.dryRun
      });
      
      console.log(chalk.green(`✅ Modernization completed!`));
      console.log(chalk.cyan(`Dependencies updated: ${result.updated.length}`));
    } catch (error) {
      console.error(chalk.red(`❌ Modernization failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Community Kit Command
program
  .command('community-kit')
  .description('Generate community building files')
  .argument('<repository>', 'Repository in format "owner/repo"')
  .option('--all', 'Generate all community files', false)
  .option('--contributing', 'Generate CONTRIBUTING.md', false)
  .option('--templates', 'Generate issue/PR templates', false)
  .option('--readme', 'Enhance README.md', false)
  .action(async (repository, options) => {
    console.log(banner);
    console.log(chalk.yellow(`👥 Building community kit for ${chalk.bold(repository)}...`));
    
    try {
      const builder = new CommunityBuilder();
      const result = await builder.generateKit(repository, {
        all: options.all,
        contributing: options.contributing,
        templates: options.templates,
        readme: options.readme
      });
      
      console.log(chalk.green(`✅ Community kit generated!`));
      console.log(chalk.cyan(`Files created: ${result.filesCreated.length}`));
    } catch (error) {
      console.error(chalk.red(`❌ Community kit generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Import from Kraven Command
program
  .command('import-kraven')
  .description('Import results from Kraven for batch processing')
  .argument('<file>', 'Kraven results JSON file')
  .option('--queue', 'Add to revival queue', false)
  .option('--auto-start', 'Automatically start revival process', false)
  .action(async (file, options) => {
    console.log(banner);
    console.log(chalk.yellow(`📥 Importing Kraven results from ${chalk.bold(file)}...`));
    
    try {
      const integration = new KravenIntegration();
      const result = await integration.importResults(file, {
        queue: options.queue,
        autoStart: options.autoStart
      });
      
      console.log(chalk.green(`✅ Import completed!`));
      console.log(chalk.cyan(`Projects imported: ${result.imported.length}`));
      if (options.queue) {
        console.log(chalk.cyan(`Projects queued: ${result.queued.length}`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Status Command
program
  .command('status')
  .description('Check revival status of projects')
  .argument('[project]', 'Specific project ID or repository')
  .option('--all', 'Show all projects', false)
  .action(async (project, options) => {
    console.log(banner);
    
    try {
      const status = await phoenix.getStatus(project, { all: options.all });
      
      if (options.all || !project) {
        console.log(chalk.cyan(`📊 Phoenix Status Dashboard`));
        console.log(chalk.gray(`Active projects: ${status.active}`));
        console.log(chalk.gray(`Completed: ${status.completed}`));
        console.log(chalk.gray(`Failed: ${status.failed}`));
      } else {
        console.log(chalk.cyan(`📊 Project Status: ${project}`));
        console.log(chalk.gray(`Status: ${status.status}`));
        console.log(chalk.gray(`Progress: ${status.progress}%`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Lazarus Pit Command
program
  .command('pit')
  .description('Manage the Lazarus Pit - Dynamic project resurrection storage')
  .option('--list', 'List projects in the pit', false)
  .option('--stats', 'Show pit statistics', false)
  .option('--immerse <repository>', 'Immerse project in the pit')
  .option('--extract <id>', 'Extract project from the pit')
  .option('--process', 'Process next project from the pit', false)
  .option('--priority <level>', 'Set priority when immersing (1-100)', parseInt)
  .option('--tags <tags>', 'Add tags when immersing (comma-separated)')
  .option('--notes <notes>', 'Add notes when immersing')
  .option('--status <status>', 'Filter by status when listing')
  .option('--source <source>', 'Filter by source when listing')
  .action(async (options) => {
    console.log(banner);
    console.log(chalk.red('🔥 LAZARUS PIT 🔥'));
    console.log(chalk.gray('Dynamic resurrection storage system\n'));
    
    try {
      if (options.list) {
        const query: any = {};
        if (options.status) query.status = [options.status];
        if (options.source) query.source = [options.source];
        
        const entries = await phoenix.queryPit(query);
        console.log(chalk.cyan(`🔥 Lazarus Pit Contents (${entries.length} projects)`));
        
        if (entries.length === 0) {
          console.log(chalk.gray('   The pit is empty. Use --immerse to add projects.'));
        } else {
          entries.forEach((entry) => {
            const statusEmoji = {
              pending: '⏳', analyzing: '🔍', modernizing: '🛠️',
              'community-building': '🌟', completed: '✅', failed: '❌', paused: '⏸️'
            }[entry.phoenixData.status];
            
            console.log(chalk.white(`   ${statusEmoji} ${entry.repository.full_name}`));
            console.log(chalk.gray(`      ID: ${entry.id} | Priority: ${entry.phoenixData.priority} | Progress: ${entry.phoenixData.progress}%`));
            if (entry.metadata.tags.length > 0) {
              console.log(chalk.gray(`      Tags: ${entry.metadata.tags.join(', ')}`));
            }
          });
        }
      } else if (options.stats) {
        const stats = await phoenix.getPitStats();
        console.log(chalk.cyan('📊 Lazarus Pit Statistics\n'));
        console.log(chalk.white(`Total Projects: ${stats.total}`));
        console.log(chalk.white(`Success Rate: ${stats.successRate.toFixed(1)}%`));
        console.log(chalk.white(`Average Priority: ${stats.avgPriority.toFixed(1)}`));
        console.log(chalk.white(`Average Progress: ${stats.avgProgress.toFixed(1)}%\n`));
        
        console.log(chalk.yellow('Status Distribution:'));
        Object.entries(stats.byStatus).forEach(([status, count]) => {
          if (count > 0) {
            console.log(chalk.gray(`  ${status}: ${count}`));
          }
        });
        
        console.log(chalk.yellow('\nLanguage Distribution:'));
        Object.entries(stats.byLanguage).slice(0, 5).forEach(([lang, count]) => {
          console.log(chalk.gray(`  ${lang}: ${count}`));
        });
      } else if (options.immerse) {
        const tags = options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [];
        const id = await phoenix.immerse(options.immerse, {
          priority: options.priority,
          tags,
          notes: options.notes,
          source: 'manual'
        });
        console.log(chalk.green(`🔥 ${options.immerse} immersed in Lazarus Pit (ID: ${id})`));
      } else if (options.extract) {
        const success = await phoenix.extract(options.extract);
        if (success) {
          console.log(chalk.green(`🔥 Project extracted from Lazarus Pit`));
        } else {
          console.log(chalk.red(`❌ Project not found in pit`));
        }
      } else if (options.process) {
        const result = await phoenix.processFromPit();
        if (result) {
          console.log(chalk.green(`🔥 Processing: ${result.repository} (ID: ${result.id})`));
        } else {
          console.log(chalk.yellow('🔥 Lazarus Pit is empty - no projects to process'));
        }
      } else {
        // Show help if no options provided
        console.log(chalk.yellow('Available commands:'));
        console.log(chalk.gray('  --list              List all projects in the pit'));
        console.log(chalk.gray('  --stats             Show pit statistics'));
        console.log(chalk.gray('  --immerse <repo>    Add project to pit'));
        console.log(chalk.gray('  --extract <id>      Remove project from pit'));
        console.log(chalk.gray('  --process           Process next project'));
        console.log(chalk.gray('\nExample: phoenix pit --immerse microsoft/typescript --priority 80 --tags "popular,framework"'));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Lazarus Pit operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Health Check Command
program
  .command('health-check')
  .description('Check Phoenix system health')
  .action(async () => {
    console.log(banner);
    console.log(chalk.yellow('🏥 Running Phoenix health check...'));
    
    try {
      const health = await phoenix.healthCheck();
      
      console.log(chalk.green('✅ Phoenix Health Check'));
      console.log(chalk.cyan(`GitHub API: ${health.github ? '✅' : '❌'}`));
      console.log(chalk.cyan(`Dependencies: ${health.dependencies ? '✅' : '❌'}`));
      console.log(chalk.cyan(`Storage: ${health.storage ? '✅' : '❌'}`));
      
      if (!health.overall) {
        console.log(chalk.red('❌ Some systems are not healthy'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

// Error handling
program.configureOutput({
  writeErr: (str) => process.stderr.write(chalk.red(str))
});

program.parse();
