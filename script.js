// Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    
    // Page navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const pages = document.querySelectorAll('.page');
    
    // Chart elements
    const salesChartCanvas = document.getElementById('salesChart');
    const analyticsChartCanvas = document.getElementById('analyticsChart');
    
    // Chart controls
    const chartControls = document.querySelectorAll('.chart-controls button');
    
    // Initialize dashboard
    initializeDashboard();
    
    function initializeDashboard() {
        setupMobileToggle();
        setupNavigation();
        setupChartControls();
        setupCharts();
        setupFormInteractions();
        setupActivityFeed();
    }
    
    // Mobile sidebar toggle functionality
    function setupMobileToggle() {
        if (mobileToggle && toggleSidebar && sidebar) {
            mobileToggle.addEventListener('click', function() {
                sidebar.classList.add('active');
            });
            
            toggleSidebar.addEventListener('click', function() {
                sidebar.classList.remove('active');
            });
            
            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function(e) {
                if (!sidebar.contains(e.target) && !e.target.closest('.mobile-toggle')) {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('active');
                    }
                }
            });
        }
    }
    
    // Page navigation functionality
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetPage = this.getAttribute('data-page');
                
                // Remove active class from all nav items and pages
                navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
                pages.forEach(page => page.classList.remove('active'));
                
                // Add active class to current nav item and target page
                this.parentElement.classList.add('active');
                const targetElement = document.getElementById(targetPage);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
                
                // Close mobile sidebar after navigation
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
    
    // Chart period controls
    function setupChartControls() {
        chartControls.forEach(control => {
            control.addEventListener('click', function() {
                // Remove active class from all buttons in the same group
                const controlsGroup = this.parentElement.querySelectorAll('button');
                controlsGroup.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the period and update chart (you can extend this)
                const period = this.getAttribute('data-period');
                console.log(`Chart period changed to: ${period}`);
                
                // Here you would typically update the chart data based on period
                // For now, we'll just log it
            });
        });
    }
    
    // Chart.js implementation
    function setupCharts() {
        if (salesChartCanvas) {
            setupSalesChart();
        }
        
        if (analyticsChartCanvas) {
            setupAnalyticsChart();
        }
        
        // Setup additional charts for the enhanced overview
        setupDemographicsChart();
    }
    
    function setupDemographicsChart() {
        const demographicsCanvas = document.getElementById('demographicsChart');
        if (!demographicsCanvas) return;
        
        const ctx = demographicsCanvas.getContext('2d');
        
        // Sample demographics data
        const demographicsData = {
            labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
            datasets: [{
                label: 'Users',
                data: [25, 35, 20, 15, 5],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBorderWidth: 3
            }]
        };
        
        new Chart(ctx, {
            type: 'doughnut',
            data: demographicsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                cutout: '60%',
                rotation: Math.PI,
                circumference: Math.PI * 2,
                interaction: {
                    mode: 'point'
                },
                hover: {
                    mode: 'nearest'
                }
            }
        });
    }
    
    function setupSalesChart() {
        const ctx = salesChartCanvas.getContext('2d');
        
        // Sample data - in a real application, this would come from an API
        const salesData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales',
                data: [1200, 1900, 3000, 5000, 2300, 3400, 4500],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'Orders',
                data: [15, 23, 35, 42, 28, 38, 52],
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };
        
        new Chart(ctx, {
            type: 'line',
            data: salesData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                },
                hover: {
                    mode: 'index'
                }
            }
        });
    }
    
    function setupAnalyticsChart() {
        const ctx = analyticsChartCanvas.getContext('2d');
        
        // Sample analytics data
        const analyticsData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Users',
                data: [1200, 1900, 3000, 5000, 2300, 3400, 4500, 4200, 5500, 6200, 5800, 7200],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Page Views',
                data: [5200, 7900, 13000, 15000, 12300, 13400, 14500, 14200, 15500, 16200, 15800, 17200],
                borderColor: '#4299e1',
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Bounce Rate',
                data: [65, 62, 58, 55, 58, 52, 48, 51, 47, 45, 48, 42],
                borderColor: '#ed8936',
                backgroundColor: 'rgba(237, 137, 54, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        };
        
        new Chart(ctx, {
            type: 'line',
            data: analyticsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                },
                hover: {
                    mode: 'index'
                }
            }
        });
    }
    
    // Form interactions
    function setupFormInteractions() {
        // Handle form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show success message
                const formData = new FormData(this);
                console.log('Form submitted:', Object.fromEntries(formData));
                
                // Simulate success message
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Saved!';
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }
            });
        });
        
        // Handle checkbox toggles
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log(`${this.name || 'checkbox'} changed to: ${this.checked}`);
            });
        });
        
        // Handle button clicks
        const buttons = document.querySelectorAll('.btn, .action-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Prevent default for action buttons
                if (this.classList.contains('action-btn')) {
                    e.preventDefault();
                    console.log('Action button clicked:', this.innerHTML);
                    
                    // Add ripple effect
                    addRippleEffect(this, e);
                }
            });
        });
    }
    
    // Activity feed functionality
    function setupActivityFeed() {
        // Simulate new activity items
        const activityFeed = document.querySelector('.activity-feed');
        if (activityFeed) {
            // Add new activity after 3 seconds (simulating real-time updates)
            setTimeout(() => {
                const newActivity = createActivityItem(
                    'fas fa-plus',
                    'New user registered: <strong>Alex Johnson</strong>',
                    'Just now'
                );
                
                const firstActivity = activityFeed.querySelector('.activity-item');
                if (firstActivity) {
                    activityFeed.insertBefore(newActivity, firstActivity);
                } else {
                    activityFeed.appendChild(newActivity);
                }
                
                // Add animation class
                newActivity.style.animation = 'fadeIn 0.5s ease';
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    newActivity.style.animation = '';
                }, 500);
            }, 3000);
        }
    }
    
    function createActivityItem(iconClass, content, time) {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="activity-content">
                <p>${content}</p>
                <span class="activity-time">${time}</span>
            </div>
        `;
        
        return activityItem;
    }
    
    // Utility functions
    function addRippleEffect(element, e) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple animation to styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .action-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
    
    // Handle window resize for responsive behavior
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Ensure sidebar visibility based on screen size
            if (sidebar) {
                if (window.innerWidth > 768) {
                    // On desktop, sidebar should be visible (no active class needed)
                    sidebar.classList.remove('active');
                } else {
                    // On mobile, sidebar should be hidden by default
                    sidebar.classList.remove('active');
                }
            }
        }, 250);
    });
    
    // Add some dynamic behavior to stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a pulse animation
            this.style.animation = 'pulse 0.6s ease';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
    
    // Add pulse animation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .stat-card {
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(pulseStyle);
    
    console.log('Dashboard initialized successfully!');
});

// Utility function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to get relative time
function getRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
}
