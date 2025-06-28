#!/usr/bin/env node

const localtunnel = require('localtunnel');
const { exec } = require('child_process');
require('dotenv').config();

// Colors for console output
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

async function startTunnel() {
    const port = process.env.PORT || 3000;
    const subdomain = process.argv.includes('--subdomain=ivorytusk') ? 'ivorytusk' : null;
    
    try {
        log('🚀 Starting LocalTunnel for IvoryTusk website...', 'blue');
        log(`Local server port: ${port}`, 'cyan');
        
        // Options for localtunnel
        const options = {
            port: port,
            local_host: '127.0.0.1'
        };
        
        // Add subdomain if specified
        if (subdomain) {
            options.subdomain = subdomain;
            log(`Requesting subdomain: ${subdomain}`, 'cyan');
        }
        
        // Start the tunnel
        const tunnel = await localtunnel(options);
        
        log('✅ Tunnel started successfully!', 'green');
        log(`🌐 Public URL: ${tunnel.url}`, 'green');
        log('', 'reset');
        
        // Save tunnel URL to file for other scripts
        const fs = require('fs');
        const tunnelInfo = {
            url: tunnel.url,
            subdomain: subdomain,
            port: port,
            startTime: new Date().toISOString(),
            localUrl: `http://localhost:${port}`
        };
        
        fs.writeFileSync('tunnel-info.json', JSON.stringify(tunnelInfo, null, 2));
        log('📝 Tunnel info saved to tunnel-info.json', 'yellow');
        log('', 'reset');
        
        // Instructions
        log('📋 Next steps:', 'blue');
        log('1. Configure your domain DNS:', 'yellow');
        log(`   - Create CNAME record: ivorytusk.co.in → ${tunnel.url.replace('https://', '').replace('http://', '')}`, 'cyan');
        log('   - Or use the tunnel URL directly for testing', 'cyan');
        log('', 'reset');
        log('2. Test your website:', 'yellow');
        log(`   - Direct tunnel access: ${tunnel.url}`, 'cyan');
        log(`   - Local access: http://localhost:${port}`, 'cyan');
        log('', 'reset');
        log('3. To keep tunnel running permanently:', 'yellow');
        log('   - Use: npm run tunnel:pm2', 'cyan');
        log('   - Or run this script in background: nohup npm run tunnel &', 'cyan');
        log('', 'reset');
        
        // Handle tunnel events
        tunnel.on('close', () => {
            log('⚠️  Tunnel closed', 'yellow');
            process.exit(0);
        });
        
        tunnel.on('error', (err) => {
            log(`❌ Tunnel error: ${err.message}`, 'red');
            process.exit(1);
        });
        
        // Handle process termination
        process.on('SIGINT', () => {
            log('', 'reset');
            log('🛑 Stopping tunnel...', 'yellow');
            tunnel.close();
        });
        
        process.on('SIGTERM', () => {
            log('🛑 Stopping tunnel...', 'yellow');
            tunnel.close();
        });
        
        // Keep the process running
        log('💡 Press Ctrl+C to stop the tunnel', 'yellow');
        log('📊 Tunnel is running and forwarding traffic...', 'green');
        
        // Ping to keep tunnel alive
        setInterval(() => {
            log(`📡 Tunnel active: ${tunnel.url} → localhost:${port}`, 'cyan');
        }, 30000); // Log every 30 seconds
        
    } catch (error) {
        log(`❌ Failed to start tunnel: ${error.message}`, 'red');
        
        if (error.message.includes('subdomain')) {
            log('💡 Tip: The subdomain might be taken. Try without --subdomain flag', 'yellow');
            log('   Command: npm run tunnel', 'cyan');
        }
        
        if (error.message.includes('ECONNREFUSED')) {
            log('💡 Make sure your local server is running first:', 'yellow');
            log('   Command: npm start', 'cyan');
        }
        
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    startTunnel();
}

module.exports = startTunnel;