// Mobile Navigation - Side Drawer
(function() {
  'use strict';
  
  let menuOpen = false;
  let backdrop = null;
  let setupDropdown = null; // Will be set in initMobileNav
  
  function createBackdrop() {
    if (backdrop) return backdrop;
    
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    
    // Check if we're on a use case page
    const isUseCasePage = document.getElementById('use-case-description') !== null;
    const backdropZIndex = isUseCasePage ? '9999' : '998';
    
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: ${backdropZIndex};
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      /* Ensure backdrop doesn't visually cover navigation menu */
      mix-blend-mode: normal;
    `;
    // Remove backdrop-filter blur - we only want the menu itself to blur
    document.body.appendChild(backdrop);
    
    backdrop.addEventListener('click', function(e) {
      // Don't close if clicking on navigation menu or its children
      const navMenu = document.querySelector('.w-nav-menu');
      if (navMenu) {
        // Check if click target is within navigation menu
        if (navMenu.contains(e.target) || navMenu === e.target) {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        // Also check if click is on navigation links
        const navLinks = navMenu.querySelectorAll('a, .nav-menu-link-copy, .nav-dropdown-link-block, .nav-dropdown-toggle-copy');
        for (let i = 0; i < navLinks.length; i++) {
          if (navLinks[i].contains(e.target) || navLinks[i] === e.target) {
            e.stopPropagation();
            e.preventDefault();
            return false;
          }
        }
      }
      // Only close if clicking outside the navigation menu
      if (menuOpen) {
        closeMenu();
      }
    });
    
    // Also add touch event handler for mobile
    backdrop.addEventListener('touchend', function(e) {
      const navMenu = document.querySelector('.w-nav-menu');
      if (navMenu && navMenu.contains(e.target)) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      if (menuOpen) {
        closeMenu();
      }
    });
    
    return backdrop;
  }
  
  function openMenu() {
    const navContainer = document.querySelector('.w-nav');
    const navMenu = document.querySelector('.w-nav-menu');
    
    if (!navContainer || !navMenu) return;
    
    menuOpen = true;
    navContainer.setAttribute('data-nav-menu-open', '');
    navContainer.classList.add('menu-is-open');
    navMenu.classList.add('menu-is-open');
    
    // Show backdrop
    const backdrop = createBackdrop();
    
    // Check if we're on a use case page
    const isUseCasePage = document.getElementById('use-case-description') !== null;
    if (isUseCasePage) {
      // On use case pages, backdrop should be below navigation menu
      backdrop.style.zIndex = '9999';
      // CRITICAL: Backdrop should NOT block clicks on navigation menu
      backdrop.style.pointerEvents = 'none';
      // CRITICAL: Make backdrop not visually cover navigation menu - reduce opacity or use clip-path
      // The backdrop will still darken the background but won't dim the menu
      backdrop.style.opacity = '0.2'; // Lower opacity so it doesn't dim the menu as much
      // Ensure navigation menu is above backdrop
      navMenu.style.zIndex = '10005';
      navMenu.style.pointerEvents = 'auto';
      navMenu.style.touchAction = 'manipulation';
      navMenu.style.opacity = '1'; // Ensure menu is fully opaque
      // Ensure proper positioning - same as home page
      navMenu.style.position = 'fixed';
      navMenu.style.top = '43px';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
      navMenu.style.width = '100%';
      navMenu.style.maxWidth = '100%';
      // Make sure all navigation links are clickable and not dimmed
      const navLinks = navMenu.querySelectorAll('a, .nav-menu-link-copy, .nav-dropdown-link-block, .nav-dropdown-toggle-copy, *');
      navLinks.forEach(function(link) {
        link.style.pointerEvents = 'auto';
        link.style.touchAction = 'manipulation';
        link.style.zIndex = '10006';
        link.style.position = 'relative';
        link.style.opacity = '1';
        link.style.filter = 'none';
      });
      
      // Ensure logo is not dimmed
      const logo = navMenu.querySelector('.navbar-brand, .brand-logo, img');
      if (logo) {
        logo.style.opacity = '1';
        logo.style.filter = 'none';
      }
      
      // Add document click handler to close menu when clicking outside (since backdrop has pointer-events: none)
      const documentClickHandler = function(e) {
        if (menuOpen && navMenu && !navMenu.contains(e.target) && !navContainer.contains(e.target)) {
          closeMenu();
          document.removeEventListener('click', documentClickHandler);
          document.removeEventListener('touchend', documentClickHandler);
        }
      };
      document.addEventListener('click', documentClickHandler);
      document.addEventListener('touchend', documentClickHandler);
    } else {
      backdrop.style.zIndex = '998';
      backdrop.style.pointerEvents = 'auto';
      backdrop.style.opacity = '1';
    }
    
    if (!isUseCasePage) {
      backdrop.style.pointerEvents = 'auto';
      backdrop.style.opacity = '1';
    }
    
    // Re-setup dropdown when menu opens (in case elements weren't found before)
    setTimeout(function() {
      if (typeof setupDropdown === 'function') {
        setupDropdown();
      }
    }, 50);
    
    // DO NOT prevent body scroll - allow scrolling while menu is open
  }
  
  function closeMenu() {
    const navContainer = document.querySelector('.w-nav');
    const navMenu = document.querySelector('.w-nav-menu');
    
    if (!navContainer || !navMenu) return;
    
    menuOpen = false;
    navContainer.removeAttribute('data-nav-menu-open');
    navContainer.classList.remove('menu-is-open');
    navMenu.classList.remove('menu-is-open');
    
    // Hide backdrop
    if (backdrop) {
      backdrop.style.opacity = '0';
      backdrop.style.pointerEvents = 'none';
    }
  }
  
  function toggleMenu() {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }
  
  function initMobileNav() {
    const navButton = document.querySelector('.w-nav-button');
    const navContainer = document.querySelector('.w-nav');
    const navMenu = document.querySelector('.w-nav-menu');
    
    if (!navButton || !navContainer || !navMenu) {
      console.log('Nav elements not found');
      return;
    }
    
    // Remove any existing listeners by cloning the button
    const newButton = navButton.cloneNode(true);
    navButton.parentNode.replaceChild(newButton, navButton);
    
    // Add click handler to menu button - toggle menu
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
    
    // Close on menu link click (but not dropdown toggle or dropdown items)
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      // Skip dropdown toggle and dropdown items - they should work independently
      const isDropdownToggle = link.closest('.nav-dropdown-toggle-copy') || link.closest('.w-dropdown-toggle');
      const isDropdownItem = link.closest('.nav-dropdown-list') || link.closest('.w-dropdown-list');
      
      if (isDropdownToggle || isDropdownItem) {
        return; // Let Webflow handle dropdown functionality
      }
      
      link.addEventListener('click', function(e) {
        // Don't stop propagation - let Webflow handle it first
        if (menuOpen) {
          closeMenu();
        }
      });
    });
    
    // Store dropdown reference globally
    let dropdownRef = null;
    let dropdownToggleRef = null;
    let isDropdownClick = false;
    
    // Manually handle dropdown toggle - find dropdown after menu is initialized
    setupDropdown = function() {
      const dropdown = navMenu.querySelector('.nav-dropdown.w-dropdown') || 
                       navMenu.querySelector('.w-dropdown') ||
                       navMenu.querySelector('.nav-dropdown');
      
      if (!dropdown) {
        console.log('Dropdown not found');
        return;
      }
      
      const dropdownToggle = dropdown.querySelector('.nav-dropdown-toggle-copy') ||
                             dropdown.querySelector('.w-dropdown-toggle');
      
      if (!dropdownToggle) {
        console.log('Dropdown toggle not found');
        return;
      }
      
      // Store references
      dropdownRef = dropdown;
      dropdownToggleRef = dropdownToggle;
      
      console.log('Setting up dropdown:', { dropdown, dropdownToggle });
      
      // Make toggle clickable
      dropdownToggle.style.cursor = 'pointer';
      dropdownToggle.style.pointerEvents = 'auto';
      
      // Add click handler to toggle - use capture phase to catch it first
      dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        isDropdownClick = true;
        
        console.log('Dropdown toggle clicked');
        
        // Toggle the w--open class
        const isOpen = dropdown.classList.contains('w--open');
        if (isOpen) {
          dropdown.classList.remove('w--open');
          console.log('Dropdown closed');
        } else {
          dropdown.classList.add('w--open');
          console.log('Dropdown opened');
        }
        
        // Reset flag after a short delay
        setTimeout(function() {
          isDropdownClick = false;
        }, 200);
      }, true); // Capture phase - runs before bubble phase
      
      // Also prevent clicks on dropdown list from closing menu
      const dropdownList = dropdown.querySelector('.w-dropdown-list') || 
                          dropdown.querySelector('.nav-dropdown-list');
      if (dropdownList) {
        dropdownList.addEventListener('click', function(e) {
          e.stopPropagation();
          isDropdownClick = true;
          setTimeout(function() {
            isDropdownClick = false;
          }, 100);
        }, true);
      }
    }
    
    // Setup dropdown after a short delay to ensure DOM is ready
    setTimeout(setupDropdown, 100);
    // Also try immediately
    setupDropdown();
    
    // Also setup dropdown for desktop (not just mobile menu)
    // This ensures dropdown works on all pages, including FAQ page
    function setupDesktopDropdown() {
      // Find dropdown in the main navigation (not just mobile menu)
      const desktopNav = document.querySelector('.navbar-container');
      if (!desktopNav) return;
      
      const desktopDropdown = desktopNav.querySelector('.nav-dropdown.w-dropdown') || 
                               desktopNav.querySelector('.w-dropdown') ||
                               desktopNav.querySelector('.nav-dropdown');
      
      if (!desktopDropdown) return;
      
      const desktopToggle = desktopDropdown.querySelector('.nav-dropdown-toggle-copy') ||
                             desktopDropdown.querySelector('.w-dropdown-toggle');
      
      if (!desktopToggle) return;
      
      // Check if already set up
      if (desktopToggle.hasAttribute('data-dropdown-setup')) return;
      desktopToggle.setAttribute('data-dropdown-setup', 'true');
      
      // Make toggle clickable
      desktopToggle.style.cursor = 'pointer';
      desktopToggle.style.pointerEvents = 'auto';
      
      // Add click handler
      desktopToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle the w--open class
        const isOpen = desktopDropdown.classList.contains('w--open');
        if (isOpen) {
          desktopDropdown.classList.remove('w--open');
        } else {
          desktopDropdown.classList.add('w--open');
        }
      }, true);
    }
    
    // Setup desktop dropdown
    setTimeout(setupDesktopDropdown, 200);
    setupDesktopDropdown();
    
    // Store reference to button for click detection
    let buttonRef = newButton;
    
    // Close when clicking anywhere on the page (backdrop, page content)
    // Note: hamburger button click is handled separately by toggleMenu
    // Use a slight delay to let dropdown handler run first
    document.addEventListener('click', function(e) {
      if (!menuOpen) return;
      
      // If this is a dropdown click, don't do anything
      if (isDropdownClick) {
        return;
      }
      
      const clickedElement = e.target;
      
      // Don't close if clicking on dropdown elements - our handler manages it
      const isDropdownElement = clickedElement.closest('.w-dropdown') || 
                                clickedElement.closest('.nav-dropdown') ||
                                clickedElement.closest('.w-dropdown-toggle') ||
                                clickedElement.closest('.nav-dropdown-toggle-copy') ||
                                clickedElement.closest('.w-dropdown-list') ||
                                clickedElement.closest('.nav-dropdown-list');
      
      if (isDropdownElement) {
        // Our dropdown handler manages this - don't close menu
        return;
      }
      
      // Don't close if clicking inside menu or on hamburger button
      const isInsideMenu = navMenu.contains(clickedElement);
      const isHamburgerButton = buttonRef.contains(clickedElement);
      
      if (isInsideMenu || isHamburgerButton) {
        return;
      }
      
      // Close menu if clicking outside
      closeMenu();
    }, false); // Use bubble phase, not capture phase
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuOpen) {
        closeMenu();
      }
    });
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
  
  // Fallback
  setTimeout(initMobileNav, 300);
  
  // Also setup dropdown independently on page load (for desktop and all pages)
  function setupDropdownOnLoad() {
    const navContainer = document.querySelector('.navbar-container') || 
                         document.querySelector('.w-nav');
    if (!navContainer) return;
    
    const dropdown = navContainer.querySelector('.nav-dropdown.w-dropdown') || 
                     navContainer.querySelector('.w-dropdown') ||
                     navContainer.querySelector('.nav-dropdown');
    
    if (!dropdown) return;
    
    const dropdownToggle = dropdown.querySelector('.nav-dropdown-toggle-copy') ||
                           dropdown.querySelector('.w-dropdown-toggle');
    
    if (!dropdownToggle) return;
    
    // Check if already set up
    if (dropdownToggle.hasAttribute('data-dropdown-setup')) return;
    dropdownToggle.setAttribute('data-dropdown-setup', 'true');
    
    // Make toggle clickable
    dropdownToggle.style.cursor = 'pointer';
    dropdownToggle.style.pointerEvents = 'auto';
    
    // Add click handler
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle the w--open class
      const isOpen = dropdown.classList.contains('w--open');
      if (isOpen) {
        dropdown.classList.remove('w--open');
      } else {
        dropdown.classList.add('w--open');
      }
    }, true);
  }
  
  // Setup dropdown on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDropdownOnLoad);
  } else {
    setupDropdownOnLoad();
  }
  
  // Fallback with delay to ensure DOM is ready
  setTimeout(setupDropdownOnLoad, 500);
})();

// Instant scroll for anchor links (no smooth scroll delay)
(function() {
  'use strict';
  
  // Store processed links to avoid re-processing
  const processedLinks = new WeakSet();
  
  function handleAnchorClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Only handle anchor links
    if (!href || !href.startsWith('#')) return;
    
    // Skip if it's a dropdown or other special link
    if (link.closest('.w-dropdown') || link.closest('.nav-dropdown')) return;
    
    // Prevent default IMMEDIATELY - before anything else can happen
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    const targetId = href.substring(1);
    if (!targetId) return;
    
    // Close mobile menu first if open (before scrolling)
    const navMenu = document.querySelector('.w-nav-menu');
    if (navMenu && navMenu.classList.contains('menu-is-open')) {
      const navContainer = document.querySelector('.w-nav');
      if (navContainer) {
        navContainer.removeAttribute('data-nav-menu-open');
        navContainer.classList.remove('menu-is-open');
        navMenu.classList.remove('menu-is-open');
      }
    }
    
    // Find target element
    const targetElement = document.getElementById(targetId) || 
                          document.querySelector(`[name="${targetId}"]`);
    
    if (targetElement) {
      // Calculate offset for fixed header
      const headerHeight = 43; // Mobile header height
      const targetRect = targetElement.getBoundingClientRect();
      const targetPosition = targetRect.top + window.pageYOffset - headerHeight;
      
      // Smooth scroll to target position
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    return false;
  }
  
  function initInstantScroll() {
    // Find all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
      // Skip if already processed
      if (processedLinks.has(link)) return;
      
      // Skip dropdown links
      if (link.closest('.w-dropdown') || link.closest('.nav-dropdown')) return;
      
      // Mark as processed
      processedLinks.add(link);
      
      // Add instant scroll handler in CAPTURE phase (runs first)
      // This ensures our handler runs before any other handlers
      link.addEventListener('click', handleAnchorClick, true);
    });
  }
  
  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstantScroll);
  } else {
    initInstantScroll();
  }
  
  // Also run after a delay to catch dynamically added links
  setTimeout(initInstantScroll, 100);
  setTimeout(initInstantScroll, 500);
})();

