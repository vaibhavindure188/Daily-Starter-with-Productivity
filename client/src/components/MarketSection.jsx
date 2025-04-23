import React, { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";

const MarketSection = () => {
  const { marketData, fetchMarketData } = useContext(AppContext);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Market Updates</h2>

      {marketData.stock_indices.length > 0 || marketData.stocks.length > 0 ? (
        <div>
          {/* Stock Indices */}
          <h3 className="text-lg font-semibold mt-2">Stock Indices</h3>
          <ul className="space-y-3">
            {marketData.stock_indices.map((stock, index) => (
              <li key={index} className="p-3 border-b last:border-none flex justify-between">
                <span className="font-medium">{stock.name} ({stock.symbol})</span>
                <span className={`font-semibold ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${stock.price.toFixed(2)} ({stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%)
                </span>
              </li>
            ))}
          </ul>

          {/* Crypto & Other Stocks */}
          <h3 className="text-lg font-semibold mt-4">Crypto & Other Assets</h3>
          <ul className="space-y-3">
            {marketData.stocks.map((crypto, index) => (
              <li key={index} className="p-3 border-b last:border-none flex justify-between">
                <span className="font-medium">{crypto.name}</span>
                <span className="font-semibold text-blue-600">${crypto.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No market data available</p>
      )}
    </div>
  );
};

export default MarketSection;
