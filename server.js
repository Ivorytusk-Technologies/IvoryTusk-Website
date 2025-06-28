const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            connectSrc: ["'self'"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: isDevelopment ? true : [
        'https://ivorytusk.co.in',
        'https://www.ivorytusk.co.in',
        'https://rpipbx.duckdns.org'
    ],
    credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many contact form submissions, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isDevelopment ? 0 : '1y',
    etag: true,
    lastModified: true
}));

// Move website files to public directory function
function setupPublicDirectory() {
    const publicDir = path.join(__dirname, 'public');
    
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy files to public directory if they don't exist there
    const filesToCopy = ['index.html', '.htaccess'];
    
    filesToCopy.forEach(file => {
        const srcPath = path.join(__dirname, file);
        const destPath = path.join(publicDir, file);
        
        if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${file} to public directory`);
        }
    });
    
    // Copy ivorytusk-website directory if it exists
    const assetsDir = path.join(__dirname, 'ivorytusk-website');
    const publicAssetsDir = path.join(publicDir, 'ivorytusk-website');
    
    if (fs.existsSync(assetsDir) && !fs.existsSync(publicAssetsDir)) {
        fs.cpSync(assetsDir, publicAssetsDir, { recursive: true });
        console.log('Copied ivorytusk-website directory to public');
    }
}

// Email transporter configuration
const createEmailTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Contact form validation
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s.'-]+$/)
        .withMessage('Name contains invalid characters'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('company')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Company name must be less than 100 characters'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid phone number'),
    
    body('use-case')
        .isIn(['lead-generation', 'customer-support', 'appointment-scheduling', 'survey-research', 'sales-follow-up', 'other'])
        .withMessage('Please select a valid use case'),
    
    body('message')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Message must be less than 2000 characters')
];

// Contact form endpoint
app.post('/api/contact', contactLimiter, contactValidation, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, company, phone, 'use-case': useCase, message } = req.body;

        // Create email transporter
        const transporter = createEmailTransporter();

        // Verify transporter configuration
        await transporter.verify();

        // Email content
        const emailContent = `
New Contact Form Submission from IvoryTusk Website

Contact Details:
- Name: ${name}
- Email: ${email}
- Company: ${company || 'Not provided'}
- Phone: ${phone || 'Not provided'}
- Primary Use Case: ${useCase}

Message:
${message || 'No message provided'}

---
Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
IP Address: ${req.ip}
User Agent: ${req.get('User-Agent')}
        `.trim();

        // Email options
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'IvoryTusk Website'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || 'contact@ivorytusk.co.in',
            subject: `New Contact Form Submission - ${name}`,
            text: emailContent,
            html: emailContent.replace(/\n/g, '<br>')
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Contact form email sent:', info.messageId);

        res.json({
            success: true,
            message: 'Thank you for your message! Our team will contact you within 24 hours.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again or contact us directly at contact@ivorytusk.co.in'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Handle all other routes - serve index.html for SPA behavior
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Initialize server
async function startServer() {
    try {
        // Setup public directory
        setupPublicDirectory();
        
        // Check for SSL certificates in production
        if (!isDevelopment && fs.existsSync('./ssl/privkey.pem') && fs.existsSync('./ssl/fullchain.pem')) {
            const privateKey = fs.readFileSync('./ssl/privkey.pem', 'utf8');
            const certificate = fs.readFileSync('./ssl/fullchain.pem', 'utf8');
            const credentials = { key: privateKey, cert: certificate };

            const httpsServer = https.createServer(credentials, app);
            httpsServer.listen(443, () => {
                console.log('HTTPS Server running on port 443');
            });

            // Redirect HTTP to HTTPS
            const httpApp = express();
            httpApp.use((req, res) => {
                res.redirect(301, `https://${req.headers.host}${req.url}`);
            });
            httpApp.listen(80, () => {
                console.log('HTTP redirect server running on port 80');
            });
        } else {
            // Development or no SSL certificates
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`);
                console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
                if (isDevelopment) {
                    console.log('Development mode - serving on HTTP');
                } else {
                    console.log('Production mode - SSL certificates not found, serving on HTTP');
                    console.log('Run "npm run setup-ssl" to set up SSL certificates');
                }
            });
        }
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

startServer();