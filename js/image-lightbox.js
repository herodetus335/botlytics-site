// Global Image Lightbox - Works on all pages
(function() {
    'use strict';
    
    // Check if we're on a use case detail page
    function isUseCaseDetailPage() {
        return window.location.pathname.includes('detail_use-case.html') || 
               document.getElementById('use-case-description') !== null;
    }
    
    // Setup image lightbox for all images on the page
    function setupImageLightbox() {
        // Check if we're on a use case detail page
        const isUseCasePage = isUseCaseDetailPage();
        
        // Only enable lightbox on use case detail pages
        if (!isUseCasePage) {
            return;
        }
        
        // Find all images in the use case description/content area
        // Exclude hero image, icons, logos, and decorative images
        const descriptionElement = document.getElementById('use-case-description');
        let images;
        
        if (descriptionElement) {
            // Get all images within the description/content area (including inside figure elements)
            images = descriptionElement.querySelectorAll('img');
        } else {
            // Fallback: get all images except hero and decorative ones
            images = document.querySelectorAll('img:not(.brand-logo):not(.footer-image):not(.w-icon-):not([class*="icon"]):not([class*="logo"]):not(.case-study-thumbnail):not(#use-case-hero-image):not(.cms-details-hero-image)');
        }
        
        images.forEach(img => {
            // Skip if already has lightbox handler
            if (img.hasAttribute('data-lightbox-setup')) return;
            
            // Skip hero image specifically
            if (img.id === 'use-case-hero-image' || img.classList.contains('cms-details-hero-image')) {
                return;
            }
            
            // Allow images in figure elements (they should be clickable)
            const parentFigure = img.closest('figure');
            if (parentFigure) {
                // Images in figure elements should always be clickable, even if inside a link
                // Continue to setup lightbox
            } else {
                // For images not in figure elements, skip if they're in navigation links
                const parentLink = img.closest('a');
                if (parentLink) {
                    // Only skip if it's a navigation link
                    if (parentLink.href.includes('detail_use-case.html') || 
                        parentLink.classList.contains('case-study-thumbnail-link') ||
                        parentLink.href.includes('index.html')) {
                        return;
                    }
                }
            }
            
            // Skip very small images (likely icons) - check both width/height and naturalWidth/naturalHeight
            const imgWidth = img.naturalWidth || img.width || 0;
            const imgHeight = img.naturalHeight || img.height || 0;
            if (imgWidth < 50 && imgHeight < 50) return;
            
            img.setAttribute('data-lightbox-setup', 'true');
            
            // Make image clickable
            img.style.cursor = 'pointer';
            
            // Add click handler
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Get the full-size image source (try srcset first, then src)
                let imageSrc = img.src;
                if (img.srcset) {
                    // Get the largest image from srcset
                    const srcsetParts = img.srcset.split(',').map(s => s.trim());
                    if (srcsetParts.length > 0) {
                        const largest = srcsetParts[srcsetParts.length - 1].split(' ')[0];
                        imageSrc = largest;
                    }
                }
                openImageLightbox(imageSrc, img.alt || 'Image');
            });
        });
    }
    
    // Make setupImageLightbox available globally so usecase-detail.js can call it
    window.setupImageLightbox = setupImageLightbox;
    
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

