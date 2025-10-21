// QP-CLERK-AUTH-001: Clerk Authentication Handler

/**
 * Enhanced Clerk Authentication Integration
 * Handles all authentication flows with fallback support
 */

class ClerkAuth {
    constructor() {
        this.clerk = null;
        this.isInitialized = false;
        this.fallbackMode = false;
        this.init();
    }

    // QP-CLERK-INIT-001: Initialize Clerk
    async init() {
        try {
            // Check if Clerk is available
            if (typeof window.Clerk === 'undefined') {
                console.warn('⚠️ Clerk not loaded, using fallback mode');
                this.fallbackMode = true;
                return;
            }

            // Get publishable key from environment or use sample
            const publishableKey = this.getPublishableKey();
            
            // Initialize Clerk
            this.clerk = window.Clerk;
            await this.clerk.load({
                publishableKey: publishableKey,
                signInUrl: '/auth/sign-in.html',
                signUpUrl: '/auth/sign-up.html',
                afterSignInUrl: '/auth/dashboard.html',
                afterSignUpUrl: '/auth/dashboard.html'
            });

            this.isInitialized = true;
            console.log('✅ Clerk initialized successfully');
            
            // Setup global session monitoring
            this.setupSessionMonitoring();
            
        } catch (error) {
            console.error('❌ Clerk initialization failed:', error);
            this.fallbackMode = true;
        }
    }

    // QP-CLERK-KEY-001: Get publishable key
    getPublishableKey() {
        // In production, this would come from environment variables
        // For now, we'll use a sample key that won't work but shows structure
        return process?.env?.CLERK_PUBLISHABLE_KEY || 'pk_test_sample_1234567890abcdef';
    }

    // QP-CLERK-SIGNUP-001: Initialize Sign Up
    async initSignUp() {
        if (this.fallbackMode) {
            this.setupFallbackSignUp();
            return;
        }

        try {
            if (this.clerk && this.isInitialized) {
                // Mount Clerk sign-up component
                const signUpDiv = document.getElementById('clerk-sign-up');
                if (signUpDiv) {
                    this.clerk.mountSignUp(signUpDiv, {
                        appearance: this.getClerkTheme(),
                        redirectUrl: '/auth/dashboard.html'
                    });
                    console.log('✅ Clerk sign-up mounted');
                }
            }
        } catch (error) {
            console.error('❌ Clerk sign-up mount failed:', error);
            this.setupFallbackSignUp();
        }
    }

    // QP-CLERK-SIGNIN-001: Initialize Sign In
    async initSignIn() {
        if (this.fallbackMode) {
            this.setupFallbackSignIn();
            return;
        }

        try {
            if (this.clerk && this.isInitialized) {
                // Mount Clerk sign-in component
                const signInDiv = document.getElementById('clerk-sign-in');
                if (signInDiv) {
                    this.clerk.mountSignIn(signInDiv, {
                        appearance: this.getClerkTheme(),
                        redirectUrl: '/auth/dashboard.html'
                    });
                    console.log('✅ Clerk sign-in mounted');
                }
            }
        } catch (error) {
            console.error('❌ Clerk sign-in mount failed:', error);
            this.setupFallbackSignIn();
        }
    }

    // QP-CLERK-DASHBOARD-001: Initialize Dashboard
    async initDashboard() {
        if (this.fallbackMode) {
            this.setupFallbackDashboard();
            return;
        }

        try {
            if (this.clerk && this.isInitialized) {
                const user = this.clerk.user;
                if (user) {
                    this.updateDashboardUI(user);
                } else {
                    // Redirect to sign in if not authenticated
                    window.location.href = '/auth/sign-in.html';
                }
            }
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            this.setupFallbackDashboard();
        }
    }

    // QP-CLERK-THEME-001: Get Clerk appearance theme
    getClerkTheme() {
        return {
            elements: {
                card: 'glass-card-clerk',
                formButtonPrimary: 'glass-btn-clerk',
                formFieldInput: 'glass-input-clerk',
                headerTitle: 'text-white fw-bold',
                headerSubtitle: 'text-white-75',
                socialButtonsIconButton: 'glass-social-btn',
                dividerLine: 'clerk-divider',
                dividerText: 'clerk-divider-text'
            },
            variables: {
                colorPrimary: '#6366f1',
                colorBackground: 'rgba(255, 255, 255, 0.1)',
                colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                colorInputText: '#333',
                borderRadius: '12px'
            }
        };
    }

    // QP-FALLBACK-SIGNUP-001: Fallback Sign Up
    setupFallbackSignUp() {
        const fallbackForm = document.getElementById('fallbackSignUpForm');
        const clerkDiv = document.getElementById('clerk-sign-up');
        
        if (clerkDiv) clerkDiv.style.display = 'none';
        if (fallbackForm) {
            fallbackForm.classList.remove('d-none');
            fallbackForm.addEventListener('submit', this.handleFallbackSignUp.bind(this));
        }

        // Setup password strength indicator
        this.setupPasswordStrength();
        console.log('🔄 Using fallback sign-up mode');
    }

    // QP-FALLBACK-SIGNIN-001: Fallback Sign In
    setupFallbackSignIn() {
        const fallbackForm = document.getElementById('fallbackSignInForm');
        const clerkDiv = document.getElementById('clerk-sign-in');
        
        if (clerkDiv) clerkDiv.style.display = 'none';
        if (fallbackForm) {
            fallbackForm.classList.remove('d-none');
            fallbackForm.addEventListener('submit', this.handleFallbackSignIn.bind(this));
        }
        
        console.log('🔄 Using fallback sign-in mode');
    }

    // QP-FALLBACK-DASHBOARD-001: Fallback Dashboard
    setupFallbackDashboard() {
        const session = window.QuizPortalUtils?.getStorage('user_session');
        const token = window.QuizPortalUtils?.getStorage('auth_token');
        
        if (!session || !token) {
            window.location.href = '/auth/sign-in.html';
            return;
        }

        this.updateDashboardUI(session);
        console.log('🔄 Using fallback dashboard mode');
    }

    // QP-PASSWORD-STRENGTH-001: Password strength indicator
    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);
            
            const strengthFill = document.querySelector('.password-strength-fill');
            const strengthText = document.querySelector('.password-strength-text');
            
            if (strengthFill && strengthText) {
                strengthFill.style.width = `${strength.percentage}%`;
                strengthText.textContent = strength.text;
                strengthText.className = `password-strength-text text-${strength.color}`;
            }
        });
    }

    // QP-PASSWORD-CALC-001: Calculate password strength
    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 25;
        else feedback.push('8+ characters');

        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
        else feedback.push('Upper & lowercase');

        if (/\d/.test(password)) score += 25;
        else feedback.push('Numbers');

        if (/[^A-Za-z0-9]/.test(password)) score += 25;
        else feedback.push('Special characters');

        let strength = { percentage: score };

        if (score < 50) {
            strength.text = 'Weak - ' + feedback.slice(0, 2).join(', ');
            strength.color = 'danger';
        } else if (score < 75) {
            strength.text = 'Fair - ' + (feedback[0] || 'Good progress');
            strength.color = 'warning';
        } else if (score < 100) {
            strength.text = 'Strong - ' + (feedback[0] || 'Almost perfect');
            strength.color = 'info';
        } else {
            strength.text = 'Excellent - Very secure password';
            strength.color = 'success';
        }

        return strength;
    }

    // QP-FALLBACK-SIGNUP-HANDLE-001: Handle fallback sign up
    async handleFallbackSignUp(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            fullName: formData.get('fullName') || document.getElementById('fullName').value,
            email: formData.get('email') || document.getElementById('email').value,
            password: formData.get('password') || document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            termsAccepted: document.getElementById('termsCheck').checked,
            marketingEmails: document.getElementById('marketingCheck').checked
        };

        // Validate form
        if (!this.validateSignUpForm(userData)) return;

        // Show loading state
        const submitBtn = document.getElementById('signUpBtn');
        const spinner = submitBtn.querySelector('.button-spinner');
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');

        try {
            // Simulate API call
            await this.simulateAsyncOperation(2000);

            // Create user session
            const user = {
                id: 'user_' + Date.now(),
                name: userData.fullName,
                email: userData.email,
                avatar: null,
                joinedAt: new Date().toISOString(),
                isDemo: false
            };

            // Store session
            window.QuizPortalUtils.setStorage('user_session', user);
            window.QuizPortalUtils.setStorage('auth_token', 'fallback_token_' + Date.now());

            // Show success message
            await Swal.fire({
                title: 'Welcome to Quiz Portal! 🎉',
                text: 'Your account has been created successfully.',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });

            // Redirect to dashboard
            window.location.href = '/auth/dashboard.html';

        } catch (error) {
            console.error('Sign up error:', error);
            Swal.fire({
                title: 'Sign Up Failed',
                text: 'Please try again later.',
                icon: 'error'
            });
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('d-none');
        }
    }

    // QP-FALLBACK-SIGNIN-HANDLE-001: Handle fallback sign in
    async handleFallbackSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Show loading state
        const submitBtn = document.getElementById('signInBtn');
        const spinner = submitBtn.querySelector('.button-spinner');
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');

        try {
            // Simulate API call
            await this.simulateAsyncOperation(1500);

            // Create user session (in real app, this would validate credentials)
            const user = {
                id: 'user_' + Date.now(),
                name: email.split('@')[0], // Use email prefix as name
                email: email,
                avatar: null,
                lastSignIn: new Date().toISOString(),
                isDemo: false
            };

            // Store session
            const storageMethod = rememberMe ? 'setStorage' : 'setStorage'; // In real app, would use sessionStorage for non-persistent
            window.QuizPortalUtils[storageMethod]('user_session', user);
            window.QuizPortalUtils[storageMethod]('auth_token', 'fallback_token_' + Date.now());

            // Show success message
            await Swal.fire({
                title: 'Welcome back! 👋',
                text: 'You have been signed in successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            // Redirect to dashboard
            window.location.href = '/auth/dashboard.html';

        } catch (error) {
            console.error('Sign in error:', error);
            Swal.fire({
                title: 'Sign In Failed',
                text: 'Please check your credentials and try again.',
                icon: 'error'
            });
        } finally {
            submitBtn.disabled = false;
            spinner.classList.add('d-none');
        }
    }

    // QP-VALIDATE-SIGNUP-001: Validate sign up form
    validateSignUpForm(userData) {
        const errors = [];

        if (!userData.fullName || userData.fullName.length < 3) {
            errors.push('Full name must be at least 3 characters');
        }

        if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!userData.password || userData.password.length < 8) {
            errors.push('Password must be at least 8 characters');
        }

        if (userData.password !== userData.confirmPassword) {
            errors.push('Passwords do not match');
        }

        if (!userData.termsAccepted) {
            errors.push('You must accept the terms of service');
        }

        if (errors.length > 0) {
            Swal.fire({
                title: 'Validation Error',
                html: errors.map(error => `• ${error}`).join('<br>'),
                icon: 'error'
            });
            return false;
        }

        return true;
    }

    // QP-UPDATE-DASHBOARD-001: Update dashboard UI
    updateDashboardUI(user) {
        // Update user name and avatar
        const userNameElement = document.getElementById('userName');
        const displayNameElement = document.getElementById('displayName');
        const userAvatarElement = document.getElementById('userAvatar');

        if (userNameElement) {
            userNameElement.textContent = user.name || user.firstName || 'User';
        }
        
        if (displayNameElement) {
            displayNameElement.textContent = user.name || user.firstName || 'Student';
        }
        
        if (userAvatarElement) {
            if (user.avatar || user.profileImageUrl) {
                userAvatarElement.src = user.avatar || user.profileImageUrl;
                userAvatarElement.style.display = 'block';
            } else {
                // Use initials as fallback
                const initials = (user.name || user.firstName || 'U').charAt(0).toUpperCase();
                userAvatarElement.outerHTML = `<div class="user-avatar me-2 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; background: #6366f1; color: white; border-radius: 50%; font-size: 0.8rem; font-weight: bold;">${initials}</div>`;
            }
        }

        // Load user stats
        this.loadUserStats(user);
    }

    // QP-USER-STATS-001: Load user statistics
    loadUserStats(user) {
        // Simulate loading user statistics
        const stats = this.generateUserStats(user);
        
        // Update streak count
        const streakElement = document.getElementById('streakCount');
        if (streakElement) {
            streakElement.textContent = stats.streak;
        }
        
        // Update total points
        const pointsElement = document.getElementById('totalPoints');
        if (pointsElement) {
            pointsElement.textContent = stats.points.toLocaleString();
        }
        
        // Update user rank
        const rankElement = document.getElementById('userRank');
        if (rankElement) {
            rankElement.textContent = stats.rank;
        }
    }

    // QP-GENERATE-STATS-001: Generate sample user statistics
    generateUserStats(user) {
        // In a real app, this would fetch from an API
        return {
            streak: Math.floor(Math.random() * 30) + 1,
            points: Math.floor(Math.random() * 5000) + 100,
            rank: Math.floor(Math.random() * 1000) + 1,
            quizzesTaken: Math.floor(Math.random() * 50) + 1,
            averageScore: Math.floor(Math.random() * 40) + 60, // 60-100%
            timeSpent: Math.floor(Math.random() * 100) + 5, // 5-105 hours
            achievements: Math.floor(Math.random() * 20) + 1
        };
    }

    // QP-SESSION-MONITOR-001: Monitor session changes
    setupSessionMonitoring() {
        if (this.clerk && !this.fallbackMode) {
            this.clerk.addListener(({ session, user }) => {
                if (!session || !user) {
                    // User signed out
                    window.location.href = '/auth/sign-in.html';
                } else {
                    console.log('✅ Session updated:', { user: user.id });
                }
            });
        }
    }

    // QP-SIGNOUT-001: Sign out user
    async signOut() {
        try {
            if (this.clerk && !this.fallbackMode) {
                await this.clerk.signOut();
            } else {
                // Fallback signout
                localStorage.clear();
                sessionStorage.clear();
            }
            
            window.location.href = '/index.html';
            
        } catch (error) {
            console.error('Sign out error:', error);
            // Force fallback signout
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/index.html';
        }
    }

    // QP-UTILS-001: Utility functions
    async simulateAsyncOperation(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// QP-GLOBAL-CLERK-001: Initialize global Clerk auth
window.ClerkAuth = new ClerkAuth();

// QP-PASSWORD-TOGGLE-001: Global password toggle function
window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    const icon = toggleBtn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
};

// QP-AUTH-READY-001: Authentication ready event
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Clerk Authentication Handler Ready');
});
