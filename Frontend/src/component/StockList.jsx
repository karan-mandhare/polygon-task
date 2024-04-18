import { useState, useEffect } from "react";
import axios from "axios";

function StockPrices() {
  const [stocks, setStocks] = useState([]);
  const [color, setColor] = useState("text-lime-700");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/stock_data"
        );
        if (response) {
          setStocks(response.data);

          setColor((prevColor) =>
            prevColor === "text-red-700" ? "text-lime-600" : "text-red-700"
          );
        }
      } catch (error) {
        console.error("Error fetching stock data:", error.message);
      }
    };

    // Fetch data every 2 seconds
    const interval = setInterval(fetchData, 2000);

    // Clean up function
    return () => {
      clearInterval(interval);
    };
  }, []); // Removed 'color' from the dependency array

  return (
    <div className="m-2 p-2 w-full md:w-2/3 mx-auto">
      <h2 className="text-4xl text-center mb-4">Stock Prices</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Current Price</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan="2" className={`${color} text-center px-4 py-2`}>
                  The stock is empty
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.T} className="border-b border-gray-400 text-center">
                  <td className="px-4 py-2">{stock.T}</td>
                  <td className={`${color} font-bold px-4 py-2`}>{stock.h}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockPrices;
