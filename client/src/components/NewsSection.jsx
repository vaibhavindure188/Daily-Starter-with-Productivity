import React, { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";

const NewsSection = () => {
  const { news, fetchNews } = useContext(AppContext);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Technology News</h2>
      {news.length > 0 ? (
        <ul className="space-y-4">
          {news.map((article, index) => (
            <li key={index} className="p-3 border-b last:border-none">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                {article.title}
              </a>
              <p className="text-sm text-gray-600">By {article.author || "Unknown"} - {article.source.name}</p>
              {article.urlToImage && (
                <div className="w-full flex justify-center">
                <img
                    src={article.urlToImage}
                    alt="news"
                    className="w-auto max-w-full max-h-[400px] object-contain rounded-md"
                />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">{article.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No news available</p>
      )}
    </div>
  );
};

export default NewsSection;
