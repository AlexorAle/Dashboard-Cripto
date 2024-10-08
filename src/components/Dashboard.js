import React, { useState, Suspense, lazy } from 'react';
import './Dashboard.css';
import SidebarMenu from './SidebarMenu/SidebarMenu';
import QuotesSection from './QuotesSection/QuotesSection';
import IndicatorsSection from './IndicatorsSection/IndicatorsSection';
import OperationsSection from './OperationsSection/OperationsSection';

//const DashboardView = lazy(() => import('./DashboardView'));
const InvestmentsView = lazy(() => import('./InvestmentsView'));

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [prices, setPrices] = useState({});  // Estado para precios
  const [operations, setOperations] = useState([]);  // Estado para operaciones

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      <SidebarMenu
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        setCurrentSection={setCurrentSection}
      />
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {currentSection === 'dashboard' && (
            <>
              <QuotesSection prices={prices} setPrices={setPrices} />  {/* Pasar `setPrices` */}
              <IndicatorsSection />
              <OperationsSection operations={operations} setOperations={setOperations} />  {/* Pasar `setOperations` */}
            </>
          )}
          {currentSection === 'investments' && <InvestmentsView />}
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
