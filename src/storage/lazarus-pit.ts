import { RevivalProject, KravenRepository } from '../types';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface PitEntry {
  id: string;
  repository: {
    full_name: string;
    html_url: string;
    description?: string;
    language?: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    pushed_at: string;
    created_at: string;
  };
  kravenData?: {
    abandonmentScore: number;
    revivalPotential: number;
    lastCommitAge: number;
    reasons: string[];
    recommendations: string[];
  };
  phoenixData: {
    priority: number;
    status: 'pending' | 'analyzing' | 'modernizing' | 'community-building' | 'completed' | 'failed' | 'paused';
    progress: number;
    addedAt: Date;
    updatedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    estimatedTime?: number;
    actualTime?: number;
    issues: string[];
    logs: PitLogEntry[];
  };
  metadata: {
    source: 'kraven' | 'manual' | 'api';
    tags: string[];
    notes: string;
    assignee?: string;
    category: 'cli-tool' | 'library' | 'framework' | 'app' | 'other';
  };
}

export interface PitLogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  details?: any;
}

export interface PitQuery {
  status?: PitEntry['phoenixData']['status'][];
  priority?: { min?: number; max?: number };
  language?: string[];
  source?: PitEntry['metadata']['source'][];
  tags?: string[];
  category?: PitEntry['metadata']['category'][];
  dateRange?: { from?: Date; to?: Date };
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'priority' | 'addedAt' | 'progress' | 'estimatedTime' | 'stargazers_count';
  sortOrder?: 'asc' | 'desc';
}

export interface PitStats {
  total: number;
  byStatus: Record<PitEntry['phoenixData']['status'], number>;
  bySource: Record<PitEntry['metadata']['source'], number>;
  byLanguage: Record<string, number>;
  avgProgress: number;
  avgPriority: number;
  totalEstimatedTime: number;
  totalActualTime: number;
  successRate: number;
}

export class LazarusPit {
  private entries: Map<string, PitEntry> = new Map();
  private storageDir: string;
  private isLoaded: boolean = false;

  constructor(storageDir: string = '.phoenix/lazarus-pit') {
    this.storageDir = storageDir;
  }

  /**
   * Initialize the Lazarus Pit storage
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
      await this.loadFromDisk();
      this.isLoaded = true;
      console.log(chalk.green('🔥 Lazarus Pit initialized'));
    } catch (error) {
      throw new Error(`Failed to initialize Lazarus Pit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add a project to the Lazarus Pit
   */
  async immerse(repository: string | KravenRepository, options: {
    priority?: number;
    source?: PitEntry['metadata']['source'];
    tags?: string[];
    notes?: string;
    category?: PitEntry['metadata']['category'];
  } = {}): Promise<string> {
    if (!this.isLoaded) await this.initialize();

    const entry: PitEntry = {
      id: this.generateId(),
      repository: typeof repository === 'string' 
        ? await this.fetchRepositoryData(repository)
        : repository.repository,
      kravenData: typeof repository === 'object' ? {
        abandonmentScore: repository.abandonmentScore,
        revivalPotential: repository.revivalPotential,
        lastCommitAge: repository.lastCommitAge,
        reasons: repository.reasons,
        recommendations: repository.recommendations
      } : undefined,
      phoenixData: {
        priority: options.priority || this.calculatePriority(repository),
        status: 'pending',
        progress: 0,
        addedAt: new Date(),
        updatedAt: new Date(),
        issues: [],
        logs: [{
          timestamp: new Date(),
          level: 'info',
          message: 'Project immersed in Lazarus Pit',
          details: { source: options.source || 'manual' }
        }]
      },
      metadata: {
        source: options.source || 'manual',
        tags: options.tags || [],
        notes: options.notes || '',
        category: options.category || 'other'
      }
    };

    this.entries.set(entry.id, entry);
    await this.saveToDisk();
    
    console.log(chalk.green(`🔥 ${entry.repository.full_name} immersed in Lazarus Pit (ID: ${entry.id})`));
    return entry.id;
  }

  /**
   * Remove a project from the Lazarus Pit
   */
  async extract(id: string): Promise<boolean> {
    if (!this.isLoaded) await this.initialize();

    const entry = this.entries.get(id);
    if (!entry) return false;

    this.entries.delete(id);
    await this.saveToDisk();
    
    console.log(chalk.yellow(`🔥 ${entry.repository.full_name} extracted from Lazarus Pit`));
    return true;
  }

  /**
   * Update a project's status and progress
   */
  async updateEntry(id: string, updates: Partial<PitEntry['phoenixData']>): Promise<boolean> {
    if (!this.isLoaded) await this.initialize();

    const entry = this.entries.get(id);
    if (!entry) return false;

    // Update fields
    Object.assign(entry.phoenixData, updates, { updatedAt: new Date() });

    // Add log entry for status changes
    if (updates.status) {
      entry.phoenixData.logs.push({
        timestamp: new Date(),
        level: 'info',
        message: `Status changed to ${updates.status}`,
        details: updates
      });
    }

    await this.saveToDisk();
    return true;
  }

  /**
   * Add a log entry to a project
   */
  async addLog(id: string, log: Omit<PitLogEntry, 'timestamp'>): Promise<boolean> {
    if (!this.isLoaded) await this.initialize();

    const entry = this.entries.get(id);
    if (!entry) return false;

    entry.phoenixData.logs.push({
      ...log,
      timestamp: new Date()
    });

    entry.phoenixData.updatedAt = new Date();
    await this.saveToDisk();
    return true;
  }

  /**
   * Query the Lazarus Pit with advanced filtering
   */
  async query(query: PitQuery = {}): Promise<PitEntry[]> {
    if (!this.isLoaded) await this.initialize();

    let results = Array.from(this.entries.values());

    // Apply filters
    if (query.status) {
      results = results.filter(entry => query.status!.includes(entry.phoenixData.status));
    }

    if (query.priority) {
      results = results.filter(entry => {
        const priority = entry.phoenixData.priority;
        return (!query.priority!.min || priority >= query.priority!.min) &&
               (!query.priority!.max || priority <= query.priority!.max);
      });
    }

    if (query.language) {
      results = results.filter(entry => 
        query.language!.includes(entry.repository.language || 'unknown')
      );
    }

    if (query.source) {
      results = results.filter(entry => query.source!.includes(entry.metadata.source));
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(entry => 
        query.tags!.some(tag => entry.metadata.tags.includes(tag))
      );
    }

    if (query.category) {
      results = results.filter(entry => query.category!.includes(entry.metadata.category));
    }

    if (query.dateRange) {
      results = results.filter(entry => {
        const addedAt = entry.phoenixData.addedAt;
        return (!query.dateRange!.from || addedAt >= query.dateRange!.from) &&
               (!query.dateRange!.to || addedAt <= query.dateRange!.to);
      });
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      results = results.filter(entry => 
        entry.repository.full_name.toLowerCase().includes(searchLower) ||
        (entry.repository.description || '').toLowerCase().includes(searchLower) ||
        entry.metadata.notes.toLowerCase().includes(searchLower)
      );
    }

    // Sort results
    const sortBy = query.sortBy || 'priority';
    const sortOrder = query.sortOrder || 'desc';
    
    results.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'priority':
          aVal = a.phoenixData.priority;
          bVal = b.phoenixData.priority;
          break;
        case 'addedAt':
          aVal = a.phoenixData.addedAt.getTime();
          bVal = b.phoenixData.addedAt.getTime();
          break;
        case 'progress':
          aVal = a.phoenixData.progress;
          bVal = b.phoenixData.progress;
          break;
        case 'estimatedTime':
          aVal = a.phoenixData.estimatedTime || 0;
          bVal = b.phoenixData.estimatedTime || 0;
          break;
        case 'stargazers_count':
          aVal = a.repository.stargazers_count;
          bVal = b.repository.stargazers_count;
          break;
        default:
          aVal = 0;
          bVal = 0;
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    // Apply pagination
    if (query.offset || query.limit) {
      const offset = query.offset || 0;
      const limit = query.limit || results.length;
      results = results.slice(offset, offset + limit);
    }

    return results;
  }

  /**
   * Get next project to process based on priority
   */
  async getNext(): Promise<PitEntry | null> {
    const pending = await this.query({ 
      status: ['pending'], 
      sortBy: 'priority', 
      sortOrder: 'desc',
      limit: 1 
    });
    
    return pending[0] || null;
  }

  /**
   * Get comprehensive statistics about the Lazarus Pit
   */
  async getStats(): Promise<PitStats> {
    if (!this.isLoaded) await this.initialize();

    const entries = Array.from(this.entries.values());
    const total = entries.length;

    const byStatus: Record<PitEntry['phoenixData']['status'], number> = {
      pending: 0, analyzing: 0, modernizing: 0, 'community-building': 0,
      completed: 0, failed: 0, paused: 0
    };

    const bySource: Record<PitEntry['metadata']['source'], number> = {
      kraven: 0, manual: 0, api: 0
    };

    const byLanguage: Record<string, number> = {};

    let totalProgress = 0;
    let totalPriority = 0;
    let totalEstimatedTime = 0;
    let totalActualTime = 0;
    let completedCount = 0;

    entries.forEach(entry => {
      byStatus[entry.phoenixData.status]++;
      bySource[entry.metadata.source]++;
      
      const lang = entry.repository.language || 'unknown';
      byLanguage[lang] = (byLanguage[lang] || 0) + 1;

      totalProgress += entry.phoenixData.progress;
      totalPriority += entry.phoenixData.priority;
      totalEstimatedTime += entry.phoenixData.estimatedTime || 0;
      totalActualTime += entry.phoenixData.actualTime || 0;

      if (entry.phoenixData.status === 'completed') {
        completedCount++;
      }
    });

    return {
      total,
      byStatus,
      bySource,
      byLanguage,
      avgProgress: total > 0 ? totalProgress / total : 0,
      avgPriority: total > 0 ? totalPriority / total : 0,
      totalEstimatedTime,
      totalActualTime,
      successRate: total > 0 ? (completedCount / total) * 100 : 0
    };
  }

  /**
   * Get a specific entry by ID
   */
  async getEntry(id: string): Promise<PitEntry | null> {
    if (!this.isLoaded) await this.initialize();
    return this.entries.get(id) || null;
  }

  /**
   * Batch import from Kraven results
   */
  async batchImmerse(kravenResults: KravenRepository[], options: {
    source?: PitEntry['metadata']['source'];
    tags?: string[];
  } = {}): Promise<string[]> {
    const ids: string[] = [];
    
    for (const repo of kravenResults) {
      const id = await this.immerse(repo, {
        ...options,
        category: this.categorizeRepository(repo.repository)
      });
      ids.push(id);
    }

    console.log(chalk.green(`🔥 Batch immersed ${ids.length} projects into Lazarus Pit`));
    return ids;
  }

  /**
   * Private helper methods
   */
  private generateId(): string {
    return `pit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculatePriority(repository: string | KravenRepository): number {
    if (typeof repository === 'string') return 1;

    let priority = 0;
    priority += repository.revivalPotential * 0.4;
    priority += (100 - repository.abandonmentScore) * 0.3;
    const starScore = Math.min(repository.repository.stargazers_count / 1000 * 100, 100);
    priority += starScore * 0.2;
    const ageScore = Math.min(repository.lastCommitAge / 365 * 100, 100);
    priority += ageScore * 0.1;

    return Math.round(priority);
  }

  private categorizeRepository(repo: any): PitEntry['metadata']['category'] {
    const name = repo.full_name.toLowerCase();
    const desc = (repo.description || '').toLowerCase();

    if (name.includes('cli') || desc.includes('command line')) return 'cli-tool';
    if (name.includes('lib') || desc.includes('library')) return 'library';
    if (name.includes('framework') || desc.includes('framework')) return 'framework';
    if (name.includes('app') || desc.includes('application')) return 'app';
    
    return 'other';
  }

  private async fetchRepositoryData(repository: string): Promise<PitEntry['repository']> {
    // Mock implementation - in real app would fetch from GitHub API
    return {
      full_name: repository,
      html_url: `https://github.com/${repository}`,
      description: 'Repository data would be fetched from GitHub API',
      language: 'Unknown',
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      pushed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
  }

  private async loadFromDisk(): Promise<void> {
    try {
      const dataFile = path.join(this.storageDir, 'pit-data.json');
      const data = await fs.readFile(dataFile, 'utf-8');
      const entries: PitEntry[] = JSON.parse(data, (key, value) => {
        // Revive Date objects
        if (key.endsWith('At') || key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });

      this.entries.clear();
      entries.forEach(entry => this.entries.set(entry.id, entry));
    } catch (error) {
      // File doesn't exist yet, start with empty pit
      console.log(chalk.yellow('🔥 Starting with empty Lazarus Pit'));
    }
  }

  private async saveToDisk(): Promise<void> {
    try {
      const dataFile = path.join(this.storageDir, 'pit-data.json');
      const entries = Array.from(this.entries.values());
      await fs.writeFile(dataFile, JSON.stringify(entries, null, 2));
    } catch (error) {
      console.error(chalk.red(`Failed to save Lazarus Pit: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }
}
