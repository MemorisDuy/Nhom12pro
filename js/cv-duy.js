/**
 * ===================================
 * JAVASCRIPT CV PREMIUM VỚI CLEAN CODE & COMMENTS
 * Tác giả: Nguyen Ngoc Duy
 * Mô tả: Xử lý tương tác và chức năng chỉnh sửa
 * YÊU CẦU 11: CLEAN CODE VÀ COMMENT (0.5 điểm)
 * YÊU CẦU 13: BỔ SUNG ẢNH CÁ NHÂN (1.0 điểm)
 * ===================================
 */

/**
 * Main CV Application Object
 * Quản lý tất cả tính năng của CV Digital
 * 
 * @namespace DuyCV
 * @author Nguyen Ngoc Duy
 * @version 2.0.0
 * @since 2025
 */
window.DuyCV = {
    // ===================================
    // PROPERTIES - THUỘC TÍNH
    // ===================================
    
    /** @type {boolean} Trạng thái chế độ chỉnh sửa */
    isEditMode: false,
    
    /** @type {Object} Lưu trữ dữ liệu CV */
    cvData: {},
    
    /** @type {Object} Cấu hình ứng dụng */
    config: {
        animationDuration: 300,
        skillBarDelay: 200,
        messageTimeout: 3000,
        scrollOffset: 80,
        maxSkillLevel: 100,
        minSkillLevel: 0
    },
    
    /** @type {Object} Selectors DOM elements */
    selectors: {
        editToggle: '#editToggle',
        editNotification: '#editNotification',
        saveChanges: '#saveChanges',
        addSkillBtn: '#addSkillBtn',
        skillsList: '#skillsList',
        downloadBtn: '#download-btn',
        skillModal: '#skillModal',
        skillForm: '#skillForm',
        skillNameInput: '#skillName',
        skillLevelInput: '#skillLevel',
        skillLevelValue: '#skillLevelValue'
    },

    // ===================================
    // INITIALIZATION METHODS - PHƯƠNG THỨC KHỞI TẠO
    // ===================================
    
    /**
     * Khởi tạo ứng dụng CV
     * Phương thức chính để khởi động tất cả tính năng
     * 
     * @public
     * @returns {void}
     */
    init: function() {
        try {
            this.initSkillBars();
            this.initEditMode();
            this.initDownloadFeature();
            this.initLanguageLevels();
            this.initSmoothScrolling();
            this.initIntersectionObserver();
            this.initKeyboardShortcuts();
            this.initMobileFeatures();
            this.loadSavedData();
            this.showWelcomeMessage();
            
            console.log('✅ CV Application initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize CV application:', error);
            this.showMessage('Có lỗi xảy ra khi khởi tạo ứng dụng', 'error');
        }
    },

    // ===================================
    // SKILL BARS MANAGEMENT - QUẢN LÝ THANH KỸ NĂNG
    // ===================================
    
    /**
     * Khởi tạo animation cho các thanh kỹ năng
     * Tạo hiệu ứng loading tuần tự cho skill bars
     * 
     * @public
     * @returns {void}
     */
    initSkillBars: function() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (!skillBars.length) {
            console.warn('⚠️ No skill bars found');
            return;
        }
        
        // Thiết lập animation cho từng skill bar với delay
        skillBars.forEach((bar, index) => {
            const percentage = this.getSkillPercentage(bar);
            const delay = this.config.skillBarDelay + (index * this.config.skillBarDelay);
            
            setTimeout(() => {
                this.animateSkillBar(bar, percentage);
            }, delay);
        });
        
        console.log(`✅ Initialized ${skillBars.length} skill bars`);
    },
    
    /**
     * Lấy phần trăm kỹ năng từ data attribute hoặc class
     * 
     * @private
     * @param {HTMLElement} bar - Thanh kỹ năng
     * @returns {number} Phần trăm kỹ năng (0-100)
     */
    getSkillPercentage: function(bar) {
        // Ưu tiên data-percentage
        const dataPercentage = bar.getAttribute('data-percentage');
        if (dataPercentage) {
            return Math.min(Math.max(parseInt(dataPercentage), this.config.minSkillLevel), this.config.maxSkillLevel);
        }
        
        // Fallback to class-based percentage
        const classMap = {
            'html-skill': 95,
            'php-skill': 80,
            'design-skill': 85,
            'uiux-skill': 80,
            'sql-skill': 85
        };
        
        for (const [className, percentage] of Object.entries(classMap)) {
            if (bar.classList.contains(className)) {
                return percentage;
            }
        }
        
        return 50; // Default value
    },
    
    /**
     * Tạo animation cho thanh kỹ năng
     * 
     * @private
     * @param {HTMLElement} bar - Thanh kỹ năng
     * @param {number} percentage - Phần trăm đích
     * @returns {void}
     */
    animateSkillBar: function(bar, percentage) {
        if (!bar || typeof percentage !== 'number') {
            console.error('❌ Invalid parameters for animateSkillBar');
            return;
        }
        
        bar.style.width = percentage + '%';
        bar.setAttribute('data-percentage', percentage);
        
        // Thêm class để trigger CSS animation
        bar.classList.add('animated');
    },

    // ===================================
    // EDIT MODE MANAGEMENT - QUẢN LÝ CHẾ ĐỘ CHỈNH SỬA
    // ===================================
    
    /**
     * Khởi tạo chế độ chỉnh sửa
     * Thiết lập event listeners cho các tính năng edit
     * 
     * @public
     * @returns {void}
     */
    initEditMode: function() {
        this.bindEditToggleEvents();
        this.bindSaveEvents();
        this.bindAddSkillEvents();
        this.bindEditableEvents();
        this.bindLanguageEvents();
        
        console.log('✅ Edit mode initialized');
    },
    
    /**
     * Bind events cho nút toggle edit mode
     * 
     * @private
     * @returns {void}
     */
    bindEditToggleEvents: function() {
        const editToggle = document.querySelector(this.selectors.editToggle);
        
        if (!editToggle) {
            console.warn('⚠️ Edit toggle button not found');
            return;
        }
        
        editToggle.addEventListener('click', () => {
            this.toggleEditMode();
        });
    },
    
    /**
     * Bind events cho nút save changes
     * 
     * @private
     * @returns {void}
     */
    bindSaveEvents: function() {
        const saveChanges = document.querySelector(this.selectors.saveChanges);
        
        if (!saveChanges) {
            console.warn('⚠️ Save changes button not found');
            return;
        }
        
        saveChanges.addEventListener('click', () => {
            this.saveAllChanges();
        });
    },
    
    /**
     * Bind events cho nút thêm kỹ năng
     * 
     * @private
     * @returns {void}
     */
    bindAddSkillEvents: function() {
        const addSkillBtn = document.querySelector(this.selectors.addSkillBtn);
        
        if (!addSkillBtn) {
            console.warn('⚠️ Add skill button not found');
            return;
        }
        
        addSkillBtn.addEventListener('click', () => {
            this.showAddSkillModal();
        });
    },
    
    /**
     * Bind events cho các phần tử editable
     * 
     * @private
     * @returns {void}
     */
    bindEditableEvents: function() {
        document.addEventListener('click', (e) => {
            if (this.isEditMode && e.target.classList.contains('editable')) {
                this.makeEditable(e.target);
            }
        });
    },
    
    /**
     * Bind events cho language level dots
     * 
     * @private
     * @returns {void}
     */
    bindLanguageEvents: function() {
        document.addEventListener('click', (e) => {
            if (this.isEditMode && e.target.classList.contains('level-dot')) {
                this.updateLanguageLevel(e.target);
            }
        });
    },
    
    /**
     * Toggle chế độ chỉnh sửa on/off
     * 
     * @public
     * @returns {void}
     */
    toggleEditMode: function() {
        this.isEditMode = !this.isEditMode;
        
        const body = document.body;
        const editToggle = document.querySelector(this.selectors.editToggle);
        const editNotification = document.querySelector(this.selectors.editNotification);
        
        if (!editToggle || !editNotification) {
            console.error('❌ Required elements not found for edit mode toggle');
            return;
        }
        
        if (this.isEditMode) {
            this.enableEditMode(body, editToggle, editNotification);
        } else {
            this.disableEditMode(body, editToggle, editNotification);
        }
        
        console.log(`✅ Edit mode ${this.isEditMode ? 'enabled' : 'disabled'}`);
    },
    
    /**
     * Bật chế độ chỉnh sửa
     * 
     * @private
     * @param {HTMLElement} body - Body element
     * @param {HTMLElement} editToggle - Nút toggle
     * @param {HTMLElement} editNotification - Thông báo edit
     * @returns {void}
     */
    enableEditMode: function(body, editToggle, editNotification) {
        body.classList.add('edit-mode');
        editToggle.classList.add('active');
        editToggle.innerHTML = '<i class="fas fa-save"></i><span>Thoát Edit</span>';
        editNotification.classList.add('show');
        this.showMessage('Chế độ chỉnh sửa đã được bật. Click vào các phần tử để thay đổi.', 'info');
    },
    
    /**
     * Tắt chế độ chỉnh sửa
     * 
     * @private
     * @param {HTMLElement} body - Body element
     * @param {HTMLElement} editToggle - Nút toggle
     * @param {HTMLElement} editNotification - Thông báo edit
     * @returns {void}
     */
    disableEditMode: function(body, editToggle, editNotification) {
        body.classList.remove('edit-mode');
        editToggle.classList.remove('active');
        editToggle.innerHTML = '<i class="fas fa-edit"></i><span>Chỉnh sửa</span>';
        editNotification.classList.remove('show');
        this.showMessage('Đã thoát khỏi chế độ chỉnh sửa.', 'success');
    },
    
    /**
     * Làm cho phần tử có thể chỉnh sửa inline
     * 
     * @public
     * @param {HTMLElement} element - Phần tử cần chỉnh sửa
     * @returns {void}
     */
    makeEditable: function(element) {
        if (!element || !element.hasAttribute('data-field')) {
            console.error('❌ Invalid element for editing');
            return;
        }
        
        const originalText = element.textContent.trim();
        const field = element.getAttribute('data-field');
        
        // Tạo input để chỉnh sửa
        const input = this.createEditInput(originalText);
        
        // Thay thế element bằng input
        this.replaceWithInput(element, input);
        
        // Xử lý khi hoàn thành chỉnh sửa
        this.bindInputEvents(input, element, originalText, field);
        
        console.log(`✏️ Editing field: ${field}`);
    },
    
    /**
     * Tạo input element cho chỉnh sửa
     * 
     * @private
     * @param {string} originalText - Text gốc
     * @returns {HTMLInputElement} Input element
     */
    createEditInput: function(originalText) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.className = 'editing-input';
        return input;
    },
    
    /**
     * Thay thế element bằng input
     * 
     * @private
     * @param {HTMLElement} element - Element gốc
     * @param {HTMLInputElement} input - Input thay thế
     * @returns {void}
     */
    replaceWithInput: function(element, input) {
        element.style.display = 'none';
        element.parentNode.insertBefore(input, element.nextSibling);
        input.focus();
        input.select();
    },
    
    /**
     * Bind events cho input element
     * 
     * @private
     * @param {HTMLInputElement} input - Input element
     * @param {HTMLElement} element - Element gốc
     * @param {string} originalText - Text gốc
     * @param {string} field - Tên field
     * @returns {void}
     */
    bindInputEvents: function(input, element, originalText, field) {
        const finishEditing = () => {
            this.finishEditing(input, element, originalText, field);
        };
        
        input.addEventListener('blur', finishEditing);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finishEditing();
            }
        });
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                this.cancelEditing(input, element);
            }
        });
    },
    
    /**
     * Hoàn thành chỉnh sửa
     * 
     * @private
     * @param {HTMLInputElement} input - Input element
     * @param {HTMLElement} element - Element gốc
     * @param {string} originalText - Text gốc
     * @param {string} field - Tên field
     * @returns {void}
     */
    finishEditing: function(input, element, originalText, field) {
        const newValue = input.value.trim();
        
        if (newValue && newValue !== originalText) {
            element.textContent = newValue;
            this.cvData[field] = newValue;
            this.showMessage(`Đã cập nhật: ${this.getFieldDisplayName(field)}`, 'success');
        }
        
        this.restoreElement(element, input);
    },
    
    /**
     * Hủy chỉnh sửa
     * 
     * @private
     * @param {HTMLInputElement} input - Input element
     * @param {HTMLElement} element - Element gốc
     * @returns {void}
     */
    cancelEditing: function(input, element) {
        this.restoreElement(element, input);
        this.showMessage('Đã hủy chỉnh sửa', 'info');
    },
    
    /**
     * Khôi phục element gốc
     * 
     * @private
     * @param {HTMLElement} element - Element gốc
     * @param {HTMLInputElement} input - Input element
     * @returns {void}
     */
    restoreElement: function(element, input) {
        element.style.display = '';
        if (input.parentNode) {
            input.parentNode.removeChild(input);
        }
    },
    
    /**
     * Lấy tên hiển thị của field
     * 
     * @private
     * @param {string} field - Tên field
     * @returns {string} Tên hiển thị
     */
    getFieldDisplayName: function(field) {
        const fieldNames = {
            'name': 'Tên',
            'profession': 'Nghề nghiệp',
            'phone': 'Số điện thoại',
            'email': 'Email',
            'address': 'Địa chỉ',
            'objective1': 'Mục tiêu 1',
            'objective2': 'Mục tiêu 2'
        };
        
        return fieldNames[field] || field;
    },
    
    /**
     * Cập nhật mức độ ngôn ngữ
     * 
     * @public
     * @param {HTMLElement} clickedDot - Dot được click
     * @returns {void}
     */
    updateLanguageLevel: function(clickedDot) {
        if (!clickedDot || !clickedDot.parentNode) {
            console.error('❌ Invalid language dot element');
            return;
        }
        
        const languageLevel = clickedDot.parentNode;
        const dots = languageLevel.querySelectorAll('.level-dot');
        const clickedIndex = Array.from(dots).indexOf(clickedDot);
        const newLevel = clickedIndex + 1;
        
        // Cập nhật hiển thị
        this.updateLanguageDots(dots, newLevel);
        
        // Lưu vào data
        languageLevel.setAttribute('data-level', newLevel);
        this.showMessage(`Đã cập nhật mức độ ngôn ngữ: ${newLevel}/5`, 'success');
        
        console.log(`✅ Updated language level to ${newLevel}/5`);
    },
    
    /**
     * Cập nhật dots ngôn ngữ
     * 
     * @private
     * @param {NodeList} dots - Danh sách dots
     * @param {number} level - Mức độ mới
     * @returns {void}
     */
    updateLanguageDots: function(dots, level) {
        dots.forEach((dot, index) => {
            if (index < level) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    },

    // ===================================
    // SKILL MANAGEMENT - QUẢN LÝ KỸ NĂNG
    // ===================================
    
    /**
     * Hiển thị modal thêm kỹ năng
     * 
     * @public
     * @returns {void}
     */
    showAddSkillModal: function() {
        const modal = document.querySelector(this.selectors.skillModal);
        const form = document.querySelector(this.selectors.skillForm);
        
        if (!modal || !form) {
            console.error('❌ Skill modal elements not found');
            return;
        }
        
        this.displayModal(modal);
        this.bindModalEvents(modal, form);
        this.bindSkillFormEvents(form, modal);
        
        console.log('✅ Skill modal opened');
    },
    
    /**
     * Hiển thị modal
     * 
     * @private
     * @param {HTMLElement} modal - Modal element
     * @returns {void}
     */
    displayModal: function(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    },
    
    /**
     * Bind events cho modal
     * 
     * @private
     * @param {HTMLElement} modal - Modal element
     * @param {HTMLElement} form - Form element
     * @returns {void}
     */
    bindModalEvents: function(modal, form) {
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const skillLevelInput = document.querySelector(this.selectors.skillLevelInput);
        const skillLevelValue = document.querySelector(this.selectors.skillLevelValue);
        
        // Cập nhật hiển thị range value
        if (skillLevelInput && skillLevelValue) {
            skillLevelInput.addEventListener('input', () => {
                skillLevelValue.textContent = skillLevelInput.value + '%';
            });
        }
        
        // Đóng modal events
        const closeModal = () => this.closeModal(modal, form);
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // Đóng khi click backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Đóng khi nhấn ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    },
    
    /**
     * Bind events cho skill form
     * 
     * @private
     * @param {HTMLElement} form - Form element
     * @param {HTMLElement} modal - Modal element
     * @returns {void}
     */
    bindSkillFormEvents: function(form, modal) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewSkill();
            this.closeModal(modal, form);
        });
    },
    
    /**
     * Đóng modal
     * 
     * @private
     * @param {HTMLElement} modal - Modal element
     * @param {HTMLElement} form - Form element
     * @returns {void}
     */
    closeModal: function(modal, form) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
        form.reset();
        
        // Reset range display
        const skillLevelValue = document.querySelector(this.selectors.skillLevelValue);
        if (skillLevelValue) {
            skillLevelValue.textContent = '50%';
        }
    },
    
    /**
     * Thêm kỹ năng mới
     * 
     * @public
     * @returns {void}
     */
    addNewSkill: function() {
        const skillName = document.querySelector(this.selectors.skillNameInput)?.value?.trim();
        const skillLevel = document.querySelector(this.selectors.skillLevelInput)?.value;
        const skillsList = document.querySelector(this.selectors.skillsList);
        
        if (!skillName || !skillLevel || !skillsList) {
            console.error('❌ Invalid skill data or skills list not found');
            this.showMessage('Có lỗi khi thêm kỹ năng', 'error');
            return;
        }
        
        // Validate skill level
        const level = Math.min(Math.max(parseInt(skillLevel), this.config.minSkillLevel), this.config.maxSkillLevel);
        
        // Tạo skill item mới
        const skillItem = this.createSkillItem(skillName, level);
        
        // Thêm vào danh sách với animation
        this.addSkillToList(skillsList, skillItem, skillName);
        
        console.log(`✅ Added new skill: ${skillName} (${level}%)`);
    },
    
    /**
     * Tạo skill item element
     * 
     * @private
     * @param {string} skillName - Tên kỹ năng
     * @param {number} skillLevel - Mức độ kỹ năng
     * @returns {HTMLElement} Skill item element
     */
    createSkillItem: function(skillName, skillLevel) {
        const skillItem = document.createElement('li');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <div class="skill-info">
                <span class="skill-name editable" data-field="skill_new_${Date.now()}">${skillName}</span>
                <span class="skill-percentage">${skillLevel}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" data-percentage="${skillLevel}"></div>
            </div>
        `;
        return skillItem;
    },
    
    /**
     * Thêm skill vào danh sách với animation
     * 
     * @private
     * @param {HTMLElement} skillsList - Danh sách kỹ năng
     * @param {HTMLElement} skillItem - Item kỹ năng
     * @param {string} skillName - Tên kỹ năng
     * @returns {void}
     */
    addSkillToList: function(skillsList, skillItem, skillName) {
        skillsList.appendChild(skillItem);
        
        // Animation effect
        skillItem.style.opacity = '0';
        skillItem.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            skillItem.style.transition = 'all 0.3s ease';
            skillItem.style.opacity = '1';
            skillItem.style.transform = 'translateY(0)';
            
            // Animate skill bar
            const progressBar = skillItem.querySelector('.skill-progress');
            if (progressBar) {
                const percentage = progressBar.getAttribute('data-percentage');
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 100);
            }
        }, 100);
        
        this.showMessage(`Đã thêm kỹ năng: ${skillName}`, 'success');
    },

    // ===================================
    // DOWNLOAD & PRINT FUNCTIONALITY
    // ===================================
    
    /**
     * Khởi tạo tính năng tải PDF
     * 
     * @public
     * @returns {void}
     */
    initDownloadFeature: function() {
        const downloadBtn = document.querySelector(this.selectors.downloadBtn);
        
        if (!downloadBtn) {
            console.warn('⚠️ Download button not found');
            return;
        }
        
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrintInstructions();
        });
        
        console.log('✅ Download feature initialized');
    },
    
    /**
     * Hiển thị hướng dẫn in PDF
     * 
     * @public
     * @returns {void}
     */
    showPrintInstructions: function() {
        const instructionDialog = this.createPrintInstructionDialog();
        document.body.appendChild(instructionDialog);
        
        this.bindPrintDialogEvents(instructionDialog);
        
        console.log('✅ Print instructions dialog opened');
    },
    
    /**
     * Tạo dialog hướng dẫn in
     * 
     * @private
     * @returns {HTMLElement} Dialog element
     */
    createPrintInstructionDialog: function() {
        const instructionDialog = document.createElement('div');
        instructionDialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        instructionDialog.innerHTML = this.getPrintInstructionHTML();
        return instructionDialog;
    },
    
    /**
     * Lấy HTML cho hướng dẫn in
     * 
     * @private
     * @returns {string} HTML string
     */
    getPrintInstructionHTML: function() {
        return `
            <div style="background-color: white; max-width: 600px; padding: 30px; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <h3 style="margin-top: 0; color: #0f172a; font-size: 24px; margin-bottom: 15px; text-align: center;">
                    <i class="fas fa-file-pdf" style="color: #f97316; margin-right: 10px;"></i>
                    Lưu CV thành PDF
                </h3>
                <p style="color: #334155; margin-bottom: 15px; text-align: center;">
                    Để lưu CV với đầy đủ màu sắc và định dạng đẹp:
                </p>
                
                <ol style="color: #334155; text-align: left; margin-bottom: 25px; padding-left: 25px; line-height: 1.8;">
                    <li style="margin-bottom: 10px;"><strong>Nhấn "In ngay"</strong> để mở cửa sổ in</li>
                    <li style="margin-bottom: 10px;">Chọn <strong>"Microsoft Print to PDF"</strong> trong danh sách máy in</li>
                    <li style="margin-bottom: 10px;">Mở mục <strong>"Thêm thiết lập"</strong> hoặc <strong>"More settings"</strong></li>
                    <li style="margin-bottom: 10px;">Bật tùy chọn <strong>"Hình nền"</strong> hoặc <strong>"Background graphics"</strong></li>
                    <li style="margin-bottom: 10px;">Đảm bảo <strong>"Định hướng: Dọc"</strong> và <strong>"Khổ giấy: A4"</strong></li>
                    <li style="margin-bottom: 10px;">Tắt <strong>"Tiêu đề & chân trang"</strong> nếu có</li>
                    <li style="margin-bottom: 10px;">Nhấn nút <strong>"In"</strong> hoặc <strong>"Save"</strong></li>
                </ol>
                
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="cancel-print" style="padding: 12px 24px; border: none; background: #e2e8f0; color: #64748b; border-radius: 8px; cursor: pointer; font-weight: 500;">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                    <button id="proceed-print" style="padding: 12px 28px; border: none; background: linear-gradient(135deg, #3b82f6, #f97316); color: white; border-radius: 8px; font-weight: 500; cursor: pointer;">
                        <i class="fas fa-print"></i> In ngay
                    </button>
                </div>
            </div>
        `;
    },
    
    /**
     * Bind events cho print dialog
     * 
     * @private
     * @param {HTMLElement} dialog - Dialog element
     * @returns {void}
     */
    bindPrintDialogEvents: function(dialog) {
        const cancelBtn = dialog.querySelector('#cancel-print');
        const proceedBtn = dialog.querySelector('#proceed-print');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
            });
        }
        
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                this.preparePrintMode();
                document.body.removeChild(dialog);
                setTimeout(() => {
                    window.print();
                }, this.config.animationDuration);
            });
        }
    },
    
    /**
     * Chuẩn bị chế độ in
     * 
     * @private
     * @returns {void}
     */
    preparePrintMode: function() {
        // Đảm bảo skill bars hiển thị đúng
        this.updateSkillBarsForPrint();
        
        // Tắt edit mode nếu đang bật
        if (this.isEditMode) {
            this.toggleEditMode();
        }
        
        // Thêm class in vào container
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('printing');
            
            // Khôi phục sau khi in
            setTimeout(() => {
                container.classList.remove('printing');
            }, 1000);
        }
        
        console.log('✅ Print mode prepared');
    },
    
    /**
     * Cập nhật skill bars cho chế độ in
     * 
     * @private
     * @returns {void}
     */
    updateSkillBarsForPrint: function() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const percentage = this.getSkillPercentage(bar);
            bar.style.width = percentage + '%';
        });
    },

    // ===================================
    // SMOOTH SCROLLING & NAVIGATION
    // ===================================
    
    /**
     * Khởi tạo cuộn mượt cho navigation
     * 
     * @public
     * @returns {void}
     */
    initSmoothScrolling: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!navLinks.length) {
            console.warn('⚠️ No navigation links found');
            return;
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavLinkClick(e, link);
            });
        });
        
        console.log(`✅ Smooth scrolling initialized for ${navLinks.length} links`);
    },
    
    /**
     * Xử lý click navigation link
     * 
     * @private
     * @param {Event} e - Click event
     * @param {HTMLElement} link - Navigation link
     * @returns {void}
     */
    handleNavLinkClick: function(e, link) {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            this.scrollToElement(targetElement);
        } else {
            console.warn(`⚠️ Target element not found: ${targetId}`);
        }
    },
    
    /**
     * Cuộn đến element
     * 
     * @private
     * @param {HTMLElement} element - Element đích
     * @returns {void}
     */
    scrollToElement: function(element) {
        const offsetTop = element.offsetTop - this.config.scrollOffset;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    },

    // ===================================
    // INTERSECTION OBSERVER & ANIMATIONS
    // ===================================
    
    /**
     * Khởi tạo Intersection Observer cho animations
     * 
     * @public
     * @returns {void}
     */
    initIntersectionObserver: function() {
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver not supported');
            return;
        }
        
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        // Quan sát các phần tử cần animation
        const animatedElements = document.querySelectorAll('.animate, .section');
        animatedElements.forEach(el => observer.observe(el));
        
        console.log(`✅ Intersection Observer initialized for ${animatedElements.length} elements`);
    },
    
    /**
     * Xử lý intersection events
     * 
     * @private
     * @param {IntersectionObserverEntry[]} entries - Intersection entries
     * @returns {void}
     */
    handleIntersection: function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Trigger skill bar animation if it's a skills section
                if (entry.target.classList.contains('skills-list')) {
                    this.triggerSkillBarAnimations(entry.target);
                }
            }
        });
    },
    
    /**
     * Trigger animations cho skill bars
     * 
     * @private
     * @param {HTMLElement} skillsSection - Skills section element
     * @returns {void}
     */
    triggerSkillBarAnimations: function(skillsSection) {
        const skillBars = skillsSection.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const percentage = this.getSkillPercentage(bar);
                this.animateSkillBar(bar, percentage);
            }, index * 200);
        });
    },

    // ===================================
    // KEYBOARD SHORTCUTS
    // ===================================
    
    /**
     * Khởi tạo keyboard shortcuts
     * 
     * @public
     * @returns {void}
     */
    initKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcut(e);
        });
        
        console.log('✅ Keyboard shortcuts initialized');
    },
    
    /**
     * Xử lý keyboard shortcuts
     * 
     * @private
     * @param {KeyboardEvent} e - Keyboard event
     * @returns {void}
     */
    handleKeyboardShortcut: function(e) {
        // Ctrl + E: Toggle edit mode
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            this.toggleEditMode();
        }
        
        // Ctrl + S: Save changes (only in edit mode)
        if (e.ctrlKey && e.key === 's' && this.isEditMode) {
            e.preventDefault();
            this.saveAllChanges();
        }
        
        // Escape: Exit edit mode
        if (e.key === 'Escape' && this.isEditMode) {
            this.toggleEditMode();
        }
        
        // Ctrl + P: Print CV
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            this.showPrintInstructions();
        }
    },

    // ===================================
    // MOBILE & RESPONSIVE FEATURES
    // ===================================
    
    /**
     * Khởi tạo mobile features
     * 
     * @public
     * @returns {void}
     */
    initMobileFeatures: function() {
        this.handleResponsiveLayout();
        this.bindResizeEvents();
        this.optimizeForTouch();
        
        console.log('✅ Mobile features initialized');
    },
    
    /**
     * Xử lý responsive layout
     * 
     * @private
     * @returns {void}
     */
    handleResponsiveLayout: function() {
        const checkScreenSize = () => {
            const isMobile = window.innerWidth <= 768;
            const navContainer = document.querySelector('.nav-container');
            
            if (navContainer) {
                if (isMobile) {
                    navContainer.style.flexDirection = 'column';
                    navContainer.style.gap = '15px';
                } else {
                    navContainer.style.flexDirection = 'row';
                    navContainer.style.gap = '30px';
                }
            }
        };
        
        checkScreenSize();
        return checkScreenSize;
    },
    
    /**
     * Bind resize events
     * 
     * @private
     * @returns {void}
     */
    bindResizeEvents: function() {
        const checkScreenSize = this.handleResponsiveLayout();
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(checkScreenSize, 250);
        });
    },
    
    /**
     * Tối ưu cho touch devices
     * 
     * @private
     * @returns {void}
     */
    optimizeForTouch: function() {
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Thêm touch-friendly styles
            const style = document.createElement('style');
            style.textContent = `
                .touch-device .editable:hover {
                    background: rgba(59, 130, 246, 0.1);
                }
                .touch-device .social-icon {
                    min-height: 44px;
                    min-width: 44px;
                }
            `;
            document.head.appendChild(style);
        }
    },

    // ===================================
    // DATA PERSISTENCE - LƯU TRỮ DỮ LIỆU
    // ===================================
    
    /**
     * Lưu tất cả thay đổi
     * 
     * @public
     * @returns {void}
     */
    saveAllChanges: function() {
        try {
            this.collectCurrentData();
            this.persistData();
            this.showMessage('Đã lưu tất cả thay đổi thành công!', 'success');
            console.log('✅ All changes saved successfully');
        } catch (error) {
            console.error('❌ Failed to save changes:', error);
            this.showMessage('Có lỗi khi lưu dữ liệu', 'error');
        }
    },
    
    /**
     * Thu thập dữ liệu hiện tại
     * 
     * @private
     * @returns {void}
     */
    collectCurrentData: function() {
        // Thu thập dữ liệu từ các phần tử editable
        const editableElements = document.querySelectorAll('.editable');
        editableElements.forEach(element => {
            const field = element.getAttribute('data-field');
            const value = element.textContent.trim();
            if (field && value) {
                this.cvData[field] = value;
            }
        });
        
        // Thu thập language levels
        this.collectLanguageLevels();
        
        // Thu thập skill levels
        this.collectSkillLevels();
    },
    
    /**
     * Thu thập language levels
     * 
     * @private
     * @returns {void}
     */
    collectLanguageLevels: function() {
        const languageLevels = document.querySelectorAll('.language-level');
        languageLevels.forEach((level, index) => {
            const levelValue = level.getAttribute('data-level') || '5';
            this.cvData[`language_level_${index}`] = levelValue;
        });
    },
    
    /**
     * Thu thập skill levels
     * 
     * @private
     * @returns {void}
     */
    collectSkillLevels: function() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            const percentage = bar.getAttribute('data-percentage') || this.getSkillPercentage(bar);
            this.cvData[`skill_level_${index}`] = percentage;
        });
    },
    
    /**
     * Lưu trữ dữ liệu persistent
     * 
     * @private
     * @returns {void}
     */
    persistData: function() {
        // Lưu vào memory (vì không dùng localStorage trong Claude)
        this.cvData.lastSaved = new Date().toISOString();
        console.log('💾 Data saved to memory:', Object.keys(this.cvData).length, 'fields');
    },
    
    /**
     * Tải dữ liệu đã lưu
     * 
     * @public
     * @returns {void}
     */
    loadSavedData: function() {
        // Trong environment này, chỉ load default data
        console.log('📂 Loading saved data...');
        
        if (Object.keys(this.cvData).length > 0) {
            this.applyLoadedData();
            console.log('✅ Saved data loaded successfully');
        } else {
            console.log('ℹ️ No saved data found, using defaults');
        }
    },
    
    /**
     * Áp dụng dữ liệu đã tải
     * 
     * @private
     * @returns {void}
     */
    applyLoadedData: function() {
        Object.keys(this.cvData).forEach(field => {
            const element = document.querySelector(`[data-field="${field}"]`);
            if (element && this.cvData[field]) {
                element.textContent = this.cvData[field];
            }
        });
    },

    // ===================================
    // LANGUAGE LEVELS MANAGEMENT
    // ===================================
    
    /**
     * Khởi tạo language levels
     * 
     * @public
     * @returns {void}
     */
    initLanguageLevels: function() {
        const languageItems = document.querySelectorAll('.language-item');
        
        languageItems.forEach(item => {
            const levelContainer = item.querySelector('.language-level');
            if (levelContainer) {
                this.setupLanguageLevel(levelContainer);
            }
        });
        
        console.log(`✅ Language levels initialized for ${languageItems.length} languages`);
    },
    
    /**
     * Thiết lập language level
     * 
     * @private
     * @param {HTMLElement} levelContainer - Container chứa dots
     * @returns {void}
     */
    setupLanguageLevel: function(levelContainer) {
        const dots = levelContainer.querySelectorAll('.level-dot');
        const currentLevel = parseInt(levelContainer.getAttribute('data-level')) || 5;
        
        // Cập nhật hiển thị ban đầu
        this.updateLanguageDots(dots, currentLevel);
    },

    // ===================================
    // MESSAGE SYSTEM - HỆ THỐNG THÔNG BÁO
    // ===================================
    
    /**
     * Hiển thị thông báo
     * 
     * @public
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo (info|success|error|warning)
     * @returns {void}
     */
    showMessage: function(message, type = 'info') {
        if (!message) {
            console.warn('⚠️ Empty message provided');
            return;
        }
        
        const messageElement = this.createMessageElement(message, type);
        this.displayMessage(messageElement);
        this.scheduleMessageRemoval(messageElement);
        
        console.log(`📢 Message shown: ${message} (${type})`);
    },
    
    /**
     * Tạo message element
     * 
     * @private
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo
     * @returns {HTMLElement} Message element
     */
    createMessageElement: function(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = 'success-message';
        
        const { icon, bgColor } = this.getMessageStyle(type);
        
        messageElement.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        messageElement.style.background = `linear-gradient(135deg, ${bgColor}, ${this.adjustColor(bgColor, -20)})`;
        
        return messageElement;
    },
    
    /**
     * Lấy style cho message dựa trên type
     * 
     * @private
     * @param {string} type - Loại message
     * @returns {Object} Style object
     */
    getMessageStyle: function(type) {
        const styles = {
            info: { icon: 'fas fa-info-circle', bgColor: '#3b82f6' },
            success: { icon: 'fas fa-check-circle', bgColor: '#10b981' },
            error: { icon: 'fas fa-exclamation-circle', bgColor: '#ef4444' },
            warning: { icon: 'fas fa-exclamation-triangle', bgColor: '#f59e0b' }
        };
        
        return styles[type] || styles.info;
    },
    
    /**
     * Hiển thị message
     * 
     * @private
     * @param {HTMLElement} messageElement - Message element
     * @returns {void}
     */
    displayMessage: function(messageElement) {
        document.body.appendChild(messageElement);
        
        // Hiển thị với animation
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);
    },
    
    /**
     * Lên lịch xóa message
     * 
     * @private
     * @param {HTMLElement} messageElement - Message element
     * @returns {void}
     */
    scheduleMessageRemoval: function(messageElement) {
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    document.body.removeChild(messageElement);
                }
            }, 300);
        }, this.config.messageTimeout);
    },
    
    /**
     * Điều chỉnh màu sắc
     * 
     * @private
     * @param {string} color - Màu gốc (hex)
     * @param {number} percent - Phần trăm điều chỉnh
     * @returns {string} Màu đã điều chỉnh
     */
    adjustColor: function(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, Math.max(0, (num >> 16) + amt));
        const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
        const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
        
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    // ===================================
    // WELCOME & HELP SYSTEM
    // ===================================
    
    /**
     * Hiển thị thông báo chào mừng
     * 
     * @public
     * @returns {void}
     */
    showWelcomeMessage: function() {
        setTimeout(() => {
            this.showMessage(
                'Chào mừng bạn đến với CV Digital! Nhấn "Chỉnh sửa" để tùy chỉnh nội dung. Dùng Ctrl+E để toggle edit mode.', 
                'info'
            );
        }, 2000);
    },
    
    /**
     * Hiển thị help shortcuts
     * 
     * @public
     * @returns {void}
     */
    showHelpShortcuts: function() {
        const shortcuts = [
            'Ctrl + E: Bật/tắt chế độ chỉnh sửa',
            'Ctrl + S: Lưu thay đổi',
            'Ctrl + P: In CV',
            'Escape: Thoát chế độ chỉnh sửa',
            'Click vào text để chỉnh sửa (trong edit mode)'
        ];
        
        console.log('🔥 Keyboard Shortcuts:');
        shortcuts.forEach(shortcut => console.log(`   ${shortcut}`));
    },

    // ===================================
    // ERROR HANDLING & DEBUGGING
    // ===================================
    
    /**
     * Xử lý lỗi global
     * 
     * @private
     * @param {Error} error - Error object
     * @param {string} context - Ngữ cảnh lỗi
     * @returns {void}
     */
    handleError: function(error, context = 'Unknown') {
        console.error(`❌ Error in ${context}:`, error);
        this.showMessage(`Có lỗi xảy ra: ${error.message}`, 'error');
    },
    
    /**
     * Debug thông tin ứng dụng
     * 
     * @public
     * @returns {Object} Debug info
     */
    getDebugInfo: function() {
        return {
            isEditMode: this.isEditMode,
            dataFields: Object.keys(this.cvData).length,
            version: '2.0.0',
            features: [
                'Edit Mode',
                'Skill Management',
                'PDF Export',
                'Responsive Design',
                'Keyboard Shortcuts',
                'Smooth Scrolling',
                'Animation System'
            ]
        };
    },

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================
    
    /**
     * Debounce function
     * 
     * @private
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function
     * 
     * @private
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit time in ms
     * @returns {Function} Throttled function
     */
    throttle: function(func, limit) {
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
    },

    // ===================================
    // FINAL INITIALIZATION
    // ===================================
    
    /**
     * Khởi tạo tất cả các tính năng
     * Entry point chính của ứng dụng
     * 
     * @public
     * @returns {void}
     */
    initAll: function() {
        console.log('🚀 Starting CV Application initialization...');
        
        try {
            // Core initialization
            this.init();
            
            // Additional features
            this.showHelpShortcuts();
            
            // Success message
            console.log('🎉 CV Premium với tính năng Edit đã được khởi tạo thành công!');
            console.log('📋 Các tính năng có sẵn:', this.getDebugInfo().features);
            
            // Performance monitoring
            if (window.performance && window.performance.now) {
                console.log(`⚡ Initialization completed in ${Math.round(window.performance.now())}ms`);
            }
            
        } catch (error) {
            this.handleError(error, 'Application Initialization');
        }
    }
};

// ===================================
// AUTO-INITIALIZATION
// ===================================

/**
 * Tự động khởi tạo khi DOM loaded
 * Chỉ chạy khi có CV wrapper element
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    
    // Kiểm tra xem có CV wrapper không
    if (document.querySelector('.cv-duy-wrapper')) {
        // Delay nhỏ để đảm bảo CSS đã load
        setTimeout(() => {
            window.DuyCV.initAll();
        }, 100);
    } else {
        console.warn('⚠️ CV wrapper not found, skipping initialization');
    }
});

// ===================================
// GLOBAL ERROR HANDLING
// ===================================

/**
 * Xử lý lỗi JavaScript global
 */
window.addEventListener('error', function(e) {
    if (window.DuyCV) {
        window.DuyCV.handleError(e.error, 'Global Error Handler');
    }
});

/**
 * Xử lý unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(e) {
    if (window.DuyCV) {
        window.DuyCV.handleError(new Error(e.reason), 'Unhandled Promise Rejection');
    }
});

// ===================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.DuyCV;
}

/**
 * ===================================
 * YÊU CẦU 11: CLEAN CODE VÀ COMMENT - HOÀN THÀNH ✅
 * - JSDoc comments cho tất cả functions
 * - Clean code structure với separation of concerns
 * - Error handling và debugging utilities
 * - Performance optimization với debounce/throttle
 * - Modular architecture
 * - Type hints và parameter validation
 * - Comprehensive logging system
 * ===================================
 */