---
layout: default
title: "Revival Queue Management"
description: "Monitor and manage your Phoenix project revival pipeline"
---

# 📋 Revival Queue Management

Monitor, prioritize, and manage your Phoenix project revival pipeline in real-time.

---

## 🚦 Queue Status

<div class="queue-status">
    <div class="status-card active">
        <div class="status-icon">🔄</div>
        <div class="status-info">
            <div class="status-number" id="activeCount">3</div>
            <div class="status-label">Active Revivals</div>
        </div>
    </div>
    
    <div class="status-card pending">
        <div class="status-icon">⏳</div>
        <div class="status-info">
            <div class="status-number" id="pendingCount">12</div>
            <div class="status-label">Pending</div>
        </div>
    </div>
    
    <div class="status-card completed">
        <div class="status-icon">✅</div>
        <div class="status-info">
            <div class="status-number" id="completedCount">47</div>
            <div class="status-label">Completed</div>
        </div>
    </div>
    
    <div class="status-card failed">
        <div class="status-icon">❌</div>
        <div class="status-info">
            <div class="status-number" id="failedCount">2</div>
            <div class="status-label">Failed</div>
        </div>
    </div>
</div>

---

## 🎛️ Queue Controls

<div class="queue-controls">
    <button onclick="pauseQueue()" class="btn btn-secondary">⏸️ Pause Queue</button>
    <button onclick="resumeQueue()" class="btn btn-primary">▶️ Resume Queue</button>
    <button onclick="clearCompleted()" class="btn btn-accent">🧹 Clear Completed</button>
    <button onclick="exportQueue()" class="btn btn-secondary">📤 Export Queue</button>
</div>

---

## 📊 Active Revivals

<div class="active-revivals">
    <div id="activeRevivalsList">
        <!-- Active revivals will be populated here -->
    </div>
</div>

---

## ⏳ Pending Queue

<div class="queue-filters">
    <select id="priorityFilter" onchange="filterQueue()">
        <option value="all">All Priorities</option>
        <option value="urgent">🔴 Urgent</option>
        <option value="high">🟠 High</option>
        <option value="normal">🟡 Normal</option>
        <option value="low">🟢 Low</option>
    </select>
    
    <select id="typeFilter" onchange="filterQueue()">
        <option value="all">All Types</option>
        <option value="full">🔥 Full Revival</option>
        <option value="security">🛡️ Security Only</option>
        <option value="modernize">🛠️ Modernize Only</option>
        <option value="community">🌟 Community Only</option>
    </select>
    
    <input type="text" id="searchFilter" placeholder="Search repositories..." onkeyup="filterQueue()">
</div>

<div class="queue-list">
    <div id="pendingQueueList">
        <!-- Pending queue items will be populated here -->
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

@media (max-width: 768px) {
    .queue-controls {
        justify-content: center;
    }
    
    .revival-item, .queue-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .item-progress {
        width: 100%;
        margin: 0;
    }
    
    .queue-filters {
        flex-direction: column;
    }
}
</style>

<script>
// Mock data for demonstration
const mockActiveRevivals = [
    {
        name: 'microsoft/vscode-extension-samples',
        progress: 65,
        step: 'Modernizing dependencies',
        priority: 'high',
        startTime: '2 hours ago'
    },
    {
        name: 'facebook/create-react-app',
        progress: 30,
        step: 'Security vulnerability scan',
        priority: 'urgent',
        startTime: '45 minutes ago'
    },
    {
        name: 'angular/angular-cli',
        progress: 85,
        step: 'Community kit generation',
        priority: 'normal',
        startTime: '3 hours ago'
    }
];

const mockPendingQueue = [
    {
        name: 'vuejs/vue-cli',
        priority: 'high',
        type: 'full',
        addedTime: '1 hour ago',
        estimatedTime: '25 minutes'
    },
    {
        name: 'webpack/webpack-dev-server',
        priority: 'normal',
        type: 'security',
        addedTime: '2 hours ago',
        estimatedTime: '15 minutes'
    },
    {
        name: 'babel/babel-preset-env',
        priority: 'low',
        type: 'modernize',
        addedTime: '4 hours ago',
        estimatedTime: '20 minutes'
    },
    {
        name: 'eslint/eslint-config-standard',
        priority: 'normal',
        type: 'community',
        addedTime: '6 hours ago',
        estimatedTime: '10 minutes'
    }
];

function loadActiveRevivals() {
    const container = document.getElementById('activeRevivalsList');
    
    if (mockActiveRevivals.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--phoenix-text-muted);">No active revivals</div>';
        return;
    }
    
    container.innerHTML = mockActiveRevivals.map(revival => `
        <div class="revival-item">
            <div class="item-info">
                <div class="item-name">${revival.name}</div>
                <div class="item-details">
                    ${getPriorityIcon(revival.priority)} ${revival.priority} • Started ${revival.startTime}
                </div>
            </div>
            <div class="item-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${revival.progress}%"></div>
                </div>
                <div class="progress-text">${revival.progress}% • ${revival.step}</div>
            </div>
            <div class="item-actions">
                <button class="action-btn" onclick="pauseRevival('${revival.name}')">⏸️ Pause</button>
                <button class="action-btn" onclick="viewLogs('${revival.name}')">📋 Logs</button>
            </div>
        </div>
    `).join('');
}

function loadPendingQueue() {
    const container = document.getElementById('pendingQueueList');
    
    if (mockPendingQueue.length === 0) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--phoenix-text-muted);">Queue is empty</div>';
        return;
    }
    
    container.innerHTML = mockPendingQueue.map(item => `
        <div class="queue-item" data-priority="${item.priority}" data-type="${item.type}" data-name="${item.name.toLowerCase()}">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">
                    ${getPriorityIcon(item.priority)} ${item.priority} • ${getTypeIcon(item.type)} ${item.type} • Added ${item.addedTime}
                </div>
            </div>
            <div class="item-progress">
                <div class="progress-text">Est. ${item.estimatedTime}</div>
            </div>
            <div class="item-actions">
                <button class="action-btn" onclick="prioritizeItem('${item.name}')">⬆️ Priority</button>
                <button class="action-btn" onclick="removeFromQueue('${item.name}')">❌ Remove</button>
            </div>
        </div>
    `).join('');
}

function getPriorityIcon(priority) {
    const icons = {
        urgent: '🔴',
        high: '🟠',
        normal: '🟡',
        low: '🟢'
    };
    return icons[priority] || '🟡';
}

function getTypeIcon(type) {
    const icons = {
        full: '🔥',
        security: '🛡️',
        modernize: '🛠️',
        community: '🌟'
    };
    return icons[type] || '🔥';
}

function filterQueue() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    const items = document.querySelectorAll('.queue-item');
    
    items.forEach(item => {
        const priority = item.dataset.priority;
        const type = item.dataset.type;
        const name = item.dataset.name;
        
        const priorityMatch = priorityFilter === 'all' || priority === priorityFilter;
        const typeMatch = typeFilter === 'all' || type === typeFilter;
        const searchMatch = searchFilter === '' || name.includes(searchFilter);
        
        if (priorityMatch && typeMatch && searchMatch) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Queue control functions
function pauseQueue() {
    alert('Queue paused. No new revivals will start.');
}

function resumeQueue() {
    alert('Queue resumed. Processing will continue.');
}

function clearCompleted() {
    if (confirm('Clear all completed revivals from history?')) {
        alert('Completed revivals cleared.');
        document.getElementById('completedCount').textContent = '0';
    }
}

function exportQueue() {
    const queueData = {
        active: mockActiveRevivals,
        pending: mockPendingQueue,
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(queueData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phoenix-queue-export.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Individual item actions
function pauseRevival(name) {
    alert(`Paused revival for ${name}`);
}

function viewLogs(name) {
    alert(`Opening logs for ${name}...\n\nThis would show detailed revival progress and any issues.`);
}

function prioritizeItem(name) {
    alert(`Moved ${name} to high priority`);
}

function removeFromQueue(name) {
    if (confirm(`Remove ${name} from queue?`)) {
        alert(`${name} removed from queue`);
        // In real implementation, would remove from DOM and update backend
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadActiveRevivals();
    loadPendingQueue();
});

// Simulate progress updates
setInterval(() => {
    mockActiveRevivals.forEach(revival => {
        if (revival.progress < 100) {
            revival.progress += Math.random() * 5;
            if (revival.progress > 100) revival.progress = 100;
        }
    });
    loadActiveRevivals();
}, 5000);
</script>
