// Enhanced JavaScript cho CV chuyên nghiệp

// Biến toàn cục
let currentTheme = 'blue';
let isScrolling = false;
let scrollTimeout;

// DOM Elements
const elements = {
    navbar: null,
    hamburger: null,
    navMenu: null,
    progressBar: null,
    backToTop: null,
    loadingScreen: null,
    modal: null,
    profileImg: null,
    fileInput: null
};

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeApp();
});

// Khởi tạo các element DOM
function initializeElements() {
    elements.navbar = document.getElementById('navbar');
    elements.hamburger = document.getElementById('hamburger');
    elements.navMenu = document.getElementById('nav-menu');
    elements.progressBar = document.getElementById('progress-bar');
    elements.backToTop = document.getElementById('back-to-top');
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.modal = document.getElementById('edit-modal');
    elements.profileImg = document.querySelector('.profile-img');
}

// Khởi tạo toàn bộ ứng dụng
function initializeApp() {
    // Loading screen
    showLoadingScreen();
    
    // Load dữ liệu đã lưu
    loadUserData();
    
    // Thiết lập các chức năng
    setupNavigation();
    setupScrollEffects();
    setupThemeSystem();
    setupImageUpload();
    setupModal();
    setupControlPanel();
    setupAnimations();
    setupSkillsBars();
    setupLanguageBars();
    setupContactLinks();
    setupAccessibility();
    
    // Ẩn loading screen sau khi khởi tạo xong
    setTimeout(hideLoadingScreen, 1500);
}

// Loading Screen
function showLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Navigation System - YÊU CẦU 1
function setupNavigation() {
    // Hamburger menu toggle
    if (elements.hamburger && elements.navMenu) {
        elements.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling cho navigation links
    const navLinks = document.querySelectorAll('.smooth-scroll');
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
    
    // Close mobile menu khi click vào link
    const mobileLinks = elements.navMenu?.querySelectorAll('.nav-link');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
}

function toggleMobileMenu() {
    elements.hamburger?.classList.toggle('active');
    elements.navMenu?.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (elements.navMenu?.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    elements.hamburger?.classList.remove('active');
    elements.navMenu?.classList.remove('active');
    document.body.style.overflow = '';
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const navHeight = elements.navbar?.offsetHeight || 70;
        const targetPosition = targetElement.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll Effects
function setupScrollEffects() {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
}

function handleScroll() {
    if (isScrolling) return;
    
    isScrolling = true;
    requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbarAppearance();
        updateBackToTopVisibility();
        handleScrollAnimations();
        isScrolling = false;
    });
}

function updateScrollProgress() {
    if (!elements.progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    elements.progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
}

function updateNavbarAppearance() {
    if (!elements.navbar) return;
    
    if (window.scrollY > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }
}

function updateBackToTopVisibility() {
    if (!elements.backToTop) return;
    
    if (window.scrollY > 300) {
        elements.backToTop.classList.add('show');
    } else {
        elements.backToTop.classList.remove('show');
    }
}

function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// Theme System - Nâng cấp theme switching
function setupThemeSystem() {
    // Load saved theme
    const savedTheme = localStorage.getItem('cvTheme') || 'blue';
    applyTheme(savedTheme);
    
    // Theme button event listeners
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            saveTheme(theme);
        });
    });
}

function applyTheme(theme) {
    currentTheme = theme;
    
    // Remove all theme classes
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Update theme colors
    const root = document.documentElement;
    const themeColors = getThemeColors(theme);
    
    Object.entries(themeColors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
    
    // Update active theme button
    updateActiveThemeButton(theme);
    
    // Add theme transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function getThemeColors(theme) {
    const themes = {
        blue: {
            '--primary-color': '#2c3e50',
            '--secondary-color': '#3498db',
            '--accent-color': '#e74c3c'
        },
        green: {
            '--primary-color': '#27ae60',
            '--secondary-color': '#2ecc71',
            '--accent-color': '#f39c12'
        },
        purple: {
            '--primary-color': '#8e44ad',
            '--secondary-color': '#9b59b6',
            '--accent-color': '#f1c40f'
        },
        red: {
            '--primary-color': '#c0392b',
            '--secondary-color': '#e74c3c',
            '--accent-color': '#3498db'
        },
        dark: {
            '--primary-color': '#1a1a1a',
            '--secondary-color': '#4a9eff',
            '--accent-color': '#ff6b6b',
            '--text-color': '#e0e0e0',
            '--white': '#2d2d2d',
            '--light-bg': '#1e1e1e'
        }
    };
    
    return themes[theme] || themes.blue;
}

function updateActiveThemeButton(theme) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-theme') === theme) {
            button.classList.add('active');
        }
    });
}

function saveTheme(theme) {
    localStorage.setItem('cvTheme', theme);
    showNotification(`Đã chuyển sang theme ${theme}!`, 'success');
}

// Enhanced Image Upload - YÊU CẦU 13
function setupImageUpload() {
    if (!elements.profileImg) return;
    
    // Create file input
    elements.fileInput = document.createElement('input');
    elements.fileInput.type = 'file';
    elements.fileInput.accept = 'image/*';
    elements.fileInput.style.display = 'none';
    document.body.appendChild(elements.fileInput);
    
    // Profile image click handler
    elements.profileImg.addEventListener('click', () => {
        elements.fileInput.click();
    });
    
    // File input change handler
    elements.fileInput.addEventListener('change', handleImageUpload);
    
    // Drag and drop support
    elements.profileImg.addEventListener('dragover', handleDragOver);
    elements.profileImg.addEventListener('drop', handleImageDrop);
    
    // Load saved image
    loadProfileImage();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    elements.profileImg.style.opacity = '0.7';
}

function handleImageDrop(event) {
    event.preventDefault();
    elements.profileImg.style.opacity = '1';
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    }
}

function processImageFile(file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Kích thước ảnh không được vượt quá 5MB!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        updateProfileImage(e.target.result);
        saveProfileImage(e.target.result);
        showNotification('Ảnh đại diện đã được cập nhật!', 'success');
    };
    reader.readAsDataURL(file);
}

function updateProfileImage(imageSrc) {
    const icon = elements.profileImg.querySelector('i');
    if (icon) icon.style.display = 'none';
    
    let img = elements.profileImg.querySelector('img');
    if (!img) {
        img = document.createElement('img');
        img.alt = 'Profile Photo';
        elements.profileImg.appendChild(img);
    }
    
    img.src = imageSrc;
    img.style.display = 'block';
}

function saveProfileImage(imageSrc) {
    const userData = JSON.parse(localStorage.getItem('cvUserData') || '{}');
    userData.profileImage = imageSrc;
    localStorage.setItem('cvUserData', JSON.stringify(userData));
}

function loadProfileImage() {
    const userData = JSON.parse(localStorage.getItem('cvUserData') || '{}');
    if (userData.profileImage) {
        updateProfileImage(userData.profileImage);
    }
}

// Enhanced Modal System - YÊU CẦU 10
function setupModal() {
    if (!elements.modal) return;
    
    const editBtn = document.getElementById('edit-btn');
    const closeBtn = elements.modal.querySelector('.close-modal');
    const applyBtn = document.getElementById('apply-changes-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Event listeners
    editBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    applyBtn?.addEventListener('click', applyChanges);
    cancelBtn?.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    elements.modal.addEventListener('click', function(event) {
        if (event.target === elements.modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && elements.modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openModal() {
    populateModalForm();
    elements.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = elements.modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

function closeModal() {
    elements.modal.style.display = 'none';
    document.body.style.overflow = '';
}

function populateModalForm() {
    const fields = {
        'edit-name': document.querySelector('.name')?.textContent || '',
        'edit-title': document.querySelector('.title')?.textContent || '',
        'edit-email': getContactText(0, 'email'),
        'edit-phone': getContactText(1, 'phone'),
        'edit-address': getContactText(2, 'address'),
        'edit-facebook': getContactText(3, 'facebook'),
        'edit-github': getContactText(4, 'github'),
        'edit-about': document.querySelector('.personal-description')?.textContent || ''
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });
}

function getContactText(index, type) {
    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems[index]) {
        const link = contactItems[index].querySelector('a');
        const span = contactItems[index].querySelector('span');
        const text = link ? link.textContent : (span ? span.textContent : '');
        
        // Clean up the text based on type
        if (type === 'email' && text.startsWith('mailto:')) {
            return text.replace('mailto:', '');
        }
        if (type === 'phone' && text.startsWith('tel:')) {
            return text.replace('tel:', '');
        }
        return text;
    }
    return '';
}

function applyChanges() {
    const formData = {
        name: document.getElementById('edit-name').value,
        title: document.getElementById('edit-title').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        address: document.getElementById('edit-address').value,
        facebook: document.getElementById('edit-facebook').value,
        github: document.getElementById('edit-github').value,
        about: document.getElementById('edit-about').value
    };
    
    // Validate form
    if (!validateForm(formData)) return;
    
    // Update DOM elements
    updateDOMElements(formData);
    
    // Save to localStorage
    saveUserData(formData);
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification('Thông tin CV đã được cập nhật thành công!', 'success');
}

function validateForm(data) {
    const requiredFields = ['name', 'title', 'email'];
    const missingFields = requiredFields.filter(field => !data[field].trim());
    
    if (missingFields.length > 0) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Vui lòng nhập email hợp lệ!', 'error');
        return false;
    }
    
    return true;
}

function updateDOMElements(data) {
    // Update name and title
    const nameElement = document.querySelector('.name');
    const titleElement = document.querySelector('.title');
    if (nameElement) nameElement.textContent = data.name;
    if (titleElement) titleElement.textContent = data.title;
    
    // Update contact information
    updateContactInfo(data);
    
    // Update about section
    const aboutElement = document.querySelector('.personal-description');
    if (aboutElement) aboutElement.textContent = data.about;
}

function updateContactInfo(data) {
    const contactItems = document.querySelectorAll('.contact-item');
    const contactData = [
        { value: data.email, href: `mailto:${data.email}` },
        { value: data.phone, href: `tel:${data.phone.replace(/\s+/g, '')}` },
        { value: data.address, href: null },
        { value: data.facebook, href: addProtocolIfNeeded(data.facebook) },
        { value: data.github, href: addProtocolIfNeeded(data.github) }
    ];
    
    contactItems.forEach((item, index) => {
        if (contactData[index] && contactData[index].value) {
            const link = item.querySelector('a');
            const span = item.querySelector('span');
            
            if (contactData[index].href && (link || index < 2 || index > 2)) {
                // Update or create link
                if (link) {
                    link.textContent = contactData[index].value;
                    link.href = contactData[index].href;
                } else if (span) {
                    const newLink = document.createElement('a');
                    newLink.href = contactData[index].href;
                    newLink.textContent = contactData[index].value;
                    newLink.style.color = 'inherit';
                    newLink.style.textDecoration = 'none';
                    if (index > 2) newLink.target = '_blank';
                    span.parentNode.replaceChild(newLink, span);
                }
            } else if (span) {
                // Update span for address
                span.textContent = contactData[index].value;
            }
        }
    });
}

// Control Panel Setup
function setupControlPanel() {
    // Print button
    const printBtn = document.getElementById('print-btn');
    printBtn?.addEventListener('click', printCV);
    
    // PDF export button
    const pdfBtn = document.getElementById('pdf-btn');
    pdfBtn?.addEventListener('click', exportPDF);
    
    // Save button
    const saveBtn = document.getElementById('save-btn');
    saveBtn?.addEventListener('click', saveCurrentData);
    
    // Back to top button
    elements.backToTop?.addEventListener('click', scrollToTop);
}

function printCV() {
    // Hide elements that shouldn't be printed
    const elementsToHide = ['.navbar-banner', '.control-panel', '.back-to-top'];
    const hiddenElements = [];
    
    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            hiddenElements.push({ element, display: element.style.display });
            element.style.display = 'none';
        }
    });
    
    // Print
    window.print();
    
    // Restore hidden elements
    setTimeout(() => {
        hiddenElements.forEach(({ element, display }) => {
            element.style.display = display;
        });
    }, 1000);
    
    showNotification('Đang chuẩn bị in CV...', 'info');
}

function exportPDF() {
    if (typeof html2pdf === 'undefined') {
        showNotification('Tính năng xuất PDF đang được tải...', 'warning');
        return;
    }
    
    const element = document.getElementById('cv-content');
    const name = document.querySelector('.name')?.textContent || 'CV';
    
    const options = {
        margin: 10,
        filename: `${name.replace(/\s+/g, '-')}-CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Hide control panel temporarily
    const controlPanel = document.querySelector('.control-panel');
    const backToTop = elements.backToTop;
    
    if (controlPanel) controlPanel.style.display = 'none';
    if (backToTop) backToTop.style.display = 'none';
    
    showNotification('Đang tạo file PDF...', 'info');
    
    html2pdf().set(options).from(element).save().then(() => {
        // Restore hidden elements
        if (controlPanel) controlPanel.style.display = 'flex';
        if (backToTop) backToTop.style.display = 'block';
        
        showNotification('CV đã được xuất thành công!', 'success');
    }).catch(() => {
        showNotification('Có lỗi xảy ra khi xuất PDF!', 'error');
        
        // Restore hidden elements on error
        if (controlPanel) controlPanel.style.display = 'flex';
        if (backToTop) backToTop.style.display = 'block';
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Animations Setup
function setupAnimations() {
    // Trigger initial animations
    setTimeout(() => {
        handleScrollAnimations();
    }, 500);
    
    // Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Skills Progress Bars - YÊU CẦU 12
function setupSkillsBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill-progress');
        const skillLevel = item.getAttribute('data-skill');
        
        if (progressBar && skillLevel) {
            // Animate skill bar when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            progressBar.style.width = `${skillLevel}%`;
                        }, Math.random() * 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(item);
        }
    });
}

// Language Progress Bars - YÊU CẦU 6
function setupLanguageBars() {
    const languageItems = document.querySelectorAll('.language-progress');
    
    languageItems.forEach(progress => {
        const width = progress.getAttribute('data-width');
        
        if (width) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            progress.style.width = `${width}%`;
                        }, Math.random() * 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(progress.parentElement);
        }
    });
}

// Enhanced Contact Links - YÊU CẦU 9
function setupContactLinks() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        const textElement = item.querySelector('a, span');
        
        if (!textElement) return;
        
        // Add click handler for all contact items
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const link = this.querySelector('a');
            if (link && e.target !== link) {
                // Animate click
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                    link.click();
                }, 100);
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Helper function for protocol
function addProtocolIfNeeded(url) {
    if (!url) return '';
    
    if (url.includes('github.com') && !url.startsWith('http')) {
        return 'https://' + url;
    }
    
    if (url.includes('facebook.com') && !url.startsWith('http')) {
        return 'https://' + url;
    }
    
    return url.startsWith('http') ? url : 'https://' + url;
}

// Data Management
function saveCurrentData() {
    const userData = {
        name: document.querySelector('.name')?.textContent || '',
        title: document.querySelector('.title')?.textContent || '',
        email: getContactText(0, 'email'),
        phone: getContactText(1, 'phone'),
        address: getContactText(2, 'address'),
        facebook: getContactText(3, 'facebook'),
        github: getContactText(4, 'github'),
        about: document.querySelector('.personal-description')?.textContent || '',
        theme: currentTheme,
        lastSaved: new Date().toISOString()
    };
    
    saveUserData(userData);
    showNotification('Dữ liệu CV đã được lưu!', 'success');
}

function saveUserData(userData) {
    try {
        const existingData = JSON.parse(localStorage.getItem('cvUserData') || '{}');
        const mergedData = { ...existingData, ...userData };
        localStorage.setItem('cvUserData', JSON.stringify(mergedData));
    } catch (error) {
        console.error('Error saving user data:', error);
        showNotification('Có lỗi khi lưu dữ liệu!', 'error');
    }
}

function loadUserData() {
    try {
        const savedData = localStorage.getItem('cvUserData');
        if (!savedData) return;
        
        const userData = JSON.parse(savedData);
        
        // Apply saved theme
        if (userData.theme) {
            applyTheme(userData.theme);
        }
        
        // Load profile image
        if (userData.profileImage) {
            updateProfileImage(userData.profileImage);
        }
        
        // Store data for later use
        window.userDataTemp = userData;
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Accessibility Features
function setupAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Skip to content link
    addSkipToContentLink();
    
    // ARIA labels and roles
    enhanceARIA();
    
    // Focus management
    setupFocusManagement();
}

function handleKeyboardNavigation(e) {
    // ESC key handlers
    if (e.key === 'Escape') {
        if (elements.modal?.style.display === 'block') {
            closeModal();
        } else if (elements.navMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Add visible focus outline
        focusableElements.forEach(el => {
            el.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--secondary-color)';
                this.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }
}

function addSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#cv-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.color = 'white';
    skipLink.style.backgroundColor = 'var(--primary-color)';
    skipLink.style.padding = '8px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.zIndex = '10000';
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceARIA() {
    // Add ARIA labels
    const navbar = elements.navbar;
    if (navbar) {
        navbar.setAttribute('role', 'navigation');
        navbar.setAttribute('aria-label', 'Main navigation');
    }
    
    // Progress bar
    if (elements.progressBar) {
        elements.progressBar.setAttribute('role', 'progressbar');
        elements.progressBar.setAttribute('aria-label', 'Page scroll progress');
    }
    
    // Modal
    if (elements.modal) {
        elements.modal.setAttribute('role', 'dialog');
        elements.modal.setAttribute('aria-modal', 'true');
        elements.modal.setAttribute('aria-labelledby', 'modal-title');
    }
    
    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const theme = btn.getAttribute('data-theme');
        btn.setAttribute('aria-label', `Switch to ${theme} theme`);
        btn.setAttribute('role', 'button');
    });
}

function setupFocusManagement() {
    // Focus trap for modal
    if (elements.modal) {
        elements.modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = this.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styling
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: getNotificationColor(type),
        color: 'white',
        padding: '12px 24px',
        borderRadius: '6px',
        zIndex: '10000',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        animation: 'slideUp 0.3s ease',
        maxWidth: '90%',
        textAlign: 'center'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translate(-50%, 100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, 100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Performance Optimization
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
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('CV Application Error:', e.error);
    showNotification('Đã xảy ra lỗi. Vui lòng tải lại trang.', 'error');
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    // Save current state
    saveCurrentData();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyTheme,
        saveUserData,
        loadUserData,
        showNotification
    };
}