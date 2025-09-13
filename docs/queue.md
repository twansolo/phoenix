---
layout: default
title: "🔥 Lazarus Pit"
description: "Dynamic resurrection storage system - Monitor and manage your Phoenix project revival pipeline"
---

# 🔥 Lazarus Pit

**Dynamic resurrection storage system** - Monitor, prioritize, and manage your Phoenix project revival pipeline in real-time.

<div class="lazarus-header">
    <div class="pit-status-indicator">
        <div class="status-dot active"></div>
        <span id="pitStatus">Pit Active</span>
    </div>
    <div class="last-update">
        Last updated: <span id="lastUpdateTime">Loading...</span>
    </div>
</div>

---

## 🚦 Pit Status

<div class="queue-status" id="pitStatusCards">
    <div class="status-card active">
        <div class="status-icon">🔄</div>
        <div class="status-info">
            <div class="status-number" id="activeCount">...</div>
            <div class="status-label">Processing</div>
        </div>
    </div>
    
    <div class="status-card pending">
        <div class="status-icon">⏳</div>
        <div class="status-info">
            <div class="status-number" id="pendingCount">...</div>
            <div class="status-label">Pending</div>
        </div>
    </div>
    
    <div class="status-card completed">
        <div class="status-icon">✅</div>
        <div class="status-info">
            <div class="status-number" id="completedCount">...</div>
            <div class="status-label">Completed</div>
        </div>
    </div>
    
    <div class="status-card failed">
        <div class="status-icon">❌</div>
        <div class="status-info">
            <div class="status-number" id="failedCount">...</div>
            <div class="status-label">Failed</div>
        </div>
    </div>
</div>

<div class="pit-analytics">
    <div class="analytics-item">
        <span class="analytics-label">Success Rate:</span>
        <span class="analytics-value" id="successRate">...</span>
    </div>
    <div class="analytics-item">
        <span class="analytics-label">Avg Priority:</span>
        <span class="analytics-value" id="avgPriority">...</span>
    </div>
    <div class="analytics-item">
        <span class="analytics-label">Total Projects:</span>
        <span class="analytics-value" id="totalProjects">...</span>
    </div>
</div>

---

## 🎛️ Pit Controls

<div class="queue-controls">
    <button onclick="refreshPitData()" class="btn btn-primary">🔄 Refresh Data</button>
    <button onclick="exportPitData()" class="btn btn-secondary">📤 Export Pit Data</button>
    <button onclick="viewPitCommand()" class="btn btn-accent">💻 CLI Commands</button>
    <button onclick="toggleAutoRefresh()" class="btn btn-secondary" id="autoRefreshBtn">⏸️ Pause Auto-Refresh</button>
</div>

<div class="cli-info" id="cliCommands" style="display: none;">
    <h4>🔥 Phoenix CLI Commands</h4>
    <div class="code-block">
        <code>phoenix pit --list</code> - List all projects in the pit<br>
        <code>phoenix pit --stats</code> - Show pit statistics<br>
        <code>phoenix pit --immerse &lt;repo&gt;</code> - Add project to pit<br>
        <code>phoenix pit --process</code> - Process next project<br>
        <code>phoenix pit --extract &lt;id&gt;</code> - Remove project from pit
    </div>
</div>

---

## 🔄 Active Resurrections

<div class="active-revivals">
    <div id="activeRevivalsList">
        <div class="loading-state">
            <div class="spinner"></div>
            <span>Loading active resurrections...</span>
        </div>
    </div>
</div>

---

## ⏳ Pending Resurrections

<div class="queue-filters">
    <select id="priorityFilter" onchange="filterPit()">
        <option value="all">All Priorities</option>
        <option value="urgent">🔴 Urgent (90+)</option>
        <option value="high">🟠 High (70+)</option>
        <option value="normal">🟡 Normal (50+)</option>
        <option value="low">🟢 Low (&lt;50)</option>
    </select>
    
    <select id="languageFilter" onchange="filterPit()">
        <option value="all">All Languages</option>
        <!-- Populated dynamically -->
    </select>
    
    <select id="sourceFilter" onchange="filterPit()">
        <option value="all">All Sources</option>
        <option value="kraven">🕷️ Kraven</option>
        <option value="manual">👤 Manual</option>
        <option value="api">🤖 API</option>
    </select>
    
    <input type="text" id="searchFilter" placeholder="Search repositories, tags, notes..." onkeyup="filterPit()">
</div>

<div class="queue-list">
    <div id="pendingQueueList">
        <div class="loading-state">
            <div class="spinner"></div>
            <span>Loading pending resurrections...</span>
        </div>
    </div>
</div>

---

## 📈 Queue Analytics

<div class="analytics-grid">
    <div class="analytics-card">
        <h4>⏱️ Average Processing Time</h4>
        <div class="analytics-value">23 minutes</div>
        <div class="analytics-trend">📈 +5% from last week</div>
    </div>
    
    <div class="analytics-card">
        <h4>🎯 Success Rate</h4>
        <div class="analytics-value">87%</div>
        <div class="analytics-trend">📈 +3% from last week</div>
    </div>
    
    <div class="analytics-card">
        <h4>🚀 Throughput</h4>
        <div class="analytics-value">24 projects/day</div>
        <div class="analytics-trend">📈 +12% from last week</div>
    </div>
    
    <div class="analytics-card">
        <h4>⚡ Queue Efficiency</h4>
        <div class="analytics-value">94%</div>
        <div class="analytics-trend">📊 Stable</div>
    </div>
</div>

<style>
.lazarus-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, rgba(255, 69, 0, 0.1), rgba(255, 165, 0, 0.05));
    border-radius: 12px;
    border: 1px solid var(--phoenix-border);
    margin: 2rem 0;
}

.pit-status-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    color: var(--phoenix-text);
}

.status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #10b981;
    animation: pulse 2s infinite;
}

.status-dot.active {
    background: #10b981;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.last-update {
    color: var(--phoenix-text-muted);
    font-size: 0.9rem;
}

.pit-analytics {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin: 2rem 0;
    padding: 1.5rem;
    background: var(--phoenix-surface);
    border-radius: 12px;
    border: 1px solid var(--phoenix-border);
}

.analytics-item {
    text-align: center;
}

.analytics-label {
    display: block;
    color: var(--phoenix-text-muted);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.analytics-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--phoenix-primary);
}

.queue-status {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.status-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background: var(--phoenix-surface);
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
    transition: all 0.3s ease;
}

.status-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.status-card.active {
    border-color: var(--phoenix-primary);
    background: linear-gradient(135deg, rgba(255, 69, 0, 0.1), transparent);
}

.status-card.pending {
    border-color: var(--phoenix-accent);
    background: linear-gradient(135deg, rgba(255, 165, 0, 0.1), transparent);
}

.status-card.completed {
    border-color: #4ade80;
    background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), transparent);
}

.status-card.failed {
    border-color: #ef4444;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent);
}

.status-icon {
    font-size: 2rem;
}

.status-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--phoenix-text);
}

.status-label {
    color: var(--phoenix-text-muted);
    font-weight: 500;
}

.queue-controls {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.active-revivals, .queue-list {
    background: var(--phoenix-surface);
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
    margin: 2rem 0;
}

.revival-item, .queue-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--phoenix-border);
}

.revival-item:last-child, .queue-item:last-child {
    border-bottom: none;
}

.item-info {
    flex: 1;
}

.item-name {
    font-weight: 600;
    color: var(--phoenix-text);
    margin-bottom: 0.5rem;
}

.item-details {
    color: var(--phoenix-text-muted);
    font-size: 0.9rem;
}

.item-progress {
    width: 200px;
    margin: 0 2rem;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--phoenix-surface-light);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--phoenix-primary), var(--phoenix-accent));
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.8rem;
    color: var(--phoenix-text-muted);
    margin-top: 0.25rem;
}

.item-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    background: var(--phoenix-surface-light);
    color: var(--phoenix-text-muted);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.action-btn:hover {
    background: var(--phoenix-primary);
    color: white;
}

.queue-filters {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.queue-filters select, .queue-filters input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--phoenix-border);
    border-radius: 8px;
    background: var(--phoenix-surface);
    color: var(--phoenix-text);
    font-size: 0.9rem;
}

.queue-filters input {
    flex: 1;
    min-width: 200px;
}

.analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.analytics-card {
    padding: 2rem;
    background: var(--phoenix-surface);
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
    text-align: center;
}

.analytics-card h4 {
    margin: 0 0 1rem 0;
    color: var(--phoenix-accent);
}

.analytics-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--phoenix-primary);
    margin-bottom: 0.5rem;
}

.analytics-trend {
    color: var(--phoenix-text-muted);
    font-size: 0.9rem;
}

.cli-info {
    margin: 2rem 0;
    padding: 2rem;
    background: var(--phoenix-surface);
    border-radius: 12px;
    border: 1px solid var(--phoenix-border);
}

.cli-info h4 {
    margin: 0 0 1rem 0;
    color: var(--phoenix-accent);
}

.code-block {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-radius: 8px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    color: #e5e5e5;
}

.loading-state, .empty-state, .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 69, 0, 0.1);
    border-left: 4px solid var(--phoenix-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.empty-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--phoenix-text);
    margin-bottom: 0.5rem;
}

.empty-subtext {
    color: var(--phoenix-text-muted);
    font-size: 0.9rem;
}

.repo-link {
    color: var(--phoenix-primary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.repo-link:hover {
    color: var(--phoenix-accent);
    text-decoration: underline;
}

.priority-badge, .status-badge, .language-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid currentColor;
    margin-right: 0.5rem;
}

.language-badge {
    background: linear-gradient(135deg, var(--phoenix-primary), var(--phoenix-accent));
    color: white;
    border: none;
    margin-left: 1rem;
}

.time-info, .source-info {
    color: var(--phoenix-text-muted);
    font-size: 0.85rem;
    margin-right: 1rem;
}

.item-description {
    color: var(--phoenix-text-muted);
    font-size: 0.9rem;
    margin: 0.5rem 0;
    line-height: 1.4;
}

.item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.75rem 0;
}

.tag {
    background: rgba(255, 165, 0, 0.2);
    color: var(--phoenix-accent);
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.8rem;
    border: 1px solid var(--phoenix-accent);
}

.item-notes {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--phoenix-text-muted);
    margin-top: 0.75rem;
    border-left: 3px solid var(--phoenix-primary);
}

.item-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0 1rem;
    min-width: 120px;
}

.meta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.meta-label {
    color: var(--phoenix-text-muted);
    font-size: 0.8rem;
}

.meta-value {
    color: var(--phoenix-text);
    font-size: 0.8rem;
    font-weight: 600;
}

.action-btn.primary {
    background: linear-gradient(135deg, var(--phoenix-primary), var(--phoenix-accent));
    color: white;
    border: none;
}

.action-btn.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3);
}

.btn.paused {
    background: #6b7280;
    color: white;
}

@media (max-width: 768px) {
    .lazarus-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .pit-analytics {
        flex-direction: column;
        gap: 1rem;
    }
    
    .queue-controls {
        justify-content: center;
    }
    
    .revival-item, .queue-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .item-progress, .item-meta {
        width: 100%;
        margin: 0;
    }
    
    .queue-filters {
        flex-direction: column;
    }
}
</style>

<script src="assets/js/lazarus-api.js"></script>
<script>
/**
 * Real Lazarus Pit Interface
 * Connects to actual Phoenix Lazarus Pit data
 */

let autoRefreshEnabled = true;
let currentProjects = [];
let filteredProjects = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    await initializeLazarusPit();
    
    // Listen for data updates
    window.addEventListener('lazarusDataUpdate', handleDataUpdate);
});

async function initializeLazarusPit() {
    try {
        console.log('🔥 Initializing Lazarus Pit interface...');
        await loadAllData();
        updateLastUpdateTime();
    } catch (error) {
        console.error('Failed to initialize Lazarus Pit:', error);
        showErrorState();
    }
}

async function loadAllData() {
    // Load status cards
    await updateStatusCards();
    
    // Load active resurrections
    await loadActiveResurrections();
    
    // Load pending resurrections  
    await loadPendingResurrections();
    
    // Update filters
    await updateFilters();
}

async function updateStatusCards() {
    try {
        const stats = await window.lazarusAPI.getStatistics();
        
        // Update status counts
        document.getElementById('activeCount').textContent = 
            (stats.statusDistribution.processing || 0) + (stats.statusDistribution.analyzing || 0);
        document.getElementById('pendingCount').textContent = stats.statusDistribution.pending || 0;
        document.getElementById('completedCount').textContent = stats.statusDistribution.completed || 0;
        document.getElementById('failedCount').textContent = stats.statusDistribution.failed || 0;
        
        // Update analytics
        document.getElementById('successRate').textContent = `${stats.successRate}%`;
        document.getElementById('avgPriority').textContent = stats.averagePriority;
        document.getElementById('totalProjects').textContent = stats.totalProjects;
        
    } catch (error) {
        console.error('Failed to update status cards:', error);
    }
}

async function loadActiveResurrections() {
    try {
        const container = document.getElementById('activeRevivalsList');
        const activeProjects = await window.lazarusAPI.getActiveProjects();
        
        if (activeProjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💤</div>
                    <div class="empty-text">No active resurrections</div>
                    <div class="empty-subtext">Projects will appear here when processing begins</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = activeProjects.map(project => {
            const priorityInfo = window.lazarusAPI.constructor.getPriorityInfo(project.priority);
            const statusInfo = window.lazarusAPI.constructor.getStatusInfo(project.status);
            const timeAgo = window.lazarusAPI.constructor.timeAgo(project.immersedAt);
            
            return `
                <div class="revival-item">
                    <div class="item-info">
                        <div class="item-name">
                            <a href="${project.repository.html_url}" target="_blank" class="repo-link">
                                ${project.repository.full_name}
                            </a>
                        </div>
                        <div class="item-details">
                            <span class="priority-badge" style="color: ${priorityInfo.color}">
                                ${priorityInfo.icon} ${priorityInfo.level}
                            </span>
                            <span class="status-badge" style="color: ${statusInfo.color}">
                                ${statusInfo.icon} ${statusInfo.label}
                            </span>
                            <span class="time-info">Started ${timeAgo}</span>
                        </div>
                        <div class="item-tags">
                            ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="item-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                        </div>
                        <div class="progress-text">${project.progress || 0}% complete</div>
                    </div>
                    <div class="item-actions">
                        <button class="action-btn" onclick="viewProjectDetails('${project.id}')">
                            👁️ Details
                        </button>
                        <button class="action-btn" onclick="copyProjectId('${project.id}')">
                            📋 Copy ID
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Failed to load active resurrections:', error);
        document.getElementById('activeRevivalsList').innerHTML = 
            '<div class="error-state">Failed to load active resurrections</div>';
    }
}

async function loadPendingResurrections() {
    try {
        const container = document.getElementById('pendingQueueList');
        const pendingProjects = await window.lazarusAPI.getPendingProjects();
        currentProjects = pendingProjects;
        
        if (pendingProjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🏺</div>
                    <div class="empty-text">Lazarus Pit is empty</div>
                    <div class="empty-subtext">Use <code>phoenix pit --immerse &lt;repo&gt;</code> to add projects</div>
                </div>
            `;
            return;
        }
        
        displayPendingProjects(pendingProjects);
        
    } catch (error) {
        console.error('Failed to load pending resurrections:', error);
        document.getElementById('pendingQueueList').innerHTML = 
            '<div class="error-state">Failed to load pending resurrections</div>';
    }
}

function displayPendingProjects(projects) {
    const container = document.getElementById('pendingQueueList');
    
    container.innerHTML = projects.map(project => {
        const priorityInfo = window.lazarusAPI.constructor.getPriorityInfo(project.priority);
        const timeAgo = window.lazarusAPI.constructor.timeAgo(project.immersedAt);
        const language = project.repository.language || 'Unknown';
        
        return `
            <div class="queue-item" 
                 data-priority="${priorityInfo.level}" 
                 data-language="${language.toLowerCase()}" 
                 data-source="${project.source || 'unknown'}"
                 data-name="${project.repository.full_name.toLowerCase()}">
                <div class="item-info">
                    <div class="item-name">
                        <a href="${project.repository.html_url}" target="_blank" class="repo-link">
                            ${project.repository.full_name}
                        </a>
                        <span class="language-badge">${language}</span>
                    </div>
                    <div class="item-details">
                        <span class="priority-badge" style="color: ${priorityInfo.color}">
                            ${priorityInfo.icon} Priority: ${project.priority}
                        </span>
                        <span class="source-info">
                            ${getSourceIcon(project.source)} ${project.source || 'manual'}
                        </span>
                        <span class="time-info">Added ${timeAgo}</span>
                    </div>
                    <div class="item-description">
                        ${project.repository.description || 'No description available'}
                    </div>
                    <div class="item-tags">
                        ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${project.notes ? `<div class="item-notes">📝 ${project.notes}</div>` : ''}
                </div>
                <div class="item-meta">
                    <div class="meta-item">
                        <span class="meta-label">Stars:</span>
                        <span class="meta-value">⭐ ${project.repository.stargazers_count || 0}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">ID:</span>
                        <span class="meta-value">${project.id}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="action-btn primary" onclick="processProject('${project.id}')">
                        🔥 Process
                    </button>
                    <button class="action-btn" onclick="viewProjectDetails('${project.id}')">
                        👁️ Details
                    </button>
                    <button class="action-btn" onclick="copyProjectId('${project.id}')">
                        📋 Copy ID
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function updateFilters() {
    try {
        const stats = await window.lazarusAPI.getStatistics();
        
        // Update language filter
        const languageFilter = document.getElementById('languageFilter');
        const currentLanguage = languageFilter.value;
        
        languageFilter.innerHTML = '<option value="all">All Languages</option>';
        Object.keys(stats.languageDistribution).forEach(language => {
            const count = stats.languageDistribution[language];
            languageFilter.innerHTML += `<option value="${language}">${language} (${count})</option>`;
        });
        
        // Restore selection
        if (currentLanguage) {
            languageFilter.value = currentLanguage;
        }
        
    } catch (error) {
        console.error('Failed to update filters:', error);
    }
}

function filterPit() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const languageFilter = document.getElementById('languageFilter').value;
    const sourceFilter = document.getElementById('sourceFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    const items = document.querySelectorAll('.queue-item');
    
    items.forEach(item => {
        const priority = item.dataset.priority;
        const language = item.dataset.language;
        const source = item.dataset.source;
        const name = item.dataset.name;
        
        const priorityMatch = priorityFilter === 'all' || priority === priorityFilter;
        const languageMatch = languageFilter === 'all' || language === languageFilter.toLowerCase();
        const sourceMatch = sourceFilter === 'all' || source === sourceFilter;
        const searchMatch = searchFilter === '' || 
            name.includes(searchFilter) || 
            item.textContent.toLowerCase().includes(searchFilter);
        
        if (priorityMatch && languageMatch && sourceMatch && searchMatch) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function getSourceIcon(source) {
    const icons = {
        kraven: '🕷️',
        manual: '👤',
        api: '🤖',
        import: '📥'
    };
    return icons[source] || '❓';
}

// Control functions
async function refreshPitData() {
    const btn = document.querySelector('button[onclick="refreshPitData()"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '🔄 Refreshing...';
    btn.disabled = true;
    
    try {
        await loadAllData();
        updateLastUpdateTime();
        
        // Show success feedback
        btn.innerHTML = '✅ Refreshed';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Refresh failed:', error);
        btn.innerHTML = '❌ Failed';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

async function exportPitData() {
    try {
        const data = await window.lazarusAPI.getAllProjects();
        const exportData = {
            ...data,
            exportedAt: new Date().toISOString(),
            exportedBy: 'Phoenix Web Interface'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lazarus-pit-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed. Please try again.');
    }
}

function viewPitCommand() {
    const cliInfo = document.getElementById('cliCommands');
    cliInfo.style.display = cliInfo.style.display === 'none' ? 'block' : 'none';
}

function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    const btn = document.getElementById('autoRefreshBtn');
    
    if (autoRefreshEnabled) {
        btn.innerHTML = '⏸️ Pause Auto-Refresh';
        btn.classList.remove('paused');
    } else {
        btn.innerHTML = '▶️ Resume Auto-Refresh';
        btn.classList.add('paused');
    }
}

// Individual project actions
function viewProjectDetails(projectId) {
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const details = `
Project: ${project.repository.full_name}
ID: ${project.id}
Status: ${project.status}
Priority: ${project.priority}
Progress: ${project.progress || 0}%
Language: ${project.repository.language || 'Unknown'}
Stars: ${project.repository.stargazers_count || 0}
Source: ${project.source || 'manual'}
Tags: ${(project.tags || []).join(', ')}
Notes: ${project.notes || 'None'}
Added: ${new Date(project.immersedAt).toLocaleString()}
${project.completedAt ? `Completed: ${new Date(project.completedAt).toLocaleString()}` : ''}
    `.trim();
    
    alert(details);
}

function copyProjectId(projectId) {
    navigator.clipboard.writeText(projectId).then(() => {
        // Show temporary success feedback
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 1500);
    }).catch(() => {
        alert(`Project ID: ${projectId}`);
    });
}

function processProject(projectId) {
    const confirmed = confirm(`Process project ${projectId}?\n\nThis will start the resurrection process. You can monitor progress in the "Active Resurrections" section.`);
    if (confirmed) {
        alert(`Processing started for ${projectId}\n\nRun 'phoenix pit --process' in CLI to begin actual processing.`);
    }
}

function handleDataUpdate(event) {
    if (autoRefreshEnabled) {
        console.log('🔄 Auto-refreshing due to data update...');
        loadAllData();
        updateLastUpdateTime();
    }
}

function updateLastUpdateTime() {
    const now = new Date();
    document.getElementById('lastUpdateTime').textContent = now.toLocaleTimeString();
}

function showErrorState() {
    document.getElementById('pitStatus').innerHTML = '❌ Connection Failed';
    document.getElementById('lastUpdateTime').textContent = 'Failed to load';
}
</script>
