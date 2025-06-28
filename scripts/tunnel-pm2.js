#!/usr/bin/env node

// PM2 compatible tunnel script for persistent LocalTunnel connection

const localtunnel = require('localtunnel');
const fs = require('fs');
require('dotenv').config();

let tunnel = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // 5 seconds

async function startTunnel() {
    const port = process.env.PORT || 3000;
    const subdomain = process.env.TUNNEL_SUBDOMAIN || null;
    
    try {
        console.log(`[${new Date().toISOString()}] Starting LocalTunnel on port ${port}...`);
        
        const options = {
            port: port,
            local_host: '127.0.0.1'
        };
        
        if (subdomain) {
            options.subdomain = subdomain;
            console.log(`[${new Date().toISOString()}] Using subdomain: ${subdomain}`);
        }
        
        tunnel = await localtunnel(options);
        
        console.log(`[${new Date().toISOString()}] ✅ Tunnel active: ${tunnel.url}`);
        
        // Save tunnel info
        const tunnelInfo = {
            url: tunnel.url,
            subdomain: subdomain,
            port: port,
            startTime: new Date().toISOString(),
            pid: process.pid
        };
        
        fs.writeFileSync('tunnel-info.json', JSON.stringify(tunnelInfo, null, 2));
        
        // Reset reconnect counter on successful connection
        reconnectAttempts = 0;
        
        // Handle tunnel close
        tunnel.on('close', () => {
            console.log(`[${new Date().toISOString()}] ⚠️  Tunnel closed`);
            handleReconnect();
        });
        
        tunnel.on('error', (err) => {
            console.error(`[${new Date().toISOString()}] ❌ Tunnel error: ${err.message}`);
            handleReconnect();
        });
        
        // Keep-alive ping
        setInterval(() => {
            if (tunnel) {
                console.log(`[${new Date().toISOString()}] 📡 Tunnel heartbeat: ${tunnel.url}`);
            }
        }, 60000); // Every minute
        
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Failed to start tunnel: ${error.message}`);
        handleReconnect();
    }
}

function handleReconnect() {
    if (reconnectAttempts >= maxReconnectAttempts) {
        console.error(`[${new Date().toISOString()}] ❌ Max reconnect attempts reached. Exiting.`);
        process.exit(1);
    }
    
    reconnectAttempts++;
    console.log(`[${new Date().toISOString()}] 🔄 Reconnect attempt ${reconnectAttempts}/${maxReconnectAttempts} in ${reconnectDelay/1000}s...`);
    
    setTimeout(() => {
        startTunnel();
    }, reconnectDelay);
}

// Handle process termination
process.on('SIGTERM', () => {
    console.log(`[${new Date().toISOString()}] 🛑 Received SIGTERM, closing tunnel...`);
    if (tunnel) {
        tunnel.close();
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log(`[${new Date().toISOString()}] 🛑 Received SIGINT, closing tunnel...`);
    if (tunnel) {
        tunnel.close();
    }
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(`[${new Date().toISOString()}] 💥 Uncaught exception: ${error.message}`);
    handleReconnect();
});

// Start the tunnel
startTunnel();