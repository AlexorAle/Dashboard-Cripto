import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [operations, setOperations] = useState([]);

  return (
    <GlobalContext.Provider value={{ prices, setPrices, operations, setOperations }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Validación de props para children
GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
