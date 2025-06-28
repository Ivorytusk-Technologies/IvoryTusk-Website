# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for IvoryTusk, an AI voice agent solutions company. The website is built as a single-page application using vanilla HTML, CSS, and JavaScript without any build tools or frameworks.

## Architecture

### File Structure
- `index.html` - Main website file containing all HTML, CSS, and JavaScript
- `ivorytusk-website/assets/logo.svg` - Company logo in SVG format
- `.htaccess` - Apache server configuration for HTTPS redirect and clean URLs

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS custom properties (variables) for theming
- **Deployment**: Static files served via Apache (based on .htaccess presence)

### Design System
The website uses a consistent color scheme defined in CSS custom properties:
- Primary colors: `--primary-color: #B7472A`, `--primary-light: #CD853F`, `--primary-dark: #8B3A2B`
- Background colors: Dark theme with `--bg-dark: #1a1a1a`, `--bg-light: #252525`
- Glass morphism effects with backdrop-filter and rgba colors
- Responsive design with mobile-first approach

## Development Commands

This project now uses Node.js with Express for both development and production:

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server with nodemon
npm start            # Start production server
```

### Production Deployment (Raspberry Pi)
```bash
./scripts/setup-raspberry-pi.sh    # Initial Pi setup
npm run setup-ssl                  # Configure SSL certificates
npm run pm2:start                  # Start with PM2 process manager
npm run pm2:logs                   # View application logs
npm run pm2:restart                # Restart application
```

### Testing
```bash
curl http://localhost:3000/api/health    # Health check
npm test                                 # Run tests (if configured)
```

## Key Components

### Interactive Features
- **Mobile Navigation**: Hamburger menu with toggle functionality
- **Smooth Scrolling**: Anchor-based navigation with smooth scroll behavior
- **Contact Form**: Form submission with validation and success/error handling
- **Chatbot Widget**: Interactive FAQ chatbot with predefined responses
- **Scroll Effects**: Header background changes on scroll, intersection observer for animations

### Backend Architecture
- **Express.js Server**: Serves static files and handles API endpoints
- **Contact Form API**: `/api/contact` endpoint with email delivery via Nodemailer
- **Security**: Rate limiting, input validation, CORS, and Helmet.js security headers
- **Email System**: SMTP configuration for sending inquiries to contact@ivorytusk.co.in

### Form Handling
The contact form now uses a real API endpoint:
- Frontend submits to `/api/contact` via fetch
- Backend validates input and sends email via Nodemailer
- Rate limiting: 5 submissions per 15 minutes per IP
- Form validation includes name, email, use-case, and optional fields

### Chatbot System
The chatbot uses keyword-based matching for FAQ responses. The FAQ responses object (lines 1325-1335) can be expanded to handle more queries. For advanced functionality, consider integrating with actual AI services.

## Content Management

### Text Content
All website copy is hardcoded in the HTML. To update:
- Company information: Update meta tags, headings, and content sections
- Contact details: Modify contact section and footer
- Features/services: Update features grid and platform section

### Images and Assets
- Logo: SVG format in `ivorytusk-website/assets/logo.svg`
- Inline SVG icons used throughout for performance
- Favicon is defined as inline SVG in data URI format

## Browser Compatibility

The website uses modern CSS and JavaScript features:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Backdrop-filter for glass effects (may need fallbacks for older browsers)
- IntersectionObserver API for scroll animations
- ES6+ JavaScript features

## Performance Considerations

- Single file architecture reduces HTTP requests
- Inline SVG for icons and logos
- CSS animations use transform and opacity for GPU acceleration
- Lazy loading and intersection observer for performance
- Minification not implemented (consider for production)

## Security Notes

- Form submission needs CSRF protection when implementing backend
- Contact form data should be sanitized server-side
- .htaccess enforces HTTPS redirect
- No external dependencies reduce security surface area

## Deployment Instructions

### Raspberry Pi Setup
1. **Prepare Environment**:
   ```bash
   scp -r . pi@192.168.29.232:/home/pi/ivorytusk-website/
   ssh pi@192.168.29.232
   cd /home/pi/ivorytusk-website
   ```

2. **Run Setup Script**:
   ```bash
   chmod +x scripts/setup-raspberry-pi.sh
   ./scripts/setup-raspberry-pi.sh
   ```

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   nano .env  # Add SMTP credentials
   ```

4. **Start Application**:
   ```bash
   npm install
   npm run pm2:start
   pm2 save
   ```

5. **Setup SSL**:
   ```bash
   npm run setup-ssl
   ```

## Deployment Options

### Option 1: LocalTunnel (Recommended)
**No port forwarding needed!**

```bash
# Setup LocalTunnel
./scripts/setup-localtunnel.sh

# Start tunnel
npm run tunnel:subdomain    # Try for ivorytusk.localtunnel.me
npm run tunnel:pm2         # Persistent tunnel with PM2

# Check status
npm run tunnel:status
npm run tunnel:urls
```

**DNS Configuration:**
- GoDaddy CNAME: ivorytusk.co.in → tunnel-url (e.g., ivorytusk.localtunnel.me)

### Option 2: Traditional (Port Forwarding)
**Requires network configuration:**

- Router port forwarding: 80, 443 → 192.168.29.232  
- DNS: ivorytusk.co.in CNAME → rpipbx.duckdns.org
- DuckDNS: rpipbx.duckdns.org → dynamic IP

### Email Configuration
Edit `.env` file with SMTP settings:
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@ivorytusk.co.in
```

## Maintenance Guidelines

### Server Management
```bash
pm2 status                    # Check application status
pm2 logs ivorytusk-website   # View logs
pm2 restart ivorytusk-website # Restart application
```

### SSL Certificate Renewal
- Auto-renewal via monthly cron job
- Manual renewal: `sudo certbot renew`

### Monitoring
- Health check: `curl https://ivorytusk.co.in/api/health`
- Email test: Check contact form submissions
- Log monitoring: `pm2 logs ivorytusk-website`

### Updating Content
1. Edit files in `public/` directory
2. Restart application: `pm2 restart ivorytusk-website`
3. For major changes, update both root files and public/ directory

### Security Updates
- Regular system updates: `sudo apt update && sudo apt upgrade`
- Node.js updates: `npm update`
- Monitor security advisories: `npm audit`