#!/bin/bash

# IvoryTusk Website Setup Script for Raspberry Pi
# This script sets up the complete environment for hosting the website

set -e

echo "🚀 Starting IvoryTusk Website Setup on Raspberry Pi..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as pi user."
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
print_status "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
print_status "Node.js version: $node_version"
print_status "npm version: $npm_version"

# Install PM2 globally
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Install Certbot for SSL certificates
print_status "Installing Certbot for SSL certificates..."
sudo apt install -y certbot

# Create project directory
PROJECT_DIR="/home/pi/ivorytusk-website"
print_status "Setting up project directory at $PROJECT_DIR..."

if [ -d "$PROJECT_DIR" ]; then
    print_warning "Project directory already exists. Backing up..."
    sudo mv "$PROJECT_DIR" "${PROJECT_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Create logs directory
mkdir -p logs

# Install dependencies
print_status "Installing project dependencies..."
npm install

# Create environment file from example
if [ ! -f ".env" ]; then
    print_status "Creating environment configuration..."
    cp .env.example .env
    print_warning "Please edit .env file with your email configuration"
fi

# Set up firewall
print_status "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable

# Configure PM2 startup
print_status "Configuring PM2 for startup..."
pm2 startup
print_warning "Run the command that PM2 outputs above with sudo"

# Set up log rotation
sudo pm2 install pm2-logrotate

# Create systemd service for auto-start
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/ivorytusk-website.service > /dev/null <<EOF
[Unit]
Description=IvoryTusk Website
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ivorytusk-website.service

print_status "✅ Basic setup completed!"
echo ""
print_warning "Next steps:"
echo "1. Edit .env file with your email configuration"
echo "2. Set up SSL certificates: npm run setup-ssl"
echo "3. Start the application: pm2 start ecosystem.config.js"
echo "4. Save PM2 configuration: pm2 save"
echo "5. Configure your router to forward ports 80 and 443 to this Pi"
echo "6. Update DNS records to point ivorytusk.co.in to rpipbx.duckdns.org"
echo ""
print_status "Setup script completed!"