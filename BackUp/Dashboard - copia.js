import React, { useState, useEffect, Suspense, lazy } from 'react';
import * as XLSX from 'xlsx';
import { ChevronLeft, ChevronRight, BarChart2, Briefcase } from 'lucide-react';
import './Dashboard.css';

const DashboardView = lazy(() => import('./DashboardView'));
const InvestmentsView = lazy(() => import('./InvestmentsView'));

const Dashboard = () => {
  const [prices, setPrices] = useState({});
  const [operations, setOperations] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');

  const fetchPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur&include_24h_change=true', {
        mode: 'cors',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPrices({
        'BTC_USD': { price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
        'BTC_EUR': { price: data.bitcoin.eur, change: data.bitcoin.eur_24h_change },
        'ETH_USD': { price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
      });
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const readExcel = async () => {
    try {
      const response = await fetch('/operaciones.xlsx');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setOperations(jsonData);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  const calculatePrecioObjetivo = (precioCompra, gananciaObjetivo) => {
    return precioCompra * (1 + gananciaObjetivo / 100);
  };

  const calculateCurrentGain = (op) => {
    const currentPrice = prices[`${op.Criptomoneda}_${op.Moneda}`]?.price;
    if (currentPrice && op['Precio de Compra']) {
      return ((currentPrice - op['Precio de Compra']) / op['Precio de Compra']) * 100;
    }
    return null;
  };

  const formatNumber = (number, decimals = 2) => {
    return number !== undefined && !isNaN(number) ? Number(number).toFixed(decimals) : '';
  };

  const formatPercentage = (number) => {
    if (number === undefined || isNaN(number)) return '';
    const formattedNumber = Number(number).toFixed(2);
    return `${formattedNumber > 0 ? '+' : ''}${formattedNumber}%`;
  };

  const renderOperationsTable = (exchangeName) => {
    const filteredOperations = operations.filter(op => op.Exchange === exchangeName);
    return (
      <div className="exchange-operations">
        <h3 className="exchange-header">{exchangeName}</h3>
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
            {filteredOperations.map((op, index) => {
              const precioObjetivo = calculatePrecioObjetivo(op['Precio de Compra'], op['% Objetivo']);
              const currentGain = calculateCurrentGain(op);
              return (
                <tr key={index}>
                  <td>{op.Criptomoneda}</td>
                  <td>{op.Moneda === 'USD' ? '$' : '€'}{formatNumber(op['Precio de Compra'])}</td>
                  <td>{formatNumber(op.Cantidad)}</td>
                  <td>{op.Moneda === 'USD' ? '$' : '€'}{formatNumber(op['Dinero Invertido'])}</td>
                  <td>{op.Moneda}</td>
                  <td>{formatNumber(op['% Objetivo'])}%</td>
                  <td>{op.Moneda === 'USD' ? '$' : '€'}{formatNumber(precioObjetivo)}</td>
                  <td style={{ color: currentGain >= 0 ? '#00f9a9' : '#ff5b5b' }}>{formatPercentage(currentGain)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => setCurrentSection('dashboard')}>
            <BarChart2 size={24} />
            {!sidebarCollapsed && <span>Cryptocurrency Dashboard</span>}
          </li>
          <li onClick={() => setCurrentSection('investments')}>
            <Briefcase size={24} />
            {!sidebarCollapsed && <span>Investments</span>}
          </li>
        </ul>
      </div>
      <div className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          {currentSection === 'dashboard' && (
            <DashboardView
              prices={prices}  // Enviamos 'prices' a DashboardView
              operations={operations}
              renderOperationsTable={renderOperationsTable}
              formatNumber={formatNumber}
              formatPercentage={formatPercentage}
              readExcel={readExcel}
            />
          )}
          {currentSection === 'investments' && <InvestmentsView />}
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
