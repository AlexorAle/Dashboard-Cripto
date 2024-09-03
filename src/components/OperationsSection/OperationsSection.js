import React from 'react';
import PropTypes from 'prop-types';

const OperationsSection = ({ operations, formatNumber, formatPercentage }) => {
  const binanceOps = operations.filter(op => op.Exchange === 'binance');
  const bingxOps = operations.filter(op => op.Exchange === 'bingx');

  const renderTable = (ops, exchangeName) => (
    <div className="operations-table-wrapper">
      <h3>{exchangeName}</h3>
      <table className="operations-table">
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Precio de Compra</th>
            <th>Cantidad</th>
            <th>Dinero Invertido</th>
            <th>Moneda</th>
            <th>% Ganancia Objetivo</th>
            <th>Precio Objetivo</th>
            <th>% Ganancia Actual</th>
          </tr>
        </thead>
        <tbody>
          {ops.map((op, index) => {
            const precioObjetivo = op['Precio de Compra'] * (1 + op['% Objetivo'] / 100);
            const gananciaActual = op['Precio Actual']
              ? ((op['Precio Actual'] - op['Precio de Compra']) / op['Precio de Compra']) * 100
              : 0;

            return (
              <tr key={index}>
                <td>{op.Criptomoneda}</td>
                <td>{formatNumber(op['Precio de Compra'])}</td>
                <td>{formatNumber(op.Cantidad)}</td>
                <td>{formatNumber(op['Dinero Invertido'])}</td>
                <td>{op.Moneda}</td>
                <td>{formatPercentage(op['% Objetivo'])}</td>
                <td>{formatNumber(precioObjetivo)}</td>
                <td style={{ color: gananciaActual >= 0 ? 'lightgreen' : 'red' }}>
                  {formatPercentage(gananciaActual)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="operations-section">
      <h2>Operaciones</h2>
      {renderTable(binanceOps, 'Binance')}
      {renderTable(bingxOps, 'BINGX')}
    </div>
  );
};

OperationsSection.propTypes = {
  operations: PropTypes.array.isRequired,
  formatNumber: PropTypes.func.isRequired,
  formatPercentage: PropTypes.func.isRequired,
};

export default OperationsSection;
