import React, { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";

const QuoteSection = () => {
  const { quote, fetchQuote } = useContext(AppContext);

  useEffect(() => {
    if (!quote) {
      fetchQuote(); // ✅ Now it only fetches once!
    }
  }, [quote, fetchQuote]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4 text-center">
      <h2 className="text-xl font-bold mb-4">Daily Quote</h2>
      {quote ? (
        <p className="text-gray-700 italic">
          "{quote.quote}" — <span className="font-semibold">{quote.author}</span>
        </p>
      ) : (
        <p className="text-gray-500">Loading quote...</p>
      )}

      <button
        onClick={fetchQuote}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
      >
        Get New Quote
      </button>
    </div>
  );
};

export default QuoteSection;
