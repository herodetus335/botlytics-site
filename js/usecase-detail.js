// Load and display use case detail page
document.addEventListener('DOMContentLoaded', function() {
    // Get slug from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    
    if (!slug) {
        // If no slug, redirect to home page
        window.location.href = 'index.html';
        return;
    }
    
    // Hide FAQ empty message (since FAQ link exists)
    hideEmptyMessages();
    
    // Load use cases from JSON
    fetch('data/usecases.json')
        .then(response => response.json())
        .then(useCases => {
            // Reorder use cases: Sales Systems first
            const sortedUseCases = reorderUseCases(useCases);
            
            // Populate dropdown menu
            populateUseCasesDropdown(sortedUseCases);
            
            // Find the matching use case
            const useCase = useCases.find(uc => uc.Slug === slug);
            
            if (!useCase) {
                // If use case not found, redirect to home page
                window.location.href = 'index.html';
                return;
            }
            
            // Populate the page with use case data
            populateUseCaseDetail(useCase);
        })
        .catch(error => {
            console.error('Error loading use cases:', error);
            // Redirect to home page on error
            window.location.href = 'index.html';
        });
});

// Hide empty messages for sections that have content
function hideEmptyMessages() {
    // Hide FAQ empty message (FAQ link exists)
    const faqList = document.querySelector('.nav-menu-link-wrapper .w-dyn-list');
    if (faqList) {
        const faqEmpty = faqList.querySelector('.w-dyn-empty');
        if (faqEmpty) {
            faqEmpty.style.display = 'none';
        }
    }
}

// Reorder use cases to put Sales Systems first
function reorderUseCases(useCases) {
    // Find Sales Systems
    const salesSystems = useCases.find(uc => uc.Slug === 'sales-systems');
    const otherUseCases = useCases.filter(uc => uc.Slug !== 'sales-systems');
    
    // Return Sales Systems first, then the rest
    return salesSystems ? [salesSystems, ...otherUseCases] : useCases;
}

// Populate the Use Cases dropdown menu
function populateUseCasesDropdown(useCases) {
    const dropdownItemsContainer = document.getElementById('use-cases-dropdown');
    if (!dropdownItemsContainer) return;
    
    // Hide the "No items found" message
    const emptyMessage = dropdownItemsContainer.parentElement.querySelector('.w-dyn-empty');
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    // Clear existing items
    dropdownItemsContainer.innerHTML = '';
    
    // Create links for each use case
    useCases.forEach(useCase => {
        const itemDiv = document.createElement('div');
        itemDiv.setAttribute('role', 'listitem');
        itemDiv.className = 'w-dyn-item';
        
        const link = document.createElement('a');
        link.href = `detail_use-case.html?slug=${useCase.Slug}`;
        link.className = 'nav-dropdown-link-block static-33 w-inline-block';
        
        const shape = document.createElement('div');
        shape.className = 'nav-dropdown-shape static-34';
        
        const text = document.createElement('div');
        text.className = 'nav-dropdown-link-text static-35';
        text.textContent = useCase.Name;
        
        link.appendChild(shape);
        link.appendChild(text);
        itemDiv.appendChild(link);
        dropdownItemsContainer.appendChild(itemDiv);
    });
}

// Populate the use case detail page
function populateUseCaseDetail(useCase) {
    // Set page title
    document.title = `${useCase.Name} - Botlytics`;
    
    // Set hero title
    const titleElement = document.getElementById('use-case-title');
    if (titleElement) {
        titleElement.textContent = useCase.Name;
    }
    
    // Set hero image
    const heroImage = document.getElementById('use-case-hero-image');
    if (heroImage) {
        heroImage.src = useCase['Main Image'] || useCase['Primary Thumbnail'] || useCase['Secondary Thumbnail'] || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg';
        heroImage.alt = `${useCase.Name} Hero Image`;
    }
    
    // Set description
    const descriptionElement = document.getElementById('use-case-description');
    if (descriptionElement && useCase['Description 1']) {
        descriptionElement.innerHTML = useCase['Description 1'];
        
        // Replace hyphen lines with clean line elements (works on all screen sizes)
        replaceHyphenLines(descriptionElement);
        
        // Transform content for all use cases on mobile
        if (window.innerWidth <= 767) {
            transformUseCaseForMobile(descriptionElement);
        }
        
        // Store use case slug for resize handler
        descriptionElement.setAttribute('data-use-case-slug', useCase.Slug);
        
        // Setup lightbox for images after content is loaded
        // Use setTimeout to ensure DOM is fully updated
        setTimeout(function() {
            if (typeof setupImageLightbox === 'function') {
                setupImageLightbox();
            }
        }, 100);
    }
}

// Handle window resize for all use cases
window.addEventListener('resize', function() {
    const descriptionElement = document.getElementById('use-case-description');
    if (descriptionElement && descriptionElement.getAttribute('data-use-case-slug')) {
        // Reload the content from JSON to reset it
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        if (slug) {
            fetch('data/usecases.json')
                .then(response => response.json())
                .then(useCases => {
                    const useCase = useCases.find(uc => uc.Slug === slug);
                    if (useCase && useCase['Description 1']) {
                        descriptionElement.innerHTML = useCase['Description 1'];
                        // Replace hyphen lines with clean line elements (works on all screen sizes)
                        replaceHyphenLines(descriptionElement);
                        if (window.innerWidth <= 767) {
                            transformUseCaseForMobile(descriptionElement);
                        }
                        // Setup lightbox for images after content is loaded
                        setTimeout(function() {
                            if (typeof setupImageLightbox === 'function') {
                                setupImageLightbox();
                            }
                        }, 100);
                    }
                });
        }
    }
});

// Replace hyphen lines with clean line elements (works on all screen sizes)
function replaceHyphenLines(container) {
    const paragraphs = Array.from(container.querySelectorAll('p'));
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        // Check if paragraph contains mostly hyphens (at least 10 hyphens)
        if (text.match(/^-{10,}$/)) {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'divider-line';
            p.parentNode.replaceChild(lineDiv, p);
        }
    });
}

// Transform all use cases content for mobile - convert bullets to step flows
function transformUseCaseForMobile(container) {
    // Find all ul elements (bullet lists) - process in reverse to avoid index issues
    const bulletLists = Array.from(container.querySelectorAll('ul'));
    
    bulletLists.forEach(ul => {
        // Get all list items
        const listItems = ul.querySelectorAll('li');
        if (listItems.length === 0) return;
        
        // Create a new step flow container
        const stepContainer = document.createElement('div');
        stepContainer.className = 'mobile-step-flow';
        
        // Process each list item and convert to step format
        listItems.forEach((li, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'mobile-step-item';
            
            // Extract text content - preserve HTML formatting
            const textContent = li.innerHTML;
            
            // Create step number
            const stepNumber = document.createElement('div');
            stepNumber.className = 'mobile-step-number';
            stepNumber.textContent = index + 1;
            
            // Create step content
            const stepContent = document.createElement('div');
            stepContent.className = 'mobile-step-content';
            stepContent.innerHTML = textContent;
            
            stepDiv.appendChild(stepNumber);
            stepDiv.appendChild(stepContent);
            stepContainer.appendChild(stepDiv);
        });
        
        // Replace the ul with the new step container
        ul.parentNode.replaceChild(stepContainer, ul);
    });
}

