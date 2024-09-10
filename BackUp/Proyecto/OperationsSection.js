import React from 'react';
import PropTypes from 'prop-types';
import './OperationsSection.css';

const OperationsSection = ({ operations, formatNumber, formatPercentage }) => {
  return (
    <div className="operations-section">
      <h2>Operaciones</h2>
      <div className="operations-list">
        {operations.map((op, index) => (
          <div key={index} className="operation-item">
            <div className="operation-header">{op.Criptomoneda}</div>
            <div className="operation-detail">
              Precio de Compra: {formatNumber(op['Precio de Compra'])}
            </div>
            <div className="operation-detail">
              % Ganancia Actual: {formatPercentage(op['% Ganancia Actual'])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

OperationsSection.propTypes = {
  operations: PropTypes.array.isRequired,
  formatNumber: PropTypes.func.isRequired,
  formatPercentage: PropTypes.func.isRequired,
};

export default OperationsSection;
