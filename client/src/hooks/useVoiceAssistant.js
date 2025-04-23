import { useEffect, useCallback, useRef, useContext } from "react";
import AppContext from "../context/AppContext";

let isListening = false; // Prevent multiple recognition starts

const useVoiceAssistant = (commands) => {
  const { emails, news, marketData, tasks, quote } = useContext(AppContext);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("Voice Command:", transcript);

      if (commands[transcript]) {
        commands[transcript]();
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start();
      }
    };

    recognitionRef.current = recognitionInstance;
  }, [commands]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      isListening = true;
      console.log("Listening started...");
    } else {
      console.warn("Speech recognition is already running.");
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      isListening = false;
    }
  }, []);

  const speakText = useCallback((text, delay = 0) => {
    setTimeout(() => {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      window.speechSynthesis.speak(speech);
    }, delay);
  }, []);

  const narrateDailyStarter = useCallback(() => {
    let delay = 0;

    speakText("Here are your updates:", delay);
    delay += 3000; // Wait 3 seconds before the next update

    // Emails
    if (emails.length > 0) {
      speakText(`You have ${emails.length} unread emails.`, delay);
      delay += 3000;
      speakText(`First email from ${emails[0].sender}: ${emails[0].subject}.`, delay);
      delay += 3000;
    } else {
      speakText("You have no unread emails.", delay);
      delay += 3000;
    }

    // News
    if (news.length > 0) {
      speakText(`Here’s the latest news headline: ${news[0].title}.`, delay);
      delay += 4000;
    } else {
      speakText("No news updates at the moment.", delay);
      delay += 3000;
    }

    // Market Data
    if (marketData.stock_indices.length > 0) {
      const firstStock = marketData.stock_indices[0];
      speakText(
        `Stock Market update: ${firstStock.name} is at ${firstStock.price} dollars, with a change of ${firstStock.change} points.`,
        delay
      );
      delay += 4000;
    } else {
      speakText("No market data available.", delay);
      delay += 3000;
    }

    // Tasks
    if (tasks.length > 0) {
      speakText(`You have ${tasks.length} tasks today.`, delay);
      delay += 3000;
      speakText(`First task: ${tasks[0].description}.`, delay);
      delay += 3000;
    } else {
      speakText("No tasks for today.", delay);
      delay += 3000;
    }

    // Quote
    if (quote) {
      speakText(`Today's quote: ${quote.quote} by ${quote.author}.`, delay);
    } else {
      speakText("No quote available today.", delay);
    }
  }, [speakText, emails, news, marketData, tasks, quote]);

  return { startListening, stopListening, speakText, narrateDailyStarter };
};

export default useVoiceAssistant;
