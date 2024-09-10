import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './InvestmentsView.css';

const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FF0000', '#8884D8', '#82CA9D', '#A4DE6C'];

const InvestmentsView = () => {
  const [investmentData, setInvestmentData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const response = await fetch('/operaciones.xlsx');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets['Investments'];
        if (!worksheet) {
          throw new Error('Investments sheet not found in Excel file');
        }
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map((row) => ({
          tipo: row.Tipo || 'Unknown',
          categoria: row.Categoria || 'Unknown',
          subCategoria: row['Sub-categoria'] || 'Unknown',
          valor: Math.round(parseFloat(row.Valor) || 0),
        }));

        const total = formattedData.reduce((sum, item) => sum + item.valor, 0);

        setInvestmentData(formattedData);
        setTotalValue(total);
      } catch (error) {
        console.error('Error fetching investment data:', error);
      }
    };

    fetchInvestmentData();
  }, []);

  // Memoize groupedData to avoid recalculating it unless investmentData changes
  const groupedData = useMemo(() => {
    const grouped = investmentData.reduce((acc, curr) => {
      const category = curr.categoria;
      if (!acc[category]) {
        acc[category] = { categoria: category, valor: 0 };
      }
      acc[category].valor += curr.valor;
      return acc;
    }, {});

    return Object.values(grouped);
  }, [investmentData]);

  // Memoize custom label function
  const renderCustomLabel = useCallback(({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${groupedData[index].categoria} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  }, [groupedData]);

  return (
    <div className="investments-view">
      <div className="investment-summary">
        <h2>Investments Summary</h2>
        <div className="chart-container">
          {groupedData.length ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={groupedData}
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={144}
                  fill="#8884d8"
                  dataKey="valor"
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {groupedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No investment data available.</p>
          )}
        </div>
        <div className="investment-details">
          <h3>Investment Details</h3>
          <table className="investment-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Sub-categoría</th>
                <th>Valor (EUR)</th>
              </tr>
            </thead>
            <tbody>
              {investmentData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{item.tipo}</td>
                  <td>{item.categoria}</td>
                  <td>{item.subCategoria}</td>
                  <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>€{item.valor.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold', verticalAlign: 'middle' }}>Total</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle' }}>€{totalValue.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsView;
