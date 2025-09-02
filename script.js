// IvoryTusk Website JavaScript

// Solutions Data
const solutionsData = [
    {
        id: 'voice-agents',
        title: 'Voice Agents',
        description: 'Never miss a customer call again. Our AI voice agents handle inquiries 24/7, book appointments, and qualify leads while you focus on growing your business.',
        gradient: 'from-blue-400 to-blue-600',
        icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z'
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
        description: 'Upload floor plans and get instant 3D visualizations with AI-suggested furniture layouts. Perfect for interior designers and home buyers.',
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
        id: 'conciergeiq',
        title: 'ConciergeIQ',
        description: 'Turn WhatsApp into your smartest sales & support assistant. ConciergeIQ reads customer messages and replies instantly with the right information.',
        gradient: 'from-pink-400 to-pink-600',
        icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
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
            <a href="${solution.id === 'voice-agents' ? '#ai-voice-agents' : '#'}"
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
                            <option value="Home Builders">Home Builders</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Architects">Architects</option>
                            <option value="Home Automation">Home Automation</option>
                            <option value="Other">Other</option>
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
                            <option value="Home Builders">Home Builders</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Architects">Architects</option>
                            <option value="Home Automation">Home Automation</option>
                            <option value="Other">Other</option>
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

    const handleFormSubmit = (event) => {
        event.preventDefault();
        closeModal();
        successMessage.classList.remove('hidden');
        clearTimeout(successTimeout);
        successTimeout = setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
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
        
        // Canvas Audio Visualizer
        const audioCanvas = document.getElementById('audio-canvas');
        const canvasCtx = audioCanvas ? audioCanvas.getContext('2d') : null;
        let audioContext = null;
        let analyser = null;
        let animationId = null;
        
        // Initialize audio visualizer - Use fake animation to avoid CORS issues
        const initAudioVisualizer = async () => {
            if (!audioCanvas || !canvasCtx || !voiceAgentsAudio) {
                console.log('Missing elements for audio visualizer');
                return false;
            }
            
            // Skip Web Audio API to avoid CORS issues and use fake animation
            console.log('Using fake animation for audio visualization');
            return false;
        };
        
        // Draw static waveform when not playing
        const drawStaticWaveform = () => {
            if (!canvasCtx || !audioCanvas) return;
            
            const width = audioCanvas.width;
            const height = audioCanvas.height;
            
            canvasCtx.clearRect(0, 0, width, height);
            canvasCtx.strokeStyle = '#f97316';
            canvasCtx.lineWidth = 2;
            canvasCtx.beginPath();
            
            // Draw a subtle static waveform
            const centerY = height / 2;
            canvasCtx.moveTo(0, centerY);
            
            for (let x = 0; x < width; x += 4) {
                const y = centerY + Math.sin(x * 0.02) * 8 + Math.sin(x * 0.05) * 4;
                canvasCtx.lineTo(x, y);
            }
            
            canvasCtx.stroke();
        };
        
        // Draw animated waveform when playing
        const drawAnimatedWaveform = () => {
            if (!canvasCtx || !audioCanvas) {
                return;
            }
            
            const width = audioCanvas.width;
            const height = audioCanvas.height;
            
            canvasCtx.clearRect(0, 0, width, height);
            canvasCtx.strokeStyle = '#f97316';
            canvasCtx.lineWidth = 2;
            canvasCtx.beginPath();
            
            // Try real audio analysis first
            if (analyser) {
                try {
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    analyser.getByteTimeDomainData(dataArray);
                    
                    const sliceWidth = width / bufferLength;
                    let x = 0;
                    
                    for (let i = 0; i < bufferLength; i++) {
                        const v = dataArray[i] / 128.0;
                        const y = v * height / 2;
                        
                        if (i === 0) {
                            canvasCtx.moveTo(x, y);
                        } else {
                            canvasCtx.lineTo(x, y);
                        }
                        
                        x += sliceWidth;
                    }
                } catch (error) {
                    // Fall back to fake animation if audio analysis fails
                    drawFakeWaveform();
                }
            } else {
                // Use fake animation when real audio analysis isn't available
                drawFakeWaveform();
            }
            
            canvasCtx.stroke();
            
            // Continue animation
            if (voiceAgentsAudio && !voiceAgentsAudio.paused) {
                animationId = requestAnimationFrame(drawAnimatedWaveform);
            }
        };
        
        // Draw fake animated waveform when CORS blocks real analysis
        const drawFakeWaveform = () => {
            if (!canvasCtx || !audioCanvas) return;
            
            const width = audioCanvas.width;
            const height = audioCanvas.height;
            const centerY = height / 2;
            const time = Date.now() * 0.008;
            
            canvasCtx.moveTo(0, centerY);
            
            // Create realistic voice-like waveform
            for (let x = 0; x < width; x += 1) {
                const progress = x / width;
                
                // Multiple frequency components to simulate human voice
                const baseFreq = 0.05;
                const voicePattern = 
                    Math.sin(x * baseFreq + time * 2) * 25 * (0.5 + 0.5 * Math.sin(time * 0.3)) +
                    Math.sin(x * baseFreq * 2.1 + time * 1.7) * 15 * (0.3 + 0.7 * Math.sin(time * 0.7)) +
                    Math.sin(x * baseFreq * 0.5 + time * 0.9) * 35 * (0.4 + 0.6 * Math.sin(time * 0.2)) +
                    (Math.random() - 0.5) * 6; // Add realistic noise
                
                // Natural envelope (stronger in middle, weaker at edges)
                const envelope = Math.sin(progress * Math.PI) * 0.9 + 0.1;
                
                const y = centerY + voicePattern * envelope;
                canvasCtx.lineTo(x, y);
            }
        };
        
        // Voice agents audio controls with canvas animation
        if (playVoiceAgentsBtn && voiceAgentsAudio) {
            console.log('Setting up voice agents audio controls');
            console.log('Audio element found:', voiceAgentsAudio);
            console.log('Audio src:', voiceAgentsAudio.src);
            console.log('Audio current src:', voiceAgentsAudio.currentSrc);
            console.log('Full audio src URL:', new URL(voiceAgentsAudio.src || voiceAgentsAudio.getAttribute('src'), window.location.href).href);
            
            // Test if audio URL is accessible
            fetch(voiceAgentsAudio.src, { method: 'HEAD' })
                .then(response => {
                    console.log('Audio URL test - Status:', response.status);
                    console.log('Audio URL test - Content-Type:', response.headers.get('content-type'));
                    console.log('Audio URL test - Content-Length:', response.headers.get('content-length'));
                })
                .catch(error => {
                    console.error('Audio URL test failed:', error);
                });
            
            // Draw initial static waveform
            drawStaticWaveform();
            
            // Add error handling for audio loading
            voiceAgentsAudio.addEventListener('error', (e) => {
                console.error('Audio loading error:', e);
                console.error('Audio error details:', voiceAgentsAudio.error);
                if (voicePlayText) voicePlayText.textContent = 'Audio Error';
            });
            
            voiceAgentsAudio.addEventListener('canplay', () => {
                console.log('Audio can play');
            });
            
            voiceAgentsAudio.addEventListener('loadstart', () => {
                console.log('Audio loading started');
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
                        
                        // Start simple fake animation
                        drawAnimatedWaveform();
                    } else {
                        // Simple pause
                        voiceAgentsAudio.pause();
                        console.log('Audio paused');
                        
                        // Update UI
                        if (voicePlayIcon) voicePlayIcon.classList.remove('hidden');
                        if (voicePauseIcon) voicePauseIcon.classList.add('hidden');
                        if (voicePlayText) voicePlayText.textContent = 'Play Demo';
                        
                        // Stop animation
                        if (animationId) {
                            cancelAnimationFrame(animationId);
                            animationId = null;
                        }
                        
                        // Draw static waveform
                        drawStaticWaveform();
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
                
                // Stop animation and show static waveform
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                drawStaticWaveform();
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
    updateTabs(); // Render initial industry content and update styles
    
    // Setup media controls
    setupMediaControls();
    
    console.log('Website JavaScript loaded successfully');
});