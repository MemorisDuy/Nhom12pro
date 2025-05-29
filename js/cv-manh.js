// Clean Code và Comment - JavaScript được viết rõ ràng với comment tiếng Việt

// Chờ DOM load hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 CV Website đã tải thành công!');
    initializeAllFeatures();
});

// Khởi tạo tất cả các tính năng
function initializeAllFeatures() {
    initSmoothScrolling();
    initNavbarEffects();
    initScrollAnimations();
    initHoverEffects();
    initContactForm();
    initInteractiveElements();
    initResponsiveFeatures();
    initAccessibilityFeatures();
    console.log('✅ Tất cả tính năng đã được khởi tạo');
}

// 1. Smooth scrolling cho navbar
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Đóng mobile menu
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Cập nhật active nav link
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

// 2. Navbar effects khi scroll
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(102, 126, 234, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
        
        updateActiveNavOnScroll();
    }, 100));
}

// Tự động cập nhật active nav khi scroll
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// 3. Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.content-section, .skill-category, .timeline-item');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Animate skill bars
function animateSkillBars(skillCategory) {
    const skillItems = skillCategory.querySelectorAll('.skill-list li');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
            
            const skillLevel = item.querySelector('.skill-level');
            if (skillLevel) {
                skillLevel.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    skillLevel.style.transform = 'scale(1)';
                }, 200);
            }
        }, index * 100);
    });
}

// 4. Hover effects
function initHoverEffects() {
    // Skill items hover
    const skillItems = document.querySelectorAll('.skill-list li');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.backgroundColor = '';
        });
    });
    
    // Timeline items hover
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Hobby tags click
    const hobbyTags = document.querySelectorAll('.hobby-tag');
    hobbyTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            showNotification(`Bạn đã chọn sở thích: ${this.textContent}`, 'info');
        });
    });
}

// 5. Interactive elements
function initInteractiveElements() {
    // Click to copy contact info
    const contactItems = document.querySelectorAll('.info-item');
    contactItems.forEach(item => {
        const span = item.querySelector('span');
        if (span) {
            const text = span.textContent.trim();
            
            if (text.includes('@') || text.includes('github.com') || text.includes('facebook.com') || text.match(/\d{10}/)) {
                item.style.cursor = 'pointer';
                item.title = 'Click để sao chép';
                
                item.addEventListener('click', function() {
                    copyToClipboard(text);
                    this.style.backgroundColor = '#d4edda';
                    setTimeout(() => {
                        this.style.backgroundColor = '';
                    }, 1000);
                });
            }
        }
    });
    
    // Profile image click
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 1000);
            
            showNotification('🎉 Xin chào! Cảm ơn bạn đã ghé thăm CV của tôi!', 'success');
        });
    }
}

// 6. Contact form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#dc3545';
                } else {
                    input.style.borderColor = '#28a745';
                }
            });
            
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('✅ Tin nhắn đã được gửi thành công!', 'success');
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                showNotification('❌ Vui lòng điền đầy đủ thông tin.', 'error');
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#28a745';
                } else {
                    this.style.borderColor = '';
                }
            });
        });
    }
}

// 7. Responsive features
function initResponsiveFeatures() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        initTouchEvents();
    }
    
    window.addEventListener('resize', debounce(function() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            location.reload();
        }
    }, 250));
}

// Touch events
function initTouchEvents() {
    const interactiveElements = document.querySelectorAll('.skill-list li, .timeline-item, .hobby-tag');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// 8. Accessibility
function initAccessibilityFeatures() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        if (e.key === 'Escape') {
            const navbarCollapse = document.querySelector('.navbar-collapse.show');
            if (navbarCollapse) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Bỏ qua đến nội dung chính';
    skipLink.className = 'skip-link sr-only';
    
    skipLink.addEventListener('focus', function() {
        this.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', function() {
        this.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Utility functions
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

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(`📋 Đã sao chép: ${text}`, 'success');
        }).catch(err => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(`📋 Đã sao chép: ${text}`, 'success');
        }
    } catch (err) {
        showNotification('❌ Không thể sao chép', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, duration);
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Website loaded in ${Math.round(loadTime)}ms`);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
});

// Page visibility
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// Custom CSS for animations
const animationCSS = `
.animate-visible {
    animation: slideInUp 0.8s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.keyboard-navigation *:focus {
    outline: 2px solid #007bff !important;
    outline-offset: 2px !important;
}

.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #007bff;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s ease;
}

.skip-link:focus {
    top: 6px;
}

.mobile-device .content-section {
    touch-action: manipulation;
}

@media (max-width: 576px) {
    .notification {
        right: 10px !important;
        left: 10px !important;
        min-width: auto !important;
        max-width: none !important;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

console.log(`
🎨 ===================================
   CV WEBSITE - HUỲNH ĐỨC MẠNH
   Backend Developer
===================================
🚀 Website Features:
   ✅ Responsive Design
   ✅ Smooth Animations  
   ✅ Interactive Elements
   ✅ Form Validation
   ✅ Accessibility Support
   ✅ Performance Optimized

📱 Contact: huynhducmanh2020@gmail.com
===================================
`);

console.log('🎉 All features initialized successfully!');