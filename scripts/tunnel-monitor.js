#!/usr/bin/env node

// LocalTunnel URL Monitor with Auto DNS Updates
// Monitors tunnel URL changes and automatically updates GoDaddy DNS

const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
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
    console.log(`${colors[color]}[${new Date().toISOString()}] ${message}${colors.reset}`);
}

class TunnelMonitor {
    constructor() {
        this.checkInterval = parseInt(process.env.TUNNEL_CHECK_INTERVAL) || 30000; // 30 seconds
        this.lastKnownUrl = null;
        this.tunnelInfoFile = 'tunnel-info.json';
        this.dnsUpdaterPath = path.join(__dirname, 'godaddy-dns-updater.js');
        this.autoUpdateDNS = process.env.AUTO_UPDATE_DNS !== 'false'; // Default to true
        this.running = false;
        
        // Load last known URL
        this.loadLastKnownUrl();
    }

    loadLastKnownUrl() {
        try {
            if (fs.existsSync(this.tunnelInfoFile)) {
                const tunnelInfo = JSON.parse(fs.readFileSync(this.tunnelInfoFile, 'utf8'));
                this.lastKnownUrl = tunnelInfo.url;
                log(`📖 Loaded last known URL: ${this.lastKnownUrl}`, 'cyan');
            }
        } catch (error) {
            log(`⚠️  Error loading last known URL: ${error.message}`, 'yellow');
        }
    }

    getCurrentTunnelUrl() {
        try {
            if (!fs.existsSync(this.tunnelInfoFile)) {
                return null;
            }
            
            const tunnelInfo = JSON.parse(fs.readFileSync(this.tunnelInfoFile, 'utf8'));
            return tunnelInfo.url;
        } catch (error) {
            log(`❌ Error reading tunnel info: ${error.message}`, 'red');
            return null;
        }
    }

    async updateDNS(tunnelUrl) {
        return new Promise((resolve) => {
            log(`🔄 Updating DNS for: ${tunnelUrl}`, 'blue');
            
            const dnsUpdater = spawn('node', [this.dnsUpdaterPath, tunnelUrl], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let output = '';
            let errorOutput = '';

            dnsUpdater.stdout.on('data', (data) => {
                output += data.toString();
                // Forward output in real-time
                process.stdout.write(data);
            });

            dnsUpdater.stderr.on('data', (data) => {
                errorOutput += data.toString();
                // Forward error output in real-time
                process.stderr.write(data);
            });

            dnsUpdater.on('close', (code) => {
                if (code === 0) {
                    log('✅ DNS update completed successfully', 'green');
                    resolve(true);
                } else {
                    log(`❌ DNS update failed with code: ${code}`, 'red');
                    if (errorOutput) {
                        log(`Error details: ${errorOutput}`, 'red');
                    }
                    resolve(false);
                }
            });

            dnsUpdater.on('error', (error) => {
                log(`💥 Error spawning DNS updater: ${error.message}`, 'red');
                resolve(false);
            });
        });
    }

    async checkForChanges() {
        const currentUrl = this.getCurrentTunnelUrl();
        
        if (!currentUrl) {
            // log('ℹ️  No tunnel URL found, waiting...', 'cyan');
            return;
        }

        if (currentUrl !== this.lastKnownUrl) {
            log('🔄 Tunnel URL changed!', 'yellow');
            log(`   Old: ${this.lastKnownUrl || 'none'}`, 'yellow');
            log(`   New: ${currentUrl}`, 'yellow');
            
            // Update DNS if auto-update is enabled
            if (this.autoUpdateDNS) {
                const success = await this.updateDNS(currentUrl);
                if (success) {
                    log('🎉 DNS updated successfully for new tunnel URL', 'green');
                } else {
                    log('⚠️  DNS update failed, but continuing monitoring...', 'yellow');
                }
            } else {
                log('ℹ️  Auto-DNS update disabled. Update manually if needed.', 'cyan');
            }
            
            // Update last known URL
            this.lastKnownUrl = currentUrl;
            
            // Save to file for persistence
            try {
                const statusFile = 'tunnel-monitor-status.json';
                const status = {
                    lastKnownUrl: this.lastKnownUrl,
                    lastCheck: new Date().toISOString(),
                    autoUpdateDNS: this.autoUpdateDNS
                };
                fs.writeFileSync(statusFile, JSON.stringify(status, null, 2));
            } catch (error) {
                log(`⚠️  Error saving status: ${error.message}`, 'yellow');
            }
        } else {
            // Periodic confirmation (every 10 minutes)
            if (Date.now() % (10 * 60 * 1000) < this.checkInterval) {
                log(`✅ Tunnel stable: ${currentUrl}`, 'green');
            }
        }
    }

    start() {
        if (this.running) {
            log('⚠️  Monitor is already running', 'yellow');
            return;
        }

        this.running = true;
        log('🚀 Starting tunnel URL monitor...', 'blue');
        log(`⏰ Check interval: ${this.checkInterval/1000} seconds`, 'cyan');
        log(`🔧 Auto DNS update: ${this.autoUpdateDNS ? 'enabled' : 'disabled'}`, 'cyan');
        
        // Initial check
        this.checkForChanges();
        
        // Set up periodic checking
        this.intervalId = setInterval(() => {
            this.checkForChanges();
        }, this.checkInterval);

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            this.stop();
        });

        process.on('SIGTERM', () => {
            this.stop();
        });

        log('✅ Monitor started successfully', 'green');
        log('💡 Press Ctrl+C to stop monitoring', 'cyan');
    }

    stop() {
        if (!this.running) {
            return;
        }

        log('🛑 Stopping tunnel monitor...', 'yellow');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        this.running = false;
        log('✅ Monitor stopped', 'green');
        process.exit(0);
    }

    // Manual trigger for DNS update
    async triggerDNSUpdate() {
        const currentUrl = this.getCurrentTunnelUrl();
        if (!currentUrl) {
            log('❌ No tunnel URL found to update', 'red');
            return false;
        }

        log('🔄 Manually triggering DNS update...', 'blue');
        return await this.updateDNS(currentUrl);
    }
}

// CLI interface
async function main() {
    const monitor = new TunnelMonitor();
    const command = process.argv[2];

    switch (command) {
        case 'start':
            monitor.start();
            break;
        
        case 'check':
            log('🔍 Performing one-time check...', 'blue');
            await monitor.checkForChanges();
            break;
        
        case 'update-dns':
            const success = await monitor.triggerDNSUpdate();
            process.exit(success ? 0 : 1);
            break;
        
        case 'status':
            try {
                const statusFile = 'tunnel-monitor-status.json';
                if (fs.existsSync(statusFile)) {
                    const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
                    log('📊 Monitor Status:', 'blue');
                    log(`   Last Known URL: ${status.lastKnownUrl}`, 'cyan');
                    log(`   Last Check: ${status.lastCheck}`, 'cyan');
                    log(`   Auto DNS Update: ${status.autoUpdateDNS}`, 'cyan');
                } else {
                    log('ℹ️  No status file found', 'cyan');
                }
            } catch (error) {
                log(`❌ Error reading status: ${error.message}`, 'red');
            }
            break;
        
        default:
            log('🔧 Tunnel URL Monitor Commands:', 'blue');
            log('   start       - Start continuous monitoring', 'cyan');
            log('   check       - Perform one-time check', 'cyan');
            log('   update-dns  - Manually trigger DNS update', 'cyan');
            log('   status      - Show current status', 'cyan');
            log('', 'reset');
            log('Environment Variables:', 'blue');
            log('   TUNNEL_CHECK_INTERVAL - Check interval in ms (default: 30000)', 'cyan');
            log('   AUTO_UPDATE_DNS       - Enable auto DNS updates (default: true)', 'cyan');
            process.exit(1);
    }
}

// Export for use in other scripts
module.exports = TunnelMonitor;

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        log(`💥 Unexpected error: ${error.message}`, 'red');
        process.exit(1);
    });
}