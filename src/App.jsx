import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import PlayerProfile from './pages/PlayerProfile.jsx';
import Leaderboards from './pages/Leaderboards.jsx';
import Compare from './pages/Compare.jsx';
import QuizPage from './pages/QuizPage.jsx';
import FactsPage from './pages/FactsPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/facts" element={<FactsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
