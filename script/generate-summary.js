const fs = require('fs');
const path = require('path');

// Function to analyze Newman JSON results
function analyzeResults(jsonFile) {
    if (!fs.existsSync(jsonFile)) {
        return null;
    }

    const results = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    const { run } = results;

    // Calculate performance metrics
    const totalRequests = run.stats.requests.total;
    const failedRequests = run.stats.requests.failed;
    const successRate = ((totalRequests - failedRequests) / totalRequests * 100).toFixed(2);

    // Calculate response times
    const responseTimes = [];
    run.executions.forEach(execution => {
        if (execution.response && execution.response.responseTime) {
            responseTimes.push(execution.response.responseTime);
        }
    });

    const avgResponseTime = responseTimes.length > 0 ? 
        (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 0;
    
    const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
    const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

    // Calculate percentiles
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const p95 = sortedTimes.length > 0 ? 
        sortedTimes[Math.floor(sortedTimes.length * 0.95)] : 0;
    const p99 = sortedTimes.length > 0 ? 
        sortedTimes[Math.floor(sortedTimes.length * 0.99)] : 0;

    return {
        totalRequests,
        failedRequests,
        successRate,
        avgResponseTime,
        minResponseTime,
        maxResponseTime,
        p95ResponseTime: p95,
        p99ResponseTime: p99,
        totalTime: run.timings.completed - run.timings.started
    };
}

// Generate HTML dashboard
function generateHTMLDashboard(performanceData, loadTestData) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Performance Dashboard</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; color: #2c3e50; margin-bottom: 30px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #3498db; }
        .metric-value { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .metric-label { color: #7f8c8d; font-size: 0.9em; text-transform: uppercase; }
        .success { border-left-color: #27ae60; }
        .warning { border-left-color: #f39c12; }
        .error { border-left-color: #e74c3c; }
        .reports-section { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .report-link { display: inline-block; margin: 10px; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
        .report-link:hover { background: #2980b9; }
        .timestamp { text-align: center; color: #7f8c8d; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 API Performance Dashboard</h1>
            <p>Automated performance testing results</p>
        </div>
        
        ${performanceData ? `
        <h2>Performance Test Results</h2>
        <div class="metrics-grid">
            <div class="metric-card ${performanceData.successRate >= 95 ? 'success' : performanceData.successRate >= 80 ? 'warning' : 'error'}">
                <div class="metric-value">${performanceData.successRate}%</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${performanceData.avgResponseTime}ms</div>
                <div class="metric-label">Avg Response Time</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${performanceData.p95ResponseTime}ms</div>
                <div class="metric-label">95th Percentile</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${performanceData.totalRequests}</div>
                <div class="metric-label">Total Requests</div>
            </div>
        </div>
        ` : ''}
        
        ${loadTestData ? `
        <h2>Load Test Results</h2>
        <div class="metrics-grid">
            <div class="metric-card ${loadTestData.successRate >= 95 ? 'success' : loadTestData.successRate >= 80 ? 'warning' : 'error'}">
                <div class="metric-value">${loadTestData.successRate}%</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${loadTestData.avgResponseTime}ms</div>
                <div class="metric-label">Avg Response Time</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${loadTestData.maxResponseTime}ms</div>
                <div class="metric-label">Max Response Time</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${loadTestData.totalRequests}</div>
                <div class="metric-label">Total Requests</div>
            </div>
        </div>
        ` : ''}
        
        <div class="reports-section">
            <h2>📊 Detailed Reports</h2>
            <a href="performance-report.html" class="report-link">Performance Test Report</a>
            <a href="load-test-report.html" class="report-link">Load Test Report</a>
        </div>
        
        <div class="timestamp">
            Last updated: ${new Date().toISOString()}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync('reports/index.html', html);
}

// Generate markdown summary for GitHub comments
function generateMarkdownSummary(performanceData, loadTestData) {
    let markdown = `
### Performance Test Results
${performanceData ? `
| Metric | Value | Status |
|--------|--------|--------|
| Success Rate | ${performanceData.successRate}% | ${performanceData.successRate >= 95 ? '✅' : performanceData.successRate >= 80 ? '⚠️' : '❌'} |
| Avg Response Time | ${performanceData.avgResponseTime}ms | ${performanceData.avgResponseTime <= 1000 ? '✅' : performanceData.avgResponseTime <= 3000 ? '⚠️' : '❌'} |
| 95th Percentile | ${performanceData.p95ResponseTime}ms | ${performanceData.p95ResponseTime <= 2000 ? '✅' : performanceData.p95ResponseTime <= 5000 ? '⚠️' : '❌'} |
| Total Requests | ${performanceData.totalRequests} | ℹ️ |
| Failed Requests | ${performanceData.failedRequests} | ${performanceData.failedRequests === 0 ? '✅' : '❌'} |
` : 'No performance test data available'}

### Load Test Results
${loadTestData ? `
| Metric | Value | Status |
|--------|--------|--------|
| Success Rate | ${loadTestData.successRate}% | ${loadTestData.successRate >= 95 ? '✅' : loadTestData.successRate >= 80 ? '⚠️' : '❌'} |
| Avg Response Time | ${loadTestData.avgResponseTime}ms | ${loadTestData.avgResponseTime <= 1000 ? '✅' : loadTestData.avgResponseTime <= 3000 ? '⚠️' : '❌'} |
| Max Response Time | ${loadTestData.maxResponseTime}ms | ${loadTestData.maxResponseTime <= 5000 ? '✅' : loadTestData.maxResponseTime <= 10000 ? '⚠️' : '❌'} |
| Total Requests | ${loadTestData.totalRequests} | ℹ️ |
` : 'No load test data available'}

🔗 [View detailed reports](https://yourusername.github.io/your-repo/performance-reports/)
`;

    fs.writeFileSync('reports/summary.md', markdown);
}

// Main execution
try {
    console.log('Generating performance summary...');
    
    const performanceData = analyzeResults('reports/performance-results.json');
    const loadTestData = analyzeResults('reports/load-test-results.json');
    
    generateHTMLDashboard(performanceData, loadTestData);
    generateMarkdownSummary(performanceData, loadTestData);
    
    console.log('Performance summary generated successfully!');
    
    // Output summary to console for GitHub Actions
    if (performanceData) {
        console.log(`Performance Test - Success Rate: ${performanceData.successRate}%, Avg Response Time: ${performanceData.avgResponseTime}ms`);
    }
    if (loadTestData) {
        console.log(`Load Test - Success Rate: ${loadTestData.successRate}%, Avg Response Time: ${loadTestData.avgResponseTime}ms`);
    }
    
} catch (error) {
    console.error('Error generating summary:', error);
    process.exit(1);
}