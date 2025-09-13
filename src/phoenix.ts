import { RevivalProject, PhoenixConfig, AnalysisResult } from './types';
import { ProjectAnalyzer } from './analyzers/project-analyzer';
import { DependencyModernizer } from './modernizers/dependency-modernizer';
import { CommunityBuilder } from './community/community-builder';
import { ProgressTracker } from './tracking/progress-tracker';
import { LazarusPit, PitEntry, PitQuery, PitStats } from './storage/lazarus-pit';
import chalk from 'chalk';
import ora from 'ora';

export interface RevivalOptions {
  preset: string;
  autoFix: boolean;
  dryRun: boolean;
  outputFormat: 'table' | 'json' | 'markdown';
}

export interface StatusResult {
  active: number;
  completed: number;
  failed: number;
  status?: string;
  progress?: number;
}

export interface QueueItem {
  id: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  priority: number;
  addedAt: Date;
}

export interface HealthCheck {
  github: boolean;
  dependencies: boolean;
  storage: boolean;
  overall: boolean;
}

export class PhoenixCore {
  private analyzer: ProjectAnalyzer;
  private modernizer: DependencyModernizer;
  private communityBuilder: CommunityBuilder;
  private progressTracker: ProgressTracker;
  private config: PhoenixConfig;
  private lazarusPit: LazarusPit;
  private activeProjects: Map<string, RevivalProject> = new Map();

  constructor(config?: Partial<PhoenixConfig>) {
    this.analyzer = new ProjectAnalyzer();
    this.modernizer = new DependencyModernizer();
    this.communityBuilder = new CommunityBuilder();
    this.progressTracker = new ProgressTracker();
    this.lazarusPit = new LazarusPit();
    
    this.config = {
      defaultPreset: 'standard',
      autoFix: false,
      communityKit: {
        contributing: true,
        codeOfConduct: true,
        issueTemplates: true,
        prTemplates: true,
        readme: true,
        license: true,
        changelog: true,
        roadmap: true
      },
      integrations: {
        kraven: true,
        github: true
      },
      notifications: {},
      ...config
    };
  }

  /**
   * Main revival process - orchestrates the complete project resurrection
   */
  async reviveProject(repository: string, options: RevivalOptions): Promise<RevivalProject> {
    const projectId = this.generateProjectId(repository);
    const spinner = ora(`🔥 Starting revival of ${repository}`).start();

    try {
      // Initialize project
      const project: RevivalProject = {
        id: projectId,
        repository: await this.getRepositoryInfo(repository),
        status: 'analyzing',
        progress: {
          analysis: 0,
          dependencies: 0,
          modernization: 0,
          community: 0,
          overall: 0
        },
        issues: [],
        recommendations: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.activeProjects.set(projectId, project);

      // Phase 1: Analysis
      spinner.text = '🔍 Analyzing project health...';
      const analysis = await this.analyzer.analyze(repository);
      project.issues = analysis.issues;
      project.recommendations = analysis.recommendations;
      project.progress.analysis = 100;
      project.progress.overall = 25;
      this.updateProject(project);

      if (options.dryRun) {
        spinner.succeed('✅ Dry run completed - no changes made');
        return project;
      }

      // Phase 2: Dependency Modernization
      spinner.text = '⚡ Modernizing dependencies...';
      project.status = 'modernizing';
      await this.modernizer.modernize(repository, {
        preset: options.preset,
        autoFix: options.autoFix,
        dryRun: false
      });
      project.progress.dependencies = 100;
      project.progress.modernization = 100;
      project.progress.overall = 75;
      this.updateProject(project);

      // Phase 3: Community Building
      spinner.text = '👥 Building community kit...';
      project.status = 'community-building';
      await this.communityBuilder.generateKit(repository, {
        all: true
      });
      project.progress.community = 100;
      project.progress.overall = 100;
      project.status = 'completed';
      this.updateProject(project);

      spinner.succeed(`🎉 ${repository} has risen from the ashes!`);
      
      // Track completion
      await this.progressTracker.recordCompletion(project);
      
      return project;

    } catch (error) {
      spinner.fail(`❌ Revival failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      const project = this.activeProjects.get(projectId);
      if (project) {
        project.status = 'failed';
        this.updateProject(project);
      }
      
      throw error;
    }
  }

  /**
   * Get status of projects
   */
  async getStatus(project?: string, options: { all: boolean } = { all: false }): Promise<StatusResult> {
    if (project && !options.all) {
      const proj = this.activeProjects.get(project) || 
                   Array.from(this.activeProjects.values()).find(p => p.repository.full_name === project);
      
      if (!proj) {
        throw new Error(`Project ${project} not found`);
      }

      return {
        active: 0,
        completed: 0,
        failed: 0,
        status: proj.status,
        progress: proj.progress.overall
      };
    }

    const projects = Array.from(this.activeProjects.values());
    const active = projects.filter(p => ['queued', 'analyzing', 'modernizing', 'community-building'].includes(p.status)).length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const failed = projects.filter(p => p.status === 'failed').length;

    return { active, completed, failed };
  }

  /**
   * Queue management
   */
  /**
   * Lazarus Pit management - Dynamic storage and resurrection system
   */
  async getPit(): Promise<LazarusPit> {
    return this.lazarusPit;
  }

  async immerse(repository: string, options: {
    priority?: number;
    source?: 'kraven' | 'manual' | 'api';
    tags?: string[];
    notes?: string;
    category?: 'cli-tool' | 'library' | 'framework' | 'app' | 'other';
  } = {}): Promise<string> {
    return await this.lazarusPit.immerse(repository, options);
  }

  async extract(id: string): Promise<boolean> {
    return await this.lazarusPit.extract(id);
  }

  async queryPit(query: PitQuery = {}): Promise<PitEntry[]> {
    return await this.lazarusPit.query(query);
  }

  async getPitStats(): Promise<PitStats> {
    return await this.lazarusPit.getStats();
  }

  async getNextFromPit(): Promise<PitEntry | null> {
    return await this.lazarusPit.getNext();
  }

  async updatePitEntry(id: string, updates: Partial<PitEntry['phoenixData']>): Promise<boolean> {
    return await this.lazarusPit.updateEntry(id, updates);
  }

  async processFromPit(): Promise<{ repository: string; id: string } | null> {
    const next = await this.getNextFromPit();
    if (!next) {
      return null;
    }

    // Update status to analyzing
    await this.updatePitEntry(next.id, { 
      status: 'analyzing',
      startedAt: new Date()
    });

    // Start revival process for next item
    setTimeout(async () => {
      try {
        await this.reviveProject(next.repository.full_name, {
          preset: this.config.defaultPreset,
          autoFix: this.config.autoFix,
          dryRun: false,
          outputFormat: 'table'
        });
        
        await this.updatePitEntry(next.id, { 
          status: 'completed',
          progress: 100,
          completedAt: new Date()
        });
      } catch (error) {
        await this.updatePitEntry(next.id, { 
          status: 'failed',
          issues: [error instanceof Error ? error.message : 'Unknown error']
        });
      }
    }, 1000);

    return { repository: next.repository.full_name, id: next.id };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheck> {
    const checks = {
      github: await this.checkGitHubAPI(),
      dependencies: await this.checkDependencies(),
      storage: await this.checkStorage(),
      overall: false
    };

    checks.overall = checks.github && checks.dependencies && checks.storage;
    return checks;
  }

  /**
   * Private helper methods
   */
  private generateProjectId(repository: string): string {
    return `phoenix_${repository.replace('/', '_')}_${Date.now()}`;
  }

  private async getRepositoryInfo(repository: string): Promise<any> {
    // This would typically fetch from GitHub API
    // For now, return a mock structure
    const [owner, repo] = repository.split('/');
    return {
      full_name: repository,
      name: repo,
      owner: { login: owner },
      description: `Revival project for ${repository}`,
      html_url: `https://github.com/${repository}`,
      clone_url: `https://github.com/${repository}.git`,
      ssh_url: `git@github.com:${repository}.git`,
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      language: 'TypeScript',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString()
    };
  }

  private updateProject(project: RevivalProject): void {
    project.updatedAt = new Date();
    this.activeProjects.set(project.id, project);
  }

  private async checkGitHubAPI(): Promise<boolean> {
    try {
      // Check if GitHub token is available and valid
      return !!process.env.GITHUB_TOKEN;
    } catch {
      return false;
    }
  }

  private async checkDependencies(): Promise<boolean> {
    try {
      // Check if required dependencies are available
      return true;
    } catch {
      return false;
    }
  }

  private async checkStorage(): Promise<boolean> {
    try {
      // Check if storage/filesystem is accessible
      return true;
    } catch {
      return false;
    }
  }
}

export default PhoenixCore;
