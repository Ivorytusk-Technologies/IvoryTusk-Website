#!/bin/bash

# IvoryTusk Website Deployment Commands for Raspberry Pi
# Run these commands directly on your Raspberry Pi

echo "🚀 Starting IvoryTusk Website Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Create project directory${NC}"
mkdir -p /home/pi/ivorytusk-website
cd /home/pi/ivorytusk-website

echo -e "${BLUE}Step 2: Download and setup files${NC}"
echo "Please transfer the website files to this directory:"
echo "  /home/pi/ivorytusk-website/"
echo ""
echo "You can:"
echo "1. Copy from USB drive"
echo "2. Use git clone if uploaded to GitHub"
echo "3. Use scp from another computer"
echo ""
read -p "Press Enter when files are copied..."

echo -e "${BLUE}Step 3: Update system and install Node.js${NC}"
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

echo -e "${BLUE}Step 4: Install PM2 process manager${NC}"
sudo npm install -g pm2

echo -e "${BLUE}Step 5: Make scripts executable${NC}"
chmod +x scripts/*.sh
chmod +x scripts/*.js

echo -e "${BLUE}Step 6: Install project dependencies${NC}"
npm install

echo -e "${BLUE}Step 7: Configure environment${NC}"
cp .env.example .env
echo -e "${YELLOW}Important: Edit .env file with your email configuration${NC}"
echo "nano .env"
echo ""
echo "Add your Gmail SMTP settings:"
echo "SMTP_USER=your-email@gmail.com"
echo "SMTP_PASS=your-app-specific-password"
echo ""
read -p "Press Enter after editing .env file..."

echo -e "${BLUE}Step 8: Start the website${NC}"
npm start &
sleep 3

echo -e "${BLUE}Step 9: Start LocalTunnel${NC}"
npm run tunnel:subdomain &
sleep 5

echo -e "${BLUE}Step 10: Check status${NC}"
npm run tunnel:status

echo -e "${BLUE}Step 11: Setup PM2 for production${NC}"
npm run tunnel:pm2
pm2 save

echo -e "${BLUE}Step 12: Configure PM2 startup${NC}"
pm2 startup
echo -e "${YELLOW}Run the command that PM2 outputs above with sudo${NC}"

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo "Your website should now be accessible via the tunnel URL shown above."
echo ""
echo "Useful commands:"
echo "  npm run tunnel:status  # Check tunnel status"
echo "  npm run tunnel:urls    # Show access URLs"
echo "  pm2 status            # Check all processes"
echo "  pm2 logs ivorytusk-website  # View website logs"
echo "  pm2 logs ivorytusk-tunnel   # View tunnel logs"