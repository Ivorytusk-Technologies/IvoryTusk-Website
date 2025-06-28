#!/usr/bin/env node

// Tunnel status and monitoring script

const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkTunnelStatus() {
    try {
        log('🔍 Checking IvoryTusk LocalTunnel Status...', 'blue');
        log('', 'reset');

        // Check if tunnel info file exists
        if (!fs.existsSync('tunnel-info.json')) {
            log('❌ No tunnel info found. Tunnel may not be running.', 'red');
            log('💡 Start tunnel with: npm run tunnel', 'yellow');
            return;
        }

        // Read tunnel info
        const tunnelInfo = JSON.parse(fs.readFileSync('tunnel-info.json', 'utf8'));
        log('📊 Tunnel Information:', 'cyan');
        log(`   URL: ${tunnelInfo.url}`, 'green');
        log(`   Local Port: ${tunnelInfo.port}`, 'cyan');
        log(`   Started: ${new Date(tunnelInfo.startTime).toLocaleString()}`, 'cyan');
        log(`   Subdomain: ${tunnelInfo.subdomain || 'Random'}`, 'cyan');
        log('', 'reset');

        // Check if local server is running
        try {
            const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${tunnelInfo.port}`);
            if (stdout.trim() === '200') {
                log('✅ Local server is running', 'green');
            } else {
                log(`⚠️  Local server returned status: ${stdout.trim()}`, 'yellow');
            }
        } catch (error) {
            log('❌ Local server is not responding', 'red');
        }

        // Check if tunnel URL is accessible
        try {
            const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" ${tunnelInfo.url}`);
            if (stdout.trim() === '200') {
                log('✅ Tunnel URL is accessible', 'green');
            } else {
                log(`⚠️  Tunnel URL returned status: ${stdout.trim()}`, 'yellow');
            }
        } catch (error) {
            log('❌ Tunnel URL is not accessible', 'red');
        }

        // Check PM2 tunnel process
        try {
            const { stdout } = await execAsync('pm2 list | grep ivorytusk-tunnel');
            if (stdout.includes('online')) {
                log('✅ PM2 tunnel process is running', 'green');
            } else if (stdout.includes('stopped')) {
                log('⚠️  PM2 tunnel process is stopped', 'yellow');
            } else {
                log('❌ PM2 tunnel process not found', 'red');
            }
        } catch (error) {
            log('ℹ️  PM2 tunnel process not found (may be running manually)', 'cyan');
        }

        // Check domain resolution (if configured)
        try {
            const { stdout } = await execAsync('nslookup ivorytusk.co.in');
            if (stdout.includes('localtunnel.me') || stdout.includes(tunnelInfo.url.replace('https://', '').replace('http://', ''))) {
                log('✅ Domain is pointing to tunnel', 'green');
            } else {
                log('ℹ️  Domain may not be configured yet', 'cyan');
            }
        } catch (error) {
            log('ℹ️  Could not check domain resolution', 'cyan');
        }

        log('', 'reset');
        log('🔧 Quick Commands:', 'blue');
        log(`   Test local: curl http://localhost:${tunnelInfo.port}`, 'cyan');
        log(`   Test tunnel: curl ${tunnelInfo.url}`, 'cyan');
        log('   Restart tunnel: npm run tunnel:pm2', 'cyan');
        log('   View logs: pm2 logs ivorytusk-tunnel', 'cyan');

    } catch (error) {
        log(`❌ Error checking tunnel status: ${error.message}`, 'red');
    }
}

// Show tunnel URLs for easy access
function showUrls() {
    try {
        if (fs.existsSync('tunnel-info.json')) {
            const tunnelInfo = JSON.parse(fs.readFileSync('tunnel-info.json', 'utf8'));
            log('🌐 Access URLs:', 'blue');
            log(`   Tunnel: ${tunnelInfo.url}`, 'green');
            log(`   Local: http://localhost:${tunnelInfo.port}`, 'cyan');
            if (tunnelInfo.subdomain) {
                log(`   Custom: https://ivorytusk.co.in (if DNS configured)`, 'yellow');
            }
        }
    } catch (error) {
        log('❌ Could not read tunnel info', 'red');
    }
}

// Main execution
const command = process.argv[2];

if (command === 'urls') {
    showUrls();
} else {
    checkTunnelStatus();
}