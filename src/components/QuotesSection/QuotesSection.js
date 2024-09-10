import React, { useEffect, useContext } from 'react';
import { GlobalContext } from '../GlobalContext'; 
import { formatNumber } from '../utils/formatters'; 

const QuotesSection = () => {
  const { prices, setPrices } = useContext(GlobalContext);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await response.json();
        setPrices({
          'BTC_USD': { price: data.bitcoin.usd },
          'ETH_USD': { price: data.ethereum.usd },
        });
      } catch (error) {
        console.error('Error al obtener precios:', error);
      }
    };

    fetchPrices();
  }, [setPrices]);

  return (
    <div className="quotes-section">
      <h2>Cotizaciones en Tiempo Real</h2>
      <div className="quotes-list">
        {Object.entries(prices).map(([pair, data]) => (
          <div key={pair} className="quote-item">
            <div className="quote-header">{pair}</div>
            <div className="quote-price">${formatNumber(data.price)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuotesSection;
