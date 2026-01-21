// Botlytics Multi-Step Intake Form
// Integrates with Formspree for form submission

(function() {
  const container = document.getElementById('intake-form-container');
  if (!container) return;

  // Configure your Formspree endpoint here
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  let currentStep = 1;
  const totalSteps = 4;
  let formData = {};

  const steps = [
    {
      id: 1,
      title: 'Company Info',
      fields: [
        { name: 'company', label: 'Company Name', type: 'text', required: true },
        { name: 'website', label: 'Website URL', type: 'url', required: false },
        { name: 'industry', label: 'Industry', type: 'select', options: [
          'SaaS', 'Agency', 'E-commerce', 'Professional Services', 'Healthcare', 'Finance', 'Other'
        ], required: true }
      ]
    },
    {
      id: 2,
      title: 'Current Situation',
      fields: [
        { name: 'currentOutreach', label: 'Current Monthly Outreach Volume', type: 'select', options: [
          'None', 'Under 1,000', '1,000 - 5,000', '5,000 - 20,000', '20,000+'
        ], required: true },
        { name: 'teamSize', label: 'Sales/Marketing Team Size', type: 'select', options: [
          'Just me', '2-5 people', '6-15 people', '15+'
        ], required: false }
      ]
    },
    {
      id: 3,
      title: 'What challenges are you facing?',
      subtitle: 'Select all that apply',
      fields: [
        { name: 'painPoints', label: '', type: 'multiselect', options: [
          'Not booking enough meetings from outreach',
          'Cold emails getting ignored or landing in spam',
          'No system to track and close deals',
          'Website isn\'t generating leads or conversions',
          'Can\'t keep up with content creation',
          'Manual tasks eating up too much time',
          'Other'
        ], required: true }
      ]
    },
    {
      id: 4,
      title: 'Contact Details',
      fields: [
        { name: 'name', label: 'Your Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'timeline', label: 'When do you want to get started?', type: 'select', options: [
          'As soon as possible', 'Within the next month', 'In 1-3 months', 'Just exploring options'
        ], required: true }
      ]
    }
  ];

  function renderField(field) {
    const value = formData[field.name] || '';
    const required = field.required ? 'required' : '';

    if (field.type === 'multiselect') {
      const selected = formData[field.name] || [];
      const otherText = formData[field.name + '_other'] || '';
      const showOther = selected.includes('Other');
      return `
        <div class="intake-form-group multiselect-group">
          ${field.label ? `<label class="intake-form-label">${field.label}${field.required ? ' *' : ''}</label>` : ''}
          <div class="intake-checkbox-grid">
            ${field.options.map((opt, i) => `
              <label class="intake-checkbox-item ${selected.includes(opt) ? 'selected' : ''}" ${opt === 'Other' ? 'data-other="true"' : ''}>
                <input type="checkbox" name="${field.name}" value="${opt}" ${selected.includes(opt) ? 'checked' : ''}>
                <span class="intake-checkbox-text">${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="intake-other-input" id="other-input-wrapper" style="display: ${showOther ? 'block' : 'none'}; margin-top: 12px;">
            <input type="text" class="intake-form-input" id="${field.name}_other" name="${field.name}_other" placeholder="Please describe your challenge..." value="${otherText}">
          </div>
        </div>
      `;
    }

    if (field.type === 'select') {
      return `
        <div class="intake-form-group">
          <label class="intake-form-label" for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
          <select class="intake-form-select" id="${field.name}" name="${field.name}" ${required}>
            <option value="">Select...</option>
            ${field.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        </div>
      `;
    }

    if (field.type === 'textarea') {
      return `
        <div class="intake-form-group">
          <label class="intake-form-label" for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
          <textarea class="intake-form-textarea" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" ${required}>${value}</textarea>
        </div>
      `;
    }

    return `
      <div class="intake-form-group">
        <label class="intake-form-label" for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
        <input class="intake-form-input" type="${field.type}" id="${field.name}" name="${field.name}" value="${value}" ${required}>
      </div>
    `;
  }

  function renderStepIndicators() {
    return steps.map((step, i) => {
      let className = 'intake-step-indicator';
      if (i + 1 < currentStep) className += ' completed';
      if (i + 1 === currentStep) className += ' active';
      return `<div class="${className}"></div>`;
    }).join('');
  }

  function render() {
    const step = steps[currentStep - 1];

    container.innerHTML = `
      <div class="intake-form-steps">
        ${renderStepIndicators()}
      </div>
      <form id="intake-form" class="intake-form" novalidate>
        <div class="intake-form-step active">
          <h3 style="margin-bottom: ${step.subtitle ? '8px' : '24px'}; text-align: center;">${step.title}</h3>
          ${step.subtitle ? `<p style="text-align: center; color: var(--color--paragraph-color); margin-bottom: 24px; font-size: 14px;">${step.subtitle}</p>` : ''}
          ${step.fields.map(renderField).join('')}
        </div>
        <div class="intake-form-nav">
          ${currentStep > 1 ? '<button type="button" class="intake-back-btn" id="intake-back">Back</button>' : ''}
          <button type="submit" class="secondary-button w-button" style="flex: 1;">
            ${currentStep === totalSteps ? 'Submit' : 'Next'}
          </button>
        </div>
      </form>
    `;

    // Attach event listeners
    const form = document.getElementById('intake-form');
    const backBtn = document.getElementById('intake-back');

    form.addEventListener('submit', handleSubmit);
    if (backBtn) {
      backBtn.addEventListener('click', goBack);
    }

    // Handle checkbox selection styling and Other field toggle
    document.querySelectorAll('.intake-checkbox-item input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const item = e.target.closest('.intake-checkbox-item');
        item.classList.toggle('selected', e.target.checked);

        // Show/hide Other input field
        if (item.dataset.other === 'true') {
          const otherWrapper = document.getElementById('other-input-wrapper');
          if (otherWrapper) {
            otherWrapper.style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) {
              otherWrapper.querySelector('input')?.focus();
            }
          }
        }
      });
    });
  }

  function saveCurrentStepData() {
    const step = steps[currentStep - 1];
    step.fields.forEach(field => {
      if (field.type === 'multiselect') {
        const checkboxes = document.querySelectorAll(`input[name="${field.name}"]:checked`);
        formData[field.name] = Array.from(checkboxes).map(cb => cb.value);
        // Save "Other" explanation if it exists
        const otherInput = document.getElementById(field.name + '_other');
        if (otherInput && otherInput.value.trim()) {
          formData[field.name + '_other'] = otherInput.value.trim();
        }
      } else {
        const input = document.getElementById(field.name);
        if (input) {
          formData[field.name] = input.value;
        }
      }
    });
  }

  function validateCurrentStep() {
    const step = steps[currentStep - 1];
    for (const field of step.fields) {
      if (field.required) {
        if (field.type === 'multiselect') {
          const checkboxes = document.querySelectorAll(`input[name="${field.name}"]:checked`);
          if (checkboxes.length === 0) {
            // Highlight the checkbox group
            document.querySelector('.intake-checkbox-grid')?.classList.add('error');
            return false;
          }
        } else {
          const input = document.getElementById(field.name);
          if (!input.value.trim()) {
            input.focus();
            input.classList.add('error');
            return false;
          }
        }
      }
    }
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    saveCurrentStepData();

    if (currentStep < totalSteps) {
      currentStep++;
      render();
      // Smooth scroll to form
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      submitForm();
    }
  }

  function goBack() {
    saveCurrentStepData();
    currentStep--;
    render();
  }

  async function submitForm() {
    container.innerHTML = `
      <div class="intake-success" style="text-align: center; padding: 48px;">
        <div style="width: 48px; height: 48px; margin: 0 auto 24px; border: 3px solid #29c8ff; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p>Submitting your request...</p>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
      </div>
    `;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showSuccess();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showError();
    }
  }

  function showSuccess() {
    container.innerHTML = `
      <div class="intake-success">
        <div class="intake-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d0d12" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 style="margin-bottom: 16px;">Thank You!</h3>
        <p style="color: #dfe1e7;">We've received your request and will be in touch within 24 hours.</p>
      </div>
    `;
  }

  function showError() {
    container.innerHTML = `
      <div class="intake-success">
        <div class="intake-success-icon" style="background: #ff4444;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h3 style="margin-bottom: 16px;">Something went wrong</h3>
        <p style="color: #dfe1e7; margin-bottom: 24px;">Please try again or email us directly at mikael@botlyticsgroup.com</p>
        <button class="secondary-button w-button" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }






  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
