import React, { useEffect, useContext } from 'react';
import * as XLSX from 'xlsx'; 
import { GlobalContext } from '../GlobalContext'; 
import { formatNumber } from '../utils/formatters'; 

const OperationsSection = () => {
  const { operations, setOperations } = useContext(GlobalContext);

  const readExcel = async () => {
    try {
      const response = await fetch('/operaciones.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setOperations(jsonData);
    } catch (error) {
      console.error('Error al leer el archivo Excel:', error);
    }
  };

  useEffect(() => {
    readExcel();
  }, []);

  return (
    <div className="operations-section">
      <h2>Operaciones</h2>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {operations.length > 0 ? (
            operations.map((operation, index) => (
              <tr key={index}>
                <td>{operation.Criptomoneda}</td>
                <td>{formatNumber(operation.Cantidad)}</td>
                <td>{formatNumber(operation.Precio)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay operaciones</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OperationsSection;
