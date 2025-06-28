#!/bin/bash

# IvoryTusk Website Connectivity Test Script
# This script tests external connectivity and website functionality

echo "🔍 Testing IvoryTusk Website Connectivity..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test 1: Local server
print_test "Testing local server..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    print_success "Local server is running on port 3000"
else
    print_fail "Local server is not responding on port 3000"
fi

# Test 2: Health endpoint
print_test "Testing API health endpoint..."
health_response=$(curl -s http://localhost:3000/api/health)
if echo "$health_response" | grep -q '"status":"ok"'; then
    print_success "API health endpoint is working"
else
    print_fail "API health endpoint is not responding correctly"
fi

# Test 3: DuckDNS resolution
print_test "Testing DuckDNS resolution..."
if nslookup rpipbx.duckdns.org | grep -q "Address"; then
    print_success "DuckDNS is resolving correctly"
    duckdns_ip=$(nslookup rpipbx.duckdns.org | grep "Address" | tail -1 | awk '{print $2}')
    echo "    DuckDNS IP: $duckdns_ip"
else
    print_fail "DuckDNS is not resolving"
fi

# Test 4: External DuckDNS access
print_test "Testing external DuckDNS access..."
if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 http://rpipbx.duckdns.org | grep -q "200\|301\|302"; then
    print_success "DuckDNS is accessible externally"
else
    print_fail "DuckDNS is not accessible externally"
    print_warning "Check router port forwarding and firewall settings"
fi

# Test 5: Domain resolution
print_test "Testing domain resolution..."
if nslookup ivorytusk.co.in | grep -q "rpipbx.duckdns.org\|Address"; then
    print_success "Domain ivorytusk.co.in is resolving"
else
    print_fail "Domain ivorytusk.co.in is not resolving correctly"
    print_warning "Check DNS configuration with GoDaddy"
fi

# Test 6: SSL certificate (if exists)
print_test "Testing SSL certificate..."
if [ -f "ssl/fullchain.pem" ] && [ -f "ssl/privkey.pem" ]; then
    print_success "SSL certificates found"
    cert_info=$(openssl x509 -in ssl/fullchain.pem -text -noout | grep "Not After")
    echo "    $cert_info"
else
    print_warning "SSL certificates not found - run 'npm run setup-ssl'"
fi

# Test 7: External HTTPS access
print_test "Testing external HTTPS access..."
if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 https://ivorytusk.co.in | grep -q "200"; then
    print_success "Website is accessible via HTTPS"
else
    print_warning "HTTPS access may not be working - check SSL setup"
fi

# Test 8: PM2 status
print_test "Testing PM2 process status..."
if pm2 list | grep -q "ivorytusk-website.*online"; then
    print_success "PM2 process is running"
else
    print_warning "PM2 process may not be running - check 'pm2 status'"
fi

# Test 9: Firewall status
print_test "Testing firewall configuration..."
ufw_status=$(sudo ufw status | grep -E "(80|443|3000)")
if echo "$ufw_status" | grep -q "ALLOW"; then
    print_success "Firewall ports are open"
    echo "$ufw_status"
else
    print_warning "Firewall may be blocking web traffic"
fi

# Test 10: Port availability
print_test "Testing port availability..."
for port in 80 443 3000; do
    if netstat -tuln | grep -q ":$port "; then
        print_success "Port $port is in use"
    else
        print_warning "Port $port is not in use"
    fi
done

echo ""
echo "🏁 Connectivity test completed!"
echo ""
echo "📋 Quick fixes for common issues:"
echo "   1. Local server not running: npm start or pm2 start ecosystem.config.js"
echo "   2. External access fails: Check router port forwarding (80, 443 → Pi)"
echo "   3. Domain not resolving: Check GoDaddy DNS settings"
echo "   4. SSL issues: Run 'npm run setup-ssl'"
echo "   5. PM2 not running: pm2 start ecosystem.config.js && pm2 save"