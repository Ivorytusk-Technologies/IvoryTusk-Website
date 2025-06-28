#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupSSL() {
    try {
        log('🔒 Setting up SSL certificates for IvoryTusk website...', 'blue');

        // Load environment variables
        require('dotenv').config();

        const domain = process.env.SSL_DOMAIN || process.env.DOMAIN || 'ivorytusk.co.in';
        const email = process.env.SSL_EMAIL || process.env.CONTACT_EMAIL || 'admin@ivorytusk.co.in';

        log(`Domain: ${domain}`, 'blue');
        log(`Email: ${email}`, 'blue');

        // Check if certbot is installed
        try {
            await execAsync('which certbot');
            log('✓ Certbot is installed', 'green');
        } catch (error) {
            log('✗ Certbot is not installed. Installing...', 'red');
            await execAsync('sudo apt update && sudo apt install -y certbot');
            log('✓ Certbot installed successfully', 'green');
        }

        // Stop any running web server
        log('Stopping web server for certificate generation...', 'yellow');
        try {
            await execAsync('pm2 stop ivorytusk-website');
        } catch (error) {
            log('No PM2 process found, continuing...', 'yellow');
        }

        // Generate SSL certificate
        log('Generating SSL certificate...', 'blue');
        const certbotCommand = `sudo certbot certonly --standalone --agree-tos --non-interactive --email ${email} -d ${domain}`;
        
        try {
            const { stdout, stderr } = await execAsync(certbotCommand);
            log(stdout, 'green');
            if (stderr) log(stderr, 'yellow');
            log('✓ SSL certificate generated successfully', 'green');
        } catch (error) {
            log(`✗ Failed to generate SSL certificate: ${error.message}`, 'red');
            throw error;
        }

        // Create SSL directory in project
        const sslDir = path.join(process.cwd(), 'ssl');
        if (!fs.existsSync(sslDir)) {
            fs.mkdirSync(sslDir);
        }

        // Copy certificates to project directory
        log('Copying certificates to project directory...', 'blue');
        const certPath = `/etc/letsencrypt/live/${domain}`;
        
        try {
            await execAsync(`sudo cp ${certPath}/privkey.pem ${sslDir}/`);
            await execAsync(`sudo cp ${certPath}/fullchain.pem ${sslDir}/`);
            await execAsync(`sudo chown pi:pi ${sslDir}/*.pem`);
            log('✓ Certificates copied successfully', 'green');
        } catch (error) {
            log(`✗ Failed to copy certificates: ${error.message}`, 'red');
            throw error;
        }

        // Set up auto-renewal
        log('Setting up auto-renewal...', 'blue');
        const renewalScript = `#!/bin/bash
# Auto-renewal script for SSL certificates

certbot renew --quiet --pre-hook "pm2 stop ivorytusk-website" --post-hook "cp /etc/letsencrypt/live/${domain}/*.pem /home/pi/ivorytusk-website/ssl/ && chown pi:pi /home/pi/ivorytusk-website/ssl/*.pem && pm2 start ivorytusk-website"
`;

        fs.writeFileSync('/tmp/renewal-script.sh', renewalScript);
        await execAsync('sudo mv /tmp/renewal-script.sh /etc/cron.monthly/ivorytusk-ssl-renewal');
        await execAsync('sudo chmod +x /etc/cron.monthly/ivorytusk-ssl-renewal');

        log('✓ Auto-renewal cron job created', 'green');

        // Restart web server
        log('Restarting web server with SSL...', 'blue');
        try {
            await execAsync('pm2 start ivorytusk-website');
            log('✓ Web server restarted with SSL', 'green');
        } catch (error) {
            log('You can start the server manually with: pm2 start ecosystem.config.js', 'yellow');
        }

        log('🎉 SSL setup completed successfully!', 'green');
        log(`Your website should now be accessible at https://${domain}`, 'green');

    } catch (error) {
        log(`❌ SSL setup failed: ${error.message}`, 'red');
        log('Please check the error messages above and try again.', 'yellow');
        process.exit(1);
    }
}

// Run the setup
if (require.main === module) {
    setupSSL();
}

module.exports = setupSSL;