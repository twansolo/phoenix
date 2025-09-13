import { AnalysisResult, RevivalIssue } from '../types';
import chalk from 'chalk';
import ora from 'ora';

export class ProjectAnalyzer {
  /**
   * Analyze a project for revival potential and issues
   */
  async analyze(repository: string): Promise<AnalysisResult> {
    const spinner = ora(`🔍 Analyzing ${repository}...`).start();

    try {
      const result: AnalysisResult = {
        repository,
        timestamp: new Date(),
        health: {
          overall: 0,
          dependencies: 0,
          security: 0,
          maintainability: 0,
          community: 0
        },
        issues: [],
        recommendations: [],
        estimatedEffort: {
          hours: 0,
          complexity: 'low'
        }
      };

      // Analyze different aspects
      spinner.text = '📦 Analyzing dependencies...';
      const depHealth = await this.analyzeDependencies(repository);
      result.health.dependencies = depHealth.score;
      result.issues.push(...depHealth.issues);

      spinner.text = '🔒 Checking security...';
      const secHealth = await this.analyzeSecurity(repository);
      result.health.security = secHealth.score;
      result.issues.push(...secHealth.issues);

      spinner.text = '🛠️ Evaluating maintainability...';
      const maintHealth = await this.analyzeMaintainability(repository);
      result.health.maintainability = maintHealth.score;
      result.issues.push(...maintHealth.issues);

      spinner.text = '👥 Assessing community...';
      const commHealth = await this.analyzeCommunity(repository);
      result.health.community = commHealth.score;
      result.issues.push(...commHealth.issues);

      // Calculate overall health
      result.health.overall = Math.round(
        (result.health.dependencies + 
         result.health.security + 
         result.health.maintainability + 
         result.health.community) / 4
      );

      // Generate recommendations
      result.recommendations = this.generateRecommendations(result);

      // Estimate effort
      result.estimatedEffort = this.estimateEffort(result.issues);

      spinner.succeed(`✅ Analysis completed for ${repository}`);
      return result;

    } catch (error) {
      spinner.fail(`❌ Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Analyze project dependencies
   */
  private async analyzeDependencies(repository: string): Promise<{ score: number; issues: RevivalIssue[] }> {
    // Mock analysis - in real implementation would:
    // - Check package.json/requirements.txt/etc
    // - Identify outdated dependencies
    // - Check for security vulnerabilities
    // - Assess dependency health

    const issues: RevivalIssue[] = [
      {
        type: 'dependency',
        severity: 'high',
        title: 'Outdated Dependencies',
        description: 'Several dependencies are significantly outdated',
        autoFixable: true,
        estimatedEffort: 'hours'
      },
      {
        type: 'security',
        severity: 'critical',
        title: 'Security Vulnerabilities',
        description: 'Found 3 high-severity security vulnerabilities',
        autoFixable: true,
        estimatedEffort: 'minutes'
      }
    ];

    return { score: 45, issues };
  }

  /**
   * Analyze security aspects
   */
  private async analyzeSecurity(repository: string): Promise<{ score: number; issues: RevivalIssue[] }> {
    const issues: RevivalIssue[] = [
      {
        type: 'security',
        severity: 'medium',
        title: 'Missing Security Headers',
        description: 'Application lacks proper security headers',
        autoFixable: false,
        estimatedEffort: 'hours'
      }
    ];

    return { score: 65, issues };
  }

  /**
   * Analyze maintainability
   */
  private async analyzeMaintainability(repository: string): Promise<{ score: number; issues: RevivalIssue[] }> {
    const issues: RevivalIssue[] = [
      {
        type: 'tooling',
        severity: 'medium',
        title: 'Missing Modern Tooling',
        description: 'Project lacks modern development tools (ESLint, Prettier, etc.)',
        autoFixable: true,
        estimatedEffort: 'hours'
      },
      {
        type: 'compatibility',
        severity: 'high',
        title: 'Node.js Version Compatibility',
        description: 'Project uses outdated Node.js version',
        autoFixable: true,
        estimatedEffort: 'minutes'
      }
    ];

    return { score: 55, issues };
  }

  /**
   * Analyze community aspects
   */
  private async analyzeCommunity(repository: string): Promise<{ score: number; issues: RevivalIssue[] }> {
    const issues: RevivalIssue[] = [
      {
        type: 'documentation',
        severity: 'high',
        title: 'Missing Contributing Guidelines',
        description: 'No CONTRIBUTING.md file found',
        autoFixable: true,
        estimatedEffort: 'hours'
      },
      {
        type: 'documentation',
        severity: 'medium',
        title: 'Outdated README',
        description: 'README.md needs updating with current information',
        autoFixable: false,
        estimatedEffort: 'hours'
      }
    ];

    return { score: 30, issues };
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(result: AnalysisResult): string[] {
    const recommendations: string[] = [];

    if (result.health.dependencies < 60) {
      recommendations.push('Update dependencies to latest stable versions');
      recommendations.push('Set up automated dependency updates with Dependabot');
    }

    if (result.health.security < 70) {
      recommendations.push('Address security vulnerabilities immediately');
      recommendations.push('Implement security scanning in CI/CD pipeline');
    }

    if (result.health.maintainability < 60) {
      recommendations.push('Add modern development tooling (ESLint, Prettier, TypeScript)');
      recommendations.push('Implement automated testing and CI/CD');
    }

    if (result.health.community < 50) {
      recommendations.push('Create comprehensive documentation and contributing guidelines');
      recommendations.push('Set up issue and PR templates');
      recommendations.push('Add code of conduct and community guidelines');
    }

    // Always recommend Phoenix revival
    recommendations.push('🔥 Use Phoenix to automate the revival process');

    return recommendations;
  }

  /**
   * Estimate effort required for revival
   */
  private estimateEffort(issues: RevivalIssue[]): { hours: number; complexity: 'low' | 'medium' | 'high' } {
    let totalHours = 0;
    let complexityScore = 0;

    for (const issue of issues) {
      switch (issue.estimatedEffort) {
        case 'minutes':
          totalHours += 0.5;
          break;
        case 'hours':
          totalHours += 4;
          complexityScore += 1;
          break;
        case 'days':
          totalHours += 16;
          complexityScore += 3;
          break;
      }

      // Add complexity based on severity
      switch (issue.severity) {
        case 'critical':
          complexityScore += 2;
          break;
        case 'high':
          complexityScore += 1;
          break;
      }
    }

    let complexity: 'low' | 'medium' | 'high' = 'low';
    if (complexityScore > 10) complexity = 'high';
    else if (complexityScore > 5) complexity = 'medium';

    return {
      hours: Math.round(totalHours),
      complexity
    };
  }
}
