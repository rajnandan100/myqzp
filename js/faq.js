// QP-FAQ-JS-001: FAQ Management System

/**
 * FAQ Manager
 * Handles search, filtering, categorization, and interactions for FAQ system
 */

class FAQManager {
    constructor() {
        this.faqs = [];
        this.filteredFAQs = [];
        this.currentCategory = 'all';
        this.currentSearchQuery = '';
        this.popularQuestions = [];
        this.statistics = {
            totalQuestions: 0,
            totalViews: 0,
            helpfulVotes: 0
        };
    }

    // QP-FAQ-INIT-001: Initialize FAQ system
    async init() {
        try {
            // Load FAQ data
            await this.loadFAQData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Render initial state
            this.renderFAQs();
            this.updateCategoryCounts();
            this.loadPopularQuestions();
            this.updateStatistics();
            
            // Hide loading state
            this.hideLoading();
            
            console.log('✅ FAQ Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize FAQ Manager:', error);
            this.showError('Failed to load FAQ content');
        }
    }

    // QP-FAQ-DATA-001: Load FAQ data
    async loadFAQData() {
        // Simulate API call - in production, this would fetch from your backend
        await this.simulateAsyncOperation(2000);
        
        this.faqs = this.generateSampleFAQs();
        this.filteredFAQs = [...this.faqs];
        
        // Generate statistics
        this.statistics = {
            totalQuestions: this.faqs.length,
            totalViews: this.faqs.reduce((sum, faq) => sum + faq.views, 0),
            helpfulVotes: this.faqs.reduce((sum, faq) => sum + faq.helpful, 0)
        };
    }

    // QP-FAQ-SAMPLE-001: Generate sample FAQ data
    generateSampleFAQs() {
        const faqData = [
            {
                id: 'faq_001',
                category: 'account',
                question: 'How do I reset my password?',
                answer: `<p>To reset your password, follow these simple steps:</p>
                <ol>
                    <li>Go to the <a href="../auth/sign-in.html">Sign In page</a></li>
                    <li>Click on "Forgot Password" link below the login form</li>
                    <li>Enter your registered email address</li>
                    <li>Check your email for a password reset link</li>
                    <li>Click the link and create a new password</li>
                </ol>
                <p><strong>Note:</strong> The reset link expires in 24 hours for security reasons.</p>
                <h6>Still having trouble?</h6>
                <p>If you don't receive the reset email, check your spam folder or <a href="contact.html">contact our support team</a>.</p>`,
                popularity: 95,
                helpful: 128,
                notHelpful: 12,
                views: 2847,
                dateAdded: '2024-12-15',
                tags: ['password', 'reset', 'login', 'account', 'email']
            },
            {
                id: 'faq_002',
                category: 'quizzes',
                question: 'How is quiz scoring calculated?',
                answer: `<p>Our quiz scoring system is designed to be fair and accurate:</p>
                <h6>Basic Scoring:</h6>
                <ul>
                    <li><span class="highlight">Correct Answer:</span> +1 point</li>
                    <li><span class="highlight">Wrong Answer:</span> -0.25 points (negative marking)</li>
                    <li><span class="highlight">Unattempted:</span> 0 points</li>
                </ul>
                <h6>Time Bonus:</h6>
                <p>You can earn up to 20% bonus points based on completion time:</p>
                <ul>
                    <li>Complete in first 50% of time: +20% bonus</li>
                    <li>Complete in first 75% of time: +10% bonus</li>
                    <li>Complete after 75%: No time bonus</li>
                </ul>
                <h6>Final Score:</h6>
                <p>Your percentage is calculated as: <code>(Your Points / Total Points) × 100</code></p>`,
                popularity: 87,
                helpful: 95,
                notHelpful: 8,
                views: 1923,
                dateAdded: '2024-12-10',
                tags: ['quiz', 'scoring', 'points', 'calculation', 'time bonus']
            },
            {
                id: 'faq_003',
                category: 'premium',
                question: 'What are the benefits of Premium membership?',
                answer: `<p>Premium membership unlocks exclusive features to supercharge your learning:</p>
                <h6>📚 Content Access:</h6>
                <ul>
                    <li>Access to 500+ premium study materials</li>
                    <li>Detailed solutions for all practice questions</li>
                    <li>Monthly current affairs PDFs</li>
                    <li>Subject-wise mock tests</li>
                </ul>
                <h6>📊 Advanced Analytics:</h6>
                <ul>
                    <li>Detailed performance analytics</li>
                    <li>Weak area identification</li>
                    <li>Progress tracking across subjects</li>
                    <li>Personalized study recommendations</li>
                </ul>
                <h6>🎯 Additional Benefits:</h6>
                <ul>
                    <li>Ad-free experience</li>
                    <li>Priority customer support</li>
                    <li>Early access to new features</li>
                    <li>Unlimited downloads</li>
                </ul>
                <p><strong>Pricing:</strong> ₹299/month or ₹2499/year (save 30%)</p>`,
                popularity: 78,
                helpful: 156,
                notHelpful: 15,
                views: 3241,
                dateAdded: '2024-11-28',
                tags: ['premium', 'membership', 'benefits', 'pricing', 'features']
            },
            {
                id: 'faq_004',
                category: 'materials',
                question: 'How do I download study materials?',
                answer: `<p>Downloading study materials is easy and straightforward:</p>
                <h6>For Free Materials:</h6>
                <ol>
                    <li>Navigate to the <a href="study-materials.html">Study Materials page</a></li>
                    <li>Browse or search for the material you need</li>
                    <li>Click the "Download" button on the material card</li>
                    <li>The PDF will automatically download to your device</li>
                </ol>
                <h6>For Premium Materials:</h6>
                <p>Premium materials require an active subscription:</p>
                <ul>
                    <li>Sign up for Premium membership</li>
                    <li>Once subscribed, all premium materials become downloadable</li>
                    <li>Look for the <span class="highlight">👑 Premium</span> badge</li>
                </ul>
                <h6>Download Limits:</h6>
                <ul>
                    <li><strong>Free users:</strong> Up to 5 downloads per day</li>
                    <li><strong>Premium users:</strong> Unlimited downloads</li>
                </ul>`,
                popularity: 82,
                helpful: 89,
                notHelpful: 6,
                views: 2156,
                dateAdded: '2024-12-05',
                tags: ['download', 'study materials', 'pdf', 'premium', 'free']
            },
            {
                id: 'faq_005',
                category: 'technical',
                question: 'The website is loading slowly. What can I do?',
                answer: `<p>If you're experiencing slow loading times, try these troubleshooting steps:</p>
                <h6>🔧 Quick Fixes:</h6>
                <ol>
                    <li><strong>Clear Browser Cache:</strong> Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)</li>
                    <li><strong>Check Internet Connection:</strong> Ensure stable internet connectivity</li>
                    <li><strong>Close Unnecessary Tabs:</strong> Free up browser memory</li>
                    <li><strong>Update Browser:</strong> Use the latest version for optimal performance</li>
                </ol>
                <h6>🌐 Network Issues:</h6>
                <ul>
                    <li>Try switching to a different network (mobile data/WiFi)</li>
                    <li>Use a VPN if accessing from restricted networks</li>
                    <li>Check if the issue persists across different devices</li>
                </ul>
                <h6>📱 Mobile Users:</h6>
                <ul>
                    <li>Close other apps running in background</li>
                    <li>Ensure sufficient storage space</li>
                    <li>Try using mobile data instead of WiFi</li>
                </ul>
                <p><strong>Still having issues?</strong> <a href="contact.html">Contact our technical support team</a> with details about your device and browser.</p>`,
                popularity: 65,
                helpful: 72,
                notHelpful: 18,
                views: 1654,
                dateAdded: '2024-12-01',
                tags: ['loading', 'slow', 'performance', 'technical', 'troubleshooting']
            },
            {
                id: 'faq_006',
                category: 'billing',
                question: 'How do I cancel my Premium subscription?',
                answer: `<p>You can cancel your Premium subscription anytime without any hassle:</p>
                <h6>📱 From Dashboard:</h6>
                <ol>
                    <li>Log in to your account</li>
                    <li>Go to <a href="../auth/dashboard.html">Dashboard</a></li>
                    <li>Click on "Account Settings"</li>
                    <li>Select "Billing & Subscription"</li>
                    <li>Click "Cancel Subscription"</li>
                    <li>Confirm your cancellation</li>
                </ol>
                <h6>📧 Via Email:</h6>
                <p>Send a cancellation request to <a href="mailto:billing@quizportal.com">billing@quizportal.com</a> with:</p>
                <ul>
                    <li>Your registered email address</li>
                    <li>Reason for cancellation (optional)</li>
                    <li>We'll process it within 24 hours</li>
                </ul>
                <h6>⏰ What happens after cancellation:</h6>
                <ul>
                    <li>Your Premium access continues until the end of current billing period</li>
                    <li>No charges for the next billing cycle</li>
                    <li>You can resubscribe anytime to regain access</li>
                    <li>Your progress and data are preserved</li>
                </ul>
                <p><strong>💰 Refund Policy:</strong> 7-day money-back guarantee for new subscriptions.</p>`,
                popularity: 71,
                helpful: 84,
                notHelpful: 9,
                views: 1876,
                dateAdded: '2024-11-25',
                tags: ['cancel', 'subscription', 'billing', 'refund', 'premium']
            },
            {
                id: 'faq_007',
                category: 'privacy',
                question: 'Is my personal data safe and secure?',
                answer: `<p>Absolutely! We take your privacy and data security very seriously:</p>
                <h6>🔒 Security Measures:</h6>
                <ul>
                    <li><strong>SSL Encryption:</strong> All data transmitted is encrypted using TLS 1.3</li>
                    <li><strong>Secure Servers:</strong> Hosted on secure, regularly updated servers</li>
                    <li><strong>Regular Audits:</strong> Annual security audits and penetration testing</li>
                    <li><strong>Access Controls:</strong> Strict access limitations for our staff</li>
                </ul>
                <h6>📊 Data We Collect:</h6>
                <ul>
                    <li>Account information (name, email)</li>
                    <li>Quiz performance and progress data</li>
                    <li>Usage analytics (anonymized)</li>
                    <li>Technical data for troubleshooting</li>
                </ul>
                <h6>🚫 What We DON'T Do:</h6>
                <ul>
                    <li>We never sell your data to third parties</li>
                    <li>We don't share personal info without consent</li>
                    <li>We don't track you outside our platform</li>
                </ul>
                <h6>🛡️ Your Rights:</h6>
                <p>Under GDPR and other privacy laws, you can:</p>
                <ul>
                    <li>Request a copy of your data</li>
                    <li>Update or correct your information</li>
                    <li>Delete your account and data</li>
                    <li>Opt-out of marketing communications</li>
                </ul>
                <p>Read our complete <a href="privacy.html">Privacy Policy</a> for detailed information.</p>`,
                popularity: 59,
                helpful: 67,
                notHelpful: 5,
                views: 1432,
                dateAdded: '2024-12-08',
                tags: ['privacy', 'security', 'data', 'GDPR', 'safe']
            },
            {
                id: 'faq_008',
                category: 'account',
                question: 'How do I update my profile information?',
                answer: `<p>Keeping your profile updated ensures you receive relevant content and communications:</p>
                <h6>📝 Update Basic Information:</h6>
                <ol>
                    <li>Log in to your account</li>
                    <li>Go to <a href="../auth/dashboard.html">Dashboard</a></li>
                    <li>Click on "Profile Settings" or your profile picture</li>
                    <li>Edit the fields you want to update</li>
                    <li>Click "Save Changes"</li>
                </ol>
                <h6>✏️ What You Can Update:</h6>
                <ul>
                    <li><strong>Personal Info:</strong> Name, profile picture, bio</li>
                    <li><strong>Contact:</strong> Email address, phone number</li>
                    <li><strong>Preferences:</strong> Study subjects, difficulty level</li>
                    <li><strong>Notifications:</strong> Email and push notification settings</li>
                </ul>
                <h6>🔔 Important Notes:</h6>
                <ul>
                    <li>Email changes require verification</li>
                    <li>Some changes may take a few minutes to reflect</li>
                    <li>Your username cannot be changed once set</li>
                </ul>
                <p><strong>Need help?</strong> <a href="contact.html">Contact support</a> if you can't update certain information.</p>`,
                popularity: 44,
                helpful: 52,
                notHelpful: 3,
                views: 987,
                dateAdded: '2024-12-12',
                tags: ['profile', 'update', 'settings', 'account', 'information']
            },
            {
                id: 'faq_009',
                category: 'quizzes',
                question: 'Can I retake a quiz I\'ve already completed?',
                answer: `<p>Yes, you can retake most quizzes to improve your understanding and score:</p>
                <h6>🔄 Retake Rules:</h6>
                <ul>
                    <li><strong>Practice Quizzes:</strong> Unlimited retakes anytime</li>
                    <li><strong>Mock Tests:</strong> Can retake after 24 hours</li>
                    <li><strong>Timed Challenges:</strong> Limited retakes (varies by quiz)</li>
                    <li><strong>Certification Tests:</strong> Usually one-time only</li>
                </ul>
                <h6>📊 How Retakes Affect Scoring:</h6>
                <ul>
                    <li>Your highest score is always recorded</li>
                    <li>Previous attempts remain in your history</li>
                    <li>Leaderboard shows your best performance</li>
                    <li>Analytics track improvement over time</li>
                </ul>
                <h6>✨ Tips for Better Results:</h6>
                <ol>
                    <li>Review explanations from previous attempts</li>
                    <li>Study relevant materials before retaking</li>
                    <li>Focus on areas where you scored poorly</li>
                    <li>Use the time limit effectively</li>
                </ol>
                <p><strong>💡 Pro Tip:</strong> Premium users get detailed analytics showing exactly which topics to focus on for improvement!</p>`,
                popularity: 76,
                helpful: 89,
                notHelpful: 11,
                views: 2103,
                dateAdded: '2024-11-30',
                tags: ['retake', 'quiz', 'score', 'improvement', 'practice']
            },
            {
                id: 'faq_010',
                category: 'materials',
                question: 'Are the study materials updated regularly?',
                answer: `<p>Yes! We constantly update our study materials to ensure you have the latest and most accurate content:</p>
                <h6>📅 Update Schedule:</h6>
                <ul>
                    <li><strong>Current Affairs:</strong> Daily updates</li>
                    <li><strong>Subject Materials:</strong> Monthly reviews and updates</li>
                    <li><strong>Practice Questions:</strong> Weekly additions</li>
                    <li><strong>Mock Tests:</strong> New tests added bi-weekly</li>
                </ul>
                <h6>🔍 What Gets Updated:</h6>
                <ul>
                    <li>Latest syllabus changes</li>
                    <li>Recent exam patterns</li>
                    <li>New government policies (for competitive exams)</li>
                    <li>Error corrections and improvements</li>
                    <li>User feedback incorporations</li>
                </ul>
                <h6>🔔 Staying Informed:</h6>
                <ul>
                    <li><strong>Notifications:</strong> Get alerts for important updates</li>
                    <li><strong>Newsletter:</strong> Weekly summary of new content</li>
                    <li><strong>Dashboard:</strong> "New" badges on recently updated materials</li>
                </ul>
                <h6>👥 Community Contribution:</h6>
                <p>Found an error or outdated information? <a href="contact.html">Report it</a> and help improve materials for everyone!</p>
                <p><strong>Quality Assurance:</strong> All content is reviewed by subject matter experts before publication.</p>`,
                popularity: 38,
                helpful: 41,
                notHelpful: 2,
                views: 756,
                dateAdded: '2024-12-03',
                tags: ['updates', 'materials', 'current', 'fresh', 'quality']
            }
        ];

        return faqData.map(faq => ({
            ...faq,
            isPopular: faq.popularity > 70,
            helpfulness: faq.helpful / (faq.helpful + faq.notHelpful) * 100
        }));
    }

    // QP-FAQ-EVENTS-001: Setup event listeners
    setupEventListeners() {
        // Global functions for category filtering
        window.filterByCategory = (category) => this.filterByCategory(category);
        window.searchWithinResults = () => this.searchWithinResults();
        window.clearSearch = () => this.clearSearch();
        
        // Global functions for modals
        window.suggestQuestion = () => this.showSuggestQuestionModal();
        window.requestCallback = () => this.showCallbackModal();
        window.submitSuggestedQuestion = () => this.submitSuggestedQuestion();
        window.submitCallbackRequest = () => this.submitCallbackRequest();
        
        // Global functions for feedback
        window.submitFeedback = (type) => this.submitFeedback(type);
        window.submitDetailedFeedback = () => this.submitDetailedFeedback();
        
        // Search within input
        const searchWithinInput = document.getElementById('searchWithinInput');
        if (searchWithinInput) {
            searchWithinInput.addEventListener('input', debounce(() => {
                this.searchWithinResults();
            }, 300));
        }
        
        // Setup click handlers for FAQ items
        this.setupFAQClickHandlers();
    }

    // QP-FAQ-RENDER-001: Render FAQs
    renderFAQs() {
        const accordionContainer = document.getElementById('faqAccordion');
        if (!accordionContainer) return;
        
        if (this.filteredFAQs.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.hideNoResults();
        
        const faqHTML = this.filteredFAQs.map((faq, index) => this.renderFAQItem(faq, index)).join('');
        accordionContainer.innerHTML = faqHTML;
        
        // Setup click handlers for new items
        this.setupFAQClickHandlers();
        
        // Update search results header
        this.updateSearchResultsHeader();
    }

    // QP-FAQ-ITEM-001: Render individual FAQ item
    renderFAQItem(faq, index) {
        const categoryColors = {
            account: 'primary',
            quizzes: 'success', 
            premium: 'warning',
            materials: 'info',
            technical: 'danger',
            billing: 'secondary',
            privacy: 'dark'
        };
        
        const categoryColor = categoryColors[faq.category] || 'primary';
        const highlightedAnswer = this.highlightSearchTerms(faq.answer);
        
        return `
            <div class="faq-item" data-category="${faq.category}" data-faq-id="${faq.id}">
                <button class="faq-question" data-bs-toggle="collapse" data-bs-target="#faq-${faq.id}" 
                        aria-expanded="false" onclick="trackFAQView('${faq.id}')">
                    <div class="question-text">
                        <span class="question-category badge bg-${categoryColor}">${this.getCategoryName(faq.category)}</span>
                        <span>${this.highlightSearchTerms(faq.question)}</span>
                    </div>
                    <div class="question-meta">
                        ${faq.isPopular ? '<div class="question-popularity"><i class="fas fa-fire text-danger"></i><span>Popular</span></div>' : ''}
                        <i class="fas fa-chevron-down expand-icon"></i>
                    </div>
                </button>
                <div id="faq-${faq.id}" class="faq-answer collapse" data-bs-parent="#faqAccordion">
                    <div class="answer-content">
                        ${highlightedAnswer}
                    </div>
                    <div class="answer-actions">
                        <div class="helpful-actions">
                            <button class="helpful-btn" onclick="markHelpful('${faq.id}', true)" data-faq-id="${faq.id}">
                                <i class="fas fa-thumbs-up me-1"></i>Helpful (${faq.helpful})
                            </button>
                            <button class="helpful-btn" onclick="markHelpful('${faq.id}', false)" data-faq-id="${faq.id}">
                                <i class="fas fa-thumbs-down me-1"></i>Not Helpful (${faq.notHelpful})
                            </button>
                        </div>
                        <div class="answer-stats">
                            <div class="stat-item">
                                <i class="fas fa-eye"></i>
                                <span>${faq.views} views</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-calendar"></i>
                                <span>Updated ${this.formatDate(faq.dateAdded)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // QP-FAQ-HANDLERS-001: Setup FAQ click handlers
    setupFAQClickHandlers() {
        // Global functions for FAQ interactions
        window.trackFAQView = (faqId) => this.trackFAQView(faqId);
        window.markHelpful = (faqId, isHelpful) => this.markHelpful(faqId, isHelpful);
        
        // Setup collapse event listeners
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', (e) => {
                const icon = button.querySelector('.expand-icon');
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                // Toggle icon rotation
                setTimeout(() => {
                    button.setAttribute('aria-expanded', !isExpanded);
                    button.classList.toggle('active', !isExpanded);
                    
                    const answer = document.getElementById(button.getAttribute('data-bs-target').substring(1));
                    if (answer) {
                        answer.classList.toggle('active', !isExpanded);
                    }
                }, 100);
            });
        });
    }

    // QP-FAQ-FILTER-001: Filter by category
    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Filter FAQs
        if (category === 'all') {
            this.filteredFAQs = [...this.faqs];
        } else {
            this.filteredFAQs = this.faqs.filter(faq => faq.category === category);
        }
        
        // Apply search if active
        if (this.currentSearchQuery) {
            this.applySearch();
        }
        
        this.renderFAQs();
    }

    // QP-FAQ-SEARCH-001: Search functionality
    searchFAQ(query) {
        this.currentSearchQuery = query.toLowerCase().trim();
        
        if (this.currentSearchQuery) {
            this.applySearch();
            this.showSearchResults();
        } else {
            this.clearSearch();
        }
        
        this.renderFAQs();
    }

    applySearch() {
        const query = this.currentSearchQuery;
        
        this.filteredFAQs = this.filteredFAQs.filter(faq => {
            return faq.question.toLowerCase().includes(query) ||
                   faq.answer.toLowerCase().includes(query) ||
                   faq.tags.some(tag => tag.toLowerCase().includes(query)) ||
                   faq.category.toLowerCase().includes(query);
        });
        
        // Sort by relevance (exact matches first)
        this.filteredFAQs.sort((a, b) => {
            const aScore = this.calculateRelevanceScore(a, query);
            const bScore = this.calculateRelevanceScore(b, query);
            return bScore - aScore;
        });
    }

    calculateRelevanceScore(faq, query) {
        let score = 0;
        
        // Question title matches get highest score
        if (faq.question.toLowerCase().includes(query)) {
            score += faq.question.toLowerCase().indexOf(query) === 0 ? 10 : 5;
        }
        
        // Tag matches
        if (faq.tags.some(tag => tag.toLowerCase().includes(query))) {
            score += 3;
        }
        
        // Answer content matches
        if (faq.answer.toLowerCase().includes(query)) {
            score += 1;
        }
        
        // Popular questions get slight boost
        if (faq.isPopular) {
            score += 0.5;
        }
        
        return score;
    }

    searchWithinResults() {
        const searchInput = document.getElementById('searchWithinInput');
        if (searchInput) {
            this.searchFAQ(searchInput.value);
        }
    }

    // QP-FAQ-HIGHLIGHT-001: Highlight search terms
    highlightSearchTerms(text) {
        if (!this.currentSearchQuery) return text;
        
        const regex = new RegExp(`(${this.escapeRegex(this.currentSearchQuery)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // QP-FAQ-CLEAR-001: Clear search
    clearSearch() {
        this.currentSearchQuery = '';
        
        // Clear input fields
        const heroInput = document.getElementById('heroSearchInput');
        const searchWithinInput = document.getElementById('searchWithinInput');
        
        if (heroInput) heroInput.value = '';
        if (searchWithinInput) searchWithinInput.value = '';
        
        // Reset to category filter
        this.filterByCategory(this.currentCategory);
        
        // Hide search results header
        this.hideSearchResults();
    }

    // QP-FAQ-COUNTS-001: Update category counts
    updateCategoryCounts() {
        const counts = {};
        counts.all = this.faqs.length;
        
        // Count by category
        this.faqs.forEach(faq => {
            counts[faq.category] = (counts[faq.category] || 0) + 1;
        });
        
        // Update UI
        Object.keys(counts).forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                countElement.textContent = counts[category] || 0;
            }
        });
    }

    // QP-FAQ-POPULAR-001: Load popular questions
    loadPopularQuestions() {
        this.popularQuestions = this.faqs
            .filter(faq => faq.isPopular)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 6);
        
        this.renderPopularQuestions();
    }

    renderPopularQuestions() {
        const container = document.getElementById('popularQuestionsList');
        if (!container) return;
        
        const html = this.popularQuestions.map(faq => `
            <div class="col-md-6 col-lg-4">
                <div class="popular-question-card" onclick="openFAQ('${faq.id}')">
                    <i class="fas fa-question-circle question-icon"></i>
                    <h6>${faq.question}</h6>
                    <p class="question-preview">${this.stripHtml(faq.answer).substring(0, 100)}...</p>
                    <span class="badge bg-primary question-badge">${this.getCategoryName(faq.category)}</span>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        
        // Global function for opening FAQ
        window.openFAQ = (faqId) => this.openFAQ(faqId);
    }

    // QP-FAQ-OPEN-001: Open specific FAQ
    openFAQ(faqId) {
        const faq = this.faqs.find(f => f.id === faqId);
        if (!faq) return;
        
        // Filter to show all if needed
        if (this.currentCategory !== 'all' && this.currentCategory !== faq.category) {
            this.filterByCategory('all');
        }
        
        // Clear search to ensure FAQ is visible
        if (this.currentSearchQuery) {
            this.clearSearch();
        }
        
        // Wait for render then scroll and open
        setTimeout(() => {
            const faqElement = document.querySelector(`[data-faq-id="${faqId}"]`);
            if (faqElement) {
                // Scroll to FAQ
                faqElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Open the FAQ
                const question = faqElement.querySelector('.faq-question');
                const answer = faqElement.querySelector('.faq-answer');
                
                if (question && answer) {
                    // Trigger the collapse
                    const bsCollapse = new bootstrap.Collapse(answer, { show: true });
                    
                    // Update UI state
                    question.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    answer.classList.add('active');
                    
                    // Highlight the FAQ
                    faqElement.classList.add('highlighted');
                    setTimeout(() => {
                        faqElement.classList.remove('highlighted');
                    }, 3000);
                }
            }
        }, 100);
    }

    // QP-FAQ-TRACK-001: Track FAQ interactions
    trackFAQView(faqId) {
        const faq = this.faqs.find(f => f.id === faqId);
        if (faq) {
            faq.views += 1;
            this.updateStatistics();
            
            // In production, send analytics to backend
            console.log(`FAQ viewed: ${faqId} (${faq.views} total views)`);
        }
    }

    markHelpful(faqId, isHelpful) {
        const faq = this.faqs.find(f => f.id === faqId);
        if (!faq) return;
        
        // Check if user already voted
        const votedFAQs = JSON.parse(localStorage.getItem('faq_votes') || '{}');
        if (votedFAQs[faqId]) {
            Swal.fire({
                title: 'Already Voted',
                text: 'You have already provided feedback for this question.',
                icon: 'info',
                confirmButtonColor: '#6366f1'
            });
            return;
        }
        
        // Update counts
        if (isHelpful) {
            faq.helpful += 1;
        } else {
            faq.notHelpful += 1;
        }
        
        // Store vote
        votedFAQs[faqId] = isHelpful;
        localStorage.setItem('faq_votes', JSON.stringify(votedFAQs));
        
        // Update UI
        const buttons = document.querySelectorAll(`[onclick="markHelpful('${faqId}', ${isHelpful})"]`);
        buttons.forEach(btn => {
            btn.classList.add('voted');
            btn.disabled = true;
            
            // Update count
            const text = btn.innerHTML;
            const newCount = isHelpful ? faq.helpful : faq.notHelpful;
            btn.innerHTML = text.replace(/\(\d+\)/, `(${newCount})`);
        });
        
        // Show thank you message
        Swal.fire({
            title: 'Thank You!',
            text: 'Your feedback helps us improve our FAQ section.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
        this.updateStatistics();
    }

    // QP-FAQ-STATS-001: Update statistics
    updateStatistics() {
        this.statistics = {
            totalQuestions: this.faqs.length,
            totalViews: this.faqs.reduce((sum, faq) => sum + faq.views, 0),
            helpfulVotes: this.faqs.reduce((sum, faq) => sum + faq.helpful, 0)
        };
        
        // Animate counters
        this.animateCounter('totalQuestions', this.statistics.totalQuestions);
        this.animateCounter('totalViews', this.statistics.totalViews);
        this.animateCounter('helpfulVotes', this.statistics.helpfulVotes);
    }

    // QP-FAQ-MODAL-001: Show suggest question modal
    showSuggestQuestionModal() {
        const modal = new bootstrap.Modal(document.getElementById('suggestQuestionModal'));
        modal.show();
    }

    showCallbackModal() {
        const modal = new bootstrap.Modal(document.getElementById('callbackModal'));
        modal.show();
    }

    // QP-FAQ-SUBMIT-001: Submit suggested question
    async submitSuggestedQuestion() {
        const form = document.getElementById('suggestQuestionForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const data = {
            question: document.getElementById('suggestedQuestion').value,
            category: document.getElementById('questionCategory').value,
            context: document.getElementById('questionContext').value,
            email: document.getElementById('userEmail').value
        };
        
        try {
            // Simulate API call
            await this.simulateAsyncOperation(1500);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('suggestQuestionModal'));
            modal.hide();
            
            // Show success message
            await Swal.fire({
                title: 'Question Submitted! 🎉',
                html: `
                    <p>Thank you for suggesting a question! Our team will review it and add it to the FAQ if it helps other users.</p>
                    <p class="text-muted mt-3"><strong>Reference ID:</strong> #FAQ${Date.now().toString().slice(-6)}</p>
                    ${data.email ? '<p class="text-muted">We\'ll notify you when your question is added.</p>' : ''}
                `,
                icon: 'success',
                confirmButtonColor: '#6366f1'
            });
            
            // Reset form
            form.reset();
            
        } catch (error) {
            Swal.fire({
                title: 'Submission Failed',
                text: 'There was an error submitting your question. Please try again.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        }
    }

    // QP-FAQ-CALLBACK-001: Submit callback request
    async submitCallbackRequest() {
        const form = document.getElementById('callbackForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const data = {
            name: document.getElementById('callbackName').value,
            phone: document.getElementById('callbackPhone').value,
            email: document.getElementById('callbackEmail').value,
            preferredTime: document.getElementById('preferredTime').value,
            reason: document.getElementById('callbackReason').value
        };
        
        try {
            // Simulate API call
            await this.simulateAsyncOperation(1500);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('callbackModal'));
            modal.hide();
            
            // Show success message
            await Swal.fire({
                title: 'Callback Requested! 📞',
                html: `
                    <p>Our support team will call you within 24 hours.</p>
                    <div class="mt-3 p-3 bg-light rounded text-start">
                        <strong>Request Details:</strong><br>
                        Name: ${data.name}<br>
                        Phone: ${data.phone}<br>
                        Preferred Time: ${data.preferredTime || 'Anytime'}<br>
                        Reference: #CB${Date.now().toString().slice(-6)}
                    </div>
                    <p class="text-muted mt-3">You'll receive a confirmation email shortly.</p>
                `,
                icon: 'success',
                confirmButtonColor: '#6366f1'
            });
            
            // Reset form
            form.reset();
            
        } catch (error) {
            Swal.fire({
                title: 'Request Failed',
                text: 'There was an error submitting your callback request. Please try again.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        }
    }

    // QP-FAQ-FEEDBACK-001: Submit feedback
    submitFeedback(type) {
        const feedbackForm = document.getElementById('feedbackForm');
        
        if (type === 'not-helpful') {
            // Show feedback form for negative feedback
            feedbackForm.style.display = 'block';
            feedbackForm.scrollIntoView({ behavior: '

        } else {
            // Simple feedback without form
            this.recordFeedback(type);
            this.showFeedbackThankYou(type);
        }
    }

    submitDetailedFeedback() {
        const feedbackText = document.getElementById('feedbackText').value;
        
        // Record feedback with details
        this.recordFeedback('detailed', feedbackText);
        
        // Hide feedback form
        document.getElementById('feedbackForm').style.display = 'none';
        
        // Show thank you message
        Swal.fire({
            title: 'Thank You for Your Feedback! 🙏',
            text: 'Your detailed feedback helps us improve our FAQ section for everyone.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
        });
        
        // Clear textarea
        document.getElementById('feedbackText').value = '';
    }

    recordFeedback(type, details = '') {
        const feedback = {
            type: type,
            details: details,
            timestamp: new Date().toISOString(),
            page: 'faq'
        };
        
        // Store feedback locally
        const existingFeedback = JSON.parse(localStorage.getItem('faq_feedback') || '[]');
        existingFeedback.push(feedback);
        localStorage.setItem('faq_feedback', JSON.stringify(existingFeedback));
        
        // In production, send to analytics/backend
        console.log('FAQ Feedback recorded:', feedback);
    }

    showFeedbackThankYou(type) {
        const messages = {
            helpful: 'Great to hear! We\'re glad our FAQ was helpful.',
            somewhat: 'Thanks for the feedback! We\'re always working to improve.',
            'not-helpful': 'Sorry it wasn\'t helpful. Please let us know how we can improve.'
        };
        
        Swal.fire({
            title: 'Thank You!',
            text: messages[type],
            icon: type === 'helpful' ? 'success' : 'info',
            timer: 2500,
            showConfirmButton: false
        });
    }

    // QP-FAQ-UI-STATES-001: UI State Management
    hideLoading() {
        const loadingElement = document.getElementById('faqLoading');
        const accordionElement = document.getElementById('faqAccordion');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (accordionElement) accordionElement.style.display = 'block';
    }

    showNoResults() {
        const noResultsElement = document.getElementById('noResults');
        const accordionElement = document.getElementById('faqAccordion');
        
        if (noResultsElement) noResultsElement.style.display = 'block';
        if (accordionElement) accordionElement.style.display = 'none';
    }

    hideNoResults() {
        const noResultsElement = document.getElementById('noResults');
        if (noResultsElement) noResultsElement.style.display = 'none';
    }

    showSearchResults() {
        const headerElement = document.getElementById('searchResultsHeader');
        if (headerElement) {
            headerElement.style.display = 'block';
            document.getElementById('searchQuery').textContent = this.currentSearchQuery;
        }
    }

    hideSearchResults() {
        const headerElement = document.getElementById('searchResultsHeader');
        if (headerElement) headerElement.style.display = 'none';
    }

    updateSearchResultsHeader() {
        if (this.currentSearchQuery) {
            const countElement = document.getElementById('searchResultsCount');
            if (countElement) {
                countElement.textContent = this.filteredFAQs.length;
            }
        }
    }

    // QP-FAQ-UTILS-001: Utility functions
    getCategoryName(category) {
        const categoryNames = {
            account: 'Account',
            quizzes: 'Quizzes',
            premium: 'Premium',
            materials: 'Materials',
            technical: 'Technical',
            billing: 'Billing',
            privacy: 'Privacy'
        };
        
        return categoryNames[category] || 'General';
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 30);
        const duration = 1000; // 1 second
        const stepTime = duration / (targetValue / increment);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            element.textContent = currentValue.toLocaleString();
        }, stepTime);
    }

    async simulateAsyncOperation(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    showError(message) {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonColor: '#6366f1'
        });
    }

    // Cleanup
    destroy() {
        // Clear any intervals or event listeners
        console.log('FAQ Manager destroyed');
    }
}

// QP-FAQ-DEBOUNCE-001: Debounce utility for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// QP-FAQ-GLOBAL-001: Initialize global FAQ Manager
window.FAQManager = new FAQManager();

// QP-FAQ-READY-001: Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ FAQ System Ready');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.FAQManager) {
        window.FAQManager.destroy();
    }
});






                                         
