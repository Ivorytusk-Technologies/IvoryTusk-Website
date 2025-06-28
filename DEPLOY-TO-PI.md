# 🚀 Deploy IvoryTusk Website to Raspberry Pi

## Quick Deployment Guide

### Step 1: Transfer Files to Pi

**Option A: Direct Copy (if you have physical access)**
```bash
# Copy the entire folder to a USB drive, then copy to Pi
# Or use rsync if Pi is on same network
```

**Option B: Git Clone (Recommended)**
```bash
# First, upload your code to GitHub, then on Pi:
git clone https://github.com/your-username/ivorytusk-website.git
cd ivorytusk-website
```

**Option C: Manual SCP (from your computer)**
```bash
# If Pi is accessible via network:
scp -r /Users/T/Desktop/IvoryTusk/Website pi@192.168.29.232:/home/pi/ivorytusk-website/
```

### Step 2: SSH into Pi and Setup

```bash
# SSH into your Raspberry Pi
ssh pi@192.168.29.232

# Navigate to project directory
cd /home/pi/ivorytusk-website

# Make setup script executable
chmod +x scripts/setup-localtunnel.sh

# Run the LocalTunnel setup
./scripts/setup-localtunnel.sh
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env
```

**Add your email configuration to .env:**
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
CONTACT_EMAIL=contact@ivorytusk.co.in
FROM_EMAIL=noreply@ivorytusk.co.in

# Server Configuration
PORT=3000
NODE_ENV=production
DOMAIN=ivorytusk.co.in

# LocalTunnel Configuration
TUNNEL_SUBDOMAIN=ivorytusk
USE_TUNNEL=true
```

### Step 4: Install Dependencies and Start

```bash
# Install Node.js dependencies
npm install

# Start the local server
npm start &

# Start the tunnel (in another terminal/screen session)
npm run tunnel:subdomain

# OR for persistent tunnel with PM2:
npm run tunnel:pm2
pm2 save
```

### Step 5: Get Your Public URL

```bash
# Check tunnel status and get URLs
npm run tunnel:status
npm run tunnel:urls

# You should see something like:
# Tunnel: https://ivorytusk.localtunnel.me
# Local: http://localhost:3000
```

### Step 6: Test Your Website

```bash
# Test local access
curl http://localhost:3000

# Test tunnel access (replace with your actual tunnel URL)
curl https://ivorytusk.localtunnel.me

# Test contact form by visiting the website
```

### Step 7: Configure Domain DNS

1. **Get your tunnel URL** from Step 5 (e.g., `ivorytusk.localtunnel.me`)
2. **Go to GoDaddy DNS Management**
3. **Create CNAME record:**
   - Type: `CNAME`
   - Name: `@` (for root domain) or `www`
   - Value: `ivorytusk.localtunnel.me` (your tunnel URL without https://)
   - TTL: `600` (10 minutes)

### Step 8: Monitor and Maintain

```bash
# Check all services
pm2 status

# View website logs
pm2 logs ivorytusk-website

# View tunnel logs
pm2 logs ivorytusk-tunnel

# Restart services if needed
pm2 restart ivorytusk-website
pm2 restart ivorytusk-tunnel

# Check tunnel status anytime
npm run tunnel:status
```

## 🎯 Success Indicators

✅ **Local server running**: `curl http://localhost:3000` returns website  
✅ **Tunnel active**: `curl https://your-tunnel-url` returns website  
✅ **Email working**: Contact form sends emails to contact@ivorytusk.co.in  
✅ **Domain resolving**: `https://ivorytusk.co.in` loads your website  

## 🆘 Troubleshooting

### If tunnel fails to start:
```bash
# Check if local server is running
curl http://localhost:3000

# Restart local server
pm2 restart ivorytusk-website

# Try tunnel again
npm run tunnel
```

### If emails don't work:
```bash
# Check .env configuration
cat .env

# Test email settings
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
transporter.verify().then(console.log).catch(console.error);
"
```

### If domain doesn't resolve:
```bash
# Check DNS resolution
nslookup ivorytusk.co.in

# Wait for DNS propagation (up to 24 hours)
# Verify CNAME record in GoDaddy points to tunnel URL
```

## 🔄 Keeping Tunnel Running

```bash
# Make sure PM2 starts on boot
pm2 startup
# Run the command PM2 outputs with sudo

# Save current PM2 processes
pm2 save

# Your tunnel will now automatically restart on Pi reboot!
```

---

## 📱 Quick Commands Reference

```bash
# Essential commands to remember:
npm run tunnel:status      # Check everything
npm run tunnel:urls        # Get access URLs  
pm2 status                # Check all processes
pm2 logs ivorytusk-tunnel # View tunnel logs
npm run tunnel:pm2        # Start persistent tunnel
```

Your IvoryTusk website will be live at your tunnel URL with zero port forwarding! 🚀