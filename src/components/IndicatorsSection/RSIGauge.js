// API KEY  H4S0ZXCFWKUFG6ZV

import React, { useEffect, useState } from 'react';
import Gauge from 'react-simple-gauge';

const RSIGauge = () => {
  const [rsiValue, setRsiValue] = useState(50); // Valor inicial

  useEffect(() => {
    const fetchRSI = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=RSI&symbol=BTCUSD&interval=weekly&time_period=14&series_type=close&apikey=H4S0ZXCFWKUFG6ZV`
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
          setRsiValue(latestRSIValue);
        } else {
          console.error('Valor RSI fuera de rango o inválido:', latestRSIValue);
        }
      } catch (error) {
        console.error('Error al obtener el RSI:', error);
      }
    };

    fetchRSI();
  }, []);

  return (
    <div className="rsi-gauge-container" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      <h3>RSI (Relative Strength Index) - Semanal</h3>
      <Gauge
        value={rsiValue}
        min={0}
        max={100}
        color="#FFFFFF"
        backgroundColor={rsiValue > 75 ? '#FF0000' : '#00FF00'}
        label={`${rsiValue.toFixed(2)} RSI`}
      />
    </div>
  );
};

export default RSIGauge;


