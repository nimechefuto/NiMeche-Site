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

        const slides = carousel.querySelectorAll('.executives-slide, .staff-slide');
        const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
        if (slides.length === 0) return;

        let currentSlide = 0;
        let slideInterval;

        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    showSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
        }
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

        function showSlide(n) {
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'slide-out');
                if (dots[index]) dots[index].classList.remove('active');
            });
            
            slides[currentSlide].classList.add('slide-out');

            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 8000); // 8 seconds
        }

        // Initial setup
        slides[0].classList.add('active');
        if (dots[0]) dots[0].classList.add('active');
        resetInterval();
    }

    // --- 3. On-Scroll Fade-In Animation ---
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- 4. Mobile Navigation ---
    function setupMobileNav() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        const closeBtn = document.querySelector('.close-btn');
        const dropdown = mobileNav.querySelector('.dropdown');

        if (!menuToggle || !mobileNav || !closeBtn || !dropdown) return;

        const navPanel = mobileNav.querySelector('.mobile-nav-panel');
        const focusableElements = navPanel.querySelectorAll('a[href], button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

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

        // Accordion for mobile dropdown
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('open');
        });

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
    createCarousel('.staff-carousel');
    createCarousel('.executives-carousel');
    setupScrollAnimations();
    setupMobileNav();
});