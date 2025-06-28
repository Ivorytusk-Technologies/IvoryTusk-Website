# 🤖 GoDaddy Auto DNS Updates for LocalTunnel

## Overview

This system automatically updates your GoDaddy DNS records when your LocalTunnel URL changes, eliminating the need to manually update DNS every time the tunnel restarts.

## 🔧 Prerequisites

### 1. GoDaddy API Credentials

You need to get API credentials from GoDaddy:

1. **Go to GoDaddy Developer Portal**: https://developer.godaddy.com/
2. **Create an Account** or log in
3. **Generate API Keys**:
   - Go to "My Account" → "API Keys"
   - Click "Create New API Key"
   - Choose "Production" for live domains
   - Copy the **API Key** and **API Secret**

### 2. Configure Environment Variables

Add these to your `.env` file on the Pi:

```bash
# SSH into Pi and edit .env
ssh rpi@192.168.29.232
cd /home/rpi/ivorytusk-website
nano .env
```

**Add these lines:**
```env
# GoDaddy API for Automatic DNS Updates
GODADDY_API_KEY=your-actual-api-key-here
GODADDY_API_SECRET=your-actual-api-secret-here
DNS_RECORD_NAME=@
AUTO_UPDATE_DNS=true
TUNNEL_CHECK_INTERVAL=30000
```

## 🚀 Usage Options

### Option 1: Enhanced Tunnel (Recommended)
**All-in-one solution with auto DNS updates:**

```bash
# Start enhanced tunnel with auto DNS monitoring
npm run tunnel:enhanced

# For production (persistent with PM2)
npm run tunnel:enhanced:pm2
pm2 save
```

### Option 2: Manual DNS Management
**Use existing tunnel + manual DNS updates:**

```bash
# Update DNS for current tunnel URL
npm run dns:update

# Start continuous monitoring
npm run dns:monitor

# Check current status
npm run dns:monitor:status
```

### Option 3: Separate Components
**Run tunnel and DNS monitor separately:**

```bash
# Terminal 1: Start tunnel
npm run tunnel:pm2

# Terminal 2: Start DNS monitoring
npm run dns:monitor
```

## 📋 Available Commands

### Tunnel Commands
```bash
npm run tunnel:enhanced           # Enhanced tunnel with auto DNS
npm run tunnel:enhanced:pm2       # Enhanced tunnel with PM2
npm run tunnel:status            # Check tunnel status
npm run tunnel:urls              # Show current URLs
```

### DNS Management Commands
```bash
npm run dns:update               # Manual DNS update
npm run dns:monitor              # Start DNS monitoring
npm run dns:monitor:check        # One-time DNS check
npm run dns:monitor:status       # Show monitor status
```

## 🔍 How It Works

### 1. Tunnel URL Detection
- Monitors `tunnel-info.json` for URL changes
- Detects when LocalTunnel assigns new URLs
- Checks every 30 seconds (configurable)

### 2. Automatic DNS Updates
- Uses GoDaddy API to update CNAME records
- Updates `ivorytusk.co.in` → `new-tunnel-url.loca.lt`
- Sets TTL to 600 seconds (10 minutes) for fast propagation

### 3. Monitoring & Logging
- Logs all DNS changes with timestamps
- Saves update history in `last-dns-update.json`
- Provides real-time status updates

## 📊 Monitoring

### Check Current Status
```bash
# On Pi
ssh rpi@192.168.29.232
cd /home/rpi/ivorytusk-website

# Check PM2 processes
pm2 status

# Check tunnel URL
cat tunnel-info.json

# Check last DNS update
cat last-dns-update.json

# Monitor logs in real-time
pm2 logs ivorytusk-enhanced-tunnel
```

### Verify DNS Propagation
```bash
# Check if DNS has updated
nslookup ivorytusk.co.in

# Test website access
curl -I https://ivorytusk.co.in
```

## ⚙️ Configuration Options

### Environment Variables
```env
GODADDY_API_KEY=your-key            # GoDaddy API key
GODADDY_API_SECRET=your-secret      # GoDaddy API secret
DNS_RECORD_NAME=@                   # DNS record name (@ for root domain)
AUTO_UPDATE_DNS=true                # Enable auto DNS updates
TUNNEL_CHECK_INTERVAL=30000         # Check interval in milliseconds
TUNNEL_SUBDOMAIN=ivorytusk          # Preferred tunnel subdomain
DOMAIN=ivorytusk.co.in              # Your domain name
```

### Manual Configuration
```bash
# Edit configuration
nano .env

# Restart services to apply changes
pm2 restart all
```

## 🛠️ Troubleshooting

### DNS Update Fails
```bash
# Test API credentials
npm run dns:update

# Check error logs
pm2 logs ivorytusk-enhanced-tunnel --err

# Verify GoDaddy API access
curl -H "Authorization: sso-key YOUR_KEY:YOUR_SECRET" \
     https://api.godaddy.com/v1/domains/ivorytusk.co.in
```

### Tunnel URL Not Updating
```bash
# Check tunnel status
npm run tunnel:status

# Restart tunnel
pm2 restart ivorytusk-enhanced-tunnel

# Check monitoring
npm run dns:monitor:status
```

### DNS Not Propagating
```bash
# Check current DNS record
nslookup ivorytusk.co.in 8.8.8.8

# Force DNS update
npm run dns:update

# Wait for propagation (5-30 minutes)
```

## 🔐 Security Notes

- **API Keys**: Store securely, never commit to version control
- **Permissions**: GoDaddy API keys only need DNS record permissions
- **Rate Limits**: GoDaddy API has rate limits (60 requests/minute)
- **Backup**: Keep manual DNS update capability as backup

## 🎯 Benefits

✅ **Automatic**: No manual DNS updates needed  
✅ **Fast**: Updates DNS within 30 seconds of tunnel changes  
✅ **Reliable**: Built-in error handling and retries  
✅ **Monitoring**: Real-time status and logging  
✅ **Production Ready**: PM2 integration for uptime  

## 📈 Next Steps

1. **Get GoDaddy API Keys** from developer portal
2. **Configure .env** with your API credentials  
3. **Start Enhanced Tunnel**: `npm run tunnel:enhanced:pm2`
4. **Save PM2 Config**: `pm2 save`
5. **Test**: Change tunnel and watch DNS auto-update!

Your domain will now automatically point to your latest tunnel URL! 🎉