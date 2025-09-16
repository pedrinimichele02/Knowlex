// Enhanced Hero Carousel - Simplified and More Reliable
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicatorContainer = carousel.querySelector('.indicator-dots');
    const progressBar = carousel.querySelector('.carousel-progress-bar');
    const leftArrow = carousel.querySelector('.carousel-arrow.left');
    const rightArrow = carousel.querySelector('.carousel-arrow.right');
    
    if (slides.length === 0) return;
    
    console.log('🎠 Diritto Live - Enhanced carousel initialized with', slides.length, 'slides');
    
    let currentSlide = 0;
    let slideInterval;
    let usedSlides = [];
    let isPlaying = true;
    let isPaused = false;
    
    // Find initial active slide
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentSlide = index;
        }
    });
    
    // Create indicator dots
    function createIndicators() {
        indicatorContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Vai al slide ${i + 1}`);
            if (i === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            indicatorContainer.appendChild(dot);
        }
    }
    
    // Update indicators
    function updateIndicators() {
        const dots = indicatorContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Progress bar
    function startProgress() {
        if (!progressBar || !isPlaying || isPaused) return;
        progressBar.classList.remove('animating');
        progressBar.style.width = '0%';
        setTimeout(() => progressBar.classList.add('animating'), 50);
    }
    
    function resetProgress() {
        if (!progressBar) return;
        progressBar.classList.remove('animating');
        progressBar.style.width = '0%';
    }
    
    // Get random slide
    function getRandomSlide() {
        if (usedSlides.length >= slides.length - 1) {
            usedSlides = [];
        }
        
        let availableSlides = [];
        for (let i = 0; i < slides.length; i++) {
            if (i !== currentSlide && !usedSlides.includes(i)) {
                availableSlides.push(i);
            }
        }
        
        if (availableSlides.length === 0) {
            availableSlides = Array.from(Array(slides.length).keys()).filter(i => i !== currentSlide);
        }
        
        const randomIndex = Math.floor(Math.random() * availableSlides.length);
        const selectedSlide = availableSlides[randomIndex];
        usedSlides.push(selectedSlide);
        return selectedSlide;
    }
    
    // Change slide
    function goToSlide(index) {
        if (index === currentSlide || index < 0 || index >= slides.length) return;
        
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        updateIndicators();
        
        const slideTitle = slides[currentSlide].getAttribute('data-article-title');
        console.log(`🖼️ Showing: ${slideTitle}`);
    }
    
    // Navigation functions
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }
    
    function nextRandomSlide() {
        const nextIndex = getRandomSlide();
        goToSlide(nextIndex);
    }
    
    // Auto rotation
    function startRotation() {
        if (!isPlaying || isPaused) return;
        clearInterval(slideInterval);
        startProgress();
        slideInterval = setInterval(() => {
            if (isPlaying && !isPaused) {
                nextRandomSlide();
                startProgress();
            }
        }, 5000);
    }
    
    function stopRotation() {
        clearInterval(slideInterval);
        resetProgress();
    }
    
    function pauseRotation() {
        isPaused = true;
        clearInterval(slideInterval);
    }
    
    function resumeRotation() {
        isPaused = false;
        if (isPlaying) startRotation();
    }
    
    // Event listeners
    if (leftArrow) {
        leftArrow.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            stopRotation();
            setTimeout(startRotation, 1000); // Resume after 1 second
            console.log('⬅️ Previous slide');
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            stopRotation();
            setTimeout(startRotation, 1000); // Resume after 1 second
            console.log('➡️ Next slide');
        });
    }
    
    // Touch support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            stopRotation();
            setTimeout(startRotation, 1000);
        }
    }, { passive: true });
    
    // Hover events
    carousel.addEventListener('mouseenter', () => {
        pauseRotation();
        console.log('⏸️ Carousel paused');
    });
    
    carousel.addEventListener('mouseleave', () => {
        resumeRotation();
        console.log('▶️ Carousel resumed');
    });
    
    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                stopRotation();
                setTimeout(startRotation, 1000);
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                stopRotation();
                setTimeout(startRotation, 1000);
                break;
            case ' ':
                e.preventDefault();
                isPlaying = !isPlaying;
                if (isPlaying) startRotation();
                else stopRotation();
                break;
        }
    });
    
    // Click to navigate
    slides.forEach(slide => {
        slide.addEventListener('click', function(e) {
            if (!e.target.closest('.carousel-arrow')) {
                const articleUrl = this.getAttribute('data-article-url');
                if (articleUrl) {
                    console.log('🔗 Navigating to:', this.getAttribute('data-article-title'));
                    window.location.href = articleUrl;
                }
            }
        });
    });
    
    // Visibility API
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pauseRotation();
        } else {
            resumeRotation();
        }
    });
    
    // Initialize
    createIndicators();
    updateIndicators();
    startRotation();
    
    console.log('🚀 Diritto Live carousel fully loaded and working!');
});
