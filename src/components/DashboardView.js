import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashboardView = ({ prices, renderOperationsTable, formatNumber, formatPercentage, readExcel }) => {
  const targetPercentage = 75;

  return (
    <div className="dashboard">
      <section className="crypto-section">
        <h2 className="section-title">Cotizaciones en Tiempo Real</h2>
        <div className="crypto-container">
          {Object.keys(prices).map((key) => {
            const price = prices[key].price;
            const change = prices[key].change;
            return (
              <div key={key} className="crypto-item">
                <div className="crypto-icon">
                  {key.includes('BTC') ? '₿' : 'Ξ'}
                </div>
                <div className="crypto-details">
                  <h3>{key.replace('_', '/')}</h3>
                  <p>{key.includes('EUR') ? '€' : '$'}{formatNumber(price)}</p>
                  <p style={{ color: change >= 0 ? '#00f9a9' : '#ff5b5b' }}>
                    {formatPercentage(change)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="operations-section">
        <h2 className="section-title">Operaciones</h2>
        {renderOperationsTable('BINANCE')}
        {renderOperationsTable('BINGX')}
        <div className="text-center mt-4">
          <button onClick={readExcel}>Obtener Operaciones</button>
        </div>
      </section>

      <section className="progress-section">
        <h2 className="section-title">Progreso de Portafolio</h2>
        <div className="progress-container">
          <CircularProgressbar
            value={targetPercentage}
            text={`${targetPercentage}%`}
            styles={buildStyles({
              textColor: "#ffffff",
              pathColor: "#5e72e4",
              trailColor: "#252d47",
            })}
          />
        </div>
      </section>
    </div>
  );
};

DashboardView.propTypes = {
  prices: PropTypes.object.isRequired,
  renderOperationsTable: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
  formatPercentage: PropTypes.func.isRequired,
  readExcel: PropTypes.func.isRequired,
};

export default memo(DashboardView);
