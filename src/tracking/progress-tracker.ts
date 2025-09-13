import { RevivalProject } from '../types';

export class ProgressTracker {
  async recordCompletion(project: RevivalProject): Promise<void> {
    // Mock progress tracking
    console.log(`📊 Recording completion for ${project.repository.full_name}`);
  }
}
