import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashboardView = ({ prices, renderOperationsTable, formatNumber, formatPercentage, readExcel }) => {
  const targetPercentage = 75;

  return (
    <div className="dashboard bg-gray-900 text-white min-h-screen">
      <section className="crypto-section p-4">
        <h2 className="text-2xl mb-4">Cryptocurrency Prices</h2>
        <div className="crypto-container grid grid-cols-2 gap-4">
          {Object.keys(prices).map((key) => {
            const price = prices[key].price;
            const change = prices[key].change;
            return (
              <div key={key} className="crypto-item bg-gray-800 p-4 rounded-lg shadow">
                <div className="crypto-icon text-4xl mb-2" style={{ backgroundColor: key.includes('BTC') ? '#F7931A' : '#627EEA' }}>
                  {key.includes('BTC') ? '₿' : 'Ξ'}
                </div>
                <div className="crypto-details">
                  <h3 className="text-lg font-semibold">{key.replace('_', '/')}</h3>
                  <p className="text-xl">{key.includes('EUR') ? '€' : '$'}{formatNumber(price)}</p>
                  <p className="price-change text-lg" style={{ color: change >= 0 ? '#00f9a9' : '#ff5b5b' }}>
                    {formatPercentage(change)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="operations-section p-4">
        <h2 className="text-2xl mb-4">Operaciones</h2>
        {renderOperationsTable('BINANCE')}
        {renderOperationsTable('BINGX')}
        <div className="text-center mt-4">
          <button onClick={readExcel} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update Operations
          </button>
        </div>
      </section>

      <section className="progress-section bg-gray-800 mt-8 p-8 rounded-lg">
        <h2 className="text-2xl mb-4">Portfolio Progress</h2>
        <div className="progress-container">
          <CircularProgressbar
            value={targetPercentage}
            text={`${targetPercentage}%`}
            styles={buildStyles({
              textColor: "#ffffff",
              pathColor: "#5e72e4",
              trailColor: "#252d47",
              textSize: '18px',
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

// Memoizing the component to prevent unnecessary re-renders
export default memo(DashboardView);
