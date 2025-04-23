import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navabar.jsx";
import DailyStarter from "./pages/DailyStarter.jsx";
import TaskAnalysis from "./pages/TaskAnalysis.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daily-starter" element={<DailyStarter/>}/>
        <Route path="/task-analysis" element={<TaskAnalysis/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
