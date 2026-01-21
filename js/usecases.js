// Load and display use cases from JSON
document.addEventListener('DOMContentLoaded', function() {
    // Hide FAQ empty message (since FAQ link is already there)
    hideEmptyMessages();

    // Load use cases from JSON
    fetch('data/usecases.json')
        .then(response => response.json())
        .then(useCases => {
            // Populate Use Cases dropdown menu
            populateUseCasesDropdown(useCases);

            // Populate case study section with output mockups
            populateCaseStudySection(useCases);

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

// Populate the Use Cases dropdown menu
function populateUseCasesDropdown(useCases) {
    const dropdownItemsContainer = document.querySelector('.nav-dropdown .w-dyn-items');
    if (!dropdownItemsContainer) return;

    // Hide the "No items found" message
    const emptyMessage = dropdownItemsContainer.parentElement.querySelector('.w-dyn-empty');
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }

    // Clear existing items
    dropdownItemsContainer.innerHTML = '';

    // Create links for each use case - now linking to blueprint pages
    useCases.forEach(useCase => {
        const itemDiv = document.createElement('div');
        itemDiv.setAttribute('role', 'listitem');
        itemDiv.className = 'w-dyn-item';

        const link = document.createElement('a');
        // Link to blueprint page instead of detail_use-case.html
        link.href = useCase.BlueprintPage || `blueprint-${useCase.Slug}.html`;
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

// Populate the case study section with output mockups
function populateCaseStudySection(useCases) {
    const caseStudyItemsContainer = document.querySelector('.case-study-collection-list');
    if (!caseStudyItemsContainer) return;

    // Hide the "No items found" message
    const emptyMessage = caseStudyItemsContainer.parentElement.querySelector('.w-dyn-empty');
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }

    // Clear existing items
    caseStudyItemsContainer.innerHTML = '';

    // Create cards for each use case with new mockup structure
    useCases.forEach((useCase, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.setAttribute('role', 'listitem');
        itemDiv.className = 'case-study-collection-item w-dyn-item';
        itemDiv.setAttribute('data-w-id', `cda16067-16d3-da67-bdee-a623e7a08e2${index}`);

        const cardBlock = document.createElement('div');
        cardBlock.className = 'case-study-card-block';

        // Content block with title and tagline
        const contentBlock = document.createElement('div');
        contentBlock.className = 'case-study-content-block';

        const titleLink = document.createElement('a');
        titleLink.href = useCase.BlueprintPage || `blueprint-${useCase.Slug}.html`;
        titleLink.className = 'case-study-card-title-link w-inline-block';

        const title = document.createElement('h3');
        title.className = 'case-study-card-title';
        title.textContent = useCase.Name;

        titleLink.appendChild(title);
        contentBlock.appendChild(titleLink);

        // Add tagline if available
        if (useCase.Tagline) {
            const tagline = document.createElement('p');
            tagline.className = 'case-study-tagline';
            tagline.textContent = useCase.Tagline;
            contentBlock.appendChild(tagline);
        }

        cardBlock.appendChild(contentBlock);

        // Thumbnail/Mockup area
        const thumbnailLink = document.createElement('a');
        thumbnailLink.href = useCase.BlueprintPage || `blueprint-${useCase.Slug}.html`;
        thumbnailLink.className = 'case-study-thumbnail-link w-inline-block';
        thumbnailLink.setAttribute('data-w-id', `5dbe7b3f-5fa1-b2b1-cb1e-58ea83961a1${index}`);

        // Check if thumbnail exists, otherwise create styled placeholder
        const thumbnailSrc = useCase['Primary Thumbnail'];
        if (thumbnailSrc && !thumbnailSrc.includes('mockups/')) {
            // Use actual image
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = thumbnailSrc;
            thumbnailImg.loading = 'lazy';
            thumbnailImg.alt = `${useCase.Name} Preview`;
            thumbnailImg.className = 'case-study-thumbnail';
            thumbnailLink.appendChild(thumbnailImg);
        } else {
            // Create SVG placeholder mockup
            const mockupDiv = document.createElement('div');
            mockupDiv.className = 'case-study-mockup-placeholder';
            mockupDiv.innerHTML = createMockupSVG(useCase.Slug, useCase.Name);
            thumbnailLink.appendChild(mockupDiv);
        }

        cardBlock.appendChild(thumbnailLink);
        itemDiv.appendChild(cardBlock);
        caseStudyItemsContainer.appendChild(itemDiv);
    });
}

// Create SVG mockup placeholder based on service type
function createMockupSVG(slug, name) {
    const mockupConfigs = {
        'strategic-outreach': {
            icon: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
            label: 'Email Dashboard',
            stats: ['5% Reply Rate', '1M+ Sent']
        },
        'revenue-infrastructure': {
            icon: `<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" stroke="currentColor" stroke-width="1.5"/>`,
            label: 'Pipeline Flow',
            stats: ['3 Phases', 'Auto-Sync']
        },
        'web-design': {
            icon: `<rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.5"/>`,
            label: 'Site Preview',
            stats: ['React', 'Node.js']
        },
        'content-pal': {
            icon: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><polygon points="10,8 16,12 10,16" fill="currentColor"/>`,
            label: 'Content Queue',
            stats: ['24/7 Active', 'Multi-Platform']
        }
    };

    const config = mockupConfigs[slug] || { icon: '', label: name, stats: [] };

    return `
        <svg class="mockup-svg" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#064dfa;stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:#29c8ff;stop-opacity:0.1" />
                </linearGradient>
                <filter id="glow-${slug}">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <rect width="300" height="200" rx="8" fill="url(#grad-${slug})" stroke="#064dfa" stroke-opacity="0.3"/>
            <g transform="translate(126, 50)" filter="url(#glow-${slug})" style="color:#29c8ff">
                <g transform="scale(2)">
                    ${config.icon}
                </g>
            </g>
            <text x="150" y="130" text-anchor="middle" fill="#fff" font-family="Clash Display, sans-serif" font-size="16" font-weight="500">${config.label}</text>
            <g transform="translate(75, 155)">
                ${config.stats.map((stat, i) => `
                    <rect x="${i * 80}" y="0" width="70" height="24" rx="4" fill="#16181d" stroke="#666d80" stroke-opacity="0.5"/>
                    <text x="${i * 80 + 35}" y="16" text-anchor="middle" fill="#dfe1e7" font-size="10">${stat}</text>
                `).join('')}
            </g>
        </svg>
    `;
}
