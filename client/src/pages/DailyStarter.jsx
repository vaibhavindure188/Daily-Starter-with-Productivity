import React, { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";
import useVoiceAssistant from "../hooks/useVoiceAssistant";
import EmailSection from "../components/EmailSection";
import MarketSection from "../components/MarketSection";
import { useNavigate } from "react-router-dom";
import NewsSection from "../components/NewsSection";
import QuoteSection from "../components/QuoteSection";
import TasksSection from "../components/TasksSection";

const DailyStarter = () => {
  const { fetchEmails, fetchNews, fetchMarketData, fetchTasks, fetchQuote } = useContext(AppContext);

  useEffect(() => {
    fetchEmails();
    fetchNews();
    fetchMarketData();
    fetchTasks(new Date().toISOString().split("T")[0]);
    fetchQuote();
  }, [fetchEmails, fetchNews, fetchMarketData, fetchTasks, fetchQuote]);

  const { speakText, startListening, narrateDailyStarter } = useVoiceAssistant({
    "start the day": () => narrateDailyStarter(),
    "read news": () => speakText("Fetching latest news."),
    "read market": () => speakText("Here are the market updates."),
    "read tasks": () => speakText("Your daily tasks are as follows."),
    "read quote": () => speakText("Here is your daily quote."),
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Daily Starter</h1>
            <p className="text-gray-600 text-lg">Your personal daily briefing, tailored for productivity.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={narrateDailyStarter}
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-3 rounded-xl shadow"
            >
              Start the Day
            </button>
            <button
              onClick={startListening}
              className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold px-6 py-3 rounded-xl shadow"
            >
              Start Voice Commands
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 transition-shadow hover:shadow-xl min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">📧 Emails</h2>
            <EmailSection />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 transition-shadow hover:shadow-xl min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4 text-red-500">📰 News</h2>
            <NewsSection />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 transition-shadow hover:shadow-xl min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-500">📈 Market</h2>
            <MarketSection />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 transition-shadow hover:shadow-xl min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">📝 Tasks</h2>
            <TasksSection />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 col-span-1 lg:col-span-2 transition-shadow hover:shadow-xl min-h-[200px]">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">💡 Quote</h2>
            <QuoteSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStarter;
