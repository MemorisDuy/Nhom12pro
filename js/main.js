/* ========== MAIN.JS - PROFESSIONAL JAVASCRIPT ========== */

// ========== GLOBAL VARIABLES ========== //
let currentPage = 'home';
let isLoading = false;
let scrollIndicatorTimeout;
let statsAnimated = false;

// Navigation members data
const members = ['duy', 'manh', 'thang', 'truc'];
const memberNames = {
    'duy': 'Nguyễn Ngọc Duy',
    'manh': 'Huỳnh Đức Mạnh', 
    'thang': 'Nguyễn Quốc Thắng',
    'truc': 'Võ Trung Trực'
};

// CV file mapping
const cvFiles = {
    'duy': 'cv-duy.html',
    'manh': 'cv-manh.html',
    'thang': 'cv-thang.html',
    'truc': 'cv-truc.html'
};

// ========== DOM CONTENT LOADED ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing 12PRO Website...');
    
    // Check if we're on homepage or CV page
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || currentPath.includes('index.html') || currentPath === '';
    
    if (isHomePage) {
        // Initialize homepage components
        initializeHomepage();
    } else {
        // Initialize CV page components
        initializeCVPage();
    }

// ========== HOMEPAGE INITIALIZATION ========== //
function initializeHomepage() {
    try {
        initializeNavigation();
        initializeScrollEffects();
        initializeParticles();
        initializeAOS();
        initializeMemberCards();
        initializeThemeToggle();
        initializeBackToTop();
        initializeSmoothScroll();
        initializeStatsAnimation();
        
        // Show loading screen initially
        showLoadingScreen();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            hideLoadingScreen();
            console.log('✅ Homepage loaded successfully!');
        }, 2000);
        
        console.log('✅ Homepage components initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing homepage:', error);
    }
}

// ========== CV PAGE INITIALIZATION ========== //
function initializeCVPage() {
    try {
        // Get current CV from URL
        const currentCV = getCurrentCVFromPath();
        
        initializeCVNavigation(currentCV);
        initializeThemeToggle();
        initializeBackToTop();
        initializeSmoothScroll();
        
        // Show loading screen initially
        showLoadingScreen();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            hideLoadingScreen();
            console.log(`✅ CV page loaded successfully: ${currentCV}`);
        }, 1500);
        
        console.log('✅ CV page components initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing CV page:', error);
    }
}

function getCurrentCVFromPath() {
    const path = window.location.pathname;
    for (const member in cvFiles) {
        if (path.includes(cvFiles[member])) {
            return member;
        }
    }
    return 'duy'; // default fallback
}

// ========== NAVIGATION SYSTEM FOR HOMEPAGE ========== //
function initializeNavigation() {
    const navbar = document.getElementById('mainNavbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Navigation link clicks - Navigate to separate CV pages
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            
            if (page === 'home') {
                // Smooth scroll to top if already on homepage
                scrollToTop();
                return;
            }
            
            if (page && cvFiles[page]) {
                // Navigate to separate CV page
                navigateToCVPage(page);
                
                // Close mobile menu
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
    
    // Scroll effects for navbar
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (mobile)
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// ========== CV PAGE NAVIGATION ========== //
function navigateToCVPage(member) {
    if (isLoading) return;
    
    console.log(`🔄 Navigating to CV page: ${member}`);
    
    // Show loading transition
    showPageTransition(`Đang chuyển đến CV ${memberNames[member]}...`);
    
    // Navigate to CV page after short delay
    setTimeout(() => {
        window.location.href = cvFiles[member];
    }, 800);
}

function initializeCVNavigation(currentMember) {
    console.log(`🔧 Initializing CV navigation for: ${currentMember}`);
    
    // Create CV navigation if it doesn't exist
    createCVNavigationBar(currentMember);
    
    // Back to home functionality
    const backHomeButtons = document.querySelectorAll('.back-home, .btn-home');
    backHomeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToHomepage();
        });
    });
    
    // Previous/Next member navigation
    const prevButtons = document.querySelectorAll('.prev-member, .btn-prev');
    const nextButtons = document.querySelectorAll('.next-member, .btn-next');
    
    prevButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const prevMember = getPreviousMember(currentMember);
            navigateToCVPage(prevMember);
        });
    });
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const nextMember = getNextMember(currentMember);
            navigateToCVPage(nextMember);
        });
    });
    
    // Keyboard navigation for CV pages
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                const prevMember = getPreviousMember(currentMember);
                navigateToCVPage(prevMember);
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                const nextMember = getNextMember(currentMember);
                navigateToCVPage(nextMember);
                break;
                
            case 'Escape':
            case 'Home':
                e.preventDefault();
                navigateToHomepage();
                break;
        }
    });
}

function createCVNavigationBar(currentMember) {
    // Check if navigation already exists
    if (document.querySelector('.cv-navigation-bar')) return;
    
    const prevMember = getPreviousMember(currentMember);
    const nextMember = getNextMember(currentMember);
    
    const navBar = document.createElement('div');
    navBar.className = 'cv-navigation-bar';
    navBar.innerHTML = `
        <div class="cv-nav-container">
            <button class="cv-nav-btn btn-home" title="Về trang chủ">
                <i class="fas fa-home"></i>
                <span>Trang chủ</span>
            </button>
            
            <div class="cv-nav-info">
                <h3>CV ${memberNames[currentMember]}</h3>
                <p>Nhóm 12PRO - UTH</p>
            </div>
            
            <div class="cv-nav-members">
                <button class="cv-nav-btn btn-prev" title="Thành viên trước: ${memberNames[prevMember]}">
                    <i class="fas fa-chevron-left"></i>
                    <span>${memberNames[prevMember]}</span>
                </button>
                
                <button class="cv-nav-btn btn-next" title="Thành viên tiếp theo: ${memberNames[nextMember]}">
                    <span>${memberNames[nextMember]}</span>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add CSS for CV navigation
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .cv-navigation-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 1000;
            padding: 1rem 0;
        }
        
        .cv-nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
        }
        
        .cv-nav-info {
            text-align: center;
            flex: 1;
        }
        
        .cv-nav-info h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 0.25rem 0;
        }
        
        .cv-nav-info p {
            font-size: 0.875rem;
            color: #6b7280;
            margin: 0;
        }
        
        .cv-nav-members {
            display: flex;
            gap: 1rem;
        }
        
        .cv-nav-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 50px;
            color: #374151;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            white-space: nowrap;
        }
        
        .cv-nav-btn:hover {
            background: #3b82f6;
            border-color: #3b82f6;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }
        
        .btn-home {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border: none;
            color: white;
        }
        
        .btn-home:hover {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            opacity: 0.9;
        }
        
        .cv-nav-btn i {
            font-size: 0.875rem;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .cv-nav-container {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem;
            }
            
            .cv-nav-members {
                width: 100%;
                justify-content: space-between;
            }
            
            .cv-nav-btn {
                flex: 1;
                justify-content: center;
                padding: 0.75rem 1rem;
            }
            
            .cv-nav-btn span {
                display: none;
            }
            
            .cv-nav-info {
                order: -1;
            }
        }
        
        @media (max-width: 480px) {
            .cv-nav-btn {
                padding: 0.625rem 0.75rem;
                font-size: 0.75rem;
            }
        }
    `;
    
    // Add navigation and styles to page
    document.head.appendChild(navStyle);
    document.body.insertBefore(navBar, document.body.firstChild);
    
    // Add padding to body to account for fixed nav
    document.body.style.paddingTop = '100px';
    
    // Re-initialize navigation after creating it
    setTimeout(() => {
        initializeCVNavigation(currentMember);
    }, 100);
}

function getPreviousMember(currentMember) {
    const currentIndex = members.indexOf(currentMember);
    return currentIndex > 0 ? members[currentIndex - 1] : members[members.length - 1];
}

function getNextMember(currentMember) {
    const currentIndex = members.indexOf(currentMember);
    return currentIndex < members.length - 1 ? members[currentIndex + 1] : members[0];
}

function navigateToHomepage() {
    if (isLoading) return;
    
    console.log('🏠 Navigating back to homepage');
    
    showPageTransition('Đang về trang chủ...');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

// ========== MEMBER CARDS FOR HOMEPAGE ========== //
function initializeMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        // Click handler - Navigate to CV page
        card.addEventListener('click', function() {
            const member = this.getAttribute('data-member');
            if (member && members.includes(member)) {
                navigateToCVPage(member);
            }
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            
            // Add subtle animation to avatar
            const avatar = this.querySelector('.avatar-frame img');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(2deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const avatar = this.querySelector('.avatar-frame img');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
}

// ========== LOADING SYSTEM ========== //
function showPageTransition(message = 'Đang tải...') {
    // Create and show page transition overlay
    let overlay = document.getElementById('pageTransition');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pageTransition';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-logo">
                    <i class="fas fa-users"></i>
                </div>
                <div class="transition-spinner"></div>
                <h3 class="transition-message">${message}</h3>
                <p>Vui lòng chờ trong giây lát...</p>
            </div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            color: white;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .transition-content {
                text-align: center;
                color: white;
            }
            .transition-logo {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                margin: 0 auto 2rem;
                animation: pulse 2s infinite;
            }
            .transition-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1.5rem;
            }
            .transition-message {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    } else {
        // Update message
        const messageEl = overlay.querySelector('.transition-message');
        if (messageEl) messageEl.textContent = message;
    }
    
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    isLoading = true;
}

function hidePageTransition() {
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
    isLoading = false;
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        isLoading = true;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        isLoading = false;
    }
}

// ========== SCROLL EFFECTS ========== //
function initializeScrollEffects() {
    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger stats animation when stats section is visible
                if (entry.target.classList.contains('stats-section') && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.member-card, .info-card, .tech-item, .stat-item, .stats-section').forEach(el => {
        observer.observe(el);
    });
}

// ========== STATISTICS ANIMATION ========== //
function initializeStatsAnimation() {
    // Will be triggered by scroll observer
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(target * easeOutQuart);
            
            stat.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        }
        
        requestAnimationFrame(updateNumber);
    });
}

// ========== PARTICLES INITIALIZATION ========== //
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 3,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
        
        console.log('✅ Particles.js initialized');
    }
}

// ========== AOS ANIMATION ========== //
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
        
        console.log('✅ AOS initialized');
    }
}

// ========== THEME TOGGLE ========== //
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ========== BACK TO TOP BUTTON ========== //
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            scrollToTop();
        });
    }
}

// ========== SMOOTH SCROLL ========== //
function initializeSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========== UTILITY FUNCTIONS ========== //
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ========== ERROR HANDLING ========== //
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
});

// ========== RESIZE HANDLER ========== //
window.addEventListener('resize', debounce(function() {
    // Update particles if needed
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.canvasSize();
    }
    
    // Refresh AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// ========== CONSOLE STYLING ========== //
console.log('%c🚀 12PRO Website Loaded Successfully!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%cDeveloped by Team 12PRO - UTH Group', 'color: #6b7280; font-size: 12px;');

// ========== EXPORT FOR TESTING ========== //
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToCVPage,
        navigateToHomepage,
        members,
        memberNames,
        cvFiles
    };
}
        
    // Show loading screen initially
    showLoadingScreen();
    
    // Hide loading screen after initialization
    setTimeout(() => {
        hideLoadingScreen();
        console.log('✅ Website loaded successfully!');
    }, 2000);
});

// ========== MAIN INITIALIZATION ========== //
function initializeComponents() {
    try {
        initializeNavigation();
        initializeScrollEffects();
        initializeParticles();
        initializeAOS();
        initializeMemberCards();
        initializeThemeToggle();
        initializeBackToTop();
        initializeSmoothScroll();
        initializeStatsAnimation();
        initializeCVNavigation();
        initializeLoadingProgress();
        
        console.log('✅ All components initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing components:', error);
    }
}

// ========== PAGE NAVIGATION ========== //
function navigateToPage(page) {
    if (isLoading || page === currentPage) return;
    
    console.log(`🔄 Navigating to: ${page}`);
    
    // Show loading
    showPageTransition();
    
    // Update navigation
    updateActiveNavLink(page);
    
    // Switch content
    setTimeout(() => {
        switchContent(page);
        currentPage = page;
        
        // Update URL without page reload
        updateURL(page);
        
        // Hide loading
        hidePageTransition();
        
        // Scroll to top
        scrollToTop();
        
        // Re-initialize components if needed
        if (page !== 'home') {
            initializeCVContent(page);
        }
        
        console.log(`✅ Navigation completed: ${page}`);
    }, 500);
}

function switchContent(page) {
    // Hide all content
    document.querySelectorAll('.cv-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected content
    const targetContent = document.getElementById(`${page}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
        
        // Load CV content if needed
        if (page !== 'home') {
            loadCVContent(page);
        }
    }
}

function updateActiveNavLink(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    updateNavIndicator();
}

function updateURL(page) {
    const url = page === 'home' ? '/' : `/#${page}`;
    window.history.pushState({ page }, '', url);
}

// ========== CV CONTENT LOADING ========== //
function loadCVContent(member) {
    const cvWrapper = document.querySelector(`#${member}-content .cv-wrapper`);
    if (!cvWrapper) return;
    
    // Show loading in CV wrapper
    cvWrapper.innerHTML = `
        <div class="cv-loading">
            <div class="cv-loading-spinner"></div>
            <h3>Đang tải CV ${memberNames[member]}...</h3>
            <p>Vui lòng chờ trong giây lát</p>
        </div>
    `;
    
    // Simulate CV loading (replace with actual loading logic)
    setTimeout(() => {
        cvWrapper.innerHTML = `
            <div class="cv-loaded">
                <div class="cv-header">
                    <div class="cv-avatar">
                        <img src="Nhom12pro.img/${getImageName(member)}" alt="${memberNames[member]}">
                    </div>
                    <div class="cv-info">
                        <h1>${memberNames[member]}</h1>
                        <p class="cv-role">${getMemberRole(member)}</p>
                        <p class="cv-id">MSSV: ${getMemberID(member)}</p>
                    </div>
                </div>
                <div class="cv-content-body">
                    <p>Nội dung CV chi tiết của ${memberNames[member]} sẽ được tích hợp từ file cv-${member}.html</p>
                    <div class="cv-placeholder">
                        <div class="placeholder-section">
                            <h3><i class="fas fa-user"></i> Thông tin cá nhân</h3>
                            <p>Chi tiết thông tin cá nhân...</p>
                        </div>
                        <div class="placeholder-section">
                            <h3><i class="fas fa-graduation-cap"></i> Học vấn</h3>
                            <p>Thông tin học vấn và bằng cấp...</p>
                        </div>
                        <div class="placeholder-section">
                            <h3><i class="fas fa-code"></i> Kỹ năng</h3>
                            <p>Các kỹ năng chuyên môn...</p>
                        </div>
                        <div class="placeholder-section">
                            <h3><i class="fas fa-project-diagram"></i> Dự án</h3>
                            <p>Các dự án đã thực hiện...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add animation
        cvWrapper.querySelector('.cv-loaded').style.animation = 'fadeInUp 0.6s ease forwards';
    }, 1000);
}

function getImageName(member) {
    const imageMap = {
        'duy': 'NguyenNgocDuy.jpg',
        'manh': 'HuynhDucManh.png',
        'thang': 'NguyenQuocThang.jpg',
        'truc': 'voTrungTruc.jpg'
    };
    return imageMap[member] || 'default.jpg';
}

function getMemberRole(member) {
    const roles = {
        'duy': 'Trưởng Nhóm - Full Stack Developer',
        'manh': 'Frontend Developer',
        'thang': 'Backend Developer', 
        'truc': 'UI/UX Designer'
    };
    return roles[member] || 'Thành viên';
}

function getMemberID(member) {
    const ids = {
        'duy': '052205011809',
        'manh': '052205011234',
        'thang': '052205011567',
        'truc': '052205011789'
    };
    return ids[member] || '000000000000';
}

function initializeCVContent(member) {
    // Add specific initialization for each CV if needed
    console.log(`Initializing CV content for: ${member}`);
    
    // Add smooth scroll for CV sections
    const cvContent = document.querySelector(`#${member}-content`);
    if (cvContent) {
        cvContent.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

function updateNavIndicator() {
    const activeLink = document.querySelector('.nav-link.active');
    const indicator = document.getElementById('navIndicator');
    
    if (activeLink && indicator) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('.nav-menu').getBoundingClientRect();
        
        indicator.style.left = (rect.left - navRect.left) + 'px';
        indicator.style.width = rect.width + 'px';
    }
}

function initializeLoadingProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }
}

// ========== BROWSER HISTORY ========== //
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
        const page = e.state.page;
        if (page !== currentPage) {
            switchContent(page);
            updateActiveNavLink(page);
            currentPage = page;
        }
    } else {
        // Default to home
        if (currentPage !== 'home') {
            switchContent('home');
            updateActiveNavLink('home');
            currentPage = 'home';
        }
    }
});

// ========== PERFORMANCE MONITORING ========== //
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Page Load Performance:', {
                'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                'Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                'Total Load Time': Math.round(perfData.loadEventEnd - perfData.navigationStart)
            });
        }, 0);
    });
}

// ========== ADDITIONAL HELPER FUNCTIONS ========== //

// Create floating notification
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 4px solid ${getNotificationColor(type)};
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            color: #374151;
        }
        
        .notification-content i {
            color: ${getNotificationColor(type)};
            font-size: 18px;
        }
        
        .notification-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .notification-close:hover {
            background: #f3f4f6;
            color: #6b7280;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide
    const autoHide = setTimeout(() => hideNotification(notification), duration);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoHide);
        hideNotification(notification);
    });
    
    return notification;
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Enhanced loading with progress tracking
function createAdvancedLoader() {
    const loader = document.createElement('div');
    loader.className = 'advanced-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">
                <div class="logo-ring"></div>
                <i class="fas fa-users"></i>
            </div>
            <h3>12PRO</h3>
            <p class="loader-text">Đang tải trang web...</p>
            <div class="loader-progress">
                <div class="progress-track">
                    <div class="progress-fill"></div>
                </div>
                <span class="progress-percent">0%</span>
            </div>
        </div>
    `;
    
    const loaderStyles = `
        .advanced-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
        }
        
        .loader-content {
            text-align: center;
            max-width: 400px;
            padding: 40px;
        }
        
        .loader-logo {
            position: relative;
            width: 100px;
            height: 100px;
            margin: 0 auto 30px;
        }
        
        .logo-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }
        
        .loader-logo i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            color: white;
        }
        
        .loader-content h3 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        
        .loader-text {
            margin-bottom: 30px;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .loader-progress {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .progress-track {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: white;
            border-radius: 3px;
            transition: width 0.3s ease;
            width: 0%;
        }
        
        .progress-percent {
            font-weight: 600;
            min-width: 40px;
            text-align: right;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = loaderStyles;
    document.head.appendChild(style);
    
    return loader;
}

// Preload images for better performance
function preloadImages() {
    const images = [
        'Nhom12pro.img/NguyenNgocDuy.jpg',
        'Nhom12pro.img/HuynhDucManh.png', 
        'Nhom12pro.img/NguyenQuocThang.jpg',
        'Nhom12pro.img/voTrungTruc.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Enhanced error handling with user feedback
function handleError(error, context = 'Unknown') {
    console.error(`❌ Error in ${context}:`, error);
    
    // Show user-friendly error notification
    showNotification(
        'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        'error',
        5000
    );
    
    // Send error to analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: `${context}: ${error.message}`,
            fatal: false
        });
    }
}

// Wrap critical functions with error handling
const originalNavigateToCVPage = navigateToCVPage;
navigateToCVPage = function(member) {
    try {
        return originalNavigateToCVPage.call(this, member);
    } catch (error) {
        handleError(error, 'navigateToCVPage');
    }
};

// Service worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully');
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed');
            });
    });
}

// Enhanced console welcome message
function showWelcomeMessage() {
    const styles = [
        'color: #3b82f6',
        'font-size: 20px',
        'font-weight: bold',
        'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)'
    ].join(';');
    
    const teamStyles = [
        'color: #10b981',
        'font-size: 14px',
        'font-weight: 600'
    ].join(';');
    
    console.log('%c🚀 Welcome to 12PRO Website!', styles);
    console.log('%c👨‍💻 Developed by Team 12PRO - UTH Group', teamStyles);
    console.log('%c🎯 Features: Responsive Design, Modern UI, Smooth Animations', 'color: #6b7280; font-size: 12px;');
    console.log('%c📱 Optimized for all devices', 'color: #6b7280; font-size: 12px;');
}

// Show welcome message
showWelcomeMessage();

// Export functions for external use
window.TeamWebsite = {
    navigateToCVPage,
    navigateToHomepage,
    showNotification,
    members,
    memberNames,
    cvFiles
};

// ========== NAVIGATION SYSTEM ========== //
function initializeNavigation() {
    const navbar = document.getElementById('mainNavbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIndicator = document.getElementById('navIndicator');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            if (page && page !== currentPage) {
                navigateToPage(page);
                
                // Close mobile menu
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
    
    // Scroll effects for navbar
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (mobile)
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Update nav indicator
    updateNavIndicator();
}

function updateNavIndicator() {
    const activeLink = document.querySelector('.nav-link.active');
    const indicator = document.getElementById('navIndicator');
    
    if (activeLink && indicator) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('.nav-menu').getBoundingClientRect();
        
        indicator.style.left = (rect.left - navRect.left) + 'px';
        indicator.style.width = rect.width + 'px';
    }
}

// ========== PAGE NAVIGATION ========== //
function navigateToPage(page) {
    if (isLoading || page === currentPage) return;
    
    console.log(`🔄 Navigating to: ${page}`);
    
    // Show loading
    showPageTransition();
    
    // Update navigation
    updateActiveNavLink(page);
    
    // Switch content
    setTimeout(() => {
        switchContent(page);
        currentPage = page;
        
        // Update URL without page reload
        updateURL(page);
        
        // Hide loading
        hidePageTransition();
        
        // Scroll to top
        scrollToTop();
        
        // Re-initialize components if needed
        if (page !== 'home') {
            initializeCVContent(page);
        }
        
        console.log(`✅ Navigation completed: ${page}`);
    }, 500);
}

function switchContent(page) {
    // Hide all content
    document.querySelectorAll('.cv-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected content
    const targetContent = document.getElementById(`${page}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
        
        // Load CV content if needed
        if (page !== 'home') {
            loadCVContent(page);
        }
    }
}

function updateActiveNavLink(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    updateNavIndicator();
}

function updateURL(page) {
    const url = page === 'home' ? '/' : `/#${page}`;
    window.history.pushState({ page }, '', url);
}

// ========== CV CONTENT LOADING ========== //
function loadCVContent(member) {
    const cvWrapper = document.querySelector(`#${member}-content .cv-wrapper`);
    if (!cvWrapper) return;
    
    // Show loading in CV wrapper
    cvWrapper.innerHTML = `
        <div class="cv-loading">
            <div class="cv-loading-spinner"></div>
            <h3>Đang tải CV ${memberNames[member]}...</h3>
            <p>Vui lòng chờ trong giây lát</p>
        </div>
    `;
    
    // Simulate CV loading (replace with actual loading logic)
    setTimeout(() => {
        cvWrapper.innerHTML = `
            <div class="cv-loaded">
                <div class="cv-header">
                    <div class="cv-avatar">
                        <img src="Nhom12pro.img/${getImageName(member)}" alt="${memberNames[member]}">
                    </div>
                    <div class="cv-info">
                        <h1>${memberNames[member]}</h1>
                        <p class="cv-role">${getMemberRole(member)}</p>
                        <p class="cv-id">MSSV: ${getMemberID(member)}</p>
                    </div>
                </div>
                <div class="cv-content-body">
                    <p>Nội dung CV chi tiết của ${memberNames[member]} sẽ được tích hợp từ file cv-${member}.html</p>
                    <div class="cv-placeholder">
                        <div class="placeholder-section">
                            <h3><i class="fas fa-user"></i> Thông tin cá nhân</h3>
                            <p>Chi tiết thông tin cá nhân...</p>
                        </div>
                        <div class="placeholder-section">
                            <h3><i class="fas fa-graduation-cap"></i> Học vấn</h3>
                            <p>Thông tin học vấn và bằng cấp...</p>
                        </div>
                        <div class="placeholder-section">
                            <h3><i class="fas fa-code"></i> Kỹ năng</h3>
                            <p>Các kỹ năng chuyên môn...</p>
                        </div>
                        <div class="placeholder-section">
                            <h3><i class="fas fa-project-diagram"></i> Dự án</h3>
                            <p>Các dự án đã thực hiện...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add animation
        cvWrapper.querySelector('.cv-loaded').style.animation = 'fadeInUp 0.6s ease forwards';
    }, 1000);
}

function getImageName(member) {
    const imageMap = {
        'duy': 'NguyenNgocDuy.jpg',
        'manh': 'HuynhDucManh.png',
        'thang': 'NguyenQuocThang.jpg',
        'truc': 'voTrungTruc.jpg'
    };
    return imageMap[member] || 'default.jpg';
}

function getMemberRole(member) {
    const roles = {
        'duy': 'Trưởng Nhóm - Full Stack Developer',
        'manh': 'Frontend Developer',
        'thang': 'Backend Developer', 
        'truc': 'UI/UX Designer'
    };
    return roles[member] || 'Thành viên';
}

function getMemberID(member) {
    const ids = {
        'duy': '052205011809',
        'manh': '052205011234',
        'thang': '052205011567',
        'truc': '052205011789'
    };
    return ids[member] || '000000000000';
}

// ========== CV NAVIGATION ========== //
function initializeCVNavigation() {
    // Back to home buttons
    document.querySelectorAll('.back-home').forEach(btn => {
        btn.addEventListener('click', function() {
            navigateToPage('home');
        });
    });
    
    // Member navigation buttons
    document.querySelectorAll('.prev-member, .next-member').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target && members.includes(target)) {
                navigateToPage(target);
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (currentPage !== 'home') {
            const currentIndex = members.indexOf(currentPage);
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : members.length - 1;
                    navigateToPage(members[prevIndex]);
                    break;
                    
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = currentIndex < members.length - 1 ? currentIndex + 1 : 0;
                    navigateToPage(members[nextIndex]);
                    break;
                    
                case 'Escape':
                    e.preventDefault();
                    navigateToPage('home');
                    break;
            }
        }
    });
}

function initializeCVContent(member) {
    // Add specific initialization for each CV if needed
    console.log(`Initializing CV content for: ${member}`);
    
    // Add smooth scroll for CV sections
    const cvContent = document.querySelector(`#${member}-content`);
    if (cvContent) {
        cvContent.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// ========== MEMBER CARDS ========== //
function initializeMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        // Click handler
        card.addEventListener('click', function() {
            const member = this.getAttribute('data-member');
            if (member && members.includes(member)) {
                navigateToPage(member);
            }
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            
            // Add subtle animation to avatar
            const avatar = this.querySelector('.avatar-frame img');
            if (avatar) {
                avatar.style.transform = 'scale(1.1) rotate(2deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const avatar = this.querySelector('.avatar-frame img');
            if (avatar) {
                avatar.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
}

// ========== SCROLL EFFECTS ========== //
function initializeScrollEffects() {
    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger stats animation when stats section is visible
                if (entry.target.classList.contains('stats-section') && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.member-card, .info-card, .tech-item, .stat-item, .stats-section').forEach(el => {
        observer.observe(el);
    });
}

// ========== STATISTICS ANIMATION ========== //
function initializeStatsAnimation() {
    // Will be triggered by scroll observer
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(target * easeOutQuart);
            
            stat.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        }
        
        requestAnimationFrame(updateNumber);
    });
}

// ========== PARTICLES INITIALIZATION ========== //
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 3,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
        
        console.log('✅ Particles.js initialized');
    }
}

// ========== AOS ANIMATION ========== //
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
        
        console.log('✅ AOS initialized');
    }
}

// ========== THEME TOGGLE ========== //
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// ========== BACK TO TOP BUTTON ========== //
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            scrollToTop();
        });
    }
}

// ========== SMOOTH SCROLL ========== //
function initializeSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========== LOADING SYSTEM ========== //
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        isLoading = true;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        isLoading = false;
    }
}

function showPageTransition() {
    // Create and show page transition overlay
    let overlay = document.getElementById('pageTransition');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pageTransition';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-spinner"></div>
                <p>Đang chuyển trang...</p>
            </div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .transition-content {
                text-align: center;
                color: #374151;
            }
            .transition-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #e5e7eb;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    isLoading = true;
}

function hidePageTransition() {
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
    isLoading = false;
}

function initializeLoadingProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }
}

// ========== UTILITY FUNCTIONS ========== //
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ========== ERROR HANDLING ========== //
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
});

// ========== BROWSER HISTORY ========== //
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
        const page = e.state.page;
        if (page !== currentPage) {
            switchContent(page);
            updateActiveNavLink(page);
            currentPage = page;
        }
    } else {
        // Default to home
        if (currentPage !== 'home') {
            switchContent('home');
            updateActiveNavLink('home');
            currentPage = 'home';
        }
    }
});

// ========== RESIZE HANDLER ========== //
window.addEventListener('resize', debounce(function() {
    // Update particles if needed
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.canvasSize();
    }
    
    // Update nav indicator
    updateNavIndicator();
    
    // Refresh AOS
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// ========== PERFORMANCE MONITORING ========== //
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Page Load Performance:', {
                'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                'Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                'Total Load Time': Math.round(perfData.loadEventEnd - perfData.navigationStart)
            });
        }, 0);
    });
}

// ========== CONSOLE STYLING ========== //
console.log('%c🚀 12PRO Website Loaded Successfully!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%cDeveloped by Team 12PRO - UTH Group', 'color: #6b7280; font-size: 12px;');

// ========== EXPORT FOR TESTING ========== //
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToPage,
        members,
        memberNames,
        currentPage: () => currentPage
    };
}