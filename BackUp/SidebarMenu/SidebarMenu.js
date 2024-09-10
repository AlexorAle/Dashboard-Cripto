import React from 'react';
import { ChevronLeft, ChevronRight, BarChart2, Briefcase } from 'lucide-react';
import PropTypes from 'prop-types';
import './SidebarMenu.css';

const SidebarMenu = ({ sidebarCollapsed, toggleSidebar, setCurrentSection }) => {
  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
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
  );
};

SidebarMenu.propTypes = {
  sidebarCollapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  setCurrentSection: PropTypes.func.isRequired,
};

export default SidebarMenu;
