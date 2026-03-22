/**
 * Toolbox & Safe Moving - Site Enhancements
 * Improves UX: smooth scrolling, mobile nav, form validation, scroll effects
 */

(function() {
    'use strict';

    // ============================================
    // MOBILE NAVIGATION TOGGLE
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Toggle button icon
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
    }

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // PHONE NUMBER FORMATTING
    // ============================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            
            if (value.length >= 6) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            }
            e.target.value = value;
        });
    }

    // ============================================
    // FORM VALIDATION & SUBMISSION FEEDBACK
    // ============================================
    const quoteForm = document.querySelector('.quote-form-container');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('sending');
            
            // Re-enable after a timeout (Formspree will redirect anyway)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('sending');
            }, 5000);
        });

        // Real-time validation styling
        const requiredInputs = quoteForm.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.classList.add('invalid');
                    this.classList.remove('valid');
                } else {
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('invalid') && this.value.trim() !== '') {
                    this.classList.remove('invalid');
                    this.classList.add('valid');
                }
            });
        });
    }

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide header on scroll down, show on scroll up (optional)
            // if (currentScroll > lastScroll && currentScroll > 150) {
            //     header.classList.add('hidden');
            // } else {
            //     header.classList.remove('hidden');
            // }
            
            lastScroll = currentScroll;
        });
    }

    // ============================================
    // FAQ ACCORDION (if FAQs are clickable)
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            question.style.cursor = 'pointer';
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'true');
            
            question.addEventListener('click', function() {
                const isExpanded = answer.style.display !== 'none';
                answer.style.display = isExpanded ? 'none' : 'block';
                this.setAttribute('aria-expanded', !isExpanded);
                item.classList.toggle('collapsed', isExpanded);
            });
        }
    });

    // ============================================
    // SCROLL TO TOP (for long pages)
    // ============================================
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1e3a5f;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });

    // ============================================
    // TESTIMONIALS CAROUSEL (auto-rotate on mobile)
    // ============================================
    if (window.innerWidth < 768) {
        const testimonialGrid = document.querySelector('.testimonials-grid');
        if (testimonialGrid) {
            let currentIndex = 0;
            const cards = testimonialGrid.querySelectorAll('.testimonial-card');
            
            if (cards.length > 1) {
                // Create dots indicator
                const dotsContainer = document.createElement('div');
                dotsContainer.className = 'testimonial-dots';
                dotsContainer.style.cssText = 'text-align: center; margin-top: 20px;';
                
                cards.forEach((_, i) => {
                    const dot = document.createElement('span');
                    dot.style.cssText = `
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: ${i === 0 ? '#1e3a5f' : '#ccc'};
                        margin: 0 5px;
                        cursor: pointer;
                    `;
                    dot.addEventListener('click', () => showTestimonial(i));
                    dotsContainer.appendChild(dot);
                });
                
                testimonialGrid.parentElement.appendChild(dotsContainer);
                
                function showTestimonial(index) {
                    cards.forEach((card, i) => {
                        card.style.display = i === index ? 'block' : 'none';
                    });
                    dotsContainer.querySelectorAll('span').forEach((dot, i) => {
                        dot.style.background = i === index ? '#1e3a5f' : '#ccc';
                    });
                    currentIndex = index;
                }
                
                // Auto-rotate every 5 seconds
                setInterval(() => {
                    showTestimonial((currentIndex + 1) % cards.length);
                }, 5000);
                
                // Initialize
                showTestimonial(0);
            }
        }
    }

    // ============================================
    // LAZY LOAD IMAGES (when real images are added)
    // ============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // ACCESSIBILITY: SKIP TO MAIN CONTENT
    // ============================================
    const skipLink = document.createElement('a');
    skipLink.href = '#services';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #1e3a5f;
        color: white;
        padding: 8px 16px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ============================================
    // TRACK OUTBOUND CALLS (for analytics)
    // ============================================
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Google Analytics event tracking (when GA is added)
            if (typeof gtag === 'function') {
                gtag('event', 'call_click', {
                    'event_category': 'contact',
                    'event_label': this.href
                });
            }
            console.log('[Analytics] Phone click:', this.href);
        });
    });

    console.log('✅ Toolbox & Safe site enhancements loaded');
})();
