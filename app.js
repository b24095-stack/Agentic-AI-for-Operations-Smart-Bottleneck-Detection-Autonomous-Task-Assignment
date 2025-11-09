// Production Lines Data
const productionLines = [
    { name: 'Assembly Line A', throughput: 85, cycleTime: 12, queueLength: 15, efficiency: 88 },
    { name: 'Packaging Line B', throughput: 120, cycleTime: 8, queueLength: 22, efficiency: 92 },
    { name: 'Quality Control C', throughput: 95, cycleTime: 15, queueLength: 18, efficiency: 85 },
    { name: 'Welding Station D', throughput: 75, cycleTime: 20, queueLength: 12, efficiency: 90 },
    { name: 'Paint Shop E', throughput: 65, cycleTime: 25, queueLength: 8, efficiency: 87 }
];

const teamMembers = [
    'Maria Santos', 'John Chen', 'Sarah Williams', 'Ahmed Hassan',
    'Lisa Anderson', 'David Kim', 'Emily Rodriguez', 'Michael Brown'
];

const bottleneckScenarios = [
    { type: 'capacity_shortage', action: 'Reassign workers from underutilized lines', task: 'Provide additional capacity support' },
    { type: 'equipment_degradation', action: 'Schedule immediate maintenance inspection', task: 'Perform equipment diagnostics and maintenance' },
    { type: 'material_shortage', action: 'Expedite material procurement', task: 'Coordinate urgent material delivery' },
    { type: 'quality_issues', action: 'Initiate quality audit', task: 'Conduct quality inspection and root cause analysis' },
    { type: 'training_gap', action: 'Deploy cross-training resources', task: 'Provide operational training and support' }
];

const alertTypes = [
    'Predicted Capacity Shortage',
    'Equipment Performance Degradation',
    'Material Inventory Low',
    'Quality Variance Detected',
    'Maintenance Due Soon'
];

// State
let simulationRunning = false;
let simulationInterval = null;
let decisionLog = [];
let tasks = [];
let alerts = [];
let stats = {
    bottlenecksDetected: 0,
    tasksAssigned: 0,
    resolutionTimes: [],
    interventionsAvoided: 0
};
let taskIdCounter = 1000;

// Initialize
function init() {
    renderProductionLines();
    updateStats();
}

// Toggle Info Panel
function toggleInfo() {
    const content = document.getElementById('infoContent');
    const icon = document.getElementById('infoToggleIcon');
    content.classList.toggle('hidden');
    icon.textContent = content.classList.contains('hidden') ? '▼' : '▲';
}

// Render Production Lines
function renderProductionLines() {
    const container = document.getElementById('productionLines');
    container.innerHTML = productionLines.map((line, index) => {
        const status = getLineStatus(line);
        return `
            <div class="production-line" data-line="${index}">
                <div class="line-header">
                    <div class="line-name">${line.name}</div>
                    <div class="status status-${status.class}">${status.text}</div>
                </div>
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-label">Throughput</div>
                        <div class="metric-value">${line.throughput} <span style="font-size: 0.8rem; color: var(--text-secondary);">units/hr</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(line.throughput / 150) * 100}%; background: var(--${status.color});"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Cycle Time</div>
                        <div class="metric-value">${line.cycleTime} <span style="font-size: 0.8rem; color: var(--text-secondary);">min</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min((line.cycleTime / 30) * 100, 100)}%; background: var(--${status.color});"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Queue Length</div>
                        <div class="metric-value">${line.queueLength} <span style="font-size: 0.8rem; color: var(--text-secondary);">units</span></div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(line.queueLength / 60) * 100}%; background: var(--${status.color});"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Efficiency</div>
                        <div class="metric-value">${line.efficiency}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${line.efficiency}%; background: var(--${status.color});"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get Line Status
function getLineStatus(line) {
    const cycleTimeIncrease = ((line.cycleTime - getInitialCycleTime(line.name)) / getInitialCycleTime(line.name)) * 100;
    
    if (cycleTimeIncrease > 30 || line.efficiency < 75 || line.queueLength > 40) {
        return { class: 'critical', text: 'Bottleneck Detected', color: 'danger' };
    } else if (cycleTimeIncrease > 15 || line.efficiency < 85 || line.queueLength > 30) {
        return { class: 'warning', text: 'Warning', color: 'warning' };
    }
    return { class: 'normal', text: 'Normal', color: 'success' };
}

function getInitialCycleTime(lineName) {
    const initial = {
        'Assembly Line A': 12,
        'Packaging Line B': 8,
        'Quality Control C': 15,
        'Welding Station D': 20,
        'Paint Shop E': 25
    };
    return initial[lineName] || 15;
}

// Start Simulation
function startSimulation() {
    if (simulationRunning) return;
    
    simulationRunning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    
    showToast('Simulation Started', 'AI agent is now monitoring production lines');
    
    const speed = document.getElementById('speedControl').value;
    const interval = 3000 / speed;
    
    simulationInterval = setInterval(() => {
        updateProductionLines();
        checkForBottlenecks();
        updateTaskStatuses();
        generatePredictiveAlerts();
    }, interval);
}

// Pause Simulation
function pauseSimulation() {
    if (!simulationRunning) return;
    
    simulationRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    
    clearInterval(simulationInterval);
    showToast('Simulation Paused', 'AI monitoring has been paused');
}

// Update Production Lines
function updateProductionLines() {
    productionLines.forEach(line => {
        // Random fluctuations
        line.throughput = Math.max(50, line.throughput + (Math.random() - 0.5) * 10);
        line.cycleTime = Math.max(5, line.cycleTime + (Math.random() - 0.5) * 3);
        line.queueLength = Math.max(0, line.queueLength + (Math.random() - 0.5) * 5);
        line.efficiency = Math.min(100, Math.max(60, line.efficiency + (Math.random() - 0.5) * 4));
    });
    
    renderProductionLines();
}

// Check for Bottlenecks
function checkForBottlenecks() {
    productionLines.forEach((line, index) => {
        const cycleTimeIncrease = ((line.cycleTime - getInitialCycleTime(line.name)) / getInitialCycleTime(line.name)) * 100;
        
        if (cycleTimeIncrease > 30 || line.efficiency < 75 || line.queueLength > 40) {
            // Only trigger if we haven't recently detected this bottleneck
            const recentDecision = decisionLog.find(d => 
                d.line === line.name && 
                (Date.now() - d.timestamp) < 30000
            );
            
            if (!recentDecision && Math.random() > 0.7) {
                detectBottleneck(line, index);
            }
        }
    });
}

// Detect Bottleneck
function detectBottleneck(line, index) {
    stats.bottlenecksDetected++;
    stats.interventionsAvoided++;
    
    const scenario = bottleneckScenarios[Math.floor(Math.random() * bottleneckScenarios.length)];
    const assignee = teamMembers[Math.floor(Math.random() * teamMembers.length)];
    const resolutionTime = Math.floor(Math.random() * 20) + 10;
    
    // Create decision log entry
    const decision = {
        timestamp: Date.now(),
        line: line.name,
        event: `Bottleneck detected on ${line.name}`,
        analysis: `Cycle time: ${line.cycleTime.toFixed(1)}min (+${(((line.cycleTime - getInitialCycleTime(line.name)) / getInitialCycleTime(line.name)) * 100).toFixed(0)}%), Queue: ${Math.floor(line.queueLength)} units, Efficiency: ${line.efficiency.toFixed(0)}%`,
        action: scenario.action,
        assignee: assignee,
        impact: `Expected resolution in ${resolutionTime} minutes`,
        scenarioType: scenario.type
    };
    
    decisionLog.unshift(decision);
    if (decisionLog.length > 10) decisionLog.pop();
    
    // Create task
    createTask(line.name, assignee, scenario.task, resolutionTime);
    
    // Update resolution times
    stats.resolutionTimes.push(resolutionTime);
    if (stats.resolutionTimes.length > 20) stats.resolutionTimes.shift();
    
    renderDecisionLog();
    updateStats();
    
    showToast('Bottleneck Detected', `AI assigned task to ${assignee}`);
}

// Create Task
function createTask(line, assignee, description, estimatedTime) {
    const task = {
        id: taskIdCounter++,
        line: line,
        assignee: assignee,
        description: description,
        priority: Math.random() > 0.5 ? 'high' : 'medium',
        status: 'assigned',
        timestamp: Date.now(),
        estimatedTime: estimatedTime
    };
    
    tasks.unshift(task);
    if (tasks.length > 8) tasks.pop();
    
    stats.tasksAssigned++;
    renderTasks();
}

// Update Task Statuses
function updateTaskStatuses() {
    let updated = false;
    
    tasks.forEach(task => {
        const age = (Date.now() - task.timestamp) / 1000;
        
        if (task.status === 'assigned' && age > 5 && Math.random() > 0.7) {
            task.status = 'progress';
            updated = true;
        } else if (task.status === 'progress' && age > 15 && Math.random() > 0.6) {
            task.status = 'completed';
            updated = true;
        }
    });
    
    if (updated) {
        renderTasks();
    }
}

// Generate Predictive Alerts
function generatePredictiveAlerts() {
    if (Math.random() > 0.85) {
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const confidence = Math.floor(Math.random() * 20) + 75;
        
        const alertMessages = {
            'Predicted Capacity Shortage': {
                desc: 'Assembly Line A projected to reach capacity in 45 minutes',
                action: 'Recommend preemptive worker reallocation'
            },
            'Equipment Performance Degradation': {
                desc: 'Welding Station D showing declining efficiency trend',
                action: 'Schedule preventive maintenance check'
            },
            'Material Inventory Low': {
                desc: 'Raw material levels for Packaging Line B below threshold',
                action: 'Initiate expedited procurement process'
            },
            'Quality Variance Detected': {
                desc: 'Quality Control C detecting higher rejection rate',
                action: 'Deploy quality assurance team for inspection'
            },
            'Maintenance Due Soon': {
                desc: 'Paint Shop E approaching scheduled maintenance window',
                action: 'Prepare maintenance crew and backup resources'
            }
        };
        
        const message = alertMessages[alertType];
        
        const alert = {
            type: alertType,
            description: message.desc,
            action: message.action,
            confidence: confidence,
            timestamp: Date.now()
        };
        
        alerts.unshift(alert);
        if (alerts.length > 6) alerts.pop();
        
        renderAlerts();
    }
}

// Trigger Manual Bottleneck
function triggerBottleneck() {
    const randomLine = productionLines[Math.floor(Math.random() * productionLines.length)];
    
    // Force bottleneck conditions
    randomLine.cycleTime = randomLine.cycleTime * 1.5;
    randomLine.efficiency = Math.min(randomLine.efficiency, 70);
    randomLine.queueLength = Math.max(randomLine.queueLength, 45);
    
    renderProductionLines();
    
    setTimeout(() => {
        detectBottleneck(randomLine, productionLines.indexOf(randomLine));
    }, 500);
}

// Render Decision Log
function renderDecisionLog() {
    const container = document.getElementById('decisionLog');
    
    if (decisionLog.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Waiting for AI decisions...</p>';
        return;
    }
    
    container.innerHTML = decisionLog.map(decision => `
        <div class="decision-entry">
            <div class="decision-timestamp">${formatTime(decision.timestamp)}</div>
            <div class="decision-event">🚨 ${decision.event}</div>
            <div class="decision-analysis">📊 Analysis: ${decision.analysis}</div>
            <div class="decision-action">✅ Action: ${decision.action}</div>
            <div class="decision-action">👤 Assigned to: ${decision.assignee}</div>
            <div class="decision-impact">⏱️ ${decision.impact}</div>
        </div>
    `).join('');
}

// Render Tasks
function renderTasks() {
    const container = document.getElementById('tasksSection');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No tasks assigned yet...</p>';
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="task-card">
            <div class="task-header">
                <div class="task-id">#${task.id}</div>
                <div class="priority priority-${task.priority}">${task.priority.toUpperCase()}</div>
            </div>
            <div class="task-assignee">👤 ${task.assignee}</div>
            <div class="task-description">${task.description} - ${task.line}</div>
            <div class="task-footer">
                <div style="color: var(--text-secondary);">${formatTime(task.timestamp)}</div>
                <div class="task-status status-${task.status}">${capitalizeFirst(task.status)}</div>
            </div>
        </div>
    `).join('');
}

// Render Alerts
function renderAlerts() {
    const container = document.getElementById('alertsSection');
    
    if (alerts.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No alerts at this time...</p>';
        return;
    }
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-card">
            <div class="alert-header">
                <div class="alert-type">⚠️ ${alert.type}</div>
                <div class="confidence">${alert.confidence}% confidence</div>
            </div>
            <div class="alert-description">${alert.description}</div>
            <div class="alert-action">💡 ${alert.action}</div>
        </div>
    `).join('');
}

// Update Stats
function updateStats() {
    document.getElementById('bottlenecksDetected').textContent = stats.bottlenecksDetected;
    document.getElementById('tasksAssigned').textContent = stats.tasksAssigned;
    document.getElementById('interventionsAvoided').textContent = stats.interventionsAvoided;
    
    if (stats.resolutionTimes.length > 0) {
        const avgResolution = stats.resolutionTimes.reduce((a, b) => a + b, 0) / stats.resolutionTimes.length;
        document.getElementById('avgResolution').textContent = avgResolution.toFixed(1);
    }
    
    if (stats.bottlenecksDetected > 0) {
        const improvement = Math.min(25, stats.bottlenecksDetected * 2 + Math.floor(Math.random() * 5));
        document.getElementById('efficiencyImprovement').textContent = improvement + '%';
    }
}

// Show Toast Notification
function showToast(title, message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Format Time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Capitalize First Letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Speed Control Handler
document.getElementById('speedControl').addEventListener('input', function() {
    if (simulationRunning) {
        pauseSimulation();
        setTimeout(startSimulation, 100);
    }
});

// Initialize on load
init();