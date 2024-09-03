import React from 'react';
import PropTypes from 'prop-types';

const QuotesSection = ({ prices, formatNumber }) => {
  return (
    <div className="quotes-section">
      <h2>Cotizaciones en Tiempo Real</h2>
      <div className="quotes-list">
        {Object.entries(prices).map(([pair, data]) => (
          <div key={pair} className="quote-item">
            <div className="quote-header">{pair}</div>
            <div className="quote-price">{formatNumber(data.price)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

QuotesSection.propTypes = {
  prices: PropTypes.object.isRequired,
  formatNumber: PropTypes.func.isRequired,
};

export default QuotesSection;
