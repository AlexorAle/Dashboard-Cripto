// API KEY  H4S0ZXCFWKUFG6ZV

import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';

const RSIGauge = ({ symbol = 'BTCUSD', interval = 'weekly', timePeriod = 14, apikey = 'H4S0ZXCFWKUFG6ZV' }) => {
  const [rsiValue, setRsiValue] = useState(0.5); // GaugeChart usa valores entre 0 y 1
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRSI = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=${interval}&time_period=${timePeriod}&series_type=close&apikey=${H4S0ZXCFWKUFG6ZV}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data['Technical Analysis: RSI']) {
          throw new Error('RSI data not found in the response');
        }

        const rsiData = data['Technical Analysis: RSI'];
        const latestRSIKey = Object.keys(rsiData)[0];
        const latestRSIValue = parseFloat(rsiData[latestRSIKey]['RSI']);

        if (!isNaN(latestRSIValue) && latestRSIValue >= 0 && latestRSIValue <= 100) {
          setRsiValue(latestRSIValue / 100); // Ajuste para el valor del GaugeChart
        } else {
          setError('Valor RSI fuera de rango o inválido.');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error al obtener el RSI:', error);
      }
    };

    fetchRSI();
  }, [symbol, interval, timePeriod, apikey]);

  return (
    <div className="rsi-gauge-container" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      <h3>RSI (Relative Strength Index) - Semanal</h3>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <GaugeChart
          id="rsi-gauge"
          nrOfLevels={20}
          colors={['#00FF00', '#FF0000']}
          arcWidth={0.3}
          percent={rsiValue} // El valor del medidor debe estar entre 0 y 1
          textColor="#000"
        />
      )}
    </div>
  );
};

export default RSIGauge;




