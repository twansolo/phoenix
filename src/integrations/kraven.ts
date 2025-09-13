import * as fs from 'fs-extra';
import { KravenResults, KravenRepository } from '../types';
import chalk from 'chalk';
import ora from 'ora';

export interface ImportOptions {
  queue: boolean;
  autoStart: boolean;
  minRevivalPotential?: number;
  maxAbandonmentScore?: number;
}

export interface ImportResult {
  imported: string[];
  queued: string[];
  skipped: string[];
  errors: string[];
}

export class KravenIntegration {
  /**
   * Import results from Kraven JSON file
   */
  async importResults(filePath: string, options: ImportOptions): Promise<ImportResult> {
    const spinner = ora('📥 Reading Kraven results...').start();
    
    try {
      // Read and parse Kraven results
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const kravenResults: KravenResults = JSON.parse(fileContent);
      
      spinner.text = `📊 Processing ${kravenResults.analyzed.length} repositories...`;
      
      const result: ImportResult = {
        imported: [],
        queued: [],
        skipped: [],
        errors: []
      };

      // Filter repositories based on criteria
      const filtered = this.filterRepositories(kravenResults.analyzed, options);
      
      spinner.text = `✨ Processing ${filtered.length} qualified repositories...`;

      for (const repo of filtered) {
        try {
          const repoName = repo.repository.full_name;
          
          // Import repository data
          await this.importRepository(repo);
          result.imported.push(repoName);
          
          // Add to queue if requested
          if (options.queue) {
            await this.addToQueue(repo);
            result.queued.push(repoName);
          }
          
          // Auto-start revival if requested
          if (options.autoStart && options.queue) {
            // This would trigger the revival process
            // For now, just log it
            console.log(chalk.gray(`🚀 Auto-starting revival for ${repoName}`));
          }
          
        } catch (error) {
          result.errors.push(`${repo.repository.full_name}: ${error.message}`);
        }
      }

      // Log skipped repositories
      const skipped = kravenResults.analyzed.length - filtered.length;
      if (skipped > 0) {
        result.skipped = kravenResults.analyzed
          .filter(repo => !filtered.includes(repo))
          .map(repo => repo.repository.full_name);
      }

      spinner.succeed(`✅ Import completed: ${result.imported.length} imported, ${result.skipped.length} skipped`);
      
      return result;

    } catch (error) {
      spinner.fail(`❌ Import failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Filter repositories based on revival criteria
   */
  private filterRepositories(repositories: KravenRepository[], options: ImportOptions): KravenRepository[] {
    return repositories.filter(repo => {
      // Skip if revival potential is too low
      if (options.minRevivalPotential && repo.revivalPotential < options.minRevivalPotential) {
        return false;
      }

      // Skip if abandonment score is too high (too active)
      if (options.maxAbandonmentScore && repo.abandonmentScore > options.maxAbandonmentScore) {
        return false;
      }

      // Skip if no clear language
      if (!repo.repository.language) {
        return false;
      }

      // Skip if too few stars (might not be worth reviving)
      if (repo.repository.stargazers_count < 10) {
        return false;
      }

      return true;
    });
  }

  /**
   * Import a single repository from Kraven data
   */
  private async importRepository(kravenRepo: KravenRepository): Promise<void> {
    // Convert Kraven data to Phoenix format
    const phoenixData = {
      repository: kravenRepo.repository,
      kravenAnalysis: {
        abandonmentScore: kravenRepo.abandonmentScore,
        revivalPotential: kravenRepo.revivalPotential,
        lastCommitAge: kravenRepo.lastCommitAge,
        reasons: kravenRepo.reasons,
        recommendations: kravenRepo.recommendations
      },
      importedAt: new Date(),
      source: 'kraven'
    };

    // Store in Phoenix database/storage
    // For now, just log the import
    console.log(chalk.gray(`📦 Imported ${kravenRepo.repository.full_name}`));
    
    // In a real implementation, this would:
    // - Store in database
    // - Create project entry
    // - Set up tracking
  }

  /**
   * Add repository to Phoenix revival queue
   */
  private async addToQueue(kravenRepo: KravenRepository): Promise<void> {
    // Calculate priority based on Kraven metrics
    const priority = this.calculatePriority(kravenRepo);
    
    // Add to queue with calculated priority
    // For now, just log it
    console.log(chalk.gray(`📋 Queued ${kravenRepo.repository.full_name} (priority: ${priority})`));
    
    // In a real implementation, this would:
    // - Add to Phoenix queue
    // - Set priority
    // - Schedule processing
  }

  /**
   * Calculate queue priority based on Kraven metrics
   */
  private calculatePriority(kravenRepo: KravenRepository): number {
    let priority = 0;

    // Higher revival potential = higher priority
    priority += kravenRepo.revivalPotential * 0.4;

    // Lower abandonment score = higher priority (more abandoned = higher priority)
    priority += (100 - kravenRepo.abandonmentScore) * 0.3;

    // More stars = higher priority
    const starScore = Math.min(kravenRepo.repository.stargazers_count / 1000 * 100, 100);
    priority += starScore * 0.2;

    // Recent activity = slightly lower priority (less abandoned)
    const ageScore = Math.min(kravenRepo.lastCommitAge / 365 * 100, 100);
    priority += ageScore * 0.1;

    return Math.round(priority);
  }

  /**
   * Export Phoenix results back to Kraven format
   */
  async exportToKraven(projects: any[], outputPath: string): Promise<void> {
    const spinner = ora('📤 Exporting to Kraven format...').start();

    try {
      const kravenFormat: KravenResults = {
        query: 'phoenix-export',
        totalFound: projects.length,
        analyzed: projects.map(project => ({
          repository: project.repository,
          abandonmentScore: project.kravenAnalysis?.abandonmentScore || 0,
          revivalPotential: project.kravenAnalysis?.revivalPotential || 0,
          lastCommitAge: project.kravenAnalysis?.lastCommitAge || 0,
          reasons: project.kravenAnalysis?.reasons || [],
          recommendations: project.recommendations || []
        })),
        timestamp: new Date().toISOString()
      };

      await fs.writeFile(outputPath, JSON.stringify(kravenFormat, null, 2));
      spinner.succeed(`✅ Exported ${projects.length} projects to ${outputPath}`);

    } catch (error) {
      spinner.fail(`❌ Export failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate Kraven results file format
   */
  async validateKravenFile(filePath: string): Promise<boolean> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Check required fields
      if (!data.analyzed || !Array.isArray(data.analyzed)) {
        return false;
      }

      // Check first repository structure
      if (data.analyzed.length > 0) {
        const first = data.analyzed[0];
        if (!first.repository || !first.repository.full_name) {
          return false;
        }
      }

      return true;

    } catch {
      return false;
    }
  }

  /**
   * Get statistics from Kraven results
   */
  async getKravenStats(filePath: string): Promise<any> {
    const content = await fs.readFile(filePath, 'utf-8');
    const data: KravenResults = JSON.parse(content);

    const stats = {
      total: data.analyzed.length,
      languages: {} as Record<string, number>,
      avgRevivalPotential: 0,
      avgAbandonmentScore: 0,
      highPotential: 0, // > 70% revival potential
      abandoned: 0 // > 80% abandonment score
    };

    let totalRevival = 0;
    let totalAbandonment = 0;

    for (const repo of data.analyzed) {
      // Language stats
      const lang = repo.repository.language || 'Unknown';
      stats.languages[lang] = (stats.languages[lang] || 0) + 1;

      // Averages
      totalRevival += repo.revivalPotential;
      totalAbandonment += repo.abandonmentScore;

      // Categories
      if (repo.revivalPotential > 70) stats.highPotential++;
      if (repo.abandonmentScore > 80) stats.abandoned++;
    }

    stats.avgRevivalPotential = Math.round(totalRevival / data.analyzed.length);
    stats.avgAbandonmentScore = Math.round(totalAbandonment / data.analyzed.length);

    return stats;
  }
}
