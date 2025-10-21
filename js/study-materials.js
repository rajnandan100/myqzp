// QP-STUDY-JS-001: Study Materials Management System

/**
 * Study Materials Manager
 * Handles PDF viewing, searching, filtering, and material management
 */

class StudyMaterialsManager {
    constructor() {
        this.materials = [];
        this.filteredMaterials = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentView = 'grid';
        this.currentPDF = null;
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.scale = 1.0;
        this.canvas = null;
        this.ctx = null;
    }

    // QP-STUDY-INIT-001: Initialize the system
    async init() {
        try {
            // Load sample materials
            await this.loadMaterials();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup PDF.js
            this.setupPDFjs();
            
            // Initial render
            this.renderMaterials();
            
            console.log('✅ Study Materials Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Study Materials:', error);
            this.showError('Failed to load study materials');
        }
    }

    // QP-STUDY-LOAD-001: Load materials data
    async loadMaterials() {
        // Show loading state
        const loadingState = document.getElementById('loadingState');
        const materialsGrid = document.getElementById('materialsGrid');
        
        if (loadingState) loadingState.classList.remove('d-none');
        if (materialsGrid) materialsGrid.classList.add('d-none');

        try {
            // Simulate API call - in production, this would fetch from your backend
            await this.simulateAsyncOperation(2000);
            
            // Sample materials data
            this.materials = this.generateSampleMaterials();
            this.filteredMaterials = [...this.materials];
            
            // Hide loading state
            if (loadingState) loadingState.classList.add('d-none');
            if (materialsGrid) materialsGrid.classList.remove('d-none');
            
            // Update results count
            this.updateResultsCount();
            
        } catch (error) {
            console.error('Error loading materials:', error);
            this.showError('Failed to load materials');
        }
    }

    // QP-STUDY-SAMPLE-001: Generate sample materials
    generateSampleMaterials() {
        const categories = ['mathematics', 'english', 'reasoning', 'gk', 'current-affairs', 'science'];
        const types = ['free', 'premium'];
        const materials = [];

        const sampleData = [
            { title: 'Advanced Algebra Formulas', description: 'Comprehensive collection of algebra formulas with examples', category: 'mathematics', pages: 45, size: '2.3 MB', rating: 4.5, downloads: 1250 },
            { title: 'English Grammar Essentials', description: 'Complete guide to English grammar rules and usage', category: 'english', pages: 67, size: '3.1 MB', rating: 4.7, downloads: 980 },
            { title: 'Logical Reasoning Tricks', description: 'Quick tricks and shortcuts for logical reasoning', category: 'reasoning', pages: 38, size: '1.8 MB', rating: 4.3, downloads: 1450 },
            { title: 'Indian Constitution Basics', description: 'Fundamental concepts of Indian Constitution', category: 'gk', pages: 89, size: '4.2 MB', rating: 4.6, downloads: 870 },
            { title: 'Current Affairs January 2025', description: 'Monthly current affairs digest with MCQs', category: 'current-affairs', pages: 52, size: '2.8 MB', rating: 4.4, downloads: 2100 },
            { title: 'Physics Formula Sheet', description: 'Important physics formulas for competitive exams', category: 'science', pages: 23, size: '1.2 MB', rating: 4.8, downloads: 1680 },
            { title: 'Geometry Problem Solutions', description: 'Step-by-step solutions for geometry problems', category: 'mathematics', pages: 78, size: '3.5 MB', rating: 4.2, downloads: 920 },
            { title: 'Vocabulary Building Guide', description: 'Systematic approach to building vocabulary', category: 'english', pages: 95, size: '4.1 MB', rating: 4.5, downloads: 1340 },
            { title: 'Data Interpretation Techniques', description: 'Methods and tricks for DI questions', category: 'reasoning', pages: 56, size: '2.7 MB', rating: 4.7, downloads: 1120 },
            { title: 'Indian History Timeline', description: 'Chronological timeline of Indian history', category: 'gk', pages: 42, size: '2.1 MB', rating: 4.3, downloads: 1580 },
            { title: 'Economics Fundamentals', description: 'Basic concepts of micro and macro economics', category: 'gk', pages: 73, size: '3.8 MB', rating: 4.6, downloads: 750 },
            { title: 'Chemistry Quick Notes', description: 'Concise notes covering important chemistry topics', category: 'science', pages: 64, size: '3.2 MB', rating: 4.4, downloads: 990 }
        ];

        sampleData.forEach((item, index) => {
            materials.push({
                id: `mat_${index + 1}`,
                title: item.title,
                description: item.description,
                category: item.category,
                type: Math.random() > 0.3 ? 'free' : 'premium', // 70% free, 30% premium
                pages: item.pages,
                size: item.size,
                rating: item.rating,
                downloads: item.downloads,
                uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                thumbnail: `../assets/images/pdf-thumbnails/thumb-${index + 1}.jpg`,
                pdfUrl: `../assets/pdfs/sample-${index + 1}.pdf`,
                author: 'Quiz Portal Team',
                difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
                tags: this.generateTags(item.category)
            });
        });

        return materials;
    }

    // QP-STUDY-TAGS-001: Generate tags for materials
    generateTags(category) {
        const tagMap = {
            'mathematics': ['algebra', 'geometry', 'calculus', 'statistics'],
            'english': ['grammar', 'vocabulary', 'comprehension', 'writing'],
            'reasoning': ['logical', 'verbal', 'non-verbal', 'analytical'],
            'gk': ['history', 'geography', 'polity', 'economy'],
            'current-affairs': ['monthly', 'important', 'mcqs', 'updates'],
            'science': ['physics', 'chemistry', 'biology', 'formulas']
        };
        
        return tagMap[category] || ['general'];
    }

    // QP-STUDY-EVENTS-001: Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.performSearch(e.target.value);
            }, 300));
        }

        // Filter dropdowns
        ['categoryFilter', 'typeFilter', 'sortFilter'].forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });

        // Quick filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickFilter(e.target);
            });
        });

        // View toggle buttons
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (gridView) gridView.addEventListener('click', () => this.switchView('grid'));
        if (listView) listView.addEventListener('click', () => this.switchView('list'));

        // Star rating
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.addEventListener('click', (e) => this.handleRating(e));
            star.addEventListener('mouseenter', (e) => this.previewRating(e));
        });

        // PDF viewer controls
        this.setupPDFControls();
    }

    // QP-STUDY-PDF-SETUP-001: Setup PDF.js
    setupPDFjs() {
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            console.log('✅ PDF.js configured');
        } else {
            console.warn('⚠️ PDF.js not loaded, PDF viewing will be limited');
        }
    }

    // QP-STUDY-PDF-CONTROLS-001: Setup PDF viewer controls
    setupPDFControls() {
        // These functions will be defined globally for onclick handlers
        window.zoomIn = () => this.zoomIn();
        window.zoomOut = () => this.zoomOut();
        window.nextPage = () => this.nextPage();
        window.prevPage = () => this.prevPage();
        window.fitToWidth = () => this.fitToWidth();
        window.fullscreen = () => this.fullscreen();
        window.downloadPDF = () => this.downloadCurrentPDF();
        window.printPDF = () => this.printCurrentPDF();
    }

    // QP-STUDY-SEARCH-001: Perform search
    performSearch(query = '') {
        const searchQuery = query.toLowerCase().trim();
        
        if (!searchQuery) {
            this.filteredMaterials = [...this.materials];
        } else {
            this.filteredMaterials = this.materials.filter(material => 
                material.title.toLowerCase().includes(searchQuery) ||
                material.description.toLowerCase().includes(searchQuery) ||
                material.category.toLowerCase().includes(searchQuery) ||
                material.tags.some(tag => tag.toLowerCase().includes(searchQuery))
            );
        }
        
        this.currentPage = 1;
        this.applyFilters();
    }

    // QP-STUDY-FILTERS-001: Apply filters
    applyFilters() {
        let filtered = [...this.filteredMaterials];
        
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter && categoryFilter.value) {
            filtered = filtered.filter(material => material.category === categoryFilter.value);
        }
        
        // Type filter
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter && typeFilter.value) {
            filtered = filtered.filter(material => material.type === typeFilter.value);
        }
        
        // Sort
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            this.sortMaterials(filtered, sortFilter.value);
        }
        
        this.filteredMaterials = filtered;
        this.renderMaterials();
        this.updateResultsCount();
    }

    // QP-STUDY-SORT-001: Sort materials
    sortMaterials(materials, sortBy) {
        switch (sortBy) {
            case 'newest':
                materials.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
            case 'oldest':
                materials.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
                break;
            case 'popular':
                materials.sort((a, b) => b.downloads - a.downloads);
                break;
            case 'rating':
                materials.sort((a, b) => b.rating - a.rating);
                break;
            case 'size':
                materials.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
                break;
        }
    }

    // QP-STUDY-QUICK-FILTER-001: Handle quick filter buttons
    handleQuickFilter(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.dataset.filter;
        
        switch (filter) {
            case 'all':
                this.filteredMaterials = [...this.materials];
                break;
            case 'free':
                this.filteredMaterials = this.materials.filter(m => m.type === 'free');
                break;
            case 'premium':
                this.filteredMaterials = this.materials.filter(m => m.type === 'premium');
                break;
            case 'recent':
                this.filteredMaterials = this.materials.filter(m => {
                    const uploadDate = new Date(m.uploadDate);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return uploadDate > weekAgo;
                });
                break;
            case 'trending':
                this.filteredMaterials = this.materials
                    .filter(m => m.downloads > 1000)
                    .sort((a, b) => b.downloads - a.downloads);
                break;
        }
        
        this.currentPage = 1;
        this.renderMaterials();
        this.updateResultsCount();
    }

    // QP-STUDY-RENDER-001: Render materials
    renderMaterials() {
        const materialsGrid = document.getElementById('materialsGrid');
        const noResults = document.getElementById('noResults');
        
        if (!materialsGrid) return;
        
        if (this.filteredMaterials.length === 0) {
            materialsGrid.classList.add('d-none');
            if (noResults) noResults.classList.remove('d-none');
            return;
        }
        
        if (noResults) noResults.classList.add('d-none');
        materialsGrid.classList.remove('d-none');
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredMaterials.slice(startIndex, endIndex);
        
        // Set grid/list view class
        materialsGrid.className = `materials-grid ${this.currentView}-view`;
        
        // Render items
        materialsGrid.innerHTML = pageItems.map(material => this.renderMaterialCard(material)).join('');
        
        // Setup card click handlers
        this.setupCardHandlers();
        
        // Render pagination
        this.renderPagination();
    }

    // QP-STUDY-CARD-001: Render material card
    renderMaterialCard(material) {
        const isLocked = material.type === 'premium' && !this.isPremiumUser();
        const categoryIcons = {
            'mathematics': 'fas fa-calculator',
            'english': 'fas fa-book-open',
            'reasoning': 'fas fa-brain',
            'gk': 'fas fa-globe',
            'current-affairs': 'fas fa-newspaper',
            'science': 'fas fa-atom'
        };
        
        return `
            <div class="material-card" data-material-id="${material.id}" data-aos="fade-up">
                <div class="material-header">
                    <span class="material-type-badge ${material.type}">
                        ${material.type === 'premium' ? '<i class="fas fa-crown me-1"></i>' : '<i class="fas fa-gift me-1"></i>'}
                        ${material.type.toUpperCase()}
                    </span>
                    <i class="${categoryIcons[material.category] || 'fas fa-file-pdf'} material-icon"></i>
                    <h4 class="material-title">${material.title}</h4>
                    <div class="material-category">${this.getCategoryName(material.category)}</div>
                </div>
                
                <div class="material-body">
                    <p class="material-description">${material.description}</p>
                    
                    <div class="material-meta">
                        <div class="material-info">
                            <span><i class="fas fa-file-alt"></i> ${material.pages} pages</span>
                            <span><i class="fas fa-hdd"></i> ${material.size}</span>
                            <span><i class="fas fa-download"></i> ${material.downloads.toLocaleString()}</span>
                        </div>
                        <div class="material-rating">
                            <div class="stars">
                                ${this.renderStars(material.rating)}
                            </div>
                            <span class="rating-value">${material.rating}</span>
                        </div>
                    </div>
                </div>
                
                <div class="material-footer">
                    <div class="material-actions">
                        ${isLocked ? `
                            <button class="btn btn-premium-lock" onclick="showPremiumModal()">
                                <i class="fas fa-lock me-2"></i>Unlock Premium
                            </button>
                        ` : `
                            <button class="btn btn-view-pdf" onclick="viewPDF('${material.id}')">
                                <i class="fas fa-eye me-2"></i>View PDF
                            </button>
                            <button class="btn btn-download" onclick="downloadMaterial('${material.id}')" title="Download PDF">
                                <i class="fas fa-download"></i>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    // QP-STUDY-UTILS-001: Utility functions
    getCategoryName(category) {
        const categoryNames = {
            'mathematics': 'Mathematics',
            'english': 'English',
            'reasoning': 'Reasoning',
            'gk': 'General Knowledge',
            'current-affairs': 'Current Affairs',
            'science': 'Science'
        };
        return categoryNames[category] || category;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        
        return stars;
    }

    isPremiumUser() {
        // Check if user has premium access
        const session = window.QuizPortalUtils?.getStorage('user_session');
        return session && session.isPremium;
    }

    // QP-STUDY-HANDLERS-001: Setup card handlers
    setupCardHandlers() {
        // Make view PDF and download functions global
        window.viewPDF = (materialId) => this.viewPDF(materialId);
        window.downloadMaterial = (materialId) => this.downloadMaterial(materialId);
        window.showPremiumModal = () => this.showPremiumModal();
        window.filterByCategory = (category) => this.filterByCategory(category);
        window.clearFilters = () => this.clearFilters();
        window.performSearch = () => this.performSearch(document.getElementById('searchInput').value);
        window.switchView = (view) => this.switchView(view);
    }

    // QP-STUDY-PDF-VIEW-001: View PDF
    async viewPDF(materialId) {
        const material = this.materials.find(m => m.id === materialId);
        if (!material) return;
        
        this.currentPDF = material;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('pdfViewerModal'));
        modal.show();
        
        // Update modal title
        const title = document.getElementById('pdfViewerTitle');
        if (title) title.textContent = material.title;
        
        // Load PDF content
        await this.loadPDFContent(material);
    }

    // QP-STUDY-PDF-LOAD-001: Load PDF content
    async loadPDFContent(material) {
        const contentArea = document.getElementById('pdfContentArea');
        if (!contentArea) return;
        
        // Show loading state
        contentArea.innerHTML = `
            <div class="pdf-loading text-center py-5">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading PDF...</span>
                </div>
                <p class="text-muted">Loading ${material.title}...</p>
            </div>
        `;
        
        try {
            // Simulate PDF loading - in production, load actual PDF
            await this.simulateAsyncOperation(2000);
            
            // Create canvas for PDF rendering
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-page';
            canvas.style.maxWidth = '100%';
            canvas.style.height = 'auto';
            
            contentArea.innerHTML = '';
            contentArea.appendChild(canvas);
            
            // Simulate PDF rendering
            this.simulatePDFRender(canvas, material);
            
            // Update PDF info
            document.getElementById('pdfSize').textContent = material.size;
            document.getElementById('pdfPages').textContent = `${material.pages} pages`;
            document.getElementById('totalPages').textContent = material.pages;
            document.getElementById('currentPage').textContent = '1';
            
        } catch (error) {
            console.error('Error loading PDF:', error);
            contentArea.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5>Failed to load PDF</h5>
                    <p class="text-muted">Please try again later</p>
                </div>
            `;
        }
    }

    // QP-STUDY-PDF-RENDER-001: Simulate PDF rendering
    simulatePDFRender(canvas, material) {
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 800;
        
        // Draw a sample PDF page
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Add title
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(material.title, canvas.width / 2, 60);
        
        // Add content lines
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        const lines = [
            'This is a sample PDF viewer demonstration.',
            'In production, this would show the actual PDF content.',
            '',
            'Key Features:',
            '• Mobile-optimized viewing',
            '• Zoom and navigation controls',
            '• Download and print options',
            '• Responsive design',
            '',
            'Sample content for: ' + material.category,
            'Difficulty: ' + material.difficulty,
            'Pages: ' + material.pages,
            'Rating: ' + material.rating + '/5'
        ];
        
        let y = 120;
        lines.forEach(line => {
            ctx.fillText(line, 40, y);
            y += 25;
        });
        
        // Add footer
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#666666';
        ctx.fillText('Quiz Portal - Study Materials', canvas.width / 2, canvas.height - 20);
    }

    // QP-STUDY-PDF-CONTROLS-002: PDF control functions
    zoomIn() {
        this.scale = Math.min(this.scale * 1.2, 3.0);
        this.updateZoom();
    }

    zoomOut() {
        this.scale = Math.max(this.scale / 1.2, 0.5);
        this.updateZoom();
    }

    updateZoom() {
        const zoomLevel = document.querySelector('.zoom-level');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.scale * 100) + '%';
        }
        
        const canvas = document.querySelector('.pdf-page');
        if (canvas) {
            canvas.style.transform = `scale(${this.scale})`;
        }
    }

    nextPage() {
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        
        if (currentPageEl && totalPagesEl) {
            const current = parseInt(currentPageEl.textContent);
            const total = parseInt(totalPagesEl.textContent);
            
            if (current < total) {
                currentPageEl.textContent = current + 1;
                // In real implementation, render next page
            }
        }
    }

    prevPage() {
        const currentPageEl = document.getElementById('currentPage');
        
        if (currentPageEl) {
            const current = parseInt(currentPageEl.textContent);
            
            if (current > 1) {
                currentPageEl.textContent = current - 1;
                // In real implementation, render previous page
            }
        }
    }

    fitToWidth() {
        const contentArea = document.getElementById('pdfContentArea');
        const canvas = document.querySelector('.pdf-page');
        
        if (contentArea && canvas) {
            const containerWidth = contentArea.clientWidth - 40; // padding
            const canvasWidth = canvas.width;
            this.scale = containerWidth / canvasWidth;
            this.updateZoom();
        }
    }

    fullscreen() {
        const modal = document.querySelector('#pdfViewerModal .modal-dialog');
        if (modal) {
            if (modal.classList.contains('modal-fullscreen')) {
                modal.classList.remove('modal-fullscreen');
                modal.classList.add('modal-xl');
            } else {
                modal.classList.remove('modal-xl');
                modal.classList.add('modal-fullscreen');
            }
        }
    }

    downloadCurrentPDF() {
        if (!this.currentPDF) return;
        this.downloadMaterial(this.currentPDF.id);
    }

    printCurrentPDF() {
        if (!this.currentPDF) return;
        
        Swal.fire({
            title: 'Print PDF',
            text: 'This will open the PDF in a new window for printing.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Open for Print',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // In production, open actual PDF for printing
                window.open(this.currentPDF.pdfUrl, '_blank');
            }
        });
    }

    // QP-STUDY-DOWNLOAD-001: Download material
    downloadMaterial(materialId) {
        const material = this.materials.find(m => m.id === materialId);
        if (!material) return;
        
        if (material.type === 'premium' && !this.isPremiumUser()) {
            this.showPremiumModal();
            return;
        }
        
        // Simulate download
        Swal.fire({
            title: 'Download Starting',
            text: `Downloading "${material.title}"...`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
        // In production, trigger actual download
        // const a = document.createElement('a');
        // a.href = material.pdfUrl;
        // a.download = material.title + '.pdf';
        // a.click();
        
        // Update download count
        material.downloads += 1;
    }

    // QP-STUDY-PREMIUM-001: Show premium modal
    showPremiumModal() {
        const modal = new bootstrap.Modal(document.getElementById('premiumModal'));
        modal.show();
    }

    // QP-STUDY-RATING-001: Handle rating
    handleRating(event) {
        const rating = parseInt(event.target.dataset.rating);
        const stars = event.target.parentElement.querySelectorAll('i');
        
        // Update visual state
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // Show thank you message
        Swal.fire({
            title: 'Thank you!',
            text: `You rated this material ${rating} stars`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    previewRating(event) {
        const rating = parseInt(event.target.dataset.rating);
        const stars = event.target.parentElement.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#fbbf24';
            } else {
                star.style.color = '#d1d5db';
            }
        });
    }

    // QP-STUDY-VIEW-001: Switch view
    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.getElementById('gridView').classList.toggle('active', view === 'grid');
        document.getElementById('listView').classList.toggle('active', view === 'list');
        
        // Re-render materials
        this.renderMaterials();
    }

    // QP-STUDY-CATEGORY-001: Filter by category
    filterByCategory(category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
        
        this.applyFilters();
        
        // Smooth scroll to materials grid
        document.getElementById('materials-grid').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    // QP-STUDY-CLEAR-001: Clear all filters
    clearFilters() {
        // Reset filter controls
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('sortFilter').value = 'newest';
        
        // Reset quick filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-filter="all"]').classList.add('active');
        
        // Reset materials
        this.filteredMaterials = [...this.materials];
        this.currentPage = 1;
        this.renderMaterials();
        this.updateResultsCount();
    }

    // QP-STUDY-PAGINATION-001: Render pagination
    renderPagination() {
        const pagination = document.getElementById('materialsPagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredMaterials.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="studyMaterials.goToPage(${this.currentPage - 1})" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="studyMaterials.goToPage(1)">1</a></li>`;
            if (startPage > 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="studyMaterials.goToPage(${i})">${i}</a>
                </li>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="studyMaterials.goToPage(${totalPages})">${totalPages}</a></li>`;
        }
        
        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="studyMaterials.goToPage(${this.currentPage + 1})" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    // QP-STUDY-PAGE-001: Go to page
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredMaterials.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages || page === this.currentPage) {
            return;
        }
        
        this.currentPage = page;
        this.renderMaterials();
        
        // Smooth scroll to top of materials grid
        document.getElementById('materials-grid').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    // QP-STUDY-COUNT-001: Update results count
    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredMaterials.length;
        }
    }

    // QP-STUDY-ERROR-001: Show error
    showError(message) {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            confirmButtonColor: '#6366f1'
        });
    }

    // QP-STUDY-ASYNC-001: Simulate async operation
    async simulateAsyncOperation(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// QP-STUDY-DEBOUNCE-001: Debounce utility
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

// QP-STUDY-GLOBAL-001: Initialize global instance
window.StudyMaterialsManager = StudyMaterialsManager;
window.studyMaterials = new StudyMaterialsManager();

// QP-STUDY-READY-001: Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Study Materials System Ready');
});
