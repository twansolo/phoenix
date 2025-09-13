/**
 * Lazarus Pit Web API
 * Interfaces with the actual Phoenix Lazarus Pit data
 */

class LazarusAPI {
    constructor() {
        this.baseUrl = window.location.origin;
        this.pitDataPath = 'assets/data/lazarus-pit.json';
        this.lastUpdate = null;
        this.updateInterval = 30000; // 30 seconds
        this.cache = null;
        
        // Start auto-refresh
        this.startAutoRefresh();
    }

    /**
     * Get all projects from the Lazarus Pit
     */
    async getAllProjects() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.pitDataPath}?t=${Date.now()}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.cache = data;
            this.lastUpdate = new Date();
            return data;
        } catch (error) {
            console.warn('Unable to load real Lazarus Pit data, using fallback:', error.message);
            return this.getFallbackData();
        }
    }

    /**
     * Get projects by status
     */
    async getProjectsByStatus(status) {
        const data = await this.getAllProjects();
        return data.projects ? data.projects.filter(p => p.status === status) : [];
    }

    /**
     * Get pit statistics
     */
    async getStatistics() {
        const data = await this.getAllProjects();
        
        if (!data.projects) return this.getFallbackStats();

        const projects = data.projects;
        const statusCounts = {};
        const languageCounts = {};
        let totalPriority = 0;
        let totalProgress = 0;
        let completedCount = 0;

        projects.forEach(project => {
            // Status distribution
            statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
            
            // Language distribution
            const language = project.repository?.language || 'Unknown';
            languageCounts[language] = (languageCounts[language] || 0) + 1;
            
            // Metrics
            totalPriority += project.priority || 0;
            totalProgress += project.progress || 0;
            
            if (project.status === 'completed') {
                completedCount++;
            }
        });

        return {
            totalProjects: projects.length,
            statusDistribution: statusCounts,
            languageDistribution: languageCounts,
            averagePriority: projects.length > 0 ? (totalPriority / projects.length).toFixed(1) : 0,
            averageProgress: projects.length > 0 ? (totalProgress / projects.length).toFixed(1) : 0,
            successRate: projects.length > 0 ? ((completedCount / projects.length) * 100).toFixed(1) : 0,
            lastUpdated: this.lastUpdate
        };
    }

    /**
     * Get active/processing projects
     */
    async getActiveProjects() {
        return await this.getProjectsByStatus('processing') || await this.getProjectsByStatus('analyzing');
    }

    /**
     * Get pending projects
     */
    async getPendingProjects() {
        return await this.getProjectsByStatus('pending');
    }

    /**
     * Get completed projects
     */
    async getCompletedProjects() {
        return await this.getProjectsByStatus('completed');
    }

    /**
     * Get failed projects
     */
    async getFailedProjects() {
        return await this.getProjectsByStatus('failed');
    }

    /**
     * Search projects
     */
    async searchProjects(query, filters = {}) {
        const data = await this.getAllProjects();
        if (!data.projects) return [];

        let results = data.projects;

        // Text search
        if (query) {
            const searchLower = query.toLowerCase();
            results = results.filter(project => 
                project.repository?.full_name?.toLowerCase().includes(searchLower) ||
                project.repository?.name?.toLowerCase().includes(searchLower) ||
                project.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
                project.notes?.toLowerCase().includes(searchLower)
            );
        }

        // Apply filters
        if (filters.status && filters.status !== 'all') {
            results = results.filter(p => p.status === filters.status);
        }
        
        if (filters.priority && filters.priority !== 'all') {
            const priorityMap = { urgent: 90, high: 70, normal: 50, low: 30 };
            const minPriority = priorityMap[filters.priority] || 0;
            results = results.filter(p => (p.priority || 0) >= minPriority);
        }
        
        if (filters.language && filters.language !== 'all') {
            results = results.filter(p => 
                p.repository?.language?.toLowerCase() === filters.language.toLowerCase()
            );
        }

        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(p => 
                p.tags && filters.tags.some(tag => p.tags.includes(tag))
            );
        }

        return results;
    }

    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        setInterval(async () => {
            try {
                await this.getAllProjects();
                this.notifyDataUpdate();
            } catch (error) {
                console.warn('Auto-refresh failed:', error.message);
            }
        }, this.updateInterval);
    }

    /**
     * Notify components of data updates
     */
    notifyDataUpdate() {
        window.dispatchEvent(new CustomEvent('lazarusDataUpdate', {
            detail: { lastUpdate: this.lastUpdate, data: this.cache }
        }));
    }

    /**
     * Get fallback data when real data is unavailable
     */
    getFallbackData() {
        return {
            projects: [
                {
                    id: 'fallback_1',
                    repository: {
                        full_name: 'example/abandoned-cli',
                        name: 'abandoned-cli',
                        language: 'JavaScript'
                    },
                    status: 'pending',
                    priority: 80,
                    progress: 0,
                    tags: ['cli', 'abandoned', 'high-potential'],
                    notes: 'Discovered via Kraven scan',
                    immersedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    source: 'kraven'
                },
                {
                    id: 'fallback_2',
                    repository: {
                        full_name: 'sample/old-framework',
                        name: 'old-framework',
                        language: 'TypeScript'
                    },
                    status: 'processing',
                    priority: 60,
                    progress: 45,
                    tags: ['framework', 'typescript'],
                    notes: 'Manual addition for testing',
                    immersedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    source: 'manual'
                },
                {
                    id: 'fallback_3',
                    repository: {
                        full_name: 'demo/completed-project',
                        name: 'completed-project',
                        language: 'Python'
                    },
                    status: 'completed',
                    priority: 90,
                    progress: 100,
                    tags: ['python', 'data-science'],
                    notes: 'Successfully revived',
                    immersedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    completedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    source: 'kraven'
                }
            ]
        };
    }

    /**
     * Get fallback statistics
     */
    getFallbackStats() {
        return {
            totalProjects: 3,
            statusDistribution: {
                pending: 1,
                processing: 1,
                completed: 1,
                failed: 0
            },
            languageDistribution: {
                JavaScript: 1,
                TypeScript: 1,
                Python: 1
            },
            averagePriority: 76.7,
            averageProgress: 48.3,
            successRate: 100.0,
            lastUpdated: new Date()
        };
    }

    /**
     * Format time ago
     */
    static timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }

    /**
     * Get priority info
     */
    static getPriorityInfo(priority) {
        if (priority >= 90) return { level: 'urgent', icon: '🔴', color: '#ef4444' };
        if (priority >= 70) return { level: 'high', icon: '🟠', color: '#f97316' };
        if (priority >= 50) return { level: 'normal', icon: '🟡', color: '#eab308' };
        return { level: 'low', icon: '🟢', color: '#22c55e' };
    }

    /**
     * Get status info
     */
    static getStatusInfo(status) {
        const statusMap = {
            pending: { icon: '⏳', color: '#6b7280', label: 'Pending' },
            processing: { icon: '🔄', color: '#3b82f6', label: 'Processing' },
            analyzing: { icon: '🔍', color: '#8b5cf6', label: 'Analyzing' },
            modernizing: { icon: '⚡', color: '#f59e0b', label: 'Modernizing' },
            completed: { icon: '✅', color: '#10b981', label: 'Completed' },
            failed: { icon: '❌', color: '#ef4444', label: 'Failed' }
        };
        return statusMap[status] || { icon: '❓', color: '#6b7280', label: 'Unknown' };
    }
}

// Create global instance
window.lazarusAPI = new LazarusAPI();
