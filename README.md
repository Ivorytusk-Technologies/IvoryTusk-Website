# IvoryTusk Website

AI-First Voice Agent Solutions website built with Node.js and Express.

## Deployment Options

### Option 1: LocalTunnel (Recommended - No Port Forwarding Needed!)

**Advantages:**
- ✅ No router configuration required
- ✅ No port forwarding needed  
- ✅ Works behind any firewall/NAT
- ✅ Instant public access with HTTPS
- ✅ Perfect for Raspberry Pi behind home networks

### Option 2: Traditional Deployment with Port Forwarding

**Requirements:**
- Router port forwarding (80, 443 → Pi)
- Static IP or DuckDNS setup

---

## Quick Start (LocalTunnel - No Port Forwarding)

### Prerequisites
- Raspberry Pi with Raspbian OS
- Internet connection (no special network setup needed)
- Domain name: ivorytusk.co.in (for DNS configuration)

### 1. Deploy to Raspberry Pi
```bash
# Copy project files to Raspberry Pi
scp -r . pi@192.168.29.232:/home/pi/ivorytusk-website/

# SSH into Raspberry Pi
ssh pi@192.168.29.232

# Navigate to project directory
cd /home/pi/ivorytusk-website

# Run LocalTunnel setup (much simpler than traditional setup!)
chmod +x scripts/setup-localtunnel.sh
./scripts/setup-localtunnel.sh
```

### 2. Configure Environment
```bash
# Copy environment template and edit
cp .env.example .env
nano .env
```

Edit `.env` with your email configuration:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
CONTACT_EMAIL=contact@ivorytusk.co.in
```

### 3. Start LocalTunnel
```bash
# Install dependencies
npm install

# Start your website locally
npm start &

# In another terminal/session, start the tunnel
npm run tunnel:subdomain    # Try to get ivorytusk.localtunnel.me
# OR
npm run tunnel             # Get random subdomain

# For production (persistent tunnel)
npm run tunnel:pm2         # Start tunnel with PM2
pm2 save                   # Save PM2 configuration
```

### 4. Configure Domain DNS
```bash
# Note the tunnel URL from step 3 (e.g., ivorytusk.localtunnel.me)
# Then configure your domain at GoDaddy:
```

**GoDaddy DNS Settings:**
- Type: `CNAME`
- Name: `@` (or `www`)
- Value: `your-tunnel-url` (e.g., `ivorytusk.localtunnel.me`)
- TTL: `600` (10 minutes)

### 5. Test Access
1. **Direct Tunnel**: Visit your tunnel URL (e.g., `https://ivorytusk.localtunnel.me`)
2. **Custom Domain**: Visit `https://ivorytusk.co.in` (after DNS propagation)
3. **Test Form**: Submit the contact form to verify email delivery

---

## Traditional Deployment (Port Forwarding Method)

<details>
<summary>Click to expand traditional deployment instructions</summary>

### Prerequisites
- Router access for port forwarding
- Static IP or DuckDNS setup

### Network Configuration

#### Router Port Forwarding
Configure your router to forward these ports to 192.168.29.232:
- Port 80 (HTTP) → Pi:80  
- Port 443 (HTTPS) → Pi:443

#### DNS Configuration
Set up DNS records for ivorytusk.co.in:
```
Type: CNAME
Name: @
Value: rpipbx.duckdns.org
```

### Setup Commands
```bash
# Run traditional setup
./scripts/setup-raspberry-pi.sh

# Configure SSL
npm run setup-ssl
```

</details>

---

## Monitoring and Maintenance

### PM2 Commands
```bash
# View all processes
pm2 status

# Website logs
pm2 logs ivorytusk-website

# Tunnel logs (if using PM2 tunnel)
pm2 logs ivorytusk-tunnel

# Restart services
pm2 restart ivorytusk-website
pm2 restart ivorytusk-tunnel

# Stop services
pm2 stop ivorytusk-website
pm2 stop ivorytusk-tunnel
```

### LocalTunnel Management
```bash
# Check current tunnel info
cat tunnel-info.json

# Start tunnel manually
npm run tunnel

# Start persistent tunnel
npm run tunnel:pm2

# Stop tunnel
npm run tunnel:stop
```

### SSL Certificate Renewal
Certificates auto-renew monthly via cron job. Manual renewal:
```bash
sudo certbot renew
```

### System Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
npm update
```

## Troubleshooting

### Check Service Status
```bash
# Check if service is running
pm2 status

# Check system service
sudo systemctl status ivorytusk-website
```

### Check Logs
```bash
# Application logs
pm2 logs ivorytusk-website

# System logs
sudo journalctl -u ivorytusk-website -f
```

### Test Email Configuration
```bash
# Test email sending
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

### Common Issues

#### LocalTunnel Issues
1. **Tunnel not starting**
   - Check if local server is running: `curl http://localhost:3000`
   - Restart tunnel: `npm run tunnel`
   - Check logs: `pm2 logs ivorytusk-tunnel`

2. **Tunnel URL keeps changing**
   - Use subdomain option: `npm run tunnel:subdomain`
   - Update DNS when tunnel URL changes
   - Consider paid tunneling service for stable URLs

3. **Domain not resolving to tunnel**
   - Verify CNAME record points to tunnel URL
   - Check DNS propagation: `nslookup ivorytusk.co.in`
   - Wait for DNS cache to clear (up to 24 hours)

#### Traditional Deployment Issues
1. **External access not working**
   - Check router port forwarding
   - Verify DuckDNS configuration  
   - Check firewall settings: `sudo ufw status`

2. **SSL certificate issues**
   - Ensure ports 80/443 are accessible externally
   - Check domain DNS resolution
   - Run: `npm run setup-ssl` again

#### General Issues
3. **Email not working**
   - Verify SMTP credentials in `.env`
   - Check if using 2FA (need app-specific password)
   - Test email configuration

4. **Website not loading**
   - Check if server is running: `pm2 status`
   - Check server logs: `pm2 logs ivorytusk-website`
   - Restart server: `pm2 restart ivorytusk-website`

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### API Endpoints
- `GET /` - Website homepage
- `POST /api/contact` - Contact form submission
- `GET /api/health` - Health check

## Security Features

- Rate limiting on contact form (5 submissions per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- HTTPS enforcement in production
- Email delivery with anti-spam measures

## Support

For technical support or deployment issues:
- Email: contact@ivorytusk.co.in
- Check logs: `pm2 logs ivorytusk-website`