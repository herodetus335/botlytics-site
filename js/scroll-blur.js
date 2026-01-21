// Scroll-based blur effect for case study cards
// This function can be called after cards are populated
// Blur is disabled on mobile devices
function initScrollBlur() {
    const caseStudySection = document.querySelector('.case-study-section');
    let caseStudyCards = document.querySelectorAll('.case-study-collection-item');

    // Also check for new process preview cards
    if (caseStudyCards.length === 0) {
        caseStudyCards = document.querySelectorAll('.process-preview-card');
    }

    if (!caseStudySection || caseStudyCards.length === 0) {
        return;
    }
    
    // Check if we're on mobile (screen width <= 991px)
    function isMobile() {
        return window.innerWidth <= 991;
    }
    
    // Function to update blur based on scroll position
    function updateBlur() {
        // Don't apply blur on mobile
        if (isMobile()) {
            caseStudyCards.forEach((card) => {
                card.style.filter = 'none';
                card.style.opacity = '1';
            });
            return;
        }
        
        const sectionTop = caseStudySection.offsetTop;
        const sectionHeight = caseStudySection.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Calculate how far into the section we are
        const sectionStart = sectionTop - windowHeight;
        const sectionEnd = sectionTop + sectionHeight;
        const scrollProgress = (scrollY - sectionStart) / (sectionEnd - sectionStart);
        
        caseStudyCards.forEach((card, index) => {
            // Calculate blur based on card position and scroll
            const cardTop = card.getBoundingClientRect().top + scrollY;
            const cardCenter = cardTop + card.offsetHeight / 2;
            const distanceFromViewport = Math.abs(cardCenter - (scrollY + windowHeight / 2));
            const maxDistance = windowHeight * 1.5; // Increased range - blur starts much further away
            const blurThreshold = windowHeight * 0.4; // No blur within 40% of viewport center

            // Only apply blur if beyond threshold
            let blurAmount = 0;
            if (distanceFromViewport > blurThreshold) {
                blurAmount = Math.min(((distanceFromViewport - blurThreshold) / maxDistance) * 6, 6); // Reduced max blur to 6px
            }

            // Apply blur with smooth transition
            card.style.transition = 'filter 0.4s ease-out, opacity 0.4s ease-out';
            card.style.filter = `blur(${blurAmount}px)`;
            card.style.opacity = 1 - (blurAmount / 6) * 0.2; // Reduced opacity change
        });
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateBlur();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Initial blur calculation
    updateBlur();
    
    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Recalculate on window resize
    window.addEventListener('resize', function() {
        updateBlur();
    }, { passive: true });
}

