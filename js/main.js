// Restaurant Website JavaScript
class RestaurantWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupMobileMenu();
        this.setupBackToTop();
        this.setupSmoothScrolling();
        this.setupReservationForm();
        this.setupMenuInteractions();
        this.setupNewsletterSubscription();
        this.setupLazyLoading();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        menuToggle?.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    setupBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
    }

    setupReservationForm() {
        const form = document.getElementById('reservation-form');
        
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReservationSubmission(form);
        });
    }

    handleReservationSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Submitting...';
        submitButton.classList.add('loading');
        
        // Hide previous messages
        this.hideMessages();
        
        // Get form data
        const formData = this.getFormData(form);
        
        // Validate form
        if (!this.validateReservationForm(formData)) {
            this.showMessage('error-message');
            this.resetButton(submitButton, originalText);
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            this.showMessage('success-message');
            form.reset();
            this.resetButton(submitButton, originalText);
            
            // Scroll to success message
            document.getElementById('success-message').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 1500);
    }

    getFormData(form) {
        return {
            name: form.querySelector('#name').value,
            phone: form.querySelector('#phone').value,
            date: form.querySelector('#date').value,
            time: form.querySelector('#time').value,
            guests: form.querySelector('#guests').value,
            requests: form.querySelector('#special-requests').value
        };
    }

    validateReservationForm(data) {
        return data.name && data.phone && data.date && data.time;
    }

    hideMessages() {
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }

    showMessage(messageId) {
        document.getElementById(messageId).style.display = 'block';
    }

    resetButton(button, originalText) {
        button.textContent = originalText;
        button.classList.remove('loading');
    }

    setupMenuInteractions() {
        document.querySelectorAll('.menu-overlay button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const menuItem = button.closest('.menu-item');
                const itemName = menuItem.querySelector('h3').textContent;
                this.showNotification(`${itemName} added to order!`, 'success');
            });
        });
    }

    setupNewsletterSubscription() {
        const subscribeButton = document.querySelector('footer button');
        
        subscribeButton?.addEventListener('click', () => {
            const emailInput = subscribeButton.previousElementSibling;
            const email = emailInput.value;
            
            if (this.validateEmail(email)) {
                this.showNotification('Successfully subscribed!', 'success');
                emailInput.value = '';
            } else {
                this.highlightError(emailInput);
            }
        });
    }

    validateEmail(email) {
        return email && email.includes('@') && email.includes('.');
    }

    highlightError(input) {
        input.focus();
        input.style.borderColor = '#ef4444';
        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        const icon = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle';
        
        notification.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `<i class="${icon} mr-2"></i>${message}`;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantWebsite();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RestaurantWebsite;
}