// Load and display use cases from JSON
document.addEventListener('DOMContentLoaded', function() {
    // Hide FAQ empty message (since FAQ link is already there)
    hideEmptyMessages();
    
    // Load use cases from JSON
    fetch('data/usecases.json')
        .then(response => response.json())
        .then(useCases => {
            // Reorder use cases: Sales Systems first
            const sortedUseCases = reorderUseCases(useCases);
            
            // Populate Use Cases dropdown menu
            populateUseCasesDropdown(sortedUseCases);
            
            // Populate case study section
            populateCaseStudySection(sortedUseCases);
            
            // Initialize scroll blur effect after cards are populated
            if (typeof initScrollBlur === 'function') {
                setTimeout(initScrollBlur, 100);
            }
        })
        .catch(error => {
            console.error('Error loading use cases:', error);
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
    const dropdownItemsContainer = document.querySelector('.nav-dropdown .w-dyn-items');
    if (!dropdownItemsContainer) return;
    
    // Hide the "No items found" message
    const emptyMessage = dropdownItemsContainer.parentElement.querySelector('.w-dyn-empty');
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    // Clear existing items (keep the template structure)
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

// Populate the case study section
function populateCaseStudySection(useCases) {
    const caseStudyItemsContainer = document.querySelector('.case-study-collection-list');
    if (!caseStudyItemsContainer) return;
    
    // Hide the "No items found" message
    const emptyMessage = caseStudyItemsContainer.parentElement.querySelector('.w-dyn-empty');
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    // Clear existing items (keep the template structure)
    caseStudyItemsContainer.innerHTML = '';
    
    // Create cards for each use case
    useCases.forEach((useCase, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.setAttribute('role', 'listitem');
        itemDiv.className = 'case-study-collection-item w-dyn-item';
        itemDiv.setAttribute('data-w-id', `cda16067-16d3-da67-bdee-a623e7a08e2${index}`);
        
        const cardBlock = document.createElement('div');
        cardBlock.className = 'case-study-card-block';
        
        const contentBlock = document.createElement('div');
        contentBlock.className = 'case-study-content-block';
        
        const titleLink = document.createElement('a');
        titleLink.href = `detail_use-case.html?slug=${useCase.Slug}`;
        titleLink.className = 'case-study-card-title-link w-inline-block';
        
        const title = document.createElement('h3');
        title.className = 'case-study-card-title';
        title.textContent = useCase.Name;
        
        titleLink.appendChild(title);
        contentBlock.appendChild(titleLink);
        cardBlock.appendChild(contentBlock);
        
        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = `detail_use-case.html?slug=${useCase.Slug}`;
        thumbnailLink.className = 'case-study-thumbnail-link w-inline-block';
        thumbnailLink.setAttribute('data-w-id', `5dbe7b3f-5fa1-b2b1-cb1e-58ea83961a1${index}`);
        
        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = useCase['Primary Thumbnail'] || useCase['Secondary Thumbnail'] || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg';
        thumbnailImg.loading = 'lazy';
        thumbnailImg.alt = `${useCase.Name} Thumbnail`;
        thumbnailImg.className = 'case-study-thumbnail';
        
        thumbnailLink.appendChild(thumbnailImg);
        cardBlock.appendChild(thumbnailLink);
        
        itemDiv.appendChild(cardBlock);
        caseStudyItemsContainer.appendChild(itemDiv);
    });
}

