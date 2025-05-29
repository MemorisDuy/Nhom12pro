// Global Variables
let isEditMode = false;
let cvData = {};

// DOM Elements
const editModeBtn = document.getElementById('editModeBtn');
const saveModeBtn = document.getElementById('saveModeBtn');
const scrollToTopBtn = document.getElementById('scrollToTop');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const imageUpload = document.getElementById('imageUpload');
const profileImg = document.getElementById('profileImg');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSkillAnimations();
    setupEventListeners();
    setupScrollEffects();
    setupSmoothScrolling();
});

// Initialize Application
function initializeApp() {
    loadCVData();
    updateSkillBars();
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Edit mode toggle
    editModeBtn.addEventListener('click', toggleEditMode);
    saveModeBtn.addEventListener('click', saveChanges);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Contact form
    contactForm.addEventListener('submit', handleContactForm);
    
    // Image upload
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Skill range inputs
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('skill-range')) {
            updateSkill(e.target);
        }
    });
    
    // Make editable elements contentEditable in edit mode
    document.addEventListener('click', function(e) {
        if (isEditMode && e.target.classList.contains('editable')) {
            e.target.contentEditable = true;
            e.target.focus();
        }
    });
    
    // Save editable content on blur
    document.addEventListener('blur', function(e) {
        if (e.target.classList.contains('editable')) {
            e.target.contentEditable = false;
            saveCVData();
        }
    }, true);
}

// Scroll Effects
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for header
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${rate}px)`;
        }
        
        // Show/hide scroll to top button
        if (scrolled > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
        
        // Add scroll class to navbar
        const navbar = document.querySelector('.navbar');
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth Scrolling for Navigation
function setupSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
        });
    });
}

// Edit Mode Functions
function toggleEditMode() {
    isEditMode = !isEditMode;
    
    if (isEditMode) {
        document.body.classList.add('edit-mode');
        editModeBtn.style.display = 'none';
        saveModeBtn.style.display = 'flex';
        showNotification('Chế độ chỉnh sửa đã bật', 'info');
    } else {
        document.body.classList.remove('edit-mode');
        editModeBtn.style.display = 'flex';
        saveModeBtn.style.display = 'none';
        
        // Make all editable elements non-editable
        document.querySelectorAll('.editable').forEach(element => {
            element.contentEditable = false;
        });
    }
}

function saveChanges() {
    saveCVData();
    toggleEditMode();
    showNotification('Thay đổi đã được lưu!', 'success');
}

// Data Management
function loadCVData() {
    // Load data from memory storage (since localStorage is not available)
    if (window.cvStoredData) {
        cvData = window.cvStoredData;
        populateFormData();
    } else {
        // Initialize with default data
        cvData = gatherCurrentData();
        window.cvStoredData = cvData;
    }
}

function saveCVData() {
    cvData = gatherCurrentData();
    window.cvStoredData = cvData;
}

function gatherCurrentData() {
    const data = {};
    
    document.querySelectorAll('.editable').forEach(element => {
        const field = element.getAttribute('data-field');
        if (field) {
            data[field] = element.textContent || element.innerText;
        }
    });
    
    // Gather skill levels
    document.querySelectorAll('.skill-progress').forEach((skill, index) => {
        data[`skillLevel${index + 1}`] = skill.getAttribute('data-skill');
    });
    
    return data;
}

function populateFormData() {
    Object.keys(cvData).forEach(key => {
        const element = document.querySelector(`[data-field="${key}"]`);
        if (element) {
            element.textContent = cvData[key];
        }
    });
}

// Mobile Menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Contact Form
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    // Simulate form submission
    showLoadingButton(e.target.querySelector('.btn-submit'));
    
    setTimeout(() => {
        showNotification('Tin nhắn đã được gửi thành công!', 'success');
        e.target.reset();
        resetLoadingButton(e.target.querySelector('.btn-submit'));
    }, 2000);
}

// Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImg.src = e.target.result;
            showNotification('Ảnh đại diện đã được cập nhật!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Skill Management
function updateSkill(rangeInput) {
    const skillItem = rangeInput.closest('.skill-item');
    const progressBar = skillItem.querySelector('.skill-progress');
    const value = rangeInput.value;
    
    progressBar.style.width = value + '%';
    progressBar.setAttribute('data-skill', value);
    
    // Add animation
    progressBar.style.transition = 'width 0.5s ease-out';
}

function updateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const skillValue = bar.getAttribute('data-skill');
        setTimeout(() => {
            bar.style.width = skillValue + '%';
        }, 100);
    });
}

function loadSkillAnimations() {
    const observerOptions = {
        threshold: 0.5
    };
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const skillValue = bar.getAttribute('data-skill');
                        bar.style.width = skillValue + '%';
                    }, index * 200);
                });
            }
        });
    }, observerOptions);
    
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
}

// Dynamic Content Management
function addTimelineItem() {
    const timeline = document.getElementById('careerTimeline');
    const newItem = document.createElement('div');
    newItem.className = 'timeline-item';
    newItem.innerHTML = `
        <div class="timeline-date editable" data-field="careerNew${Date.now()}Date">Năm - Năm</div>
        <div class="timeline-content">
            <h3 class="editable" data-field="careerNew${Date.now()}Title">Vị trí công việc</h3>
            <p class="editable" data-field="careerNew${Date.now()}Desc">Mô tả công việc</p>
        </div>
        <button class="remove-btn" onclick="removeTimelineItem(this)">×</button>
    `;
    timeline.appendChild(newItem);
    animateNewElement(newItem);
}

function removeTimelineItem(button) {
    const item = button.closest('.timeline-item');
    item.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        item.remove();
    }, 300);
}

function addSkillItem() {
    const skillsGrid = document.getElementById('skillsGrid');
    const newSkill = document.createElement('div');
    newSkill.className = 'skill-item';
    newSkill.innerHTML = `
        <i class="fas fa-code"></i>
        <span class="editable" data-field="skillNew${Date.now()}Name">Kỹ năng mới</span>
        <div class="skill-bar">
            <div class="skill-progress" data-skill="50"></div>
        </div>
        <input type="range" class="skill-range" min="0" max="100" value="50" onchange="updateSkill(this)">
        <button class="remove-btn" onclick="removeSkillItem(this)">×</button>
    `;
    skillsGrid.appendChild(newSkill);
    animateNewElement(newSkill);
}

function removeSkillItem(button) {
    const item = button.closest('.skill-item');
    item.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        item.remove();
    }, 300);
}

function addHobbyItem() {
    const hobbiesGrid = document.getElementById('hobbiesGrid');
    const newHobby = document.createElement('div');
    newHobby.className = 'hobby-item';
    newHobby.innerHTML = `
        <i class="fas fa-star"></i>
        <h3 class="editable" data-field="hobbyNew${Date.now()}Title">Sở thích mới</h3>
        <p class="editable" data-field="hobbyNew${Date.now()}Desc">Mô tả sở thích</p>
        <button class="remove-btn" onclick="removeHobbyItem(this)">×</button>
    `;
    hobbiesGrid.appendChild(newHobby);
    animateNewElement(newHobby);
}

function removeHobbyItem(button) {
    const item = button.closest('.hobby-item');
    item.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        item.remove();
    }, 300);
}

function addLanguageItem() {
    const languagesGrid = document.getElementById('languagesGrid');
    const newLanguage = document.createElement('div');
    newLanguage.className = 'language-item';
    newLanguage.innerHTML = `
        <h3 class="editable" data-field="langNew${Date.now()}Name">Ngôn ngữ mới</h3>
        <div class="language-level">
            <span class="editable" data-field="langNew${Date.now()}Level">Cơ bản</span>
            <div class="level-stars" data-level="2">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
                <i class="far fa-star"></i>
            </div>
        </div>
        <button class="remove-btn" onclick="removeLanguageItem(this)">×</button>
    `;
    languagesGrid.appendChild(newLanguage);
    animateNewElement(newLanguage);
}

function removeLanguageItem(button) {
    const item = button.closest('.language-item');
    item.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        item.remove();
    }, 300);
}

function addAwardItem() {
    const awardsList = document.getElementById('awardsList');
    const newAward = document.createElement('div');
    newAward.className = 'award-item';
    newAward.innerHTML = `
        <div class="award-icon">
            <i class="fas fa-trophy"></i>
        </div>
        <div class="award-content">
            <h3 class="editable" data-field="awardNew${Date.now()}Title">Giải thưởng mới</h3>
            <p class="editable" data-field="awardNew${Date.now()}Desc">Mô tả giải thưởng</p>
        </div>
        <button class="remove-btn" onclick="removeAwardItem(this)">×</button>
    `;
    awardsList.appendChild(newAward);
    animateNewElement(newAward);
}

function removeAwardItem(button) {
    const item = button.closest('.award-item');
    item.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        item.remove();
    }, 300);
}

function addProjectItem() {
    const projectsGrid = document.getElementById('projectsGrid');
    const newProject = document.createElement('div');
    newProject.className = 'project-card';
    newProject.innerHTML = `
        <div class="project-image">
            <img src="https://via.placeholder.com/300x200/4a6cf7/white?text=New+Project" alt="New Project">
        </div>
        <div class="project-content">
            <h3 class="editable" data-field="projectNew${Date.now()}Title">Dự án mới</h3>
            <p class="editable" data-field="projectNew${Date.now()}Desc">Mô tả dự án</p>
            <div class="project-tech">
                <span class="tech-tag editable" data-field="projectNew${Date.now()}Tech1">HTML</span>
                <span class="tech-tag editable" data-field="projectNew${Date.now()}Tech2">CSS</span>
                <span class="tech-tag editable" data-field="projectNew${Date.now()}Tech3">JS</span>
            </div>
            <div class="project-links">
                <a href="#" target="_blank" class="btn-link">
                    <i class="fab fa-github"></i> GitHub
                </a>
                <a href="#" target="_blank" class="btn-link">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>
            </div>
        </div>
        <button class="remove-btn" onclick="removeProjectItem(this)">×</button>
    `;
    projectsGrid.appendChild(newProject);
    animateNewElement(newProject);
}

function removeProjectItem(button) {
    const item = button.closest('.project-card');
    item.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        item.remove();
    }, 300);
}

// Animation Functions
function animateNewElement(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.3s ease-out';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#27ae60';
        case 'error': return '#e74c3c';
        case 'warning': return '#f39c12';
        default: return '#4a6cf7';
    }
}

function showLoadingButton(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    button.disabled = true;
    button.setAttribute('data-original-text', originalText);
}

function resetLoadingButton(button) {
    const originalText = button.getAttribute('data-original-text');
    button.innerHTML = originalText;
    button.disabled = false;
    button.removeAttribute('data-original-text');
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + E for edit mode
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
    }
    
    // Ctrl + S for save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (isEditMode) {
            saveChanges();
        }
    }
    
    // Escape to exit edit mode
    if (e.key === 'Escape' && isEditMode) {
        toggleEditMode();
    }
});

// Print Functionality
function printCV() {
    // Hide edit elements for printing
    const editElements = document.querySelectorAll('.edit-toggle, .remove-btn, .add-btn');
    editElements.forEach(el => el.style.display = 'none');
    
    window.print();
    
    // Restore edit elements after printing
    setTimeout(() => {
        editElements.forEach(el => el.style.display = '');
    }, 1000);
}

// Export Data
function exportData() {
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'cv-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;

document.head.appendChild(style);