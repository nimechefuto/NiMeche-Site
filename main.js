document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Hero Background Slideshow ---
    function setupHeroSlideshow() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const backgroundImages = heroSection.querySelectorAll('.hero-background-image');
        if (backgroundImages.length <= 1) return;

        let currentImageIndex = 0;
        backgroundImages[currentImageIndex].classList.add('active'); // Start with the first image

        setInterval(() => {
            // Remove active class from current image
            backgroundImages[currentImageIndex].classList.remove('active');

            // Move to the next image, looping if necessary
            currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;

            // Add active class to the new current image
            backgroundImages[currentImageIndex].classList.add('active');
        }, 10000); // Change image every 10 seconds
    }

    // --- 2. Carousel Logic ---
    function createCarousel(carouselSelector) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.executives-slide'); // Updated to ONLY select executive slides
        const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
        if (slides.length === 0) return;

        let currentSlide = 0;
        let slideInterval;

        // Create dots
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => showSlide(index));
                dotsContainer.appendChild(dot);
            });
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

        function showSlide(index) {
            // Clear interval to reset timer on manual interaction
            clearInterval(slideInterval);
            
            // Loop back to start if index is out of bounds
            if (index >= slides.length) {
                index = 0;
            } else if (index < 0) {
                index = slides.length - 1;
            }

            // Update slide visibility
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            slides[index].classList.add('active');

            // Update dot visibility
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            if (dots.length > 0) {
                dots[index].classList.add('active');
            }

            currentSlide = index;

            // Restart interval
            startCarousel();
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function startCarousel() {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        // Initialize and start
        if (slides.length > 1) {
            startCarousel();
        }
    }

    // --- 3. Scroll-Based Animations (Intersection Observer) ---
    function setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Target elements for fade-in
        const fadeElements = document.querySelectorAll('.fade-in, .stat-item, .programme-card, .project-card, .executives-section, .contact-cta');

        fadeElements.forEach(el => observer.observe(el));
    }

    // --- 4. Mobile Navigation Logic ---
    function setupMobileNav() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const closeBtn = document.querySelector('.mobile-nav-panel .close-btn');
        const navPanel = document.querySelector('.mobile-nav-panel');
        const focusableElements = navPanel.querySelectorAll('a[href], button:not([disabled])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (!menuToggle || !mobileNav || !closeBtn) return;

        const openNav = () => {
            mobileNav.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            firstFocusable.focus();
        };

        const closeNav = () => {
            mobileNav.classList.remove('is-open');
            document.body.style.overflow = '';
            menuToggle.focus();
        };

        menuToggle.addEventListener('click', openNav);
        closeBtn.addEventListener('click', closeNav);
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) closeNav();
        });

        // Accordion for mobile dropdown (desktop nav dropdown is only for "About" which is handled in the HTML as a simple list for mobile)
        const dropdown = document.querySelector('.mobile-nav-links .dropdown > a');
        if (dropdown) {
            dropdown.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.parentElement.classList.toggle('open');
            });
        }
        
        // Trap focus inside the mobile nav
        navPanel.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // --- Initialization ---
    setupHeroSlideshow();
    createCarousel('.executives-carousel'); // Staff carousel call removed
    setupScrollAnimations();
    setupMobileNav();
});
