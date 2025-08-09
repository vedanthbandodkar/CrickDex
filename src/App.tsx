import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlayerProfile from './pages/PlayerProfile';
import Leaderboards from './pages/Leaderboards';
import Compare from './pages/Compare';
import QuizPage from './pages/QuizPage';
import FactsPage from './pages/FactsPage';

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;