#!/bin/bash

# IvoryTusk Website LocalTunnel Setup Script
# Alternative to port forwarding - no router configuration needed!

set -e

echo "🌐 Setting up LocalTunnel for IvoryTusk Website..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${CYAN}[SUCCESS]${NC} $1"
}

# Check if Node.js is installed
print_step "Checking Node.js installation..."
if command -v node >/dev/null 2>&1; then
    node_version=$(node --version)
    print_status "Node.js is installed: $node_version"
else
    print_error "Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/ or run: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

# Install dependencies
print_step "Installing project dependencies..."
npm install

# Check if local server can start
print_step "Testing local server..."
if [ ! -f ".env" ]; then
    print_status "Creating environment file from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your email configuration before starting tunnel"
fi

# Start server in background for testing
print_status "Starting local server for tunnel test..."
npm start &
SERVER_PID=$!
sleep 3

# Test if server is responding
if curl -s http://localhost:3000 >/dev/null; then
    print_success "Local server is running successfully on port 3000"
else
    print_error "Local server failed to start"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Stop test server
kill $SERVER_PID 2>/dev/null || true
sleep 2

print_step "Starting LocalTunnel..."
echo ""
print_status "🚀 LocalTunnel Setup Complete!"
echo ""
print_warning "Next steps:"
echo ""
echo "1. Start your local server:"
echo -e "   ${CYAN}npm start${NC}"
echo ""
echo "2. In another terminal, start the tunnel:"
echo -e "   ${CYAN}npm run tunnel${NC}                    # Random subdomain"
echo -e "   ${CYAN}npm run tunnel:subdomain${NC}          # Try to get 'ivorytusk' subdomain"
echo ""
echo "3. For production (persistent tunnel):"
echo -e "   ${CYAN}npm run tunnel:pm2${NC}               # Start tunnel with PM2"
echo -e "   ${CYAN}pm2 save${NC}                         # Save PM2 configuration"
echo ""
echo "4. Configure your domain (GoDaddy):"
echo "   - Wait for tunnel URL from step 2"
echo "   - Create CNAME record: ivorytusk.co.in → [tunnel-url]"
echo "   - Example: ivorytusk.co.in → abc123.localtunnel.me"
echo ""
print_success "✅ LocalTunnel setup completed!"
echo ""
print_warning "📋 Advantages of LocalTunnel:"
echo "   ✓ No port forwarding needed"
echo "   ✓ No router configuration required"
echo "   ✓ Works behind NAT/firewall"
echo "   ✓ Instant public access"
echo "   ✓ HTTPS included automatically"
echo ""
print_warning "📋 Things to note:"
echo "   ⚠ Tunnel URL may change on restart (unless using subdomain)"
echo "   ⚠ Free service with rate limits"
echo "   ⚠ Update DNS when tunnel URL changes"
echo "   ⚠ For production, consider paid tunneling services"
echo ""
print_status "🔧 Useful commands:"
echo -e "   ${CYAN}npm run tunnel:stop${NC}              # Stop PM2 tunnel"
echo -e "   ${CYAN}pm2 logs ivorytusk-tunnel${NC}        # View tunnel logs"
echo -e "   ${CYAN}cat tunnel-info.json${NC}             # View current tunnel info"