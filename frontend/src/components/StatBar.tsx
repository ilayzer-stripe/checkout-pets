import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  change?: number;
  getStatColor: (value: number) => string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, change, getStatColor }) => {
  return (
    <div className="stat-bar-container">
      <span className="stat-label">{label}</span>
      <div className="stat-bar">
        <div 
          className="stat-fill"
          style={{
            width: `${value}%`,
            backgroundColor: getStatColor(value)
          }}
        />
      </div>
      <span className="stat-value">{value}</span>
      <span className={`stat-change ${change && change > 0 ? 'positive' : 'negative'} ${!change ? 'invisible' : ''}`}>
        {change ? (change > 0 ? '+' : '') + change : ''}
      </span>
    </div>
  );
};

export default StatBar;
