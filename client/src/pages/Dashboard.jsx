import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLogged, setIsLogged, fetchEmails, emails } = useContext(AppContext);
  const [isListening, setIsListening] = useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      queryParams.delete("token"); // Remove token from URL

      try {
        const decoded = jwtDecode(token);
        setIsLogged(true);
        fetchEmails(decoded.email);
        startListening();
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        navigate("/");
      } else {
        startListening();
      }
    }
  }, [navigate, setIsLogged, fetchEmails]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    navigate("/");
  };

  const startListening = () => {
    try {
      recognition.start();
      console.log("Listening...");
    } catch (error) {
      console.warn("Speech recognition is already running.");
    }
  };
  

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
    console.log("Stopped listening.");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("Voice Command:", transcript);

    if (transcript.includes("start the day")) {
      navigate("/daily-starter");
    } else if (transcript.includes("logout")) {
      handleLogout();
    } else if (transcript.includes("read my emails")) {
      readEmails();
    }
  };

  const readEmails = () => {
    console.log("reading emails")
    if (emails.length === 0) {
      speak("You have no unread emails.");
    } else {
      let emailText = "Here are your unread emails. ";
      emails.forEach((email, index) => {
        emailText += `Email ${index + 1}: ${email.subject} from ${email.from}. `;
      });
      speak(emailText);
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Daily Starter</h1>
      <button onClick={startListening} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 mb-4">
        Start Voice Control
      </button>
      {isLogged && emails.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Unread Emails:</h2>
          <ul className="mt-2">
            {emails.map((email) => (
              <li key={email.id} className="border p-2 my-2 bg-white shadow-md">
                <strong>{email.subject}</strong> from {email.from}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate("/daily-starter")} className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 mb-4">
        Start the Day
      </button>
      <button onClick={handleLogout} className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
