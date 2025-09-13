#!/usr/bin/env node

/**
 * Export Lazarus Pit data for web interface
 * This script reads the Lazarus Pit data and exports it to a JSON file
 * that can be served by GitHub Pages
 */

import { LazarusPit } from '../storage/lazarus-pit';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

interface WebExportData {
  projects: any[];
  stats: {
    totalProjects: number;
    statusDistribution: Record<string, number>;
    languageDistribution: Record<string, number>;
    averagePriority: number;
    averageProgress: number;
    successRate: number;
  };
  lastExported: string;
  exportVersion: string;
}

class PitDataExporter {
  private lazarusPit: LazarusPit;
  private outputPath: string;

  constructor() {
    this.lazarusPit = new LazarusPit();
    // Export to docs/assets/data/ for GitHub Pages
    this.outputPath = path.join(process.cwd(), 'docs', 'assets', 'data');
  }

  async exportData(): Promise<void> {
    try {
      console.log(chalk.blue('🔥 Exporting Lazarus Pit data for web interface...'));

      // Ensure output directory exists
      await fs.mkdir(this.outputPath, { recursive: true });

      // Get all projects from the pit
      const allProjects = await this.lazarusPit.query({});
      const stats = await this.lazarusPit.getStats();

      // Transform data for web consumption
      const webData: WebExportData = {
        projects: allProjects.map(project => ({
          id: project.id,
          repository: {
            full_name: project.repository.full_name,
            name: project.repository.full_name.split('/')[1], // Extract name from full_name
            description: project.repository.description,
            language: project.repository.language,
            stargazers_count: project.repository.stargazers_count,
            html_url: project.repository.html_url,
            updated_at: project.repository.pushed_at
          },
          status: project.phoenixData.status,
          priority: project.phoenixData.priority,
          progress: project.phoenixData.progress,
          tags: project.metadata.tags,
          notes: project.metadata.notes,
          category: project.metadata.category,
          source: project.metadata.source,
          immersedAt: project.phoenixData.addedAt,
          lastUpdated: project.phoenixData.updatedAt,
          completedAt: project.phoenixData.completedAt,
          issues: project.phoenixData.issues || [],
          estimatedEffort: project.phoenixData.estimatedTime
        })),
        stats: {
          totalProjects: stats.total,
          statusDistribution: stats.byStatus,
          languageDistribution: stats.byLanguage,
          averagePriority: stats.avgPriority,
          averageProgress: stats.avgProgress,
          successRate: stats.successRate
        },
        lastExported: new Date().toISOString(),
        exportVersion: '1.0.0'
      };

      // Write to JSON file
      const outputFile = path.join(this.outputPath, 'lazarus-pit.json');
      await fs.writeFile(outputFile, JSON.stringify(webData, null, 2), 'utf-8');

      // Also create a minified version for faster loading
      const minifiedFile = path.join(this.outputPath, 'lazarus-pit.min.json');
      await fs.writeFile(minifiedFile, JSON.stringify(webData), 'utf-8');

      console.log(chalk.green(`✅ Exported ${webData.projects.length} projects to:`));
      console.log(chalk.gray(`   📄 ${outputFile}`));
      console.log(chalk.gray(`   📄 ${minifiedFile}`));

      // Generate summary
      this.printSummary(webData);

    } catch (error) {
      console.error(chalk.red(`❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  }

  private printSummary(data: WebExportData): void {
    console.log(chalk.blue('\n📊 Export Summary:'));
    console.log(chalk.gray(`   Total Projects: ${data.stats.totalProjects}`));
    
    console.log(chalk.gray('   Status Distribution:'));
    Object.entries(data.stats.statusDistribution).forEach(([status, count]) => {
      console.log(chalk.gray(`     ${status}: ${count}`));
    });

    console.log(chalk.gray('   Language Distribution:'));
    const topLanguages = Object.entries(data.stats.languageDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    topLanguages.forEach(([language, count]) => {
      console.log(chalk.gray(`     ${language}: ${count}`));
    });

    console.log(chalk.gray(`   Average Priority: ${data.stats.averagePriority}`));
    console.log(chalk.gray(`   Average Progress: ${data.stats.averageProgress}%`));
    console.log(chalk.gray(`   Success Rate: ${data.stats.successRate}%`));
    console.log(chalk.gray(`   Last Exported: ${data.lastExported}`));
  }

  /**
   * Watch for changes and auto-export
   */
  async startWatcher(): Promise<void> {
    console.log(chalk.blue('👁️  Starting auto-export watcher...'));
    
    setInterval(async () => {
      try {
        await this.exportData();
        console.log(chalk.green('🔄 Auto-export completed'));
      } catch (error) {
        console.error(chalk.red(`❌ Auto-export failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    }, 60000); // Export every minute
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const exporter = new PitDataExporter();

  if (args.includes('--watch')) {
    await exporter.exportData(); // Initial export
    await exporter.startWatcher(); // Start watching
  } else {
    await exporter.exportData();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red(`❌ ${error.message}`));
    process.exit(1);
  });
}

export { PitDataExporter };
