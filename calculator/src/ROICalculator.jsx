import React, { useState, useMemo } from 'react';

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    monthlyLeadVolume: 5000,
    replyRate: 5,
    closeRate: 10,
    avgDealValue: 5000
  });

  const [displayValues, setDisplayValues] = useState({
    monthlyLeadVolume: '5,000',
    replyRate: '5',
    closeRate: '10',
    avgDealValue: '5,000'
  });

  const results = useMemo(() => {
    const replies = inputs.monthlyLeadVolume * (inputs.replyRate / 100);
    const closedDeals = replies * (inputs.closeRate / 100);
    const monthlyRevenue = closedDeals * inputs.avgDealValue;
    const annualRevenue = monthlyRevenue * 12;

    return { replies, closedDeals, monthlyRevenue, annualRevenue };
  }, [inputs]);

  const handleSliderChange = (field, value) => {
    const numValue = Number(value);
    setInputs(prev => ({ ...prev, [field]: numValue }));
    if (field === 'replyRate' || field === 'closeRate') {
      setDisplayValues(prev => ({ ...prev, [field]: String(numValue) }));
    } else {
      setDisplayValues(prev => ({ ...prev, [field]: formatNumber(numValue) }));
    }
  };

  const handleInputChange = (field, value, isPercent = false) => {
    const cleanValue = isPercent ? value.replace(/[^0-9.]/g, '') : value.replace(/[^0-9]/g, '');
    setDisplayValues(prev => ({ ...prev, [field]: cleanValue }));
    const numValue = Number(cleanValue) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleInputBlur = (field, isPercent = false) => {
    if (isPercent) {
      setDisplayValues(prev => ({ ...prev, [field]: String(inputs[field]) }));
    } else {
      setDisplayValues(prev => ({ ...prev, [field]: formatNumber(inputs[field]) }));
    }
  };

  return (
    <div className="roi-calculator">
      <h3 className="roi-calculator-title">Calculate Your Potential ROI</h3>
      <p className="roi-calculator-subtitle">
        See what our Strategic Outreach Engine could generate for your business
      </p>

      <div className="roi-inputs">
        <div className="roi-input-group">
          <label className="roi-input-label">Monthly Lead Volume</label>
          <input
            type="text"
            className="roi-input-field"
            value={displayValues.monthlyLeadVolume}
            onChange={(e) => handleInputChange('monthlyLeadVolume', e.target.value)}
            onBlur={() => handleInputBlur('monthlyLeadVolume')}
          />
          <input
            type="range"
            className="roi-slider"
            min="500"
            max="50000"
            step="500"
            value={inputs.monthlyLeadVolume}
            onChange={(e) => handleSliderChange('monthlyLeadVolume', e.target.value)}
          />
        </div>

        <div className="roi-input-group">
          <label className="roi-input-label">Reply Rate %</label>
          <div className="roi-input-with-suffix">
            <input
              type="text"
              className="roi-input-field"
              value={displayValues.replyRate}
              onChange={(e) => handleInputChange('replyRate', e.target.value, true)}
              onBlur={() => handleInputBlur('replyRate', true)}
            />
            <span className="roi-input-suffix">%</span>
          </div>
          <input
            type="range"
            className="roi-slider"
            min="1"
            max="15"
            step="0.5"
            value={inputs.replyRate}
            onChange={(e) => handleSliderChange('replyRate', e.target.value)}
          />
        </div>

        <div className="roi-input-group">
          <label className="roi-input-label">Close Rate %</label>
          <div className="roi-input-with-suffix">
            <input
              type="text"
              className="roi-input-field"
              value={displayValues.closeRate}
              onChange={(e) => handleInputChange('closeRate', e.target.value, true)}
              onBlur={() => handleInputBlur('closeRate', true)}
            />
            <span className="roi-input-suffix">%</span>
          </div>
          <input
            type="range"
            className="roi-slider"
            min="1"
            max="50"
            step="1"
            value={inputs.closeRate}
            onChange={(e) => handleSliderChange('closeRate', e.target.value)}
          />
        </div>

        <div className="roi-input-group">
          <label className="roi-input-label">Average Deal Value</label>
          <div className="roi-input-with-prefix">
            <span className="roi-input-prefix">$</span>
            <input
              type="text"
              className="roi-input-field"
              value={displayValues.avgDealValue}
              onChange={(e) => handleInputChange('avgDealValue', e.target.value)}
              onBlur={() => handleInputBlur('avgDealValue')}
            />
          </div>
          <input
            type="range"
            className="roi-slider"
            min="500"
            max="50000"
            step="500"
            value={inputs.avgDealValue}
            onChange={(e) => handleSliderChange('avgDealValue', e.target.value)}
          />
        </div>
      </div>

      <div className="roi-results">
        <div className="roi-result-item">
          <span className="roi-result-value">{formatNumber(results.replies)}</span>
          <span className="roi-result-label">Expected Replies/Month</span>
        </div>
        <div className="roi-result-item">
          <span className="roi-result-value">{formatNumber(results.closedDeals)}</span>
          <span className="roi-result-label">Closed Deals/Month</span>
        </div>
        <div className="roi-result-item highlight">
          <span className="roi-result-value">{formatCurrency(results.monthlyRevenue)}</span>
          <span className="roi-result-label">Potential Monthly Revenue</span>
        </div>
        <div className="roi-result-item highlight">
          <span className="roi-result-value">{formatCurrency(results.annualRevenue)}</span>
          <span className="roi-result-label">Potential Annual Revenue</span>
        </div>
      </div>
    </div>
  );
}
