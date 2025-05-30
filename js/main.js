/* ========== MAIN.JS - FIXED VERSION ========== */

// ========== GLOBAL VARIABLES ========== //
let isLoading = false;
let statsAnimated = false;

// CV file mapping
const cvFiles = {
    'duy': 'cv-duy.html',
    'manh': 'cv-manh.html',
    'thang': 'cv-thang.html',
    'truc': 'cv-truc.html'
};

const memberNames = {
    'duy': 'Nguyễn Ngọc Duy',
    'manh': 'Huỳnh Đức Mạnh', 
    'thang': 'Nguyễn Quốc Thắng',
    'truc': 'Võ Trung Trực'
};

// ========== DOM CONTENT LOADED ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing 12PRO Website...');
    
    // DETECT IF WE'RE ON CV PAGE OR HOMEPAGE
    const currentPage = window.location.pathname;
    const isHomePage = currentPage === '/' || currentPage.includes('index.html') || currentPage === '' || currentPage.endsWith('/');
    
    if (isHomePage) {
        // HOMEPAGE INITIALIZATION
        initializeHomepage();
    } else {
        // CV PAGE INITIALIZATION - IMPORTANT!
        initializeCVPage();
    }
});

// ========== HOMEPAGE INITIALIZATION ========== //
function initializeHomepage() {
    try {
        // Initialize components
        initializeNavigation();
        initializeMemberCards();
        initializeScrollEffects();
        initializeParticles();
        initializeAOS();
        initializeThemeToggle();
        initializeBackToTop();
        initializeSmoothScroll();
        initializeStatsAnimation();
        
        // Show loading screen initially
        showLoadingScreen();
        
        // Hide loading screen after short delay
        setTimeout(() => {
            hideLoadingScreen();
            console.log('✅ Homepage loaded successfully!');
        }, 1500);
        
        console.log('✅ All components initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing website:', error);
        hideLoadingScreen(); // Make sure to hide loading on error
    }
}

// ========== CV PAGE INITIALIZATION ========== //
function initializeCVPage() {
    try {
        console.log('🔧 Initializing CV page...');
        
        // IMMEDIATELY HIDE ANY LOADING OVERLAYS
        hideAllLoadingScreens();
        
        // Initialize basic components for CV pages
        initializeThemeToggle();
        initializeBackToTop();
        initializeSmoothScroll();
        
        console.log('✅ CV page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing CV page:', error);
        hideAllLoadingScreens();
    }
}

// ========== HIDE ALL LOADING SCREENS ========== //
function hideAllLoadingScreens() {
    // Hide main loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        loadingScreen.classList.add('hidden');
    }
    
    // Hide page transition overlay
    const pageTransition = document.getElementById('pageTransition');
    if (pageTransition) {
        pageTransition.style.display = 'none';
        pageTransition.style.opacity = '0';
        pageTransition.style.visibility = 'hidden';
    }
    
    // Hide any other overlays with transition classes
    const overlays = document.querySelectorAll('.page-transition, .loading-overlay, .transition-overlay');
    overlays.forEach(overlay => {
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
    });
    
    isLoading = false;
    console.log('✅ All loading screens hidden');
}

// ========== NAVIGATION SYSTEM ========== //
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
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
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
                // Navigate to separate CV page - SIMPLIFIED
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
    
    // Navbar scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class
        if (scrollTop > 50 && navbar) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (mobile)
        if (window.innerWidth <= 768 && navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// ========== CV PAGE NAVIGATION - SIMPLIFIED ========== //
function navigateToCVPage(member) {
    if (isLoading) return;
    
    console.log(`🔄 Navigating to CV page: ${member}`);
    
    // SIMPLE NAVIGATION - NO COMPLEX LOADING
    showSimpleTransition(`Đang chuyển đến CV ${memberNames[member]}...`);
    
    // Navigate after very short delay
    setTimeout(() => {
        window.location.href = cvFiles[member];
    }, 500);
}

// ========== SIMPLE TRANSITION - NO COMPLEX OVERLAYS ========== //
function showSimpleTransition(message) {
    // Create simple loading indicator
    const indicator = document.createElement('div');
    indicator.id = 'simpleTransition';
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 20px 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        text-align: center;
        font-weight: 600;
        color: #374151;
    `;
    indicator.innerHTML = `
        <div style="margin-bottom: 10px;">
            <div style="width: 30px; height: 30px; border: 3px solid #e5e7eb; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        ${message}
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    `;
    
    document.body.appendChild(indicator);
    isLoading = true;
    
    // Auto remove after 2 seconds (failsafe)
    setTimeout(() => {
        if (indicator && indicator.parentNode) {
            indicator.remove();
        }
        isLoading = false;
    }, 2000);
}

// ========== MEMBER CARDS FOR HOMEPAGE ========== //
function initializeMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        // Click handler - Navigate to CV page
        card.addEventListener('click', function() {
            const member = this.getAttribute('data-member');
            if (member && cvFiles[member]) {
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
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.style.display = 'flex';
        isLoading = true;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
        }, 500);
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
    const elementsToAnimate = document.querySelectorAll('.member-card, .info-card, .tech-item, .stat-item, .stats-section');
    elementsToAnimate.forEach(el => {
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
        const target = parseInt(stat.getAttribute('data-count')) || 0;
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
        try {
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
        } catch (error) {
            console.log('⚠️ Particles.js failed to initialize:', error);
        }
    } else {
        console.log('⚠️ Particles.js not found');
    }
}

// ========== AOS ANIMATION ========== //
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
            
            console.log('✅ AOS initialized');
        } catch (error) {
            console.log('⚠️ AOS failed to initialize:', error);
        }
    } else {
        console.log('⚠️ AOS not found');
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

// ========== ERROR HANDLING ========== //
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
    // Hide loading screen if there's an error
    hideAllLoadingScreens();
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
    hideAllLoadingScreens();
});

// ========== RESIZE HANDLER ========== //
window.addEventListener('resize', debounce(function() {
    // Update particles if needed
    if (window.pJSDom && window.pJSDom.length > 0) {
        try {
            window.pJSDom[0].pJS.fn.canvasSize();
        } catch (error) {
            console.log('⚠️ Particles resize failed:', error);
        }
    }
    
    // Refresh AOS
    if (typeof AOS !== 'undefined') {
        try {
            AOS.refresh();
        } catch (error) {
            console.log('⚠️ AOS refresh failed:', error);
        }
    }
}, 250));

// ========== IMMEDIATE LOADING FIX ON PAGE LOAD ========== //
// This runs immediately when script loads
(function() {
    // If we're on a CV page and there are loading overlays, hide them immediately
    const currentPage = window.location.pathname;
    const isCVPage = currentPage.includes('cv-') && currentPage.includes('.html');
    
    if (isCVPage) {
        // Force hide any loading screens immediately
        setTimeout(() => {
            hideAllLoadingScreens();
        }, 100);
    }
})();

// ========== CONSOLE STYLING ========== //
console.log('%c🚀 12PRO Website Loaded Successfully!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%cDeveloped by Team 12PRO - UTH Group', 'color: #6b7280; font-size: 12px;');

// ========== EXPORT FOR EXTERNAL USE ========== //
window.TeamWebsite = {
    navigateToCVPage,
    cvFiles,
    memberNames,
    hideAllLoadingScreens
};