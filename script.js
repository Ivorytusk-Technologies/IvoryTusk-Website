// IvoryTusk Website JavaScript

// Solutions Data
const solutionsData = [
    {
        id: 'voice-agents',
        title: 'AI Voice Agents',
        description: 'Never miss a customer call again. Our AI voice agents handle inquiries 24/7, book appointments, and qualify leads while you focus on growing your business.',
        gradient: 'from-blue-400 to-blue-600',
        icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z'
    },
    {
        id: 'whatsapp-agents',
        title: 'WhatsApp AI Agents',
        description: 'Transform WhatsApp into your smartest sales & support channel. Our AI agents handle customer queries, book appointments, process orders, and qualify leads instantly - like having your best employee available 24/7.',
        gradient: 'from-green-400 to-green-600',
        icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488'
    },
    {
        id: 'expenseiq',
        title: 'ExpenseIQ',
        description: 'Take a photo of any bill or receipt, and ExpenseIQ reads it using OCR, extracts all details, and files it in your accounting system automatically.',
        gradient: 'from-green-400 to-green-600',
        icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H4.5m-1.25 0H3c-.621 0-1.125.504-1.125 1.125v.375m1.5 0v-.375c0-.621.504-1.125 1.125-1.125m0 0h.375c.621 0 1.125.504 1.125 1.125v.375m0 0v.75c0 .414.336.75.75.75H6m0 0v.75c0 .414.336.75.75.75H7.5m0 0v.75c0 .414.336.75.75.75H9'
    },
    {
        id: 'orrahome',
        title: 'OrraHome',
        description: 'Control your world with your voice. OrraHome integrates seamlessly with existing smart home/company apps, turning AI into your universal remote. Lights, fans, ACs — all respond instantly to simple commands. No complex menus. Just say it, and it’s done.',
        gradient: 'from-purple-400 to-purple-600',
        icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
    },
    {
        id: 'memora',
        title: 'Memora',
        description: 'Record client meetings and get instant transcripts, action items, and follow-up reminders. Never forget important details again.',
        gradient: 'from-orange-400 to-orange-600',
        icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
    },
    {
        id: 'procumatic',
        title: 'Procumatic',
        description: 'Procurement on the go. Procumatic lets construction teams log materials by voice ("20 bags cement received") and instantly generates a purchase order.',
        gradient: 'from-teal-400 to-teal-600',
        icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
    },
];

// Voice Capabilities Data
const voiceCapabilitiesData = [
    {
        title: 'Multilingual',
        description: 'Fluent in Hindi, English, and regional languages with perfect pronunciation. Gujarati and Tamil are coming soon.',
        iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    },
    {
        title: 'RAG (Knowledge Retrieval)',
        description: "RAG allows the AI to look up information from your private documents and databases to provide accurate, up-to-date answers. It's like having a perfect memory for all your company's data.",
        iconPath: "M12 17c3.31 0 6-2.69 6-6V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v6c0 3.31 2.69 6 6 6zm1-12c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1s1-.45 1-1V5z"
    },
    {
        title: 'Webhook Calls',
        description: "Webhooks allow the AI to trigger actions in other applications. For example, the AI can book an appointment, check inventory, or generate a support ticket automatically during a call.",
        iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    },
    {
        title: 'Advanced Turn Detection',
        description: "The AI seamlessly knows when to talk and when to listen, making the conversation feel natural and human-like.",
        iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    },
    {
        title: 'BYOS (Bring Your Own SIP)',
        description: "Integrate the AI with your existing phone system using our 'Bring Your Own SIP' feature, ensuring a smooth transition and low cost.",
        iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    },
    {
        title: 'Sentiment Detection',
        description: "Our AI can understand the tone and emotion of the caller, allowing it to adapt its conversation to de-escalate or provide better support.",
        iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    },
];

// WhatsApp Capabilities Data
const whatsappCapabilitiesData = [
    {
        title: 'Instant Response',
        description: 'Reply to customer messages in under 3 seconds, 24/7. Never lose a lead because you were busy or unavailable.',
        iconPath: "M12 2C13.1 2 14 2.9 14 4V8C14 9.1 13.1 10 12 10S10 9.1 10 8V4C10 2.9 10.9 2 12 2ZM21 9V7C21 6.45 20.55 6 20 6S19 6.45 19 7V9C19 13.97 15.84 18.24 11.35 19.73C11.75 20.91 12.81 21.75 14.04 21.75H16V23.25H8V21.75H9.96C11.19 21.75 12.25 20.91 12.65 19.73C8.16 18.24 5 13.97 5 9V7C5 6.45 4.55 6 4 6S3 6.45 3 7V9C3 14.5 6.82 19.24 12 20.92C17.18 19.24 21 14.5 21 9Z"
    },
    {
        title: 'Sales Automation',
        description: 'Qualify leads, share product catalogs, calculate quotes, and process orders directly through WhatsApp. Turn conversations into conversions.',
        iconPath: "M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z"
    },
    {
        title: 'Appointment Booking',
        description: 'Let customers book appointments, reschedule, and get reminders directly through WhatsApp. Seamless calendar integration with your existing systems.',
        iconPath: "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"
    },
    {
        title: 'Smart Escalation',
        description: 'AI knows when to handle queries independently and when to seamlessly transfer to human agents with full conversation context.',
        iconPath: "M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
    },
    {
        title: 'Multi-language Support',
        description: 'Communicate fluently in Hindi, English, and regional languages. Break language barriers and serve all your customers naturally.',
        iconPath: "M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"
    },
    {
        title: 'Rich Media Support',
        description: 'Send images, documents, location pins, and interactive buttons. Create engaging experiences that drive action and sales.',
        iconPath: "M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
    }
];

// Channel Switching Functionality
function initChannelSwitching() {
    const voiceTab = document.getElementById('voice-tab');
    const whatsappTab = document.getElementById('whatsapp-tab');
    const voiceDemo = document.getElementById('voice-demo');
    const whatsappDemo = document.getElementById('whatsapp-demo');
    const capabilitiesContainer = document.getElementById('voice-capabilities-container');

    function switchToVoice() {
        // Update tab styles
        voiceTab.className = 'channel-tab px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-orange-500 text-white';
        whatsappTab.className = 'channel-tab px-6 py-3 rounded-full font-semibold transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-orange-600';

        // Show/hide demos
        voiceDemo.classList.remove('hidden');
        whatsappDemo.classList.add('hidden');

        // Update capabilities
        renderCapabilities(voiceCapabilitiesData);
    }

    function switchToWhatsApp() {
        // Update tab styles
        whatsappTab.className = 'channel-tab px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-green-500 text-white';
        voiceTab.className = 'channel-tab px-6 py-3 rounded-full font-semibold transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-orange-600';

        // Show/hide demos
        voiceDemo.classList.add('hidden');
        whatsappDemo.classList.remove('hidden');

        // Update capabilities
        renderCapabilities(whatsappCapabilitiesData);
    }

    function renderCapabilities(capabilitiesData) {
        capabilitiesContainer.innerHTML = capabilitiesData.map(capability => `
            <div class="backdrop-blur-lg bg-white/20 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/30 dark:hover:bg-slate-800/60">
                <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg class="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="${capability.iconPath}"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 text-center">${capability.title}</h3>
                <p class="text-slate-600 dark:text-slate-300 text-center leading-relaxed">${capability.description}</p>
            </div>
        `).join('');
    }

    // Add event listeners
    if (voiceTab && whatsappTab) {
        voiceTab.addEventListener('click', switchToVoice);
        whatsappTab.addEventListener('click', switchToWhatsApp);

        // Initialize with voice capabilities
        renderCapabilities(voiceCapabilitiesData);
    }
}

// Industries Content Data
const industriesContentData = {
    builders: {
        title: 'Home Builders',
        points: [
            { h4: 'Never lose a ₹1.5 crore project', p: 'Handle inquiries while you\'re on construction sites' },
            { h4: 'RERA & Permit Questions', p: 'AI handles regulatory queries professionally' },
            { h4: 'Vastu Compliance', p: 'Expert responses to traditional requirements' },
        ],
        sample: '"For a 4 BHK in Bangalore with a ₹1.5 crore budget, that\'s definitely achievable. Including BBMP approvals and RERA compliance, we\'re looking at 14-16 months for completion. Shall I schedule a site visit with our senior architect?"'
    },
    furniture: {
        title: 'Furniture Stores',
        points: [
            { h4: 'Complete Inventory Knowledge', p: 'AI knows every product, price, and availability' },
            { h4: 'EMI & Financing Options', p: 'Instant calculations and payment plans' },
            { h4: 'After-Hours Sales', p: 'Convert ₹2-5 lakh orders while you sleep' },
        ],
        sample: '"For 8 people dining set under ₹2 lakhs, we have excellent solid wood options starting at ₹1.5 lakhs. Current Diwali offers include 0% EMI for 12 months. Shall I check availability at your nearest showroom?"'
    },
    architects: {
        title: 'Architecture Firms',
        points: [
            { h4: 'Project Pre-Qualification', p: 'Screen budgets and timelines efficiently' },
            { h4: 'Sustainable Design Queries', p: 'LEED, GRIHA certification discussions' },
            { h4: '₹5 Crore Projects', p: 'Never miss high-value commercial inquiries' },
        ],
        sample: '"10,000 sq ft corporate office in Mumbai - excellent! Budgets typically range from ₹800-1500 per sq ft. Are you interested in LEED certification? I can schedule a consultation with our senior design team."'
    },
    healthcare: {
        title: 'Healthcare Providers',
        points: [
            { h4: 'Appointment Scheduling', p: 'HIPAA-compliant patient appointment management' },
            { h4: 'Insurance Verification', p: 'Real-time insurance eligibility and benefits checking' },
            { h4: 'Emergency Protocols', p: 'Proper triage and emergency service routing' },
        ],
        sample: '"I can schedule your consultation with Dr. Sharma for next Tuesday at 3 PM. Your insurance covers 80% of the consultation fee. Would you like me to send appointment details and preparation instructions to your registered mobile number?"'
    },
    automation: {
        title: 'Home Automation',
        points: [
            { h4: 'Technical Expertise', p: 'Complex smart home system explanations' },
            { h4: 'Energy Savings Calculations', p: 'ROI on electricity bills and efficiency' },
            { h4: '₹3-15 Lakh Projects', p: 'Schedule installations round-the-clock' },
        ],
        sample: '"For 2500 sq ft, smart home packages range from ₹3.5 lakhs to ₹12 lakhs. Most clients see 25-30% electricity savings. This includes lighting, climate, and security. Shall I schedule a home assessment?"'
    }
};

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    
    // --- DOM Element References ---
    const navbar = document.getElementById('navbar');
    const successMessage = document.getElementById('success-message');
    const modalWrapper = document.getElementById('modal-wrapper');
    const modalTitle = document.getElementById('modal-title');
    const modalFormContainer = document.getElementById('modal-form-container');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const demoNavBtn = document.getElementById('demo-nav-btn');
    const contactNavBtn = document.getElementById('contact-nav-btn');
    const liveDemoHeroBtn = document.getElementById('live-demo-hero-btn');
    const liveDemoCtaBtn = document.getElementById('live-demo-cta-btn');
    const solutionsContainer = document.getElementById('solutions-container');
    const voiceCapabilitiesContainer = document.getElementById('voice-capabilities-container');
    const industryTabButtons = document.querySelectorAll('.tab-btn');
    const industriesContent = document.getElementById('industries-content');
    let successTimeout;

    // --- Functions ---
    const renderSolutions = () => {
        solutionsContainer.innerHTML = solutionsData.map(solution => `
            <a href="${(solution.id === 'voice-agents' || solution.id === 'whatsapp-agents') ? '#ai-agents' : '#'}"
                class="group backdrop-blur-xl bg-white/20 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl p-8 hover:bg-white/30 dark:hover:bg-slate-800/60
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-r ${solution.gradient} flex items-center justify-center mb-6
                    transform group-hover:scale-110 transition-transform duration-300">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="${solution.icon}" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">${solution.title}</h3>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${solution.description}</p>
            </a>
        `).join('');
    };

    const renderVoiceCapabilities = () => {
        voiceCapabilitiesContainer.innerHTML = voiceCapabilitiesData.map(capability => `
            <div class="group backdrop-blur-xl bg-white/20 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl p-8 hover:bg-white/30 dark:hover:bg-slate-800/60
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center mb-6
                    transform group-hover:scale-110 transition-transform duration-300">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="${capability.iconPath}" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">${capability.title}</h3>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${capability.description}</p>
            </div>
        `).join('');
    };

    const renderIndustryContent = (tab) => {
        const data = industriesContentData[tab];
        const pointsHtml = data.points.map(p => `
            <div class="flex items-start space-x-3">
                <div class="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex-shrink-0 mt-1"></div>
                <div>
                    <h4 class="font-semibold text-slate-800 dark:text-slate-100">${p.h4}</h4>
                    <p class="text-slate-600 dark:text-slate-300">${p.p}</p>
                </div>
            </div>
        `).join('');

        industriesContent.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">${data.title}</h3>
                    <div class="space-y-4">${pointsHtml}</div>
                </div>
                <div class="backdrop-blur-lg bg-white/10 dark:bg-slate-800/30 border border-white/30 dark:border-slate-700/50 rounded-2xl p-6 italic">
                    <div class="text-sm text-slate-500 dark:text-slate-400 mb-2">Sample AI Response:</div>
                    <p class="text-slate-700 dark:text-slate-300">${data.sample}</p>
                </div>
            </div>
        `;
    };

    const openModal = (type) => {
        if (type === 'demo') {
            modalTitle.textContent = 'Book a Live Demo';
            modalFormContainer.innerHTML = `
                <form id="demo-form" class="space-y-4">
                    <div>
                        <label for="name" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Name</label>
                        <input type="text" id="name" name="name" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label for="company" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Company Name</label>
                        <input type="text" id="company" name="company" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label for="phone" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Phone Number</label>
                        <input type="tel" id="phone" name="phone" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label for="email" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Work Email</label>
                        <input type="email" id="email" name="email" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label for="usecase" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Interested Product / Use Case</label>
                        <select id="usecase" name="usecase" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option value="" disabled selected>Select an option</option>
                            <option value="AI Voice Agents">AI Voice Agents</option>
                            <option value="AI WhatsApp Agents">AI WhatsApp Agents</option>
                            <option value="Workflow Automation">Workflow Automation</option>
                            <option value="Custom Solution">Custom Solution</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-full mt-4
                        shadow-lg shadow-orange-200/50 hover:scale-105 transition-transform duration-300">
                        Submit Request
                    </button>
                </form>
            `;
        } else if (type === 'contact') {
            modalTitle.textContent = 'Contact Us';
            modalFormContainer.innerHTML = `
                <form id="contact-form" class="space-y-4">
                    <div>
                        <label for="contact-name" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Name</label>
                        <input type="text" id="contact-name" name="contact-name" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label for="contact-email" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Email</label>
                        <input type="email" id="contact-email" name="contact-email" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label for="contact-phone" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Phone Number</label>
                        <input type="tel" id="contact-phone" name="contact-phone" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label for="contact-usecase" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Interested Product / Use Case</label>
                        <select id="contact-usecase" name="contact-usecase" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option value="" disabled selected>Select an option</option>
                            <option value="AI Voice Agents">AI Voice Agents</option>
                            <option value="AI WhatsApp Agents">AI WhatsApp Agents</option>
                            <option value="Workflow Automation">Workflow Automation</option>
                            <option value="Custom Solution">Custom Solution</option>
                        </select>
                    </div>
                    <div>
                        <label for="message" class="block text-slate-700 dark:text-slate-300 font-medium mb-1">Message</label>
                        <textarea id="message" name="message" rows="4" required
                            class="w-full p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-full mt-4
                        shadow-lg shadow-orange-200/50 hover:scale-105 transition-transform duration-300">
                        Send Message
                    </button>
                </form>
            `;
        }
        modalWrapper.classList.remove('opacity-0', 'invisible');
        // Re-attach event listeners to the new form
        const form = document.getElementById(type === 'demo' ? 'demo-form' : 'contact-form');
        form.addEventListener('submit', handleFormSubmit);
    };

    const closeModal = () => {
        modalWrapper.classList.add('opacity-0', 'invisible');
        modalFormContainer.innerHTML = '';
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const formType = form.id;

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Prepare data for submission
            const data = new FormData();

            // Add form fields to FormData
            for (let [key, value] of formData.entries()) {
                // Normalize field names for Netlify form
                if (formType === 'contact-form') {
                    switch(key) {
                        case 'contact-name':
                            data.append('name', value);
                            break;
                        case 'contact-email':
                            data.append('email', value);
                            break;
                        case 'contact-phone':
                            data.append('phone', value);
                            break;
                        case 'contact-usecase':
                            data.append('usecase', value);
                            break;
                        default:
                            data.append(key, value);
                    }
                } else {
                    data.append(key, value);
                }
            }

            // Add form type and timestamp
            data.append('formType', formType === 'demo-form' ? 'Demo Request' : 'Contact Form');
            data.append('form-name', 'contact');

            // Submit to Cloudflare Pages Function
            const apiUrl = '/api/contact'; // Pages Functions are available at /api/* paths
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(data))
            });

            if (response.ok) {
                const result = await response.json();
                closeModal();
                successMessage.classList.remove('hidden');
                clearTimeout(successTimeout);
                successTimeout = setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
            } else {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                if (errorData.debug) {
                    console.log('Debug Info:', errorData.debug);
                }
                throw new Error(errorData.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show user-friendly error message
            alert('There was an error submitting your form. Please try again or contact us directly at contact@ivorytusk.co.in or +91 9909507799');
            closeModal();
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    };

    // Dark mode functionality
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const logoLight = document.getElementById('logo-light');
    const logoDark = document.getElementById('logo-dark');

    // Check for saved theme preference or default to 'light' mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            logoLight.classList.remove('hidden');
            logoDark.classList.add('hidden');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            logoLight.classList.add('hidden');
            logoDark.classList.remove('hidden');
        }
    };
    
    // Set initial theme
    if (currentTheme === 'dark') {
        toggleTheme();
    }
    
    themeToggle.addEventListener('click', toggleTheme);

    // Industries tab logic
    let activeTab = 'builders';
    const updateTabs = () => {
        industryTabButtons.forEach(btn => {
            if (btn.dataset.tab === activeTab) {
                btn.classList.add('bg-gradient-to-r', 'from-orange-500', 'to-orange-600', 'text-white', 'shadow-md');
                btn.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:text-orange-600', 'hover:bg-white/50', 'dark:hover:bg-slate-800/50');
            } else {
                btn.classList.add('text-slate-600', 'dark:text-slate-300', 'hover:text-orange-600', 'hover:bg-white/50', 'dark:hover:bg-slate-800/50');
                btn.classList.remove('bg-gradient-to-r', 'from-orange-500', 'to-orange-600', 'text-white', 'shadow-md');
            }
        });
        renderIndustryContent(activeTab);
    };
    
    // Audio functionality
    const setupMediaControls = () => {
        // Hero section audio controls (if they exist)
        const demoAudio = document.getElementById('demo-audio');
        const playDemoBtn = document.getElementById('play-demo-audio');
        const playIcon = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        const playText = document.getElementById('play-text');
        const heroVisualizer = document.getElementById('hero-voice-visualizer');
        
        // Voice agents section audio controls
        const voiceAgentsAudio = document.getElementById('voice-agents-audio');
        const playVoiceAgentsBtn = document.getElementById('play-voice-agents-audio');
        const voicePlayIcon = document.getElementById('voice-play-icon');
        const voicePauseIcon = document.getElementById('voice-pause-icon');
        const voicePlayText = document.getElementById('voice-play-text');
        const voiceAgentsVisualizer = document.getElementById('voice-agents-visualizer');
        
        const watchVideoBtn = document.getElementById('watch-video-btn');
        
        // Hero audio controls (if they exist)
        if (playDemoBtn && demoAudio) {
            playDemoBtn.addEventListener('click', () => {
                if (demoAudio.paused) {
                    demoAudio.play();
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                    playText.textContent = 'Pause';
                    if (heroVisualizer) heroVisualizer.style.animationPlayState = 'running';
                } else {
                    demoAudio.pause();
                    playIcon.classList.remove('hidden');
                    pauseIcon.classList.add('hidden');
                    playText.textContent = 'Play Demo';
                    if (heroVisualizer) heroVisualizer.style.animationPlayState = 'paused';
                }
            });
            
            demoAudio.addEventListener('ended', () => {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                playText.textContent = 'Play Demo';
                if (heroVisualizer) heroVisualizer.style.animationPlayState = 'paused';
            });
        }
        
        // 3D Orbital Audio Visualizer
        let orbitalScene, orbitalCamera, orbitalRenderer;
        let nucleus, waveforms = [], electrons = [];
        let orbitalAnalyser, orbitalAudioContext, orbitalAudioSource;
        let orbitalAnimationId = null;
        let ringAnimationState = 'hidden';
        let ringAnimationProgress = 0;
        let animationStartTime = 0;
        let lastAudioIntensity = 0;
        
        // Bar waveform visualization
        let leftBars = [], rightBars = [];
        let barWaveformData = null;
        
        // Orbital visualizer constants
        const NUM_WAVEFORM_ORBITS = 5;
        const WAVEFORM_POINTS = 256;
        const NUM_ELECTRONS = 5;
        const TRAIL_LENGTH = 15;
        const ELECTRON_ORBIT_RADIUS = 0.8; // Good balance - visible but not too far from nucleus
        const ANIMATION_DURATION = 500;
        const ORANGE_COLOR = '#37AFE1'; // Change this hex code to any color you want
        
        // Bar waveform constants
        const NUM_BARS = 40; // Number of bars on each side for full width coverage
        const BAR_WIDTH = 0.10;
        const BAR_SPACING = 0.20;
        const MAX_BAR_HEIGHT = 50.0;
        const BAR_DISTANCE_FROM_CENTER = 9.0; // Extend further to edges 
        
        // Initialize 3D Orbital Visualizer
        const initOrbitalVisualizer = () => {
            const canvas = document.getElementById('orbitalCanvas');
            if (!canvas) return false;
            
            // Scene setup
            orbitalScene = new THREE.Scene();
            orbitalScene.background = new THREE.Color(0x000000);
            
            orbitalCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            orbitalCamera.position.z = 8; // Moved camera back for better view
            
            orbitalRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            orbitalRenderer.setPixelRatio(window.devicePixelRatio);
            orbitalRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
            orbitalScene.add(ambientLight);
            
            // Create central nucleus (wireframe sphere)
            const nucleusGeometry = new THREE.IcosahedronGeometry(1.0, 2); // Slightly larger nucleus
            const nucleusMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color(ORANGE_COLOR),
                linewidth: 2,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
            });
            const edges = new THREE.EdgesGeometry(nucleusGeometry);
            nucleus = new THREE.LineSegments(edges, nucleusMaterial);
            orbitalScene.add(nucleus);
            
            // Create waveform orbits
            createOrbitalWaveforms();
            
            // Create electrons
            createOrbitalElectrons();
            
            // Create bar waveform
            createBarWaveform();
            
            // Try to initialize audio analysis
            initOrbitalAudioAnalysis();
            
            // Initial render
            orbitalRenderer.render(orbitalScene, orbitalCamera);
            
            console.log('3D Orbital visualizer initialized');
            return true;
        };
        
        // Create bar waveform visualization
        const createBarWaveform = () => {
            const barGeometry = new THREE.BoxGeometry(BAR_WIDTH, 0.1, BAR_WIDTH);
            const barMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(ORANGE_COLOR),
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
            });
            
            // Create left side bars
            for (let i = 0; i < NUM_BARS; i++) {
                const bar = new THREE.Mesh(barGeometry, barMaterial.clone());
                
                                 // Position bars on the left side
                 bar.position.x = -BAR_DISTANCE_FROM_CENTER + (i * BAR_SPACING);
                 bar.position.y = 0; // Center position - bars will grow up and down from here
                 bar.position.z = -2; // Behind the orbital sphere
                 
                 // Store original Y position for animation (center point)
                 bar.originalY = 0;
                bar.targetHeight = 0.1;
                bar.currentHeight = 0.1;
                
                leftBars.push(bar);
                orbitalScene.add(bar);
            }
            
            // Create right side bars (mirrored)
            for (let i = 0; i < NUM_BARS; i++) {
                const bar = new THREE.Mesh(barGeometry, barMaterial.clone());
                
                                 // Position bars on the right side
                 bar.position.x = BAR_DISTANCE_FROM_CENTER - (i * BAR_SPACING);
                 bar.position.y = 0; // Center position - bars will grow up and down from here
                 bar.position.z = -2; // Behind the orbital sphere
                 
                 // Store original Y position for animation (center point)
                 bar.originalY = 0;
                bar.targetHeight = 0.1;
                bar.currentHeight = 0.1;
                
                rightBars.push(bar);
                orbitalScene.add(bar);
            }
            
            console.log(`Created ${NUM_BARS * 2} waveform bars`);
        };
        
        // Initialize audio analysis for the orbital visualizer (CORS-friendly)
        const initOrbitalAudioAnalysis = () => {
            // Skip Web Audio API initialization to avoid CORS issues
            // We'll use a smart fake animation that responds to audio playback state
            console.log('Using CORS-friendly audio visualization (fake animation)');
            return false; // Always use fake animation to avoid CORS issues
        };
        
        // Create orbital waveforms
        const createOrbitalWaveforms = () => {
            const waveformMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color(ORANGE_COLOR),
                transparent: true,
                blending: THREE.AdditiveBlending,
                linewidth: 2,
            });
            
            for (let i = 0; i < NUM_WAVEFORM_ORBITS; i++) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(WAVEFORM_POINTS * 3);
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const waveform = new THREE.Line(geometry, waveformMaterial.clone());
                waveforms.push(waveform);
                orbitalScene.add(waveform);
            }
            
            // Set different initial rotations for all 5 orbits
            waveforms.forEach((waveform, index) => {
                const rotationAngle = (index / NUM_WAVEFORM_ORBITS) * Math.PI * 2;
                waveform.rotation.x = rotationAngle;
                waveform.rotation.y = rotationAngle * 0.7;
                waveform.rotation.z = rotationAngle * 0.3;
            });
        };
        
        // Create orbital electrons with enhanced comet-like trails
        const createOrbitalElectrons = () => {
            const electronGeometry = new THREE.SphereGeometry(0.08, 12, 12); // Larger, higher quality electrons
            
            for (let i = 0; i < NUM_ELECTRONS; i++) {
                const electronMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(ORANGE_COLOR),
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                    opacity: 1.0,
                });
                
                const electron = new THREE.Mesh(electronGeometry, electronMaterial);
                electron.trail = [];
                electron.orbitOffset = (i / NUM_ELECTRONS) * Math.PI * 2; // Distribute electrons evenly
                electron.orbitPlane = i; // Different orbital planes for variety
                
                // Create comet-like trail with varying sizes and opacity
                for (let j = 0; j < TRAIL_LENGTH; j++) {
                    const trailSize = 0.08 * (1 - j / TRAIL_LENGTH); // Gradually smaller trail particles
                    const trailGeometry = new THREE.SphereGeometry(Math.max(0.01, trailSize), 8, 8);
                    
                    const trailMaterial = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(ORANGE_COLOR),
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        opacity: Math.pow(1 - j / TRAIL_LENGTH, 2) * 0.8, // Exponential fade for comet effect
                    });
                    
                    const trailParticle = new THREE.Mesh(trailGeometry, trailMaterial);
                    electron.trail.push(trailParticle);
                    orbitalScene.add(trailParticle);
                }
                electrons.push(electron);
                orbitalScene.add(electron);
            }
        };
        
        // Start orbital animation
        const startOrbitalVisualizer = () => {
            ringAnimationState = 'appearing';
            animationStartTime = performance.now();
        };
        
        // Stop orbital animation
        const stopOrbitalVisualizer = () => {
            ringAnimationState = 'disappearing';
            animationStartTime = performance.now();
        };
        
        // Orbital animation loop
        const animateOrbitalVisualizer = () => {
            if (!orbitalRenderer || !orbitalScene || !orbitalCamera) return;
            
            const time = performance.now() * 0.008;
            const currentTime = performance.now();
            
            // Handle ring appearance/disappearance animation
            if (ringAnimationState === 'appearing') {
                let progress = (currentTime - animationStartTime) / ANIMATION_DURATION;
                ringAnimationProgress = THREE.MathUtils.lerp(0, 1, Math.min(1, progress));
                if (progress >= 1) {
                    ringAnimationState = 'visible';
                }
            } else if (ringAnimationState === 'disappearing') {
                let progress = (currentTime - animationStartTime) / ANIMATION_DURATION;
                ringAnimationProgress = THREE.MathUtils.lerp(1, 0, Math.min(1, progress));
                if (progress >= 1) {
                    ringAnimationState = 'hidden';
                }
            }
            
            // Smart fake animation that responds to audio playback state
            let audioIntensity = 0.3; // Default intensity
            let frequencyData = null;
            
            // Check if audio is actually playing
            const isAudioPlaying = voiceAgentsAudio && !voiceAgentsAudio.paused && voiceAgentsAudio.currentTime > 0;
            
            if (isAudioPlaying) {
                // Enhanced fake animation that simulates voice patterns
                const voicePattern1 = Math.sin(time * 0.8 + Math.sin(time * 0.3)) * 0.4;
                const voicePattern2 = Math.sin(time * 1.2 + Math.cos(time * 0.5)) * 0.3;
                const voicePattern3 = Math.sin(time * 0.6 + Math.sin(time * 0.7)) * 0.2;
                
                // Add some randomness to simulate voice unpredictability
                const randomness = (Math.random() - 0.5) * 0.1;
                
                const fakeAudioIntensity = 0.5 + voicePattern1 + voicePattern2 + voicePattern3 + randomness;
                audioIntensity = Math.max(0.2, Math.min(1.0, fakeAudioIntensity)); // Clamp between 0.2 and 1.0
                
                // Smooth the intensity
                audioIntensity = lastAudioIntensity * 0.8 + audioIntensity * 0.2;
                
                // Create fake frequency data for different rings
                frequencyData = new Uint8Array(256);
                barWaveformData = new Uint8Array(NUM_BARS);
                
                for (let i = 0; i < 256; i++) {
                    // Simulate different frequency ranges with varying intensities
                    const freq = i / 256;
                    let value = 0;
                    
                    if (freq < 0.2) {
                        // Bass frequencies - more stable
                        value = (Math.sin(time * 0.5 + i * 0.1) + 1) * 80 + 40;
                    } else if (freq < 0.6) {
                        // Mid frequencies - more active
                        value = (Math.sin(time * 1.2 + i * 0.05) + 1) * 100 + 50;
                    } else {
                        // High frequencies - most active
                        value = (Math.sin(time * 2.0 + i * 0.02) + 1) * 120 + 60;
                    }
                    
                    frequencyData[i] = Math.max(0, Math.min(255, value + (Math.random() - 0.5) * 20));
                }
                
                // Generate bar waveform data (simulate classic audio visualizer bars)
                for (let i = 0; i < NUM_BARS; i++) {
                    const barFreq = i / NUM_BARS;
                    const baseValue = Math.sin(time * 1.5 + i * 0.3) * 0.5 + 0.5;
                    const voiceModulation = Math.sin(time * 0.8 + i * 0.1) * 0.3;
                    const randomVariation = (Math.random() - 0.5) * 0.2;
                    
                    let barValue = (baseValue + voiceModulation + randomVariation) * 255;
                    
                    // Make outer bars (edges) more prominent
                    const edgeBoost = Math.abs(i - NUM_BARS / 2) / (NUM_BARS / 2);
                    barValue *= (0.7 + edgeBoost * 0.6);
                    
                    barWaveformData[i] = Math.max(10, Math.min(255, barValue));
                }
            } else {
                // Static/minimal animation when audio is not playing
                const staticIntensity = 0.2 + Math.sin(time * 0.2) * 0.1;
                audioIntensity = lastAudioIntensity * 0.95 + staticIntensity * 0.05;
            }
            
            lastAudioIntensity = audioIntensity;
            
            // Update waveforms with frequency data (like original visualizer)
            waveforms.forEach((waveform, index) => {
                const positions = waveform.geometry.attributes.position.array;
                const baseRadius = 1.0; // Minimum radius as requested
                const radius = baseRadius + index * 0.4;
                
                // Separate frequency ranges for each ring (5 rings now)
                let freqData = null;
                if (frequencyData) {
                    const freqRanges = [
                        frequencyData.slice(0, 50),    // Sub-bass frequencies
                        frequencyData.slice(50, 100),  // Bass frequencies  
                        frequencyData.slice(100, 150), // Low-mid frequencies
                        frequencyData.slice(150, 200), // High-mid frequencies
                        frequencyData.slice(200, 256)  // High frequencies
                    ];
                    freqData = freqRanges[index] || frequencyData.slice(0, 50); // Fallback for safety
                }
                
                for (let i = 0; i < WAVEFORM_POINTS; i++) {
                    const angle = (i / WAVEFORM_POINTS) * Math.PI * 2;
                    
                    let displacement;
                    if (freqData) {
                        // Use real frequency data
                        const freqIndex = Math.floor((i / WAVEFORM_POINTS) * freqData.length);
                        const freqValue = freqData[freqIndex] / 255.0;
                        displacement = freqValue * audioIntensity * 1.2;
                    } else {
                        // Fallback fake animation
                        displacement = audioIntensity * 0.8 * Math.sin(angle * 3 + time);
                    }
                    
                    const x = radius * Math.sin(angle);
                    const y = radius * Math.cos(angle);
                    const z = displacement * Math.sin(angle * 2 + time * 0.5);
                    
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = z;
                }
                waveform.geometry.attributes.position.needsUpdate = true;
                
                // Animate scale based on animation progress
                const currentScale = THREE.MathUtils.lerp(0, 1, ringAnimationProgress);
                waveform.scale.set(currentScale, currentScale, currentScale);
                
                // Rotate waveforms
                waveform.rotation.y += (index * 0.002) + 0.003;
                waveform.rotation.x += (index % 2 === 0 ? 0.002 : -0.002);
            });
            
            // Animate nucleus
            if (nucleus) {
                nucleus.rotation.x += 0.002;
                nucleus.rotation.y += 0.003;
            }
            
            // Animate electrons with varied orbital patterns
            const baseElectronRadius = 1.0; // Base orbit radius
            const electronOrbitRadius = baseElectronRadius + (audioIntensity * 0.5); // Dynamic radius based on audio
            
            electrons.forEach((electron, index) => {
                // Update trail positions first (comet effect)
                for (let j = TRAIL_LENGTH - 1; j > 0; j--) {
                    electron.trail[j].position.copy(electron.trail[j - 1].position);
                    
                    // Gradually reduce trail particle opacity for smooth comet fade
                    const fadeRatio = Math.pow(1 - j / TRAIL_LENGTH, 2);
                    electron.trail[j].material.opacity = fadeRatio * 0.8;
                }
                electron.trail[0].position.copy(electron.position);
                electron.trail[0].material.opacity = 0.8;
                
                // Create varied orbital patterns for each electron
                const orbitSpeed = 0.3 + (index * 0.15); // Different speeds
                const currentAngle = time * orbitSpeed + electron.orbitOffset;
                
                // Different orbital planes and shapes for variety
                const planeOffset = electron.orbitPlane * Math.PI / NUM_ELECTRONS;
                const radiusVariation = 0.8 + (index % 2) * 0.4; // Alternate between closer and farther orbits
                const currentRadius = electronOrbitRadius * radiusVariation;
                
                // Create 3D orbital paths (elliptical and tilted)
                electron.position.x = currentRadius * Math.cos(currentAngle) * Math.cos(planeOffset);
                electron.position.y = currentRadius * Math.sin(currentAngle);
                electron.position.z = currentRadius * Math.cos(currentAngle) * Math.sin(planeOffset) * 0.6;
                
                // Add slight wobble based on audio intensity
                const wobble = audioIntensity * 0.1;
                electron.position.x += Math.sin(time * 2 + index) * wobble;
                electron.position.y += Math.cos(time * 1.8 + index) * wobble;
                electron.position.z += Math.sin(time * 2.2 + index) * wobble;
            });
            
            // Animate bar waveform
            if (barWaveformData) {
                                 // Animate left bars
                 leftBars.forEach((bar, index) => {
                     const barValue = barWaveformData[index] / 255.0;
                     bar.targetHeight = 0.1 + (barValue * MAX_BAR_HEIGHT);
                     
                     // Smooth height animation
                     bar.currentHeight = bar.currentHeight * 0.8 + bar.targetHeight * 0.2;
                     
                     // Update bar scale (grows from center - both up and down)
                     bar.scale.y = bar.currentHeight;
                     bar.position.y = bar.originalY; // Keep at center - scaling handles the growth
                     
                     // Add slight opacity variation based on height
                     bar.material.opacity = 0.4 + (barValue * 0.4);
                 });
                
                                 // Animate right bars (mirrored pattern)
                 rightBars.forEach((bar, index) => {
                     const barValue = barWaveformData[NUM_BARS - 1 - index] / 255.0; // Mirror the pattern
                     bar.targetHeight = 0.1 + (barValue * MAX_BAR_HEIGHT);
                     
                     // Smooth height animation
                     bar.currentHeight = bar.currentHeight * 0.8 + bar.targetHeight * 0.2;
                     
                     // Update bar scale (grows from center - both up and down)
                     bar.scale.y = bar.currentHeight;
                     bar.position.y = bar.originalY; // Keep at center - scaling handles the growth
                     
                     // Add slight opacity variation based on height
                     bar.material.opacity = 0.4 + (barValue * 0.4);
                 });
            } else {
                                 // Static bars when no audio data
                 [...leftBars, ...rightBars].forEach(bar => {
                     bar.targetHeight = 0.3 + Math.sin(time * 0.5 + bar.position.x * 0.1) * 0.2;
                     bar.currentHeight = bar.currentHeight * 0.9 + bar.targetHeight * 0.1;
                     bar.scale.y = bar.currentHeight;
                     bar.position.y = bar.originalY; // Keep at center - scaling handles the growth
                     bar.material.opacity = 0.3;
                 });
            }
            
            orbitalRenderer.render(orbitalScene, orbitalCamera);
            
            // Continue animation if playing
            if (voiceAgentsAudio && !voiceAgentsAudio.paused) {
                orbitalAnimationId = requestAnimationFrame(animateOrbitalVisualizer);
            }
        };
        
        // Voice agents audio controls with 3D orbital visualizer
        if (playVoiceAgentsBtn && voiceAgentsAudio) {
            console.log('Setting up voice agents audio controls with 3D visualizer');
            
            // Initialize the 3D orbital visualizer
            initOrbitalVisualizer();
            
            // Add error handling for audio loading
            voiceAgentsAudio.addEventListener('error', (e) => {
                console.error('Audio loading error:', e);
                console.error('Audio error details:', voiceAgentsAudio.error);
                
                // More user-friendly error handling
                if (voiceAgentsAudio.error) {
                    switch (voiceAgentsAudio.error.code) {
                        case 1: // MEDIA_ERR_ABORTED
                            console.log('Audio loading was aborted');
                            if (voicePlayText) voicePlayText.textContent = 'Play Demo';
                            break;
                        case 2: // MEDIA_ERR_NETWORK
                            console.log('Network error while loading audio');
                            if (voicePlayText) voicePlayText.textContent = 'Network Error';
                            break;
                        case 3: // MEDIA_ERR_DECODE
                            console.log('Audio decoding error');
                            if (voicePlayText) voicePlayText.textContent = 'Audio Error';
                            break;
                        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                            console.log('Audio format not supported');
                            if (voicePlayText) voicePlayText.textContent = 'Format Error';
                            break;
                        default:
                            if (voicePlayText) voicePlayText.textContent = 'Audio Error';
                    }
                } else {
                    if (voicePlayText) voicePlayText.textContent = 'Play Demo'; // Reset on generic error
                }
            });
            
            voiceAgentsAudio.addEventListener('canplay', () => {
                console.log('Audio can play');
                // Reset button text if it was showing an error
                if (voicePlayText && voicePlayText.textContent !== 'Play Demo' && voicePlayText.textContent !== 'Pause') {
                    voicePlayText.textContent = 'Play Demo';
                }
            });
            
            voiceAgentsAudio.addEventListener('loadstart', () => {
                console.log('Audio loading started');
                if (voicePlayText) voicePlayText.textContent = 'Loading...';
            });
            
            voiceAgentsAudio.addEventListener('loadeddata', () => {
                console.log('Audio data loaded');
                if (voicePlayText && voicePlayText.textContent === 'Loading...') {
                    voicePlayText.textContent = 'Play Demo';
                }
            });
            
            
            voiceAgentsAudio.addEventListener('loadeddata', () => {
                console.log('Audio data loaded');
            });
            
            // Add more debugging events
            voiceAgentsAudio.addEventListener('loadedmetadata', () => {
                console.log('Audio metadata loaded, duration:', voiceAgentsAudio.duration);
            });
            
            voiceAgentsAudio.addEventListener('canplaythrough', () => {
                console.log('Audio can play through');
            });
            
            voiceAgentsAudio.addEventListener('play', () => {
                console.log('Audio PLAY event fired');
            });
            
            voiceAgentsAudio.addEventListener('playing', () => {
                console.log('Audio PLAYING event fired');
            });
            
            voiceAgentsAudio.addEventListener('timeupdate', () => {
                console.log('Audio time update:', voiceAgentsAudio.currentTime);
            }, { once: true }); // Only log first time update
            
            voiceAgentsAudio.addEventListener('stalled', () => {
                console.log('Audio STALLED');
            });
            
            voiceAgentsAudio.addEventListener('waiting', () => {
                console.log('Audio WAITING for data');
            });
            
            // Add a simple test button functionality
            window.testAudioSimple = function() {
                console.log('=== SIMPLE AUDIO TEST ===');
                const audio = document.getElementById('voice-agents-audio');
                audio.currentTime = 0;
                audio.play().then(() => {
                    console.log('Simple audio test: SUCCESS');
                }).catch(err => {
                    console.log('Simple audio test: FAILED', err);
                });
            };
            
            playVoiceAgentsBtn.addEventListener('click', async () => {
                console.log('Voice agents play button clicked');
                
                try {
                    if (voiceAgentsAudio.paused) {
                        // Simple play - reset to beginning and play
                        voiceAgentsAudio.currentTime = 0;
                        voiceAgentsAudio.volume = 1.0;
                        voiceAgentsAudio.muted = false;
                        
                        await voiceAgentsAudio.play();
                        console.log('Audio playing');
                        
                        // Update UI
                        if (voicePlayIcon) voicePlayIcon.classList.add('hidden');
                        if (voicePauseIcon) voicePauseIcon.classList.remove('hidden');
                        if (voicePlayText) voicePlayText.textContent = 'Pause';
                        
                        // Try to resume audio context and start animation
                        if (orbitalAudioContext && orbitalAudioContext.state === 'suspended') {
                            orbitalAudioContext.resume();
                        }
                        
                        // Start 3D orbital animation
                        startOrbitalVisualizer();
                        animateOrbitalVisualizer();
                    } else {
                        // Simple pause
                        voiceAgentsAudio.pause();
                        console.log('Audio paused');
                        
                        // Update UI
                        if (voicePlayIcon) voicePlayIcon.classList.remove('hidden');
                        if (voicePauseIcon) voicePauseIcon.classList.add('hidden');
                        if (voicePlayText) voicePlayText.textContent = 'Play Demo';
                        
                        // Stop 3D orbital animation
                        if (orbitalAnimationId) {
                            cancelAnimationFrame(orbitalAnimationId);
                            orbitalAnimationId = null;
                        }
                        
                        stopOrbitalVisualizer();
                    }
                } catch (error) {
                    console.error('Audio playback failed:', error);
                    
                    // Check if it's an autoplay policy error
                    if (error.name === 'NotAllowedError') {
                        console.log('Autoplay was prevented by browser policy');
                        if (voicePlayText) voicePlayText.textContent = 'Click to Play';
                    } else {
                        console.error('Other audio error:', error.message);
                        if (voicePlayText) voicePlayText.textContent = 'Audio Error';
                    }
                    
                    // Reset UI state on error
                    if (voicePlayIcon) voicePlayIcon.classList.remove('hidden');
                    if (voicePauseIcon) voicePauseIcon.classList.add('hidden');
                    drawStaticWaveform();
                }
            });
            
            voiceAgentsAudio.addEventListener('ended', () => {
                console.log('Audio ended');
                if (voicePlayIcon) voicePlayIcon.classList.remove('hidden');
                if (voicePauseIcon) voicePauseIcon.classList.add('hidden');
                if (voicePlayText) voicePlayText.textContent = 'Play Demo';
                
                // Stop 3D orbital animation
                if (orbitalAnimationId) {
                    cancelAnimationFrame(orbitalAnimationId);
                    orbitalAnimationId = null;
                }
                stopOrbitalVisualizer();
            });
        } else {
            console.log('Voice agents audio elements not found');
            console.log('playVoiceAgentsBtn:', playVoiceAgentsBtn);
            console.log('voiceAgentsAudio:', voiceAgentsAudio);
        }
        
        // Video mute controls
        const videoMuteBtn = document.getElementById('video-mute-btn');
        const volumeOnIcon = document.getElementById('volume-on-icon');
        const volumeOffIcon = document.getElementById('volume-off-icon');
        const productVideo = document.getElementById('product-video');
        
        if (videoMuteBtn && productVideo) {
            // Start with audio enabled, but mute after 3 seconds for better UX
            setTimeout(() => {
                if (productVideo && !productVideo.paused) {
                    productVideo.muted = true;
                    if (volumeOnIcon) volumeOnIcon.classList.add('hidden');
                    if (volumeOffIcon) volumeOffIcon.classList.remove('hidden');
                }
            }, 3000);
            
            videoMuteBtn.addEventListener('click', () => {
                if (productVideo.muted) {
                    productVideo.muted = false;
                    if (volumeOnIcon) volumeOnIcon.classList.remove('hidden');
                    if (volumeOffIcon) volumeOffIcon.classList.add('hidden');
                } else {
                    productVideo.muted = true;
                    if (volumeOnIcon) volumeOnIcon.classList.add('hidden');
                    if (volumeOffIcon) volumeOffIcon.classList.remove('hidden');
                }
            });
        }
        
        // Watch video button - now scrolls to the video background section
        if (watchVideoBtn) {
            watchVideoBtn.addEventListener('click', () => {
                const videoSection = document.querySelector('.relative.h-screen.w-full.overflow-hidden');
                if (videoSection) {
                    videoSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    };

    // --- Event Listeners and Initial Setup ---
    
    // Scroll effects for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('backdrop-blur-xl', 'bg-white/50', 'dark:bg-slate-800/50', 'border-b', 'border-white/80', 'dark:border-slate-700/80', 'shadow-lg', 'shadow-orange-100/20', 'dark:shadow-slate-900/20');
        } else {
            navbar.classList.remove('backdrop-blur-xl', 'bg-white/50', 'dark:bg-slate-800/50', 'border-b', 'border-white/80', 'dark:border-slate-700/80', 'shadow-lg', 'shadow-orange-100/20', 'dark:shadow-slate-900/20');
        }
    });

    // Modal controls
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalWrapper) {
        modalWrapper.addEventListener('click', (e) => {
            if (e.target === modalWrapper) {
                closeModal();
            }
        });
    }

    // Button Event Listeners to open the modal
    if (demoNavBtn) demoNavBtn.addEventListener('click', () => openModal('demo'));
    if (contactNavBtn) contactNavBtn.addEventListener('click', () => openModal('contact'));
    if (liveDemoHeroBtn) liveDemoHeroBtn.addEventListener('click', () => openModal('demo'));
    if (liveDemoCtaBtn) liveDemoCtaBtn.addEventListener('click', () => openModal('demo'));

    // Industries tab buttons
    industryTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = btn.dataset.tab;
            updateTabs();
        });
    });

    // Initial rendering of dynamic content
    renderSolutions();
    renderVoiceCapabilities();
    initChannelSwitching();
    updateTabs(); // Render initial industry content and update styles
    
    // Setup media controls
    setupMediaControls();
    
    console.log('Website JavaScript loaded successfully');
});