#!/usr/bin/env node

// Enhanced LocalTunnel with Auto DNS Updates
// Combines tunnel startup with DNS monitoring and updates

const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
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

class EnhancedTunnel {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.subdomain = process.env.TUNNEL_SUBDOMAIN;
        this.autoUpdateDNS = process.env.AUTO_UPDATE_DNS !== 'false';
        this.tunnel = null;
        this.monitor = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 5000;
    }

    async startTunnel() {
        try {
            log('🚀 Starting Enhanced LocalTunnel...', 'blue');
            log(`📡 Port: ${this.port}`, 'cyan');
            
            const options = {
                port: this.port,
                local_host: '127.0.0.1'
            };
            
            if (this.subdomain) {
                options.subdomain = this.subdomain;
                log(`🎯 Requesting subdomain: ${this.subdomain}`, 'cyan');
            }
            
            this.tunnel = await localtunnel(options);
            
            log('✅ Tunnel started successfully!', 'green');
            log(`🌐 Public URL: ${this.tunnel.url}`, 'green');
            
            // Save tunnel info
            const tunnelInfo = {
                url: this.tunnel.url,
                subdomain: this.subdomain,
                port: this.port,
                startTime: new Date().toISOString(),
                localUrl: `http://localhost:${this.port}`,
                autoUpdateDNS: this.autoUpdateDNS
            };
            
            fs.writeFileSync('tunnel-info.json', JSON.stringify(tunnelInfo, null, 2));
            log('📝 Tunnel info saved to tunnel-info.json', 'cyan');
            
            // Reset reconnect counter on successful connection
            this.reconnectAttempts = 0;
            
            // Start DNS monitoring if enabled
            if (this.autoUpdateDNS) {
                this.startDNSMonitoring();
            }
            
            // Handle tunnel events
            this.tunnel.on('close', () => {
                log('⚠️  Tunnel closed', 'yellow');
                this.handleReconnect();
            });
            
            this.tunnel.on('error', (err) => {
                log(`❌ Tunnel error: ${err.message}`, 'red');
                this.handleReconnect();
            });
            
            // Initial DNS update
            if (this.autoUpdateDNS) {
                setTimeout(() => {
                    this.updateDNS(this.tunnel.url);
                }, 2000); // Wait 2 seconds after tunnel starts
            }
            
            return this.tunnel;
            
        } catch (error) {
            log(`❌ Failed to start tunnel: ${error.message}`, 'red');
            this.handleReconnect();
            throw error;
        }
    }

    startDNSMonitoring() {
        try {
            const monitorPath = path.join(__dirname, 'tunnel-monitor.js');
            
            log('🔍 Starting DNS monitoring...', 'blue');
            
            this.monitor = spawn('node', [monitorPath, 'start'], {
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            this.monitor.stdout.on('data', (data) => {
                // Filter out too verbose output, only show important messages
                const output = data.toString();
                if (output.includes('DNS') || output.includes('ERROR') || output.includes('✅') || output.includes('❌')) {
                    process.stdout.write(`[MONITOR] ${data}`);
                }
            });

            this.monitor.stderr.on('data', (data) => {
                process.stderr.write(`[MONITOR ERROR] ${data}`);
            });

            this.monitor.on('close', (code) => {
                if (code !== 0) {
                    log(`⚠️  DNS monitor exited with code: ${code}`, 'yellow');
                }
            });

            log('✅ DNS monitoring started', 'green');
            
        } catch (error) {
            log(`⚠️  Failed to start DNS monitoring: ${error.message}`, 'yellow');
        }
    }

    async updateDNS(tunnelUrl) {
        return new Promise((resolve) => {
            try {
                const updaterPath = path.join(__dirname, 'godaddy-dns-updater.js');
                
                log(`🔄 Triggering DNS update for: ${tunnelUrl}`, 'blue');
                
                const updater = spawn('node', [updaterPath, tunnelUrl], {
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                updater.stdout.on('data', (data) => {
                    process.stdout.write(`[DNS] ${data}`);
                });

                updater.stderr.on('data', (data) => {
                    process.stderr.write(`[DNS ERROR] ${data}`);
                });

                updater.on('close', (code) => {
                    if (code === 0) {
                        log('✅ DNS update completed', 'green');
                    } else {
                        log(`⚠️  DNS update failed with code: ${code}`, 'yellow');
                    }
                    resolve(code === 0);
                });

            } catch (error) {
                log(`❌ Error updating DNS: ${error.message}`, 'red');
                resolve(false);
            }
        });
    }

    handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            log(`❌ Max reconnect attempts reached (${this.maxReconnectAttempts})`, 'red');
            process.exit(1);
        }
        
        this.reconnectAttempts++;
        log(`🔄 Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectDelay/1000}s...`, 'yellow');
        
        setTimeout(() => {
            this.startTunnel().catch((error) => {
                log(`💥 Reconnect failed: ${error.message}`, 'red');
            });
        }, this.reconnectDelay);
    }

    stop() {
        log('🛑 Stopping enhanced tunnel...', 'yellow');
        
        if (this.monitor) {
            this.monitor.kill();
        }
        
        if (this.tunnel) {
            this.tunnel.close();
        }
        
        log('✅ Enhanced tunnel stopped', 'green');
    }
}

// Handle process termination
process.on('SIGTERM', () => {
    log('🛑 Received SIGTERM, stopping...', 'yellow');
    if (global.enhancedTunnel) {
        global.enhancedTunnel.stop();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    log('🛑 Received SIGINT, stopping...', 'yellow');
    if (global.enhancedTunnel) {
        global.enhancedTunnel.stop();
    }
    process.exit(0);
});

// Main execution
async function main() {
    try {
        const enhancedTunnel = new EnhancedTunnel();
        global.enhancedTunnel = enhancedTunnel;
        
        await enhancedTunnel.startTunnel();
        
        log('', 'reset');
        log('📋 Enhanced Tunnel Features:', 'blue');
        log('   ✅ Auto-reconnection on failures', 'cyan');
        log('   ✅ Automatic DNS updates (if configured)', 'cyan');
        log('   ✅ Real-time monitoring', 'cyan');
        log('   ✅ Persistent tunnel info logging', 'cyan');
        log('', 'reset');
        log('💡 Press Ctrl+C to stop the tunnel', 'yellow');
        
        // Keep process alive
        process.stdin.resume();
        
    } catch (error) {
        log(`💥 Enhanced tunnel failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Export for use as module
module.exports = EnhancedTunnel;

// Run if called directly
if (require.main === module) {
    main();
}