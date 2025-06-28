module.exports = {
  apps: [{
    name: 'ivorytusk-website',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    time: true
  }],

  deploy: {
    production: {
      user: 'pi',
      host: '192.168.29.232',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/ivorytusk-website.git',
      path: '/home/pi/ivorytusk-website',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};