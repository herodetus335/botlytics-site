import React, { useState } from 'react';
import { useForm } from '@formspree/react';

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

function IntakeForm() {
  const [state, handleFormspreeSubmit] = useForm("mwvvzraw");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showOtherInput, setShowOtherInput] = useState(false);

  const totalSteps = steps.length;

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const toggleMultiSelect = (name, value) => {
    setFormData(prev => {
      const current = prev[name] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];

      // Handle "Other" visibility
      if (value === 'Other') {
        setShowOtherInput(updated.includes('Other'));
      }

      return { ...prev, [name]: updated };
    });
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const validateStep = () => {
    const step = steps[currentStep - 1];
    const newErrors = {};

    for (const field of step.fields) {
      if (field.required) {
        if (field.type === 'multiselect') {
          if (!formData[field.name] || formData[field.name].length === 0) {
            newErrors[field.name] = true;
          }
        } else {
          if (!formData[field.name] || !formData[field.name].trim()) {
            newErrors[field.name] = true;
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Final step - submit to Formspree
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            submitData.append(key, value.join(', '));
          } else {
            submitData.append(key, value);
          }
        });
        handleFormspreeSubmit(submitData);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const hasError = errors[field.name];

    if (field.type === 'multiselect') {
      const selected = formData[field.name] || [];
      return (
        <div key={field.name} className="intake-form-group multiselect-group">
          {field.label && (
            <label className="intake-form-label">
              {field.label}{field.required ? ' *' : ''}
            </label>
          )}
          <div className={`intake-checkbox-grid ${hasError ? 'error' : ''}`}>
            {field.options.map((opt) => (
              <label
                key={opt}
                className={`intake-checkbox-item ${selected.includes(opt) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleMultiSelect(field.name, opt)}
                />
                <span className="intake-checkbox-text">{opt}</span>
              </label>
            ))}
          </div>
          {showOtherInput && (
            <div className="intake-other-input" style={{ marginTop: '12px' }}>
              <input
                type="text"
                className="intake-form-input"
                placeholder="Please describe your challenge..."
                value={formData[`${field.name}_other`] || ''}
                onChange={(e) => updateField(`${field.name}_other`, e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.name} className="intake-form-group">
          <label className="intake-form-label" htmlFor={field.name}>
            {field.label}{field.required ? ' *' : ''}
          </label>
          <select
            className={`intake-form-select ${hasError ? 'error' : ''}`}
            id={field.name}
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
          >
            <option value="">Select...</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={field.name} className="intake-form-group">
        <label className="intake-form-label" htmlFor={field.name}>
          {field.label}{field.required ? ' *' : ''}
        </label>
        <input
          className={`intake-form-input ${hasError ? 'error' : ''}`}
          type={field.type}
          id={field.name}
          value={value}
          onChange={(e) => updateField(field.name, e.target.value)}
        />
      </div>
    );
  };

  // Success state
  if (state.succeeded) {
    return (
      <div className="intake-success">
        <div className="intake-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d0d12" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 style={{ marginBottom: '16px' }}>Thank You!</h3>
        <p style={{ color: '#dfe1e7' }}>We've received your request and will be in touch within 24 hours.</p>
      </div>
    );
  }

  // Error state
  if (state.errors && state.errors.length > 0) {
    return (
      <div className="intake-success">
        <div className="intake-success-icon" style={{ background: '#ff4444' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h3 style={{ marginBottom: '16px' }}>Something went wrong</h3>
        <p style={{ color: '#dfe1e7', marginBottom: '24px' }}>
          Please try again or email us directly at mikael@botlyticsgroup.com
        </p>
        <button
          className="secondary-button w-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const step = steps[currentStep - 1];

  return (
    <>
      <div className="intake-form-steps">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`intake-step-indicator ${i + 1 < currentStep ? 'completed' : ''} ${i + 1 === currentStep ? 'active' : ''}`}
          />
        ))}
      </div>

      <form onSubmit={handleNext} className="intake-form" noValidate>
        <div className="intake-form-step active">
          <h3 style={{ marginBottom: step.subtitle ? '8px' : '24px', textAlign: 'center' }}>
            {step.title}
          </h3>
          {step.subtitle && (
            <p style={{ textAlign: 'center', color: 'var(--color--paragraph-color)', marginBottom: '24px', fontSize: '14px' }}>
              {step.subtitle}
            </p>
          )}
          {step.fields.map(renderField)}
        </div>

        <div className="intake-form-nav">
          {currentStep > 1 && (
            <button type="button" className="intake-back-btn" onClick={handleBack}>
              Back
            </button>
          )}
          <button
            type="submit"
            className="secondary-button w-button"
            style={{ flex: 1 }}
            disabled={state.submitting}
          >
            {state.submitting ? 'Submitting...' : (currentStep === totalSteps ? 'Submit' : 'Next')}
          </button>
        </div>
      </form>
    </>
  );
}

export default IntakeForm;
