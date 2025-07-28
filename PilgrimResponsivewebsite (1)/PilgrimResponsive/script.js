// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');
const whatsappBtn = document.querySelector('#whatsapp-btn');
const fileUpload = document.querySelector('#file-upload');
const fileUploadContainer = document.querySelector('.file-upload-container');
const fileList = document.querySelector('#file-list');

// Calendar Elements
const calendarDays = document.querySelector('#calendar-days');
const monthYear = document.querySelector('#month-year');
const prevMonthBtn = document.querySelector('#prev-month');
const nextMonthBtn = document.querySelector('#next-month');
const eventsList = document.querySelector('#events-list');

// Calendar State
let currentDate = new Date();
const today = new Date();

// Mobile Menu Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on nav links
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Smooth scrolling for anchor links
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMobileMenu();
        }
    }
}

// Form validation and submission
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    // Email validation
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Message validation
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    return errors;
}

function showFormMessage(message, isError = false) {
    // Remove existing message
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
    messageDiv.innerHTML = `
        <p style="
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            background: ${isError ? '#f8d7da' : '#d4edda'};
            color: ${isError ? '#721c24' : '#155724'};
            border: 1px solid ${isError ? '#f5c6cb' : '#c3e6cb'};
        ">
            ${message}
        </p>
    `;
    
    // Insert message at the top of the form
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function createWhatsAppMessage(formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const destination = formData.get('destination');
    const travelDates = formData.get('travel-dates');
    const groupSize = formData.get('group-size');
    const message = formData.get('message');
    
    let whatsappMessage = `🕌 *New Pilgrimage Inquiry - Sacred Pilgrim*\n\n`;
    whatsappMessage += `👤 *Name:* ${name}\n`;
    whatsappMessage += `📧 *Email:* ${email}\n`;
    
    if (phone) {
        whatsappMessage += `📱 *Phone:* ${phone}\n`;
    }
    
    if (destination) {
        whatsappMessage += `🌍 *Destination:* ${destination}\n`;
    }
    
    if (travelDates) {
        whatsappMessage += `📅 *Travel Dates:* ${travelDates}\n`;
    }
    
    if (groupSize) {
        whatsappMessage += `👥 *Group Size:* ${groupSize}\n`;
    }
    
    whatsappMessage += `💬 *Message:*\n${message}\n\n`;
    whatsappMessage += `🙏 Please contact me to discuss my pilgrimage journey.`;
    
    return encodeURIComponent(whatsappMessage);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage(errors.join('<br>'), true);
        return;
    }
    
    // Create WhatsApp message from form data
    const whatsappMessage = createWhatsAppMessage(formData);
    const whatsappNumber = '+7230073683';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showFormMessage('Opening WhatsApp with your inquiry details!');
    
    // Reset form after a short delay
    setTimeout(() => {
        contactForm.reset();
        
        // Clear file list if it exists
        if (fileList) {
            fileList.innerHTML = '';
        }
    }, 1000);
}

// WhatsApp functionality
function handleWhatsAppClick(e) {
    e.preventDefault();
    
    // Get form data if available
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const destinationSelect = document.querySelector('#destination');
    const messageInput = document.querySelector('#message');
    
    let whatsappMessage = "Hello! I'm interested in your spiritual pilgrimage services.";
    
    // Build message from form data if filled
    if (nameInput && nameInput.value.trim()) {
        whatsappMessage = `Hello! My name is ${nameInput.value.trim()}.`;
    }
    
    if (destinationSelect && destinationSelect.value) {
        const destinationText = destinationSelect.options[destinationSelect.selectedIndex].text;
        whatsappMessage += ` I'm interested in ${destinationText}.`;
    } else {
        whatsappMessage += " I'm interested in your spiritual pilgrimage services.";
    }
    
    if (messageInput && messageInput.value.trim()) {
        whatsappMessage += ` ${messageInput.value.trim()}`;
    }
    
    if (emailInput && emailInput.value.trim()) {
        whatsappMessage += ` You can also reach me at ${emailInput.value.trim()}.`;
    }
    
    // WhatsApp number for direct contact
    const phoneNumber = "7230073683";
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Calendar Events Data
const pilgrimageEvents = [
    {
        date: new Date(2025, 8, 15), // sep 15, 2025
        title: "Our 1st TOUR in September",
        description: "20-day spiritual journey begins",
        type: "pilgrimage"
    },
    {
        date: new Date(2025, 9, 10), // oct 10, 2025
        title: "Our 1st tour in October",
        description: "20-day spiritual journey begins",
        type: "pilgrimage"
    },
    {
        date: new Date(2025, 9, 25), // oct 25, 2025
        title: "Our 2nd Tour in october",
        description: "20-day spiritual journey begins",
        type: "pilgrimage"
    },
    {
        date: new Date(2025, 7, 15), // aug 8, 2025
        title: "Our 1st Tour in August",
        description: "21-day spiritual journey begins",
        type: "pilgrimage"
    },
    {
        date: new Date(2025, 10, 15), // Nov 15, 2025
        title: "our 1st Tour in November",
        description: "20-days spiritual journey begins",
        type: "workshop"
    },
    {
        date: new Date(2025, 11, 20), // December 20, 2025
        title: "our 1st tour in December",
        description: "0-days spiritual journey begins",
        type: "pilgrimage"
    },
    {
        date: new Date(2025, 3, 5), // September 5, 2025
        title: "our 1st tour in December month",
        description: "0-days spiritual journey begins",
        type: "pilgrimage"
    },
    {
        date: new Date(2025, 2, 20), // March 20, 2025
        title: "Hajj Pilgrimage to Makkah",
        description: "Sacred pilgrimage to the holiest city",
        type: "pilgrimage"
    },
    {
        date: new Date(2025, 4, 15), // May 15, 2025
        title: "Umrah - Makkah & Medina",
        description: "Lesser pilgrimage to holy cities",
        type: "pilgrimage"
    }
];

// Calendar Functions
function generateCalendar(date) {
    if (!calendarDays) return;
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update month/year display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (monthYear) {
        monthYear.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Clear previous days
    calendarDays.innerHTML = '';
    
    // Get first day of month and days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = createDayElement(daysInPrevMonth - i, true, new Date(year, month - 1, daysInPrevMonth - i));
        calendarDays.appendChild(dayElement);
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, false, new Date(year, month, day));
        calendarDays.appendChild(dayElement);
    }
    
    // Add next month's leading days
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true, new Date(year, month + 1, day));
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(dayNumber, isOtherMonth, date) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    // Check if it's today
    if (!isOtherMonth && 
        date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
        dayElement.classList.add('today');
    }
    
    // Check for events on this date
    const dayEvents = pilgrimageEvents.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
    
    if (dayEvents.length > 0) {
        dayElement.classList.add('has-event');
    }
    
    // Create day number
    const dayNumberElement = document.createElement('span');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = dayNumber;
    dayElement.appendChild(dayNumberElement);
    
    // Add event indicators
    dayEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'day-event';
        eventElement.textContent = event.title.substring(0, 8) + '...';
        eventElement.title = event.title;
        dayElement.appendChild(eventElement);
    });
    
    return dayElement;
}

function updateEventsList() {
    if (!eventsList) return;
    
    // Get upcoming events (next 90 days)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90);
    
    const upcomingEvents = pilgrimageEvents
        .filter(event => event.date >= today && event.date <= futureDate)
        .sort((a, b) => a.date - b.date)
        .slice(0, 5); // Show only next 5 events
    
    eventsList.innerHTML = '';
    
    if (upcomingEvents.length === 0) {
        eventsList.innerHTML = '<p style="color: #666; text-align: center;">No upcoming events in the next 90 days.</p>';
        return;
    }
    
    upcomingEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        
        const dateElement = document.createElement('div');
        dateElement.className = 'event-date';
        dateElement.innerHTML = `
            ${event.date.toLocaleDateString('en', { month: 'short' })}<br>
            ${event.date.getDate()}
        `;
        
        const detailsElement = document.createElement('div');
        detailsElement.className = 'event-details';
        detailsElement.innerHTML = `
            <h5>${event.title}</h5>
            <p>${event.description}</p>
        `;
        
        eventElement.appendChild(dateElement);
        eventElement.appendChild(detailsElement);
        eventsList.appendChild(eventElement);
    });
}

function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    generateCalendar(currentDate);
}

function initializeCalendar() {
    if (!calendarDays) return;
    
    generateCalendar(currentDate);
    updateEventsList();
    
    // Add event listeners for navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => navigateMonth(1));
    }
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.destination-card, .service-item, .about-content, .contact-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Lazy loading for images (if any are added later)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Handle window resize for mobile menu
function handleResize() {
    if (window.innerWidth > 768) {
        // Close mobile menu on desktop
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// File Upload Management
let uploadedFiles = [];

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function handleFileDrop(e) {
    e.preventDefault();
    fileUploadContainer.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    fileUploadContainer.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    fileUploadContainer.classList.remove('dragover');
}

function processFiles(files) {
    files.forEach(file => {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showFormMessage(`File "${file.name}" is too large. Maximum size is 5MB.`, true);
            return;
        }
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            showFormMessage(`File "${file.name}" has an unsupported format.`, true);
            return;
        }
        
        // Check if file already exists
        if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
            showFormMessage(`File "${file.name}" is already uploaded.`, true);
            return;
        }
        
        uploadedFiles.push(file);
    });
    
    updateFileList();
}

function updateFileList() {
    if (!fileList) return;
    fileList.innerHTML = '';
    
    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-item-info">
                <i class="${fileIcon}"></i>
                <div>
                    <div class="file-item-name">${file.name}</div>
                    <div class="file-item-size">${fileSize}</div>
                </div>
            </div>
            <button type="button" class="file-remove" onclick="removeFile(${index})" title="Remove file">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
}

function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('image')) return 'fas fa-file-image';
    return 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce function for performance
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

// Initialize page functionality
function initializePage() {
    // Check if elements exist before adding listeners
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', handleWhatsAppClick);
    }
    
    // File upload event listeners
    if (fileUpload) {
        fileUpload.addEventListener('change', handleFileSelect);
        fileUploadContainer.addEventListener('dragover', handleDragOver);
        fileUploadContainer.addEventListener('dragleave', handleDragLeave);
        fileUploadContainer.addEventListener('drop', handleFileDrop);
    }
    
    // Add scroll listener with debounce for performance
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
    
    // Add resize listener with debounce
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Initialize animations and lazy loading
    initScrollAnimations();
    initLazyLoading();
    
    // Initialize calendar
    initializeCalendar();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Add focus trap for mobile menu accessibility
    function trapFocus(e) {
        if (!navMenu.classList.contains('active')) return;
        
        const focusableElements = navMenu.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }
    
    document.addEventListener('keydown', trapFocus);
}

// Page load and DOM ready events
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers if needed
    } else {
        // Page is visible, resume normal functionality
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added later for offline functionality
    });
}

// Utility functions for potential future use
const utils = {
    // Format phone numbers
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
    },
    
    // Validate email
    isValidEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Get viewport dimensions
    getViewport: () => {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export utils for potential module use
window.pilgrimUtils = utils;

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
        }
    }
});

if (typeof PerformanceObserver !== 'undefined') {
    perfObserver.observe({ entryTypes: ['navigation'] });
}
