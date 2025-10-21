// QP-UTILS-001: Enhanced Utility Functions

/**
 * Enhanced Quiz Portal Utilities
 * Mobile-first, performance-optimized helper functions
 */

class QuizPortalUtils {
    constructor() {
        this.init();
    }

    // QP-INIT-002: Initialize utilities
    init() {
        this.setupTouchHandling();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
        console.log('✅ Quiz Portal Utils initialized');
    }

    // QP-TOUCH-001: Enhanced touch handling for mobile
    setupTouchHandling() {
        // Add touch feedback to interactive elements
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('.glass-btn, .glass-subject-card, .quick-action-card')) {
                e.target.style.transform = 'scale(0.98)';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.matches('.glass-btn, .glass-subject-card, .quick-action-card')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 100);
            }
        });
    }

    // QP-PERF-001: Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }

        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    // QP-A11Y-001: Accessibility enhancements
    setupAccessibility() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('.glass-subject-card').forEach((card, index) => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Select ${card.dataset.subject} subject`);
            
            // Keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    // QP-RESIZE-001: Handle window resize
    handleResize() {
        // Recalculate particles on mobile
        if (window.innerWidth < 768 && window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    // QP-STORAGE-001: Enhanced local storage utilities
    setStorage(key, value, encrypt = false) {
        try {
            const data = encrypt ? btoa(JSON.stringify(value)) : JSON.stringify(value);
            localStorage.setItem(`qp_${key}`, data);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    getStorage(key, decrypt = false) {
        try {
            const data = localStorage.getItem(`qp_${key}`);
            if (!data) return null;
            
            const parsed = decrypt ? JSON.parse(atob(data)) : JSON.parse(data);
            return parsed;
        } catch (error) {
            console.error('Storage retrieval error:', error);
            return null;
        }
    }

    // QP-SESSION-001: Session management
    clearSession() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('qp_'));
        keys.forEach(key => localStorage.removeItem(key));
        
        // Show confirmation
        Swal.fire({
            title: 'Session Cleared',
            text: 'All your data has been cleared successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    // QP-FORM-001: Enhanced form validation
    validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('is-invalid');
                    isValid = false;
                }
            }
            
            // Name validation
            if (input.name === 'fullName' && input.value.length < 3) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });
        
        return isValid;
    }

    // QP-SUBJECT-001: Subject selection handling
    handleSubjectSelection() {
        const subjectCards = document.querySelectorAll('.glass-subject-card');
        const hiddenInput = document.getElementById('selectedSubject');
        const startBtn = document.getElementById('startQuizBtn');
        
        subjectCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove previous selection
                subjectCards.forEach(c => c.classList.remove('selected'));
                
                // Add selection to clicked card
                card.classList.add('selected');
                
                // Update hidden input
                hiddenInput.value = card.dataset.subject;
                
                // Enable start button
                if (startBtn) startBtn.disabled = false;
                
                // Add haptic feedback on mobile
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                
                // Announce to screen readers
                const announcement = `Selected ${card.dataset.subject}`;
                this.announceToScreenReader(announcement);
            });
        });
    }

    // QP-A11Y-002: Screen reader announcements
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // QP-DATES-001: Generate quiz dates
    generateQuizDates() {
        const select = document.getElementById('quizDate');
        if (!select) return;
        
        const today = new Date();
        const dates = [];
        
        // Generate next 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const formatted = date.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const value = date.toISOString().split('T')[0];
            dates.push({ value, text: formatted });
        }
        
        dates.forEach(date => {
            const option = document.createElement('option');
            option.value = date.value;
            option.textContent = date.text;
            select.appendChild(option);
        });
    }

    // QP-NOTIFY-001: Enhanced notifications
    notify(title, message, type = 'info', duration = 3000) {
        return Swal.fire({
            title,
            text: message,
            icon: type,
            timer: duration,
            showConfirmButton: duration > 5000,
            toast: true,
            position: 'top-end',
            customClass: {
                popup: 'glass-notification'
            }
        });
    }

    // QP-LOADING-001: Loading states
    showLoading(element, text = 'Loading...') {
        const spinner = `
            <div class="d-flex align-items-center justify-content-center p-4">
                <div class="spinner-border text-primary me-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span>${text}</span>
            </div>
        `;
        element.innerHTML = spinner;
    }

    hideLoading(element, content = '') {
        element.innerHTML = content;
    }
}

// QP-GLOBAL-001: Initialize global utils
window.QuizPortalUtils = new QuizPortalUtils();

// QP-SHORTCUTS-001: Convenience functions
window.clearSession = () => window.QuizPortalUtils.clearSession();
window.notify = (title, message, type, duration) => window.QuizPortalUtils.notify(title, message, type, duration);

// QP-DOM-001: DOM Ready handler
document.addEventListener('DOMContentLoaded', () => {
    // Generate quiz dates
    window.QuizPortalUtils.generateQuizDates();
    
    // Setup subject selection
    window.QuizPortalUtils.handleSubjectSelection();
    
    console.log('✅ DOM utilities initialized');
});
