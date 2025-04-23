import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import AppContext from "../context/AppContext";

const Navbar = () => {
  const { isLogged, setIsLogged } = useContext(AppContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token); // Update global state based on token presence
  }, [setIsLogged]);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/login";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    window.location.href = "/"; // Redirect to home after logout
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-bold">Daily Starter</h1>
      
      <div>
        {isLogged ? (
          <>
            <Link to="/daily-starter">
              <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 mr-4">
                Start the Day
              </button>
            </Link>
            <Link to="/task-analysis">
              <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 mr-4">
                Task Analysis
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100"
          >
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
