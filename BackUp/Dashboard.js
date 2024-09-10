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

  const formatNumber = (number, decimals = 2) => {
    return number !== undefined && !isNaN(number) ? Number(number).toFixed(decimals) : '';
  };

  const formatPercentage = (number) => {
    if (number === undefined || isNaN(number)) return '';
    const formattedNumber = Number(number).toFixed(2);
    return `${formattedNumber > 0 ? '+' : ''}${formattedNumber}%`;
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
            <>
              <div className="dashboard-layout">
                <div className="module quotes">
                  <h2>Cotizaciones</h2>
                  <div className="quote-box">BITCOIN / USD</div>
                  <div className="quote-box">BITCOIN / EUR</div>
                  <div className="quote-box">ETHEREUM / USD</div>
                </div>
                <div className="module indicators">
                  <h2>Indicadores</h2>
                  {/* Aquí puedes añadir indicadores */}
                </div>
                <div className="module operations">
                  <h2>Operaciones</h2>
                  {/* Aquí irá la tabla de operaciones */}
                </div>
              </div>
              <button className="get-operations-btn" onClick={readExcel}>
                Obtener Operaciones
              </button>
            </>
          )}
          {currentSection === 'investments' && <InvestmentsView />}
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
