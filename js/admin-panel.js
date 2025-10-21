// QP-ADMIN-JS-001: Admin Panel Management System

/**
 * Admin Panel Manager
 * Handles dashboard, analytics, user management, and system operations
 */

class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.adminData = null;
        this.charts = {};
        this.refreshInterval = null;
        this.systemStats = {
            users: 0,
            quizzes: 0,
            attempts: 0,
            materials: 0
        };
    }

    // QP-ADMIN-INIT-001: Initialize admin panel
    async init() {
        try {
            // Check authentication
            await this.checkAuthentication();
            
            // Load dashboard data
            await this.loadDashboardData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize charts
            this.initializeCharts();
            
            // Setup auto-refresh
            this.setupAutoRefresh();
            
            console.log('✅ Admin Panel initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Admin Panel:', error);
            this.showError('Failed to initialize admin panel');
        }
    }

    // QP-ADMIN-AUTH-001: Check authentication
    async checkAuthentication() {
        // Check for admin session
        const adminSession = this.getStorage('admin_session');
        const adminToken = this.getStorage('admin_token');
        
        if (!adminSession || !adminToken) {
            // Redirect to admin login
            this.redirectToLogin();
            return;
        }
        
        // Verify session validity
        if (this.isSessionExpired(adminSession)) {
            this.showSessionExpiredDialog();
            return;
        }
        
        this.isAuthenticated = true;
        this.adminData = adminSession;
        
        // Update admin name in nav
        const adminNameEl = document.getElementById('adminName');
        if (adminNameEl) {
            adminNameEl.textContent = adminSession.name || 'Administrator';
        }
    }

    // QP-ADMIN-LOGIN-001: Redirect to login
    redirectToLogin() {
        Swal.fire({
            title: 'Admin Access Required',
            text: 'Please enter the admin password to access the control panel.',
            input: 'password',
            inputPlaceholder: 'Enter admin password',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Back to Site',
            allowOutsideClick: false,
            preConfirm: (password) => {
                if (!password) {
                    Swal.showValidationMessage('Password is required');
                    return false;
                }
                return this.validateAdminPassword(password);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.handleSuccessfulLogin(result.value);
            } else {
                window.location.href = '../index.html';
            }
        });
    }

    // QP-ADMIN-VALIDATE-001: Validate admin password
    async validateAdminPassword(password) {
        // Show loading
        Swal.showLoading();
        
        try {
            // Simulate password validation - in production, validate against secure backend
            await this.simulateAsyncOperation(2000);
            
            // For demo purposes, accept multiple passwords
            const validPasswords = ['admin123', 'secure_admin_2025', 'quiz_portal_admin'];
            
            if (validPasswords.includes(password)) {
                return {
                    success: true,
                    admin: {
                        id: 'admin_001',
                        name: 'System Administrator',
                        email: 'admin@quizportal.com',
                        role: 'super_admin',
                        permissions: ['all'],
                        lastLogin: new Date().toISOString()
                    }
                };
            } else {
                throw new Error('Invalid password');
            }
        } catch (error) {
            Swal.showValidationMessage('Invalid admin credentials');
            return false;
        }
    }

    // QP-ADMIN-SUCCESS-LOGIN-001: Handle successful login
    handleSuccessfulLogin(loginData) {
        if (loginData.success) {
            // Store admin session
            this.setStorage('admin_session', loginData.admin);
            this.setStorage('admin_token', 'admin_token_' + Date.now());
            this.setStorage('admin_login_time', Date.now());
            
            this.isAuthenticated = true;
            this.adminData = loginData.admin;
            
            // Show success message
            Swal.fire({
                title: 'Welcome, Administrator!',
                text: 'You have successfully logged into the admin panel.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Initialize the panel
                this.init();
            });
        }
    }

    // QP-ADMIN-SESSION-001: Check session expiry
    isSessionExpired(session) {
        const loginTime = this.getStorage('admin_login_time');
        if (!loginTime) return true;
        
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes
        return (Date.now() - loginTime) > sessionTimeout;
    }

    // QP-ADMIN-SESSION-EXPIRED-001: Show session expired dialog
    showSessionExpiredDialog() {
        Swal.fire({
            title: 'Session Expired',
            text: 'Your admin session has expired. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'Login Again',
            allowOutsideClick: false
        }).then(() => {
            this.clearSession();
            this.redirectToLogin();
        });
    }

    // QP-ADMIN-LOAD-DATA-001: Load dashboard data
    async loadDashboardData() {
        try {
            // Show loading states
            this.showLoadingStats();
            
            // Simulate loading data from API
            await this.simulateAsyncOperation(2000);
            
            // Generate sample statistics
            this.systemStats = {
                users: Math.floor(Math.random() * 5000) + 1000,
                quizzes: Math.floor(Math.random() * 200) + 50,
                attempts: Math.floor(Math.random() * 50000) + 10000,
                materials: Math.floor(Math.random() * 500) + 100
            };
            
            // Update statistics display
            this.updateStatisticsDisplay();
            
            // Load recent data
            await this.loadRecentUsers();
            await this.loadRecentQuizActivity();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    // QP-ADMIN-STATS-LOADING-001: Show loading stats
    showLoadingStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            stat.textContent = '...';
            stat.parentElement.parentElement.parentElement.classList.add('loading-card');
        });
    }

    // QP-ADMIN-STATS-UPDATE-001: Update statistics display
    updateStatisticsDisplay() {
        // Animate counters
        this.animateCounter('totalUsers', this.systemStats.users);
        this.animateCounter('totalQuizzes', this.systemStats.quizzes);
        this.animateCounter('totalAttempts', this.systemStats.attempts);
        this.animateCounter('totalMaterials', this.systemStats.materials);
        
        // Remove loading states
        document.querySelectorAll('.loading-card').forEach(card => {
            card.classList.remove('loading-card');
        });
    }

    // QP-ADMIN-COUNTER-001: Animate counter
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 50);
        const duration = 2000; // 2 seconds
        const stepTime = duration / (targetValue / increment);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            element.textContent = currentValue.toLocaleString();
            element.classList.add('count-up');
        }, stepTime);
    }

    // QP-ADMIN-RECENT-USERS-001: Load recent users
    async loadRecentUsers() {
        const tbody = document.querySelector('#recentUsersTable tbody');
        if (!tbody) return;
        
        // Generate sample recent users
        const users = this.generateSampleUsers(5);
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-2" style="width: 32px; height: 32px; background: ${user.avatarColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: bold;">
                            ${user.name.charAt(0)}
                        </div>
                        <div>
                            <div class="fw-semibold">${user.name}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.joinDate}</td>
                <td><span class="status-badge ${user.status}">${user.status.toUpperCase()}</span></td>
                <td>
                    <button class="action-btn btn-view" onclick="viewUser('${user.id}')" title="View User">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn btn-edit" onclick="editUser('${user.id}')" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteUser('${user.id}')" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // QP-ADMIN-RECENT-QUIZ-001: Load recent quiz activity
    async loadRecentQuizActivity() {
        const tbody = document.querySelector('#recentQuizActivity tbody');
        if (!tbody) return;
        
        // Generate sample quiz activity
        const activities = this.generateSampleQuizActivity(5);
        
        tbody.innerHTML = activities.map(activity => `
            <tr>
                <td>
                    <div class="fw-semibold">${activity.quizName}</div>
                    <small class="text-muted">${activity.category}</small>
                </td>
                <td>${activity.userName}</td>
                <td>
                    <span class="fw-bold ${activity.score >= 70 ? 'text-success' : activity.score >= 50 ? 'text-warning' : 'text-danger'}">
                        ${activity.score}%
                    </span>
                </td>
                <td>${activity.timeAgo}</td>
                <td><span class="status-badge ${activity.status}">${activity.status.toUpperCase()}</span></td>
            </tr>
        `).join('');
    }

    // QP-ADMIN-SAMPLE-DATA-001: Generate sample data
    generateSampleUsers(count) {
        const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emily Davis', 'Chris Miller', 'Lisa Anderson'];
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6b7280'];
        const statuses = ['active', 'inactive', 'premium'];
        
        return Array.from({length: count}, (_, i) => {
            const name = names[Math.floor(Math.random() * names.length)];
            return {
                id: `user_${i + 1}`,
                name: name,
                email: name.toLowerCase().replace(' ', '.') + '@example.com',
                joinDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                avatarColor: colors[Math.floor(Math.random() * colors.length)]
            };
        });
    }

    generateSampleQuizActivity(count) {
        const quizzes = ['General Knowledge', 'Mathematics', 'English Grammar', 'Logical Reasoning', 'Current Affairs'];
        const categories = ['GK', 'Math', 'English', 'Reasoning', 'Current Affairs'];
        const users = ['Alex Kumar', 'Priya Singh', 'Rahul Sharma', 'Anita Patel', 'Rohit Gupta'];
        const statuses = ['completed', 'in-progress', 'abandoned'];
        
        return Array.from({length: count}, (_, i) => ({
            id: `activity_${i + 1}`,
            quizName: quizzes[Math.floor(Math.random() * quizzes.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            userName: users[Math.floor(Math.random() * users.length)],
            score: Math.floor(Math.random() * 100),
            timeAgo: Math.floor(Math.random() * 60) + ' min ago',
            status: statuses[Math.floor(Math.random() * statuses.length)]
        }));
    }

    // QP-ADMIN-CHARTS-001: Initialize charts
    initializeCharts() {
        this.initActivityChart();
        this.initCategoriesChart();
    }

    // QP-ADMIN-ACTIVITY-CHART-001: Initialize activity chart
    initActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;
        
        this.charts.activity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Quiz Attempts',
                    data: [1200, 1350, 1100, 1400, 1600, 1800, 1900, 2100, 1950, 2200, 2400, 2300],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'New Users',
                    data: [80, 95, 70, 110, 120, 140, 150, 160, 145, 170, 180, 175],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    // QP-ADMIN-CATEGORIES-CHART-001: Initialize categories chart
    initCategoriesChart() {
        const ctx = document.getElementById('categoriesChart');
        if (!ctx) return;
        
        this.charts.categories = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Mathematics', 'English', 'Reasoning', 'General Knowledge', 'Current Affairs', 'Science'],
                datasets: [{
                    data: [120, 85, 95, 150, 60, 75],
                    backgroundColor: [
                        '#6366f1',
                        '#8b5cf6',
                        '#ec4899',
                        '#f59e0b',
                        '#10b981',
                        '#3b82f6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // QP-ADMIN-EVENTS-001: Setup event listeners
    setupEventListeners() {
        // Global admin functions
        window.refreshDashboard = () => this.refreshDashboard();
        window.exportData = () => this.exportData();
        window.adminLogout = () => this.adminLogout();
        window.showAdminProfile = () => this.showAdminProfile();
        window.showSystemSettings = () => this.showSystemSettings();
        window.showSecurityLogs = () => this.showSecurityLogs();
        window.changePassword = () => this.changePassword();
        window.saveSettings = () => this.saveSettings();
        
        // Quick actions
        window.createNewQuiz = () => this.createNewQuiz();
        window.uploadMaterial = () => this.uploadMaterial();
        window.sendNotification = () => this.sendNotification();
        window.systemBackup = () => this.systemBackup();
        window.viewLogs = () => this.viewLogs();
        window.systemMaintenance = () => this.systemMaintenance();
        
        // User management
        window.viewUser = (userId) => this.viewUser(userId);
        window.editUser = (userId) => this.editUser(userId);
        window.deleteUser = (userId) => this.deleteUser(userId);
        
        // Password toggle
        window.togglePassword = (inputId) => this.togglePassword(inputId);
    }

    // QP-ADMIN-AUTO-REFRESH-001: Setup auto refresh
    setupAutoRefresh() {
        // Refresh dashboard every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.refreshDashboard(true); // Silent refresh
        }, 5 * 60 * 1000);
    }

    // QP-ADMIN-REFRESH-001: Refresh dashboard
    async refreshDashboard(silent = false) {
        if (!silent) {
            Swal.fire({
                title: 'Refreshing Dashboard',
                text: 'Updating latest data...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
        
        try {
            await this.loadDashboardData();
            
            if (!silent) {
                Swal.fire({
                    title: 'Dashboard Refreshed!',
                    text: 'All data has been updated successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            if (!silent) {
                Swal.fire({
                    title: 'Refresh Failed',
                    text: 'Could not refresh dashboard data.',
                    icon: 'error'
                });
            }
        }
    }

    // QP-ADMIN-EXPORT-001: Export data
    exportData() {
        Swal.fire({
            title: 'Export Data',
            text: 'Select the data you want to export:',
            input: 'select',
            inputOptions: {
                'users': 'User Data',
                'quizzes': 'Quiz Results',
                'materials': 'Study Materials',
                'analytics': 'Analytics Data',
                'all': 'All Data'
            },
            inputPlaceholder: 'Select data type',
            showCancelButton: true,
            confirmButtonText: 'Export',
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage('Please select a data type');
                    return false;
                }
                return value;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.performDataExport(result.value);
            }
        });
    }

    // QP-ADMIN-PERFORM-EXPORT-001: Perform data export
    async performDataExport(dataType) {
        try {
            Swal.fire({
                title: 'Exporting Data',
                text: `Preparing ${dataType} for export...`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Simulate export process
            await this.simulateAsyncOperation(3000);
            
            // In production, this would generate and download actual data
            const exportData = this.generateExportData(dataType);
            this.downloadJSON(exportData, `quiz-portal-${dataType}-export.json`);
            
            Swal.fire({
                title: 'Export Complete!',
                text: `${dataType} data has been downloaded successfully.`,
                icon: 'success'
            });
            
        } catch (error) {
            Swal.fire({
                title: 'Export Failed',
                text: 'Could not export data. Please try again.',
                icon: 'error'
            });
        }
    }

    // QP-ADMIN-LOGOUT-001: Admin logout
    adminLogout() {
        Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout from the admin panel?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Logout',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.clearSession();
                
                Swal.fire({
                    title: 'Logged Out',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = '../index.html';
                });
            }
        });
    }

    // QP-ADMIN-PROFILE-001: Show admin profile
    showAdminProfile() {
        Swal.fire({
            title: 'Administrator Profile',
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Name:</label>
                        <p class="mb-1">${this.adminData.name}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email:</label>
                        <p class="mb-1">${this.adminData.email}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Role:</label>
                        <p class="mb-1">${this.adminData.role.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Last Login:</label>
                        <p class="mb-1">${new Date(this.adminData.lastLogin).toLocaleString()}</p>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Change Password',
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                this.showPasswordModal();
            }
        });
    }

    // QP-ADMIN-PASSWORD-MODAL-001: Show password modal
    showPasswordModal() {
        const modal = new bootstrap.Modal(document.getElementById('passwordModal'));
        modal.show();
    }

    // QP-ADMIN-SETTINGS-001: Show system settings
    showSystemSettings() {
        const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
        modal.show();
    }

    // QP-ADMIN-SECURITY-LOGS-001: Show security logs
    showSecurityLogs() {
        const logs = [
            { time: '2025-01-21 16:30:15', event: 'Admin Login', ip: '192.168.1.1', status: 'Success' },
            { time: '2025-01-21 14:22:30', event: 'User Registration', ip: '203.0.113.5', status: 'Success' },
            { time: '2025-01-21 12:15:45', event: 'Failed Login Attempt', ip: '198.51.100.3', status: 'Failed' },
            { time: '2025-01-21 10:30:22', event: 'Password Reset', ip: '192.0.2.1', status: 'Success' },
            { time: '2025-01-21 09:45:18', event: 'Admin Settings Changed', ip: '192.168.1.1', status: 'Success' }
        ];
        
        const logsHTML = logs.map(log => `
            <tr>
                <td>${log.time}</td>
                <td>${log.event}</td>
                <td>${log.ip}</td>
                <td><span class="status-badge ${log.status.toLowerCase() === 'success' ? 'active' : 'inactive'}">${log.status}</span></td>
            </tr>
        `).join('');
        
        Swal.fire({
            title: 'Security Logs',
            html: `
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Event</th>
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logsHTML}
                        </tbody>
                    </table>
                </div>
            `,
            width: '800px',
            confirmButtonText: 'Close'
        });
    }

    // QP-ADMIN-QUICK-ACTIONS-001: Quick action handlers
    createNewQuiz() {
        Swal.fire({
            title: 'Create New Quiz',
            text: 'This would open the quiz creation interface.',
            icon: 'info',
            confirmButtonText: 'Go to Quiz Manager'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'quiz-manager.html';
            }
        });
    }

    uploadMaterial() {
        Swal.fire({
            title: 'Upload Study Material',
            text: 'This would open the content upload interface.',
            icon: 'info',
            confirmButtonText: 'Go to Content Manager'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'content-manager.html';
            }
        });
    }

    sendNotification() {
        Swal.fire({
            title: 'Send Notification',
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Title:</label>
                        <input type="text" class="form-control glass-input" id="notifyTitle" placeholder="Notification title">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Message:</label>
                        <textarea class="form-control glass-input" id="notifyMessage" rows="3" placeholder="Notification message"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Send to:</label>
                        <select class="form-select glass-input" id="notifyTarget">
                            <option value="all">All Users</option>
                            <option value="premium">Premium Users Only</option>
                            <option value="recent">Recent Active Users</option>
                        </select>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Send Notification',
            preConfirm: () => {
                const title = document.getElementById('notifyTitle').value;
                const message = document.getElementById('notifyMessage').value;
                const target = document.getElementById('notifyTarget').value;
                
                if (!title || !message) {
                    Swal.showValidationMessage('Title and message are required');
                    return false;
                }
                
                return { title, message, target };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.performSendNotification(result.value);
            }
        });
    }

    systemBackup() {
        Swal.fire({
            title: 'System Backup',
            text: 'This will create a full backup of all system data. Continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Start Backup'
        }).then((result) => {
            if (result.isConfirmed) {
                this.performSystemBackup();
            }
        });
    }

    viewLogs() {
        Swal.fire({
            title: 'System Logs',
            text: 'This would display comprehensive system logs.',
            icon: 'info',
            confirmButtonText: 'Open Log Viewer'
        });
    }

    systemMaintenance() {
        Swal.fire({
            title: 'Maintenance Mode',
            text: 'Enable maintenance mode? This will temporarily disable the site for users.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Enable Maintenance'
        }).then((result) => {
            if (result.isConfirmed) {
                this.enableMaintenanceMode();
            }
        });
    }

    // QP-ADMIN-USER-ACTIONS-001: User management actions
    viewUser(userId) {
        const user = this.generateSampleUsers(1)[0];
        user.id = userId;
        
        Swal.fire({
            title: 'User Details',
            html: `
                <div class="text-start">
                    <div class="text-center mb-4">
                        <div class="user-avatar mx-auto" style="width: 80px; height: 80px; background: ${user.avatarColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">
                            ${user.name.charAt(0)}
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold">Name:</label>
                            <p>${user.name}</p>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold">Email:</label>
                            <p>${user.email}</p>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold">Status:</label>
                            <span class="status-badge ${user.status}">${user.status.toUpperCase()}</span>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold">Joined:</label>
                            <p>${user.joinDate}</p>
                        </div>
                    </div>
                </div>
            `,
            width: '600px',
            confirmButtonText: 'Close'
        });
    }

    editUser(userId) {
        Swal.fire({
            title: 'Edit User',
            text: `This would open the user editing interface for user ${userId}.`,
            icon: 'info',
            confirmButtonText: 'Go to User Manager'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'user-manager.html';
            }
        });
    }

    deleteUser(userId) {
        Swal.fire({
            title: 'Delete User?',
            text: 'This action cannot be undone. All user data will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'User Deleted',
                    text: 'User has been successfully removed from the system.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Reload recent users
                this.loadRecentUsers();
            }
        });
    }

    // QP-ADMIN-UTILS-001: Utility functions
    setStorage(key, value) {
        try {
            localStorage.setItem(`admin_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    getStorage(key) {
        try {
            const data = localStorage.getItem(`admin_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage retrieval error:', error);
            return null;
        }
    }

    clearSession() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('admin_'));
        keys.forEach(key => localStorage.removeItem(key));
    }

    togglePassword(inputId) {
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

    // QP-ADMIN-EXPORT-UTILS-001: Export utility functions
    generateExportData(dataType) {
        const timestamp = new Date().toISOString();
        
        switch (dataType) {
            case 'users':
                return {
                    type: 'users',
                    timestamp,
                    data: this.generateSampleUsers(50)
                };
            case 'quizzes':
                return {
                    type: 'quizzes',
                    timestamp,
                    data: this.generateSampleQuizActivity(100)
                };
            default:
                return {
                    type: dataType,
                    timestamp,
                    data: { message: `Sample ${dataType} export data` }
                };
        }
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Cleanup on page unload
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
    }
}

// QP-ADMIN-GLOBAL-001: Initialize global admin panel
window.AdminPanel = new AdminPanel();

// QP-ADMIN-READY-001: Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Admin Panel System Ready');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.AdminPanel) {
        window.AdminPanel.destroy();
    }
});
