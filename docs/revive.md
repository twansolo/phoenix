---
layout: default
title: "Project Revival Interface"
description: "Revive abandoned GitHub projects with automated modernization"
---

# 🔥 Project Revival Interface

Transform abandoned repositories into modern, thriving projects with Phoenix's automated revival system.

---

## 🚀 Quick Revival

<div class="revival-interface">
    <div class="revival-form">
        <h3>🎯 Revive a Project</h3>
        <form id="revivalForm">
            <div class="form-group">
                <label for="repoUrl">Repository URL or owner/repo:</label>
                <input type="text" id="repoUrl" placeholder="e.g., microsoft/typescript or https://github.com/owner/repo" required>
            </div>
            
            <div class="form-group">
                <label>Revival Options:</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" id="modernize" checked> 🛠️ Modernize Dependencies</label>
                    <label><input type="checkbox" id="communityKit" checked> 🌟 Community Kit</label>
                    <label><input type="checkbox" id="securityFix" checked> 🛡️ Security Fixes</label>
                    <label><input type="checkbox" id="cicd" checked> ⚙️ CI/CD Setup</label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="priority">Priority Level:</label>
                <select id="priority">
                    <option value="low">🟢 Low - Background processing</option>
                    <option value="normal" selected>🟡 Normal - Standard queue</option>
                    <option value="high">🟠 High - Priority processing</option>
                    <option value="urgent">🔴 Urgent - Immediate processing</option>
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-large">🔥 Start Revival</button>
        </form>
    </div>
    
    <div class="revival-preview">
        <h3>📋 Revival Preview</h3>
        <div id="revivalPreview">
            <p>Enter a repository to see the revival plan...</p>
        </div>
    </div>
</div>

---

## 📊 Revival Process

<div class="process-steps">
    <div class="step">
        <div class="step-number">1</div>
        <h4>🔍 Analysis</h4>
        <p>Deep scan of repository structure, dependencies, and community health</p>
    </div>
    
    <div class="step">
        <div class="step-number">2</div>
        <h4>🛠️ Modernization</h4>
        <p>Update dependencies, fix vulnerabilities, add modern tooling</p>
    </div>
    
    <div class="step">
        <div class="step-number">3</div>
        <h4>🌟 Community Building</h4>
        <p>Create documentation, templates, and community guidelines</p>
    </div>
    
    <div class="step">
        <div class="step-number">4</div>
        <h4>🚀 Launch</h4>
        <p>Deploy improvements and monitor community engagement</p>
    </div>
</div>

---

## 🎯 Batch Revival

<div class="batch-revival">
    <h3>📥 Import from Kraven</h3>
    <p>Import discovered projects from Kraven for batch processing:</p>
    
    <div class="import-options">
        <div class="import-method">
            <h4>📁 File Upload</h4>
            <input type="file" id="kravenFile" accept=".json">
            <button onclick="importKravenFile()" class="btn btn-secondary">Import JSON</button>
        </div>
        
        <div class="import-method">
            <h4>🔗 Direct Integration</h4>
            <p>Connect directly with Kraven's web interface:</p>
            <a href="https://twansolo.github.io/kraven/hunt" class="btn btn-accent">🕷️ Hunt with Kraven</a>
        </div>
    </div>
</div>

---

## 📈 Success Metrics

<div class="metrics-grid">
    <div class="metric-card">
        <div class="metric-number" id="totalRevived">0</div>
        <div class="metric-label">Projects Revived</div>
    </div>
    
    <div class="metric-card">
        <div class="metric-number" id="avgSuccessRate">0%</div>
        <div class="metric-label">Success Rate</div>
    </div>
    
    <div class="metric-card">
        <div class="metric-number" id="communityGrowth">0%</div>
        <div class="metric-label">Community Growth</div>
    </div>
    
    <div class="metric-card">
        <div class="metric-number" id="securityFixes">0</div>
        <div class="metric-label">Security Issues Fixed</div>
    </div>
</div>

<style>
.revival-interface {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin: 3rem 0;
}

.revival-form, .revival-preview {
    background: var(--phoenix-surface);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
}

.form-group {
    margin-bottom: 2rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--phoenix-accent);
}

.form-group input, .form-group select {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--phoenix-border);
    border-radius: 8px;
    background: var(--phoenix-surface-light);
    color: var(--phoenix-text);
    font-size: 1rem;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
}

.process-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.step {
    text-align: center;
    padding: 2rem;
    background: var(--phoenix-surface);
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
    position: relative;
}

.step-number {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--phoenix-primary), var(--phoenix-secondary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5rem;
    margin: 0 auto 1rem auto;
}

.batch-revival {
    background: var(--phoenix-surface);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
    margin: 3rem 0;
}

.import-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
}

.import-method {
    text-align: center;
    padding: 2rem;
    background: var(--phoenix-surface-light);
    border-radius: 12px;
    border: 1px solid var(--phoenix-border);
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin: 3rem 0;
}

.metric-card {
    text-align: center;
    padding: 2rem;
    background: var(--phoenix-surface);
    border-radius: 16px;
    border: 1px solid var(--phoenix-border);
}

.metric-number {
    font-size: 3rem;
    font-weight: bold;
    color: var(--phoenix-primary);
    margin-bottom: 0.5rem;
}

.metric-label {
    color: var(--phoenix-text-muted);
    font-weight: 500;
}

@media (max-width: 768px) {
    .revival-interface {
        grid-template-columns: 1fr;
    }
    
    .import-options {
        grid-template-columns: 1fr;
    }
}
</style>

<script>
// Revival form handling
document.getElementById('revivalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const repoUrl = document.getElementById('repoUrl').value;
    const options = {
        modernize: document.getElementById('modernize').checked,
        communityKit: document.getElementById('communityKit').checked,
        securityFix: document.getElementById('securityFix').checked,
        cicd: document.getElementById('cicd').checked,
        priority: document.getElementById('priority').value
    };
    
    startRevival(repoUrl, options);
});

function startRevival(repoUrl, options) {
    // Show loading state
    const button = document.querySelector('#revivalForm button');
    const originalText = button.textContent;
    button.textContent = '🔄 Starting Revival...';
    button.disabled = true;
    
    // Simulate CLI command generation
    const cliCommand = generateCliCommand(repoUrl, options);
    
    // Show success message with CLI command
    setTimeout(() => {
        alert(`Revival started! Run this command in your terminal:\n\n${cliCommand}`);
        button.textContent = originalText;
        button.disabled = false;
        
        // Update preview
        updateRevivalPreview(repoUrl, options);
    }, 2000);
}

function generateCliCommand(repoUrl, options) {
    let command = `phoenix revive ${repoUrl}`;
    
    if (options.modernize) command += ' --modernize';
    if (options.communityKit) command += ' --community-kit';
    if (options.securityFix) command += ' --security-fix';
    if (options.cicd) command += ' --ci-cd';
    if (options.priority !== 'normal') command += ` --priority ${options.priority}`;
    
    return command;
}

function updateRevivalPreview(repoUrl, options) {
    const preview = document.getElementById('revivalPreview');
    const repo = repoUrl.replace(/^https:\/\/github\.com\//, '');
    
    let steps = [];
    if (options.modernize) steps.push('🛠️ Dependency modernization');
    if (options.communityKit) steps.push('🌟 Community infrastructure');
    if (options.securityFix) steps.push('🛡️ Security vulnerability fixes');
    if (options.cicd) steps.push('⚙️ CI/CD pipeline setup');
    
    preview.innerHTML = `
        <h4>📋 Revival Plan for ${repo}</h4>
        <ul>
            ${steps.map(step => `<li>${step}</li>`).join('')}
        </ul>
        <p><strong>Priority:</strong> ${options.priority}</p>
        <p><strong>Estimated Time:</strong> ${estimateTime(steps.length)} minutes</p>
    `;
}

function estimateTime(stepCount) {
    return stepCount * 15; // 15 minutes per step
}

function importKravenFile() {
    const fileInput = document.getElementById('kravenFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a Kraven JSON file first.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const kravenData = JSON.parse(e.target.result);
            const command = `phoenix import-kraven ${file.name} --queue --auto-start`;
            alert(`Import ready! Run this command:\n\n${command}\n\nFound ${kravenData.analyzed?.length || 0} projects to import.`);
        } catch (error) {
            alert('Invalid JSON file. Please ensure it\'s a valid Kraven export.');
        }
    };
    reader.readAsText(file);
}

// Load mock metrics
function loadMetrics() {
    document.getElementById('totalRevived').textContent = '1,247';
    document.getElementById('avgSuccessRate').textContent = '87%';
    document.getElementById('communityGrowth').textContent = '156%';
    document.getElementById('securityFixes').textContent = '3,891';
}

// Load metrics on page load
document.addEventListener('DOMContentLoaded', loadMetrics);
</script>
