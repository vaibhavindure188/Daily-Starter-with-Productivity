import React, { useState, useEffect, useCallback } from "react";
import AppContext from "./AppContext";
import axios from "axios";

const AppProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [emails, setEmails] = useState([]);
  const [news, setNews] = useState([]);
  const [marketData, setMarketData] = useState({ stock_indices: [], stocks: [] });
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState(null);

  const fetchEmails = useCallback(async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:5000/api/emails", {
        headers: {
          Authorization: `Bearer ${token}` // Pass token in the Authorization header
        },
      });
  
      if (response.data.success) {
        setEmails(response.data.emails);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  }, []);
  

  const fetchNews = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/newsApi/news?category=technology`);
      if (response.data.success) setNews(response.data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }, []);

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/finance/market-data`);
      if (response.data.success) setMarketData(response.data);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  }, []);

  const fetchTasks = useCallback(async (date) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    
    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/taskManager/${date}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure "Bearer " prefix
        },
      });

      if (response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  
  

  const fetchQuote = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/getQuotes/quote");
      setQuote(response.data);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLogged(true);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLogged,
        setIsLogged,
        emails,
        fetchEmails,
        news,
        fetchNews,
        marketData,
        fetchMarketData,
        tasks,
        fetchTasks,
        quote,
        fetchQuote, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
