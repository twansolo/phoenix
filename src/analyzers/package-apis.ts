import axios from 'axios';
import * as semver from 'semver';
import chalk from 'chalk';

export interface PackageVersionInfo {
  current: string;
  latest: string;
  outdated: boolean;
  majorBehind: number;
  minorBehind: number;
  patchBehind: number;
  securityVulnerabilities: SecurityVulnerability[];
  deprecated: boolean;
  lastUpdated?: string;
}

export interface SecurityVulnerability {
  id: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  description: string;
  fixedIn?: string;
  url?: string;
}

export class PackageAPIClient {
  private npmRegistry = 'https://registry.npmjs.org';
  private pypiRegistry = 'https://pypi.org/pypi';
  private packagistRegistry = 'https://packagist.org/packages';

  /**
   * Check package version information
   */
  async checkPackageVersion(name: string, currentVersion: string, ecosystem: string): Promise<PackageVersionInfo> {
    try {
      switch (ecosystem) {
        case 'npm':
          return await this.checkNpmPackage(name, currentVersion);
        case 'pip':
          return await this.checkPypiPackage(name, currentVersion);
        case 'composer':
          return await this.checkPackagistPackage(name, currentVersion);
        default:
          return this.createFallbackVersionInfo(currentVersion);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error checking ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return this.createFallbackVersionInfo(currentVersion);
    }
  }

  /**
   * Check npm package
   */
  private async checkNpmPackage(name: string, currentVersion: string): Promise<PackageVersionInfo> {
    try {
      const response = await axios.get(`${this.npmRegistry}/${encodeURIComponent(name)}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Phoenix-Dependency-Analyzer/1.0.0'
        }
      });

      const packageData = response.data;
      const latest = packageData['dist-tags']?.latest || 'unknown';
      const versions = Object.keys(packageData.versions || {});
      
      // Clean current version for comparison
      const cleanCurrent = semver.clean(currentVersion) || currentVersion;
      const isOutdated = semver.valid(cleanCurrent) && semver.valid(latest) && semver.lt(cleanCurrent, latest);
      
      let majorBehind = 0;
      let minorBehind = 0;
      let patchBehind = 0;

      if (isOutdated && semver.valid(cleanCurrent) && semver.valid(latest)) {
        const currentParsed = semver.parse(cleanCurrent);
        const latestParsed = semver.parse(latest);
        
        if (currentParsed && latestParsed) {
          majorBehind = latestParsed.major - currentParsed.major;
          minorBehind = latestParsed.minor - currentParsed.minor;
          patchBehind = latestParsed.patch - currentParsed.patch;
        }
      }

      // Check for deprecation
      const deprecated = packageData.versions?.[latest]?.deprecated !== undefined;

      // Check security vulnerabilities (would need GitHub Security API or Snyk API)
      const vulnerabilities = await this.checkNpmSecurityVulnerabilities(name, cleanCurrent);

      return {
        current: cleanCurrent,
        latest,
        outdated: isOutdated,
        majorBehind: Math.max(0, majorBehind),
        minorBehind: majorBehind > 0 ? 0 : Math.max(0, minorBehind),
        patchBehind: majorBehind > 0 || minorBehind > 0 ? 0 : Math.max(0, patchBehind),
        securityVulnerabilities: vulnerabilities,
        deprecated,
        lastUpdated: packageData.time?.[latest]
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(chalk.yellow(`⚠️  Package ${name} not found in npm registry`));
      }
      return this.createFallbackVersionInfo(currentVersion);
    }
  }

  /**
   * Check PyPI package
   */
  private async checkPypiPackage(name: string, currentVersion: string): Promise<PackageVersionInfo> {
    try {
      const response = await axios.get(`${this.pypiRegistry}/${encodeURIComponent(name)}/json`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Phoenix-Dependency-Analyzer/1.0.0'
        }
      });

      const packageData = response.data;
      const latest = packageData.info?.version || 'unknown';
      const releases = Object.keys(packageData.releases || {});
      
      // Simple version comparison for Python packages
      const isOutdated = currentVersion !== latest && currentVersion !== 'latest';
      
      // Try to parse versions if they follow semver-like pattern
      let majorBehind = 0;
      let minorBehind = 0;
      let patchBehind = 0;

      const currentParts = currentVersion.split('.').map(Number);
      const latestParts = latest.split('.').map(Number);

      if (currentParts.length >= 3 && latestParts.length >= 3) {
        majorBehind = Math.max(0, latestParts[0] - currentParts[0]);
        minorBehind = majorBehind > 0 ? 0 : Math.max(0, latestParts[1] - currentParts[1]);
        patchBehind = majorBehind > 0 || minorBehind > 0 ? 0 : Math.max(0, latestParts[2] - currentParts[2]);
      }

      return {
        current: currentVersion,
        latest,
        outdated: isOutdated,
        majorBehind,
        minorBehind,
        patchBehind,
        securityVulnerabilities: [], // Would need PyUp.io API or similar
        deprecated: false, // PyPI doesn't have a deprecated flag in this format
        lastUpdated: packageData.info?.upload_time
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(chalk.yellow(`⚠️  Package ${name} not found in PyPI`));
      }
      return this.createFallbackVersionInfo(currentVersion);
    }
  }

  /**
   * Check Packagist package (PHP)
   */
  private async checkPackagistPackage(name: string, currentVersion: string): Promise<PackageVersionInfo> {
    try {
      const response = await axios.get(`${this.packagistRegistry}/${encodeURIComponent(name)}.json`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Phoenix-Dependency-Analyzer/1.0.0'
        }
      });

      const packageData = response.data.package;
      const versions = packageData.versions || {};
      
      // Find latest stable version
      const stableVersions = Object.keys(versions).filter(v => 
        !v.includes('dev') && !v.includes('alpha') && !v.includes('beta') && !v.includes('RC')
      );
      
      const latest = stableVersions.sort((a, b) => {
        // Simple version comparison
        return b.localeCompare(a, undefined, { numeric: true });
      })[0] || 'unknown';

      const cleanCurrent = currentVersion.replace(/[~^>=<]+/, '').trim();
      const isOutdated = cleanCurrent !== latest && cleanCurrent !== 'latest';

      return {
        current: cleanCurrent,
        latest,
        outdated: isOutdated,
        majorBehind: 0, // Would need more sophisticated version parsing
        minorBehind: 0,
        patchBehind: 0,
        securityVulnerabilities: [], // Would need SensioLabs Security Checker or similar
        deprecated: false,
        lastUpdated: versions[latest]?.time
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(chalk.yellow(`⚠️  Package ${name} not found in Packagist`));
      }
      return this.createFallbackVersionInfo(currentVersion);
    }
  }

  /**
   * Check for npm security vulnerabilities (simplified)
   */
  private async checkNpmSecurityVulnerabilities(name: string, version: string): Promise<SecurityVulnerability[]> {
    // This is a simplified implementation
    // In a real system, you would integrate with:
    // - GitHub Security Advisory API
    // - Snyk API
    // - npm audit API
    // - OSV (Open Source Vulnerabilities) database

    try {
      // For demonstration, we'll create some mock vulnerabilities for commonly vulnerable packages
      const knownVulnerablePackages = [
        'lodash', 'moment', 'request', 'debug', 'minimist', 'yargs-parser', 
        'handlebars', 'axios', 'jquery', 'bootstrap'
      ];

      if (knownVulnerablePackages.includes(name)) {
        // This would be replaced with real API calls
        return [
          {
            id: `CVE-2024-DEMO-${name}`,
            severity: 'moderate',
            title: `Potential vulnerability in ${name}`,
            description: `Older versions of ${name} may have security vulnerabilities. Consider updating to the latest version.`,
            fixedIn: 'latest',
            url: `https://github.com/advisories?query=${name}`
          }
        ];
      }

      return [];
    } catch (error) {
      console.error(chalk.red(`❌ Error checking vulnerabilities for ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return [];
    }
  }

  /**
   * Batch check multiple packages
   */
  async batchCheckPackages(packages: Array<{ name: string; version: string; ecosystem: string }>): Promise<Map<string, PackageVersionInfo>> {
    const results = new Map<string, PackageVersionInfo>();
    const batchSize = 5; // Limit concurrent requests
    
    console.log(chalk.blue(`🔍 Checking ${packages.length} packages...`));

    for (let i = 0; i < packages.length; i += batchSize) {
      const batch = packages.slice(i, i + batchSize);
      const promises = batch.map(async pkg => {
        const info = await this.checkPackageVersion(pkg.name, pkg.version, pkg.ecosystem);
        return { name: pkg.name, info };
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ name, info }) => {
        results.set(name, info);
      });

      // Progress indicator
      const progress = Math.min(i + batchSize, packages.length);
      console.log(chalk.gray(`📊 Progress: ${progress}/${packages.length} packages checked`));

      // Rate limiting - wait between batches
      if (i + batchSize < packages.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Create fallback version info when API calls fail
   */
  private createFallbackVersionInfo(currentVersion: string): PackageVersionInfo {
    return {
      current: currentVersion,
      latest: 'unknown',
      outdated: false,
      majorBehind: 0,
      minorBehind: 0,
      patchBehind: 0,
      securityVulnerabilities: [],
      deprecated: false
    };
  }

  /**
   * Get registry status (for health checks)
   */
  async getRegistryStatus(): Promise<{ npm: boolean; pypi: boolean; packagist: boolean }> {
    const checks = await Promise.allSettled([
      axios.get(`${this.npmRegistry}/express`, { timeout: 5000 }),
      axios.get(`${this.pypiRegistry}/requests/json`, { timeout: 5000 }),
      axios.get(`${this.packagistRegistry}/symfony/symfony.json`, { timeout: 5000 })
    ]);

    return {
      npm: checks[0].status === 'fulfilled',
      pypi: checks[1].status === 'fulfilled',
      packagist: checks[2].status === 'fulfilled'
    };
  }
}
