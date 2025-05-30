/* ========== MAIN.JS - ULTRA SIMPLE VERSION ========== */

// ========== IMMEDIATELY HIDE ALL LOADING SCREENS ========== //
(function() {
    // Force hide ANY loading overlays immediately when script loads
    setTimeout(() => {
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none !important';
            loadingScreen.classList.add('hidden');
        }
        
        // Hide page transitions
        const pageTransition = document.getElementById('pageTransition');
        if (pageTransition) {
            pageTransition.remove();
        }
        
        // Hide simple transitions
        const simpleTransition = document.getElementById('simpleTransition');
        if (simpleTransition) {
            simpleTransition.remove();
        }
        
        // Hide any overlay with common class names
        const overlays = document.querySelectorAll('.loading-overlay, .page-transition, .transition-overlay, [id*="loading"], [id*="transition"]');
        overlays.forEach(overlay => {
            overlay.style.display = 'none !important';
            overlay.style.opacity = '0 !important';
            overlay.style.visibility = 'hidden !important';
        });
        
        console.log('✅ All overlays forcefully removed');
    }, 50);
})();

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
    
    // FORCE HIDE LOADING AGAIN
    forceHideAllLoading();
    
    // Initialize based on current page
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || currentPath.includes('index.html') || currentPath === '' || currentPath.endsWith('/');
    const isCVPage = currentPath.includes('cv-') && currentPath.includes('.html');
    
    if (isCVPage) {
        // ON CV PAGE - Just hide loading and basic setup
        initializeCVPage();
    } else {
        // ON HOMEPAGE - Full initialization
        initializeHomepage();
    }
});

// ========== FORCE HIDE ALL LOADING ========== //
function forceHideAllLoading() {
    // Remove all possible loading elements
    const loadingSelectors = [
        '#loadingScreen',
        '#pageTransition', 
        '#simpleTransition',
        '.loading-screen',
        '.loading-overlay',
        '.page-transition',
        '.transition-overlay',
        '[class*="loading"]',
        '[id*="loading"]',
        '[class*="transition"]',
        '[id*="transition"]'
    ];
    
    loadingSelectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none !important';
                el.style.opacity = '0 !important';
                el.style.visibility = 'hidden !important';
                el.remove();
            });
        } catch (e) {
            // Ignore errors
        }
    });
    
    // Clear body classes that might affect loading
    document.body.classList.remove('loading', 'transitioning');
    
    isLoading = false;
    console.log('🔥 FORCE REMOVED all loading screens');
}

// ========== CV PAGE INITIALIZATION ========== //
function initializeCVPage() {
    console.log('🔧 CV Page detected - hiding all loading');
    
    // AGGRESSIVE LOADING REMOVAL
    forceHideAllLoading();
    
    // Keep trying to remove loading for a few seconds
    const clearLoadingInterval = setInterval(() => {
        forceHideAllLoading();
    }, 100);
    
    // Stop trying after 5 seconds
    setTimeout(() => {
        clearInterval(clearLoadingInterval);
        console.log('✅ CV page fully loaded');
    }, 5000);
    
    // Basic CV page setup
    try {
        initializeThemeToggle();
        initializeBackToTop();
        initializeSmoothScroll();
    } catch (error) {
        console.log('Minor error in CV setup:', error);
    }
}

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
        
        // Show loading screen briefly
        showLoadingScreen();
        
        // Hide loading screen after short delay
        setTimeout(() => {
            hideLoadingScreen();
            console.log('✅ Homepage loaded successfully!');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error in homepage:', error);
        forceHideAllLoading();
    }
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
    }
    
    // Navigation link clicks - DIRECT NAVIGATION (no loading screens)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            
            if (page === 'home') {
                scrollToTop();
                return;
            }
            
            if (page && cvFiles[page]) {
                // DIRECT NAVIGATION - NO LOADING OVERLAY
                console.log(`🔄 Direct navigation to: ${page}`);
                window.location.href = cvFiles[page];
            }
        });
    });
    
    // Navbar scroll effects
    if (navbar) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// ========== MEMBER CARDS ========== //
function initializeMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        // DIRECT CLICK - NO LOADING
        card.addEventListener('click', function() {
            const member = this.getAttribute('data-member');
            if (member && cvFiles[member]) {
                console.log(`🔄 Direct navigation to CV: ${member}`);
                window.location.href = cvFiles[member];
            }
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            
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
        
        card.style.cursor = 'pointer';
    });
}

// ========== SIMPLE LOADING SYSTEM ========== //
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ========== SCROLL EFFECTS ========== //
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.classList.contains('stats-section') && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.member-card, .info-card, .tech-item, .stat-item, .stats-section');
    elementsToAnimate.forEach(el => {
        if (el) observer.observe(el);
    });
}

function initializeStatsAnimation() {
    // Placeholder
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

// ========== PARTICLES ========== //
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        try {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 60, density: { enable: true, value_area: 800 } },
                    color: { value: '#ffffff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5 },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 3, direction: 'none', out_mode: 'out' }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
                    modes: { grab: { distance: 140 }, push: { particles_nb: 4 } }
                }
            });
            console.log('✅ Particles.js loaded');
        } catch (error) {
            console.log('⚠️ Particles.js failed');
        }
    }
}

// ========== AOS ========== //
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({ duration: 800, once: true, offset: 100 });
            console.log('✅ AOS loaded');
        } catch (error) {
            console.log('⚠️ AOS failed');
        }
    }
}

// ========== THEME TOGGLE ========== //
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
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

// ========== BACK TO TOP ========== //
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
        
        backToTop.addEventListener('click', scrollToTop);
    }
}

// ========== SMOOTH SCROLL ========== //
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== ERROR HANDLING ========== //
window.addEventListener('error', function(e) {
    console.error('❌ Error:', e.error);
    forceHideAllLoading();
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Promise error:', e.reason);
    forceHideAllLoading();
});

// ========== CONTINUOUS LOADING CLEANUP ========== //
// Keep checking and removing any loading screens every 2 seconds
setInterval(() => {
    const loadingElements = document.querySelectorAll('[class*="loading"], [id*="loading"], [class*="transition"], [id*="transition"]');
    if (loadingElements.length > 0) {
        console.log('🧹 Cleaning up remaining loading elements');
        forceHideAllLoading();
    }
}, 2000);

console.log('%c🚀 12PRO Website - Ultra Simple Version!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%c✅ No complex loading systems - Direct navigation only', 'color: #10b981; font-size: 12px;');