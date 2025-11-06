// Global Image Lightbox - Works on all pages
(function() {
    'use strict';
    
    // Setup image lightbox for all images on the page
    function setupImageLightbox() {
        // Find all images on the page (excluding icons, logos, and other decorative images)
        const images = document.querySelectorAll('img:not(.brand-logo):not(.footer-image):not(.w-icon-):not([class*="icon"]):not([class*="logo"])');
        
        images.forEach(img => {
            // Skip if already has lightbox handler
            if (img.hasAttribute('data-lightbox-setup')) return;
            img.setAttribute('data-lightbox-setup', 'true');
            
            // Skip very small images (likely icons)
            if (img.width < 50 && img.height < 50) return;
            
            // Make image clickable
            img.style.cursor = 'pointer';
            
            // Add click handler
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openImageLightbox(img.src, img.alt || 'Image');
            });
        });
    }
    
    // Open image lightbox
    function openImageLightbox(imageSrc, imageAlt) {
        // Create lightbox overlay
        const overlay = document.createElement('div');
        overlay.className = 'image-lightbox-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            animation: fadeIn 0.2s ease;
        `;
        
        // Create image container
        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            max-width: 95%;
            max-height: 95%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        // Create image
        const lightboxImg = document.createElement('img');
        lightboxImg.src = imageSrc;
        lightboxImg.alt = imageAlt;
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 95vh;
            object-fit: contain;
            cursor: pointer;
            animation: zoomIn 0.3s ease;
        `;
        
        imgContainer.appendChild(lightboxImg);
        overlay.appendChild(imgContainer);
        document.body.appendChild(overlay);
        
        // Close on click anywhere
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay || e.target === lightboxImg || e.target === imgContainer) {
                closeImageLightbox(overlay);
            }
        });
        
        // Close on escape key
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeImageLightbox(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
    }
    
    // Close image lightbox
    function closeImageLightbox(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.style.animation = 'fadeOut 0.2s ease';
            setTimeout(function() {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 200);
        }
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupImageLightbox);
    } else {
        setupImageLightbox();
    }
    
    // Also setup after a delay to catch dynamically loaded images
    setTimeout(setupImageLightbox, 500);
    setTimeout(setupImageLightbox, 1000);
    
    // Re-setup when new content is added (for use case pages)
    const observer = new MutationObserver(function(mutations) {
        setupImageLightbox();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

