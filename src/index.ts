// Phoenix - Automated revival of dead projects
// From ashes to 2099

export { PhoenixCore } from './phoenix';
export { KravenIntegration } from './integrations/kraven';
export { ProjectAnalyzer } from './analyzers/project-analyzer';
export { DependencyModernizer } from './modernizers/dependency-modernizer';
export { CommunityBuilder } from './community/community-builder';
export { ProgressTracker } from './tracking/progress-tracker';

// Types
export * from './types';

// Default export
export { PhoenixCore as default } from './phoenix';
