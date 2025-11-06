// Nav scroll opacity - desktop only
(function() {
    'use strict';
    
    // Only run on desktop (min-width: 768px)
    if (window.innerWidth < 768) {
        return;
    }
    
    const header = document.querySelector('.header') || document.querySelector('section.header');
    if (!header) return;
    
    let lastScrollTop = 0;
    const scrollThreshold = 50; // Pixels to scroll before nav becomes opaque
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            // Add scrolled class to make nav opaque
            if (!header.classList.contains('scrolled')) {
                header.classList.add('scrolled');
            }
        } else {
            // Remove scrolled class to make nav transparent
            if (header.classList.contains('scrolled')) {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Initial check
    handleScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also handle resize to re-check if switching between mobile/desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            handleScroll();
        } else {
            // Remove scrolled class on mobile
            header.classList.remove('scrolled');
        }
    }, { passive: true });
})();

