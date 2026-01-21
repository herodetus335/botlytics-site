import React from 'react';
import { createRoot } from 'react-dom/client';
import ROICalculator from './ROICalculator';
import IntakeForm from './IntakeForm';

// Mount ROI Calculator
const calculatorContainer = document.getElementById('roi-calculator-root');
if (calculatorContainer) {
  const root = createRoot(calculatorContainer);
  root.render(<ROICalculator />);
}

// Mount Intake Form
const intakeContainer = document.getElementById('intake-form-container');
if (intakeContainer) {
  const root = createRoot(intakeContainer);
  root.render(<IntakeForm />);
}
