// Scroll-based blur effect for case study cards
// This function can be called after cards are populated
// Blur is disabled on mobile devices
function initScrollBlur() {
    const caseStudySection = document.querySelector('.case-study-section');
    const caseStudyCards = document.querySelectorAll('.case-study-collection-item');
    
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
            const maxDistance = windowHeight;
            const blurAmount = Math.min((distanceFromViewport / maxDistance) * 8, 8); // Max blur of 8px
            
            // Apply blur with smooth transition
            card.style.transition = 'filter 0.3s ease-out';
            card.style.filter = `blur(${blurAmount}px)`;
            card.style.opacity = 1 - (blurAmount / 8) * 0.3; // Slight opacity reduction for more depth
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

