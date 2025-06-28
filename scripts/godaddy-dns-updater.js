#!/usr/bin/env node

// GoDaddy DNS Auto-Updater for LocalTunnel URLs
// Automatically updates CNAME records when tunnel URL changes

const https = require('https');
const fs = require('fs');
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

class GoDaddyDNSUpdater {
    constructor() {
        this.apiKey = process.env.GODADDY_API_KEY;
        this.apiSecret = process.env.GODADDY_API_SECRET;
        this.domain = process.env.DOMAIN || 'ivorytusk.co.in';
        this.recordName = process.env.DNS_RECORD_NAME || '@';
        this.apiUrl = 'api.godaddy.com';
        
        if (!this.apiKey || !this.apiSecret) {
            log('Missing GoDaddy API credentials. Please set GODADDY_API_KEY and GODADDY_API_SECRET in .env', 'red');
            process.exit(1);
        }
    }

    makeRequest(method, path, data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.apiUrl,
                port: 443,
                path: path,
                method: method,
                headers: {
                    'Authorization': `sso-key ${this.apiKey}:${this.apiSecret}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (data) {
                const jsonData = JSON.stringify(data);
                options.headers['Content-Length'] = Buffer.byteLength(jsonData);
            }

            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = responseData ? JSON.parse(responseData) : {};
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(response);
                        } else {
                            reject(new Error(`API Error ${res.statusCode}: ${responseData}`));
                        }
                    } catch (error) {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve({}); // Success with no content
                        } else {
                            reject(new Error(`Parse Error: ${error.message}`));
                        }
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async getCurrentRecord() {
        try {
            const path = `/v1/domains/${this.domain}/records/CNAME/${this.recordName}`;
            const records = await this.makeRequest('GET', path);
            return records.length > 0 ? records[0] : null;
        } catch (error) {
            log(`Error getting current record: ${error.message}`, 'red');
            return null;
        }
    }

    async updateRecord(newValue) {
        try {
            // Remove https:// and trailing slashes from tunnel URL
            const cleanValue = newValue.replace(/^https?:\/\//, '').replace(/\/$/, '');
            
            const path = `/v1/domains/${this.domain}/records/CNAME/${this.recordName}`;
            const data = [{
                type: 'CNAME',
                name: this.recordName,
                data: cleanValue,
                ttl: 600 // 10 minutes
            }];

            await this.makeRequest('PUT', path, data);
            log(`✅ Successfully updated DNS record: ${this.recordName}.${this.domain} → ${cleanValue}`, 'green');
            
            // Save last update info
            const updateInfo = {
                domain: this.domain,
                record: this.recordName,
                value: cleanValue,
                timestamp: new Date().toISOString(),
                tunnelUrl: newValue
            };
            
            fs.writeFileSync('last-dns-update.json', JSON.stringify(updateInfo, null, 2));
            return true;
        } catch (error) {
            log(`❌ Error updating DNS record: ${error.message}`, 'red');
            return false;
        }
    }

    async checkAndUpdate(newTunnelUrl) {
        try {
            log(`🔍 Checking DNS update for: ${newTunnelUrl}`, 'blue');
            
            // Get current record
            const currentRecord = await this.getCurrentRecord();
            const currentValue = currentRecord ? currentRecord.data : null;
            
            // Clean new tunnel URL for comparison
            const newValue = newTunnelUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            
            if (currentValue === newValue) {
                log(`ℹ️  DNS record already points to: ${newValue}`, 'cyan');
                return false;
            }
            
            log(`🔄 DNS update needed: ${currentValue} → ${newValue}`, 'yellow');
            return await this.updateRecord(newTunnelUrl);
            
        } catch (error) {
            log(`❌ Error in check and update: ${error.message}`, 'red');
            return false;
        }
    }

    async verifyCredentials() {
        try {
            const path = `/v1/domains/${this.domain}`;
            await this.makeRequest('GET', path);
            log(`✅ GoDaddy API credentials verified for domain: ${this.domain}`, 'green');
            return true;
        } catch (error) {
            log(`❌ Failed to verify GoDaddy API credentials: ${error.message}`, 'red');
            return false;
        }
    }
}

// Main execution
async function main() {
    const updater = new GoDaddyDNSUpdater();
    
    // Get tunnel URL from command line or tunnel-info.json
    let tunnelUrl = process.argv[2];
    
    if (!tunnelUrl) {
        try {
            const tunnelInfo = JSON.parse(fs.readFileSync('tunnel-info.json', 'utf8'));
            tunnelUrl = tunnelInfo.url;
        } catch (error) {
            log('❌ No tunnel URL provided and no tunnel-info.json found', 'red');
            log('Usage: node godaddy-dns-updater.js <tunnel-url>', 'yellow');
            log('Or place tunnel URL in tunnel-info.json', 'yellow');
            process.exit(1);
        }
    }
    
    if (!tunnelUrl) {
        log('❌ No tunnel URL found', 'red');
        process.exit(1);
    }
    
    log(`🚀 Starting DNS update for tunnel: ${tunnelUrl}`, 'blue');
    
    // Verify credentials first
    if (!(await updater.verifyCredentials())) {
        process.exit(1);
    }
    
    // Perform update
    const success = await updater.checkAndUpdate(tunnelUrl);
    
    if (success) {
        log('🎉 DNS update completed successfully!', 'green');
        log(`🌐 Your domain should now point to: ${tunnelUrl}`, 'green');
        log('⏰ DNS propagation may take 5-30 minutes', 'yellow');
    } else {
        log('ℹ️  No DNS update was needed', 'cyan');
    }
}

// Export for use in other scripts
module.exports = GoDaddyDNSUpdater;

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        log(`💥 Unexpected error: ${error.message}`, 'red');
        process.exit(1);
    });
}