// Phoenix Type Definitions

export interface KravenRepository {
  repository: {
    full_name: string;
    name: string;
    owner: {
      login: string;
    };
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string | null;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    html_url: string;
    clone_url: string;
    ssh_url: string;
  };
  abandonmentScore: number;
  revivalPotential: number;
  lastCommitAge: number;
  reasons: string[];
  recommendations: string[];
}

export interface KravenResults {
  query: string;
  totalFound: number;
  analyzed: KravenRepository[];
  timestamp: string;
}

export interface RevivalProject {
  id: string;
  repository: KravenRepository['repository'];
  status: 'queued' | 'analyzing' | 'modernizing' | 'community-building' | 'completed' | 'failed';
  progress: {
    analysis: number;
    dependencies: number;
    modernization: number;
    community: number;
    overall: number;
  };
  issues: RevivalIssue[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RevivalIssue {
  type: 'dependency' | 'security' | 'compatibility' | 'tooling' | 'documentation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  autoFixable: boolean;
  estimatedEffort: 'minutes' | 'hours' | 'days';
}

export interface DependencyAnalysis {
  outdated: OutdatedDependency[];
  vulnerable: VulnerableDependency[];
  deprecated: DeprecatedDependency[];
  recommendations: DependencyRecommendation[];
}

export interface OutdatedDependency {
  name: string;
  current: string;
  wanted: string;
  latest: string;
  type: 'dependencies' | 'devDependencies' | 'peerDependencies';
  breaking: boolean;
}

export interface VulnerableDependency {
  name: string;
  version: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  advisory: string;
  patched: string;
  recommendation: string;
}

export interface DeprecatedDependency {
  name: string;
  version: string;
  reason: string;
  alternative?: string;
  sunsetDate?: string;
}

export interface DependencyRecommendation {
  action: 'update' | 'replace' | 'remove';
  package: string;
  reason: string;
  alternative?: string;
  effort: 'low' | 'medium' | 'high';
}

export interface ModernizationPreset {
  name: string;
  description: string;
  features: ModernizationFeature[];
}

export interface ModernizationFeature {
  name: string;
  description: string;
  category: 'typescript' | 'bundling' | 'testing' | 'linting' | 'ci-cd' | 'documentation';
  enabled: boolean;
  config?: Record<string, any>;
}

export interface CommunityKit {
  contributing: boolean;
  codeOfConduct: boolean;
  issueTemplates: boolean;
  prTemplates: boolean;
  readme: boolean;
  license: boolean;
  changelog: boolean;
  roadmap: boolean;
}

export interface PhoenixConfig {
  defaultPreset: string;
  autoFix: boolean;
  communityKit: CommunityKit;
  integrations: {
    kraven: boolean;
    github: boolean;
  };
  notifications: {
    slack?: string;
    discord?: string;
    email?: string;
  };
}

export interface AnalysisResult {
  repository: string;
  timestamp: Date;
  health: {
    overall: number;
    dependencies: number;
    security: number;
    maintainability: number;
    community: number;
  };
  issues: RevivalIssue[];
  recommendations: string[];
  estimatedEffort: {
    hours: number;
    complexity: 'low' | 'medium' | 'high';
  };
}
