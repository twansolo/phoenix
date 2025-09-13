import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

export interface PackageInfo {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency' | 'peerDependency' | 'optionalDependency';
}

export interface ProjectPackages {
  ecosystem: 'npm' | 'pip' | 'composer' | 'gem' | 'cargo' | 'go' | 'unknown';
  packages: PackageInfo[];
  packageFile: string;
  lockFile?: string;
}

export class PackageParser {
  /**
   * Detect and parse package files in a repository
   */
  async parseRepository(repositoryPath: string): Promise<ProjectPackages[]> {
    const results: ProjectPackages[] = [];

    try {
      // Check for different package managers
      const parsers = [
        { file: 'package.json', parser: this.parseNodePackages.bind(this) },
        { file: 'requirements.txt', parser: this.parsePythonRequirements.bind(this) },
        { file: 'Pipfile', parser: this.parsePipfile.bind(this) },
        { file: 'pyproject.toml', parser: this.parsePyprojectToml.bind(this) },
        { file: 'composer.json', parser: this.parseComposerPackages.bind(this) },
        { file: 'Gemfile', parser: this.parseGemfile.bind(this) },
        { file: 'Cargo.toml', parser: this.parseCargoPackages.bind(this) },
        { file: 'go.mod', parser: this.parseGoPackages.bind(this) }
      ];

      for (const { file, parser } of parsers) {
        const filePath = path.join(repositoryPath, file);
        try {
          await fs.access(filePath);
          console.log(chalk.gray(`📦 Found ${file}`));
          const packages = await parser(filePath);
          if (packages) {
            results.push(packages);
          }
        } catch (error) {
          // File doesn't exist, continue
        }
      }

      if (results.length === 0) {
        console.log(chalk.yellow('⚠️  No recognized package files found'));
      }

      return results;
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing repository: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return [];
    }
  }

  /**
   * Parse Node.js package.json
   */
  private async parseNodePackages(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const packageJson = JSON.parse(content);
      const packages: PackageInfo[] = [];

      // Parse different dependency types
      const depTypes: Array<{ key: keyof typeof packageJson; type: PackageInfo['type'] }> = [
        { key: 'dependencies', type: 'dependency' },
        { key: 'devDependencies', type: 'devDependency' },
        { key: 'peerDependencies', type: 'peerDependency' },
        { key: 'optionalDependencies', type: 'optionalDependency' }
      ];

      for (const { key, type } of depTypes) {
        const deps = packageJson[key];
        if (deps && typeof deps === 'object') {
          for (const [name, version] of Object.entries(deps)) {
            packages.push({
              name,
              version: this.cleanVersion(version as string),
              type
            });
          }
        }
      }

      // Check for lock file
      const lockFile = await this.findLockFile(path.dirname(filePath), ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']);

      return {
        ecosystem: 'npm',
        packages,
        packageFile: filePath,
        lockFile
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing package.json: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Parse Python requirements.txt
   */
  private async parsePythonRequirements(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const packages: PackageInfo[] = [];

      const lines = content.split('\n').filter(line => 
        line.trim() && 
        !line.trim().startsWith('#') && 
        !line.trim().startsWith('-')
      );

      for (const line of lines) {
        const match = line.trim().match(/^([a-zA-Z0-9_-]+)\s*([>=<~!]+)?\s*([0-9.*]+)?/);
        if (match) {
          const [, name, operator, version] = match;
          packages.push({
            name: name.toLowerCase(),
            version: version || 'latest',
            type: 'dependency'
          });
        }
      }

      return {
        ecosystem: 'pip',
        packages,
        packageFile: filePath
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing requirements.txt: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Parse Python Pipfile
   */
  private async parsePipfile(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const packages: PackageInfo[] = [];

      // Simple TOML-like parsing for [packages] and [dev-packages] sections
      const sections = content.split(/\[([^\]]+)\]/);
      
      for (let i = 1; i < sections.length; i += 2) {
        const sectionName = sections[i];
        const sectionContent = sections[i + 1];

        if (sectionName === 'packages' || sectionName === 'dev-packages') {
          const type = sectionName === 'packages' ? 'dependency' : 'devDependency';
          
          const lines = sectionContent.split('\n').filter(line => 
            line.trim() && !line.trim().startsWith('#')
          );

          for (const line of lines) {
            const match = line.trim().match(/^([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/);
            if (match) {
              const [, name, version] = match;
              packages.push({
                name: name.toLowerCase(),
                version: this.cleanVersion(version),
                type: type as PackageInfo['type']
              });
            }
          }
        }
      }

      return {
        ecosystem: 'pip',
        packages,
        packageFile: filePath,
        lockFile: await this.findLockFile(path.dirname(filePath), ['Pipfile.lock'])
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing Pipfile: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Parse Python pyproject.toml (basic support)
   */
  private async parsePyprojectToml(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const packages: PackageInfo[] = [];

      // Look for [tool.poetry.dependencies] or [project.dependencies]
      const dependencyMatch = content.match(/\[(?:tool\.poetry\.dependencies|project\.dependencies)\]([\s\S]*?)(?=\[|$)/);
      if (dependencyMatch) {
        const depsSection = dependencyMatch[1];
        const lines = depsSection.split('\n').filter(line => 
          line.trim() && !line.trim().startsWith('#')
        );

        for (const line of lines) {
          const match = line.trim().match(/^([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/);
          if (match) {
            const [, name, version] = match;
            if (name !== 'python') { // Skip python version specifier
              packages.push({
                name: name.toLowerCase(),
                version: this.cleanVersion(version),
                type: 'dependency'
              });
            }
          }
        }
      }

      return {
        ecosystem: 'pip',
        packages,
        packageFile: filePath
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing pyproject.toml: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Parse PHP composer.json
   */
  private async parseComposerPackages(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const composerJson = JSON.parse(content);
      const packages: PackageInfo[] = [];

      // Parse require and require-dev
      if (composerJson.require) {
        for (const [name, version] of Object.entries(composerJson.require)) {
          if (name !== 'php') { // Skip PHP version
            packages.push({
              name,
              version: this.cleanVersion(version as string),
              type: 'dependency'
            });
          }
        }
      }

      if (composerJson['require-dev']) {
        for (const [name, version] of Object.entries(composerJson['require-dev'])) {
          packages.push({
            name,
            version: this.cleanVersion(version as string),
            type: 'devDependency'
          });
        }
      }

      return {
        ecosystem: 'composer',
        packages,
        packageFile: filePath,
        lockFile: await this.findLockFile(path.dirname(filePath), ['composer.lock'])
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing composer.json: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Parse Ruby Gemfile (basic support)
   */
  private async parseGemfile(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const packages: PackageInfo[] = [];

      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.trim().match(/^gem\s+['"]([^'"]+)['"]\s*,?\s*['"]([^'"]+)?['"]/);
        if (match) {
          const [, name, version] = match;
          packages.push({
            name,
            version: version || 'latest',
            type: 'dependency'
          });
        }
      }

      return {
        ecosystem: 'gem',
        packages,
        packageFile: filePath,
        lockFile: await this.findLockFile(path.dirname(filePath), ['Gemfile.lock'])
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing Gemfile: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Parse Rust Cargo.toml
   */
  private async parseCargoPackages(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const packages: PackageInfo[] = [];

      // Look for [dependencies] section
      const dependencyMatch = content.match(/\[dependencies\]([\s\S]*?)(?=\[|$)/);
      if (dependencyMatch) {
        const depsSection = dependencyMatch[1];
        const lines = depsSection.split('\n').filter(line => 
          line.trim() && !line.trim().startsWith('#')
        );

        for (const line of lines) {
          const match = line.trim().match(/^([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/);
          if (match) {
            const [, name, version] = match;
            packages.push({
              name,
              version: this.cleanVersion(version),
              type: 'dependency'
            });
          }
        }
      }

      return {
        ecosystem: 'cargo',
        packages,
        packageFile: filePath,
        lockFile: await this.findLockFile(path.dirname(filePath), ['Cargo.lock'])
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing Cargo.toml: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Parse Go go.mod
   */
  private async parseGoPackages(filePath: string): Promise<ProjectPackages | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const packages: PackageInfo[] = [];

      const lines = content.split('\n');
      let inRequireBlock = false;

      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed === 'require (') {
          inRequireBlock = true;
          continue;
        }
        
        if (trimmed === ')' && inRequireBlock) {
          inRequireBlock = false;
          continue;
        }

        if (inRequireBlock || trimmed.startsWith('require ')) {
          const match = trimmed.match(/([a-zA-Z0-9.\/-]+)\s+v?([0-9.]+[a-zA-Z0-9.-]*)/);
          if (match) {
            const [, name, version] = match;
            packages.push({
              name,
              version,
              type: 'dependency'
            });
          }
        }
      }

      return {
        ecosystem: 'go',
        packages,
        packageFile: filePath,
        lockFile: await this.findLockFile(path.dirname(filePath), ['go.sum'])
      };
    } catch (error) {
      console.error(chalk.red(`❌ Error parsing go.mod: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return null;
    }
  }

  /**
   * Helper methods
   */
  private cleanVersion(version: string): string {
    // Remove common version prefixes and operators
    return version.replace(/^[~^>=<]+/, '').trim();
  }

  private async findLockFile(directory: string, lockFiles: string[]): Promise<string | undefined> {
    for (const lockFile of lockFiles) {
      const lockPath = path.join(directory, lockFile);
      try {
        await fs.access(lockPath);
        return lockPath;
      } catch {
        // File doesn't exist, continue
      }
    }
    return undefined;
  }
}
