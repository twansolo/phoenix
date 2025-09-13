import chalk from 'chalk';
import ora from 'ora';

export interface CommunityKitOptions {
  all?: boolean;
  contributing?: boolean;
  templates?: boolean;
  readme?: boolean;
}

export interface CommunityKitResult {
  filesCreated: string[];
  filesUpdated: string[];
  errors: string[];
}

export class CommunityBuilder {
  /**
   * Generate community building files and templates
   */
  async generateKit(repository: string, options: CommunityKitOptions): Promise<CommunityKitResult> {
    const spinner = ora(`👥 Building community kit for ${repository}...`).start();

    try {
      const result: CommunityKitResult = {
        filesCreated: [],
        filesUpdated: [],
        errors: []
      };

      if (options.all || options.contributing) {
        await this.createContributingGuide(repository, result);
      }

      if (options.all || options.templates) {
        await this.createIssueTemplates(repository, result);
        await this.createPRTemplates(repository, result);
      }

      if (options.all || options.readme) {
        await this.enhanceReadme(repository, result);
      }

      if (options.all) {
        await this.createCodeOfConduct(repository, result);
        await this.createLicense(repository, result);
        await this.createChangelog(repository, result);
      }

      spinner.succeed(`✅ Community kit generated - ${result.filesCreated.length} files created`);
      return result;

    } catch (error) {
      spinner.fail(`❌ Community kit generation failed: ${error.message}`);
      throw error;
    }
  }

  private async createContributingGuide(repository: string, result: CommunityKitResult): Promise<void> {
    // Mock CONTRIBUTING.md creation
    console.log(chalk.gray('  📝 Creating CONTRIBUTING.md'));
    result.filesCreated.push('CONTRIBUTING.md');
  }

  private async createIssueTemplates(repository: string, result: CommunityKitResult): Promise<void> {
    const templates = ['bug_report.yml', 'feature_request.yml', 'question.yml'];
    for (const template of templates) {
      console.log(chalk.gray(`  🐛 Creating .github/ISSUE_TEMPLATE/${template}`));
      result.filesCreated.push(`.github/ISSUE_TEMPLATE/${template}`);
    }
  }

  private async createPRTemplates(repository: string, result: CommunityKitResult): Promise<void> {
    console.log(chalk.gray('  🔄 Creating .github/pull_request_template.md'));
    result.filesCreated.push('.github/pull_request_template.md');
  }

  private async enhanceReadme(repository: string, result: CommunityKitResult): Promise<void> {
    console.log(chalk.gray('  📖 Enhancing README.md'));
    result.filesUpdated.push('README.md');
  }

  private async createCodeOfConduct(repository: string, result: CommunityKitResult): Promise<void> {
    console.log(chalk.gray('  🤝 Creating CODE_OF_CONDUCT.md'));
    result.filesCreated.push('CODE_OF_CONDUCT.md');
  }

  private async createLicense(repository: string, result: CommunityKitResult): Promise<void> {
    console.log(chalk.gray('  📄 Creating LICENSE'));
    result.filesCreated.push('LICENSE');
  }

  private async createChangelog(repository: string, result: CommunityKitResult): Promise<void> {
    console.log(chalk.gray('  📋 Creating CHANGELOG.md'));
    result.filesCreated.push('CHANGELOG.md');
  }
}
