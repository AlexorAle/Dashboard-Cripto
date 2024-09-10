import React from 'react';
import RSIGauge from './RSIGauge';
import './IndicatorsSection.css';

const IndicatorsSection = () => {
  return (
    <div className="indicators-section">
      <RSIGauge symbol="BTCUSD" />
      {/* Puedes añadir más medidores aquí */}
    </div>
  );
};

export default IndicatorsSection;



